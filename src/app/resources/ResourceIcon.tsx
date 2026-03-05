"use client";

import { BookOpen, Scale, PenTool, Cloud, Heart, Plane } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Scale,
  PenTool,
  Cloud,
  Heart,
  Plane,
};

export default function ResourceIcon({ name }: { name: string }) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon className="h-6 w-6 text-primary" />;
}
