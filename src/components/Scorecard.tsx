import { SCORE_LABELS, type ScoreBreakdown } from "@/lib/types";

function barColor(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-brand-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-rose-500";
}

export function ScoreRing({ score }: { score: number }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="grid h-24 w-24 place-items-center rounded-full text-2xl font-bold text-slate-800"
        style={{
          background: `conic-gradient(#1d5cf5 ${score * 3.6}deg, #e2e8f0 0deg)`,
        }}
      >
        <span className="grid h-[5.25rem] w-[5.25rem] place-items-center rounded-full bg-white">
          {score}
        </span>
      </div>
      <span className="mt-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        Overall / 100
      </span>
    </div>
  );
}

export default function Scorecard({ scores }: { scores: ScoreBreakdown }) {
  const entries = Object.entries(scores) as [keyof ScoreBreakdown, number][];
  return (
    <div className="space-y-3">
      {entries.map(([key, value]) => (
        <div key={key}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-slate-700">{SCORE_LABELS[key]}</span>
            <span className="font-medium text-slate-900">{value}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full ${barColor(value)}`}
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
