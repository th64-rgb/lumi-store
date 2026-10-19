import { Star } from "lucide-react";

export function Stars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-1" aria-label={`별점 ${rating.toFixed(1)}점`}>
      <span className="inline-flex" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className={index < filled ? "size-3.5 fill-coral text-coral" : "size-3.5 fill-transparent text-line"}
            strokeWidth={1.75}
          />
        ))}
      </span>
      <span className="text-xs tabular-nums text-muted">{rating.toFixed(1)}</span>
    </span>
  );
}
