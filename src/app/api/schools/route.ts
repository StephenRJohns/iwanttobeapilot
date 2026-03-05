import { NextRequest, NextResponse } from "next/server";
import { haversineDistance } from "@/lib/utils";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function geocodeZip(zip: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(`https://api.zippopotam.us/us/${zip}`);
    if (!res.ok) return null;
    const data = await res.json();
    const place = data.places?.[0];
    if (!place) return null;
    return {
      lat: parseFloat(place.latitude),
      lng: parseFloat(place.longitude),
    };
  } catch {
    return null;
  }
}

async function searchWithGooglePlacesNew(
  lat: number,
  lng: number,
  radiusMiles: number,
  apiKey: string
) {
  const radiusMeters = Math.min(Math.round(radiusMiles * 1609.34), 50000);

  const body = {
    textQuery: "flight school",
    locationBias: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: radiusMeters,
      },
    },
    maxResultCount: 20,
  };

  const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.addressComponents",
        "places.location",
        "places.nationalPhoneNumber",
        "places.websiteUri",
      ].join(","),
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Places (New) failed: ${res.status} — ${errText}`);
  }

  const data = await res.json();

  interface AddressComponent {
    longText: string;
    shortText: string;
    types: string[];
  }

  interface PlaceResult {
    id: string;
    displayName?: { text: string };
    formattedAddress?: string;
    addressComponents?: AddressComponent[];
    location?: { latitude: number; longitude: number };
    nationalPhoneNumber?: string;
    websiteUri?: string;
  }

  const places: PlaceResult[] = data.places ?? [];

  return places.map((place) => {
    const placeLatLng = place.location
      ? { lat: place.location.latitude, lng: place.location.longitude }
      : { lat, lng };

    const distance = haversineDistance(lat, lng, placeLatLng.lat, placeLatLng.lng);

    // Extract address components
    const components = place.addressComponents ?? [];
    const get = (...types: string[]) =>
      components.find((c) => Array.isArray(c.types) && types.some((t) => c.types.includes(t)));

    const streetNumber = get("street_number")?.longText ?? "";
    const route = get("route")?.longText ?? "";
    const city =
      get("locality")?.longText ??
      get("sublocality")?.longText ??
      get("postal_town")?.longText ??
      null;
    const state = get("administrative_area_level_1")?.shortText ?? null;
    const zipCode = get("postal_code")?.longText ?? null;
    const address = [streetNumber, route].filter(Boolean).join(" ") || null;

    return {
      id: `gplaces-${place.id}`,
      name: place.displayName?.text ?? "Unknown",
      address,
      city,
      state,
      zipCode,
      phone: place.nationalPhoneNumber ?? null,
      email: null,
      website: place.websiteUri ?? null,
      identifier: null,
      lat: placeLatLng.lat,
      lng: placeLatLng.lng,
      distance,
    };
  });
}

async function searchWithDatabase(lat: number, lng: number, radiusMiles: number) {
  const allSchools = await db.flightSchool.findMany();
  return allSchools
    .filter((s) => s.lat !== null && s.lng !== null)
    .map((s) => ({
      id: s.id,
      name: s.name,
      address: s.address,
      city: s.city,
      state: s.state,
      zipCode: s.zipCode,
      phone: s.phone ?? null,
      email: s.email ?? null,
      website: s.website ?? null,
      identifier: null,
      lat: s.lat!,
      lng: s.lng!,
      distance: haversineDistance(lat, lng, s.lat!, s.lng!),
    }))
    .filter((s) => s.distance <= radiusMiles)
    .sort((a, b) => a.distance - b.distance);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const zip = searchParams.get("zip")?.trim();
    const radius = parseFloat(searchParams.get("radius") || "50");

    if (!zip) {
      return NextResponse.json({ error: "Zip code is required" }, { status: 400 });
    }

    const coords = await geocodeZip(zip);
    if (!coords) {
      return NextResponse.json({ error: "Could not find that zip code" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    // Try Google Places first; fall back to DB on any failure
    if (apiKey) {
      try {
        const schools = await searchWithGooglePlacesNew(coords.lat, coords.lng, radius, apiKey);
        schools.sort((a, b) => a.distance - b.distance);
        return NextResponse.json({ schools, center: coords });
      } catch (err) {
        console.error("Google Places failed, falling back to DB:", err);
      }
    }

    const schools = await searchWithDatabase(coords.lat, coords.lng, radius);
    return NextResponse.json({ schools, center: coords });
  } catch (err) {
    console.error("Schools error:", err);
    return NextResponse.json({ error: "Search failed. Please try again." }, { status: 500 });
  }
}
