"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icons for bundlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet-images/marker-icon-2x.png",
  iconUrl: "/leaflet-images/marker-icon.png",
  shadowUrl: "/leaflet-images/marker-shadow.png",
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
  onSearchHere?: (center: { lat: number; lng: number }) => void;
  loading?: boolean;
}

function SearchHereControl({
  onSearchHere,
  loading,
}: {
  onSearchHere: (center: { lat: number; lng: number }) => void;
  loading: boolean;
}) {
  const map = useMap();
  const [moved, setMoved] = useState(false);

  useMapEvents({
    dragend: () => setMoved(true),
    zoomend: () => setMoved(true),
  });

  // Reset moved when a search completes (loading flips false → parent updated center)
  useEffect(() => {
    if (!loading) setMoved(false);
  }, [loading]);

  const active = moved && !loading;

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: "12px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
      }}
    >
      <button
        disabled={!active}
        onClick={() => {
          const c = map.getCenter();
          setMoved(false);
          onSearchHere({ lat: c.lat, lng: c.lng });
        }}
        style={{
          background: "#fff",
          color: active ? "#1a1a1a" : "#aaa",
          border: `1px solid ${active ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.1)"}`,
          borderRadius: "6px",
          padding: "6px 14px",
          fontSize: "13px",
          fontWeight: 500,
          cursor: active ? "pointer" : "default",
          boxShadow: active ? "0 2px 6px rgba(0,0,0,0.18)" : "0 1px 3px rgba(0,0,0,0.08)",
          transition: "all 0.15s ease",
          whiteSpace: "nowrap",
          pointerEvents: active ? "auto" : "none",
        }}
      >
        {loading ? "Searching…" : "Search This Area"}
      </button>
    </div>,
    map.getContainer()
  );
}

export default function SchoolsMap({ schools, center, onSearchHere, loading = false }: SchoolsMapProps) {
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
      {onSearchHere && (
        <SearchHereControl onSearchHere={onSearchHere} loading={loading} />
      )}
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
