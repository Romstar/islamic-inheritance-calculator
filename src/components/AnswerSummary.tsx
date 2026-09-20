import { HEIR_LABELS, labelFor, type HeirInput, type HeirKey } from "@/lib/faraid/types";
import { formatMoney, parseMoney } from "@/lib/faraid/money";
import { schoolLabel, type SchoolId } from "@/lib/faraid/schools";

export default function AnswerSummary({
  school,
  heirs,
  gross,
  debts,
  funeral,
  wasiyyah,
}: {
  school: SchoolId | null;
  heirs: HeirInput;
  gross: string;
  debts: string;
  funeral: string;
  wasiyyah: string;
}) {
  const selected = (Object.keys(HEIR_LABELS) as HeirKey[]).flatMap((key) => {
    const value = heirs[key];
    const count = typeof value === "boolean" ? (value ? 1 : 0) : value;
    if (count <= 0) return [];
    return [{ key, count, label: labelFor(key, count) }];
  });

  const moneyRows = [
    { label: "Gross estate", value: parseMoney(gross), raw: gross },
    { label: "Debts", value: parseMoney(debts), raw: debts },
    { label: "Funeral costs", value: parseMoney(funeral), raw: funeral },
    { label: "Will (requested)", value: parseMoney(wasiyyah), raw: wasiyyah },
  ].filter((row) => row.raw.trim() !== "");

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Your answers
      </h3>
      <p className="mb-3 text-sm font-medium text-zinc-800">{schoolLabel(school)} school</p>
      {selected.length === 0 ? (
        <p className="text-sm text-zinc-600">No heirs selected.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {selected.map((item) => (
            <li
              key={item.key}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700"
            >
              {item.label}
              {item.count > 1 ? ` ×${item.count}` : ""}
            </li>
          ))}
        </ul>
      )}
      {moneyRows.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs text-zinc-600">
          {moneyRows.map((row) => (
            <li key={row.label} className="flex justify-between gap-4">
              <span>{row.label}</span>
              <span>{formatMoney(row.value)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
