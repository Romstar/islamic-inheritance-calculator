"use client";

export function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
        checked
          ? "border-emerald-500 bg-emerald-50"
          : "border-zinc-200 bg-white hover:border-zinc-300"
      }`}
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-zinc-900">{label}</span>
        {hint && <span className="block text-xs text-zinc-500">{hint}</span>}
      </span>
      <span
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? "bg-emerald-500" : "bg-zinc-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}

export function Stepper({
  label,
  hint,
  value,
  min = 0,
  max = 20,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  const set = (next: number) => onChange(Math.max(min, Math.min(max, next)));
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 ${
        value > 0 ? "border-emerald-500 bg-emerald-50" : "border-zinc-200 bg-white"
      }`}
    >
      <span className="min-w-0">
        <span className="block text-sm font-medium text-zinc-900">{label}</span>
        {hint && <span className="block text-xs text-zinc-500">{hint}</span>}
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => set(value - 1)}
          className="h-9 w-9 rounded-md border border-zinc-300 bg-white text-lg font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-40"
          disabled={value <= min}
        >
          -
        </button>
        <span
          aria-label={`${label} count`}
          className="w-6 text-center text-base font-semibold text-zinc-900"
        >
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => set(value + 1)}
          className="h-9 w-9 rounded-md border border-zinc-300 bg-white text-lg font-medium text-zinc-700 hover:bg-zinc-100 disabled:opacity-40"
          disabled={value >= max}
        >
          +
        </button>
      </span>
    </div>
  );
}

export function Choice<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          aria-pressed={value === opt.value}
          onClick={() => onChange(opt.value)}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            value === opt.value
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
