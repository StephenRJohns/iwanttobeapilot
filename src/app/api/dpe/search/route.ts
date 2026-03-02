import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { haversineDistance } from "@/lib/utils";

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

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const zip = searchParams.get("zip")?.trim();
    const radius = parseFloat(searchParams.get("radius") || "50");
    const certType = searchParams.get("certificateType")?.trim();

    if (!zip) {
      return NextResponse.json({ error: "Zip code is required" }, { status: 400 });
    }

    const coords = await geocodeZip(zip);
    if (!coords) {
      return NextResponse.json({ error: "Could not find that zip code" }, { status: 400 });
    }

    const dpes = await db.dPERecord.findMany({
      where: {
        lat: { not: null },
        lng: { not: null },
        ...(certType
          ? { certificateTypes: { contains: certType } }
          : {}),
      },
      include: {
        ratings: { select: { score: true } },
      },
    });

    const nearby = dpes
      .map((dpe) => {
        const dist = haversineDistance(coords.lat, coords.lng, dpe.lat!, dpe.lng!);
        const avgRating =
          dpe.ratings.length > 0
            ? dpe.ratings.reduce((sum, r) => sum + r.score, 0) / dpe.ratings.length
            : null;
        return { ...dpe, distance: dist, avgRating, ratingCount: dpe.ratings.length };
      })
      .filter((d) => d.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return NextResponse.json({ dpes: nearby, center: coords });
  } catch (err) {
    console.error("DPE search error:", err);
    return NextResponse.json({ error: "Failed to search DPEs" }, { status: 500 });
  }
}
