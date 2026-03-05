"use client";

import { useState, useEffect, useCallback } from "react";

const colorMap: Record<string, string> = {
  blue: "bg-blue-600",
  yellow: "bg-amber-500",
  red: "bg-red-600",
  green: "bg-green-600",
};

export default function Banner() {
  const [enabled, setEnabled] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("blue");

  const fetchBanner = useCallback(() => {
    fetch("/api/maintenance")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setEnabled(data.bannerEnabled ?? false);
          setMessage(data.bannerMessage || "");
          setColor(data.bannerColor || "blue");
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchBanner();
    const handler = () => fetchBanner();
    window.addEventListener("maintenance-updated", handler);
    return () => window.removeEventListener("maintenance-updated", handler);
  }, [fetchBanner]);

  if (!enabled || !message) return null;

  return (
    <div className={`${colorMap[color] || colorMap.blue} text-white text-center text-sm py-2 px-4`}>
      {message}
    </div>
  );
}
