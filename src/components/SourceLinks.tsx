import { getSources, type SourceId } from "@/lib/sources";

export function SourceLinks({
  ids,
  className = "",
}: {
  ids: readonly SourceId[];
  className?: string;
}) {
  const items = getSources(ids);
  if (items.length === 0) return null;

  return (
    <span className={`inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs text-zinc-500 ${className}`}>
      <span className="font-medium text-zinc-600">Sources:</span>
      {items.map((source, index) => (
        <span key={source.id} className="inline-flex items-baseline gap-x-2">
          {index > 0 && <span aria-hidden>·</span>}
          <a
            href={source.href}
            target="_blank"
            rel="noopener noreferrer"
            title={source.title}
            className="text-emerald-800 underline-offset-2 hover:underline"
          >
            {source.label}
            <span className="sr-only"> ({source.title}; opens in a new tab)</span>
          </a>
        </span>
      ))}
    </span>
  );
}

export function Cited({
  as: Tag = "p",
  sources,
  children,
  className = "text-sm text-zinc-600",
}: {
  as?: "p" | "li" | "div";
  sources: readonly SourceId[];
  children: React.ReactNode;
  className?: string;
}) {
  if (Tag === "li") {
    return (
      <li className={className}>
        <span className="block">{children}</span>
        <SourceLinks ids={sources} className="mt-1" />
      </li>
    );
  }

  return (
    <Tag className={`${className} space-y-1`}>
      <span className="block">{children}</span>
      <SourceLinks ids={sources} />
    </Tag>
  );
}
