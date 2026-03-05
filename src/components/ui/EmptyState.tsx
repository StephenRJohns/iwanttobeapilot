import Link from "next/link";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: { label: string; href: string };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-muted-foreground/40 mb-4">{icon}</div>
      <p className="font-medium text-sm mb-1">{title}</p>
      <p className="text-xs text-muted-foreground max-w-xs mb-4">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-xs font-medium hover:bg-primary/90 transition-colors active:scale-[0.97]"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
