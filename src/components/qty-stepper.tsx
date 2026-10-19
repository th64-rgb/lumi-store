import { Minus, Plus } from "lucide-react";

export function QtyStepper({
  value,
  onChange,
  label = "수량",
}: {
  value: number;
  onChange: (next: number) => void;
  label?: string;
}) {
  return (
    <div className="inline-flex items-center rounded-full border border-line bg-paper">
      <button
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-full text-ink disabled:opacity-30"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label={`${label} 줄이기`}
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <span className="w-6 text-center text-sm tabular-nums" aria-live="polite" aria-label={`${label} ${value}`}>
        {value}
      </span>
      <button
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-full text-ink disabled:opacity-30"
        onClick={() => onChange(Math.min(10, value + 1))}
        disabled={value >= 10}
        aria-label={`${label} 늘리기`}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
