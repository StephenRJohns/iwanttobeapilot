"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons for bundlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface School {
  id: string;
  name: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  identifier?: string | null;
  lat: number;
  lng: number;
  distance: number;
}

interface SchoolsMapProps {
  schools: School[];
  center: { lat: number; lng: number };
}

export default function SchoolsMap({ schools, center }: SchoolsMapProps) {
  // Suppress leaflet hydration warnings
  useEffect(() => {}, []);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={9}
      style={{ height: "100%", width: "100%", minHeight: "400px" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {schools.map((school) => (
        <Marker key={school.id} position={[school.lat, school.lng]}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold mb-1">{school.name}</p>
              {(school.city || school.state || school.identifier) && (
                <p className="text-xs text-gray-600">
                  {[school.city, school.state, school.identifier].filter(Boolean).join(", ")}
                </p>
              )}
              {school.phone && <p className="text-xs mt-1">{school.phone}</p>}
              {school.website && (
                <a
                  href={school.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-1 block"
                >
                  Visit Website
                </a>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {school.distance.toFixed(1)} miles away
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
