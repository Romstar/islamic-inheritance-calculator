import { SCHOOL_LIST, type SchoolId } from "@/lib/faraid/schools";
import { SourceLinks } from "@/components/SourceLinks";

export default function SchoolPicker({
  value,
  onChange,
}: {
  value: SchoolId | null;
  onChange: (school: SchoolId) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {SCHOOL_LIST.map((school) => {
        const selected = value === school.id;
        return (
          <button
            key={school.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(school.id)}
            className={`cursor-pointer rounded-xl border px-4 py-4 text-left transition-colors ${
              selected
                ? "border-emerald-500 bg-emerald-50"
                : "border-zinc-200 bg-white hover:border-zinc-300"
            }`}
          >
            <span className="block text-base font-semibold text-zinc-900">{school.label}</span>
            <span className="mt-1 block text-sm text-zinc-500">{school.summary}</span>
          </button>
        );
      })}
      <SourceLinks
        className="sm:col-span-2"
        ids={["islamqa-140167", "islamqa-160948", "islamqa-225165"]}
      />
    </div>
  );
}
