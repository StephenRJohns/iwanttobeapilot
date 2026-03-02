"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface DPE {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  phone: string | null;
  lat: number | null;
  lng: number | null;
  distance: number;
}

interface DPEMapProps {
  dpes: DPE[];
  center: { lat: number; lng: number };
}

export default function DPEMap({ dpes, center }: DPEMapProps) {
  useEffect(() => {}, []);

  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={9}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {dpes
        .filter((d) => d.lat !== null && d.lng !== null)
        .map((dpe) => (
          <Marker key={dpe.id} position={[dpe.lat!, dpe.lng!]}>
            <Popup>
              <div className="text-xs">
                <p className="font-semibold">{dpe.name}</p>
                {(dpe.city || dpe.state) && (
                  <p>{[dpe.city, dpe.state].filter(Boolean).join(", ")}</p>
                )}
                <p>{dpe.distance.toFixed(1)} mi away</p>
                {dpe.phone && <p>{dpe.phone}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
}
