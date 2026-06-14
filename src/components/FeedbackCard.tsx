import type { Feedback } from "@/lib/types";
import Scorecard, { ScoreRing } from "./Scorecard";
import Disclaimer from "./Disclaimer";
import ExerciseFeedbackPrompt from "./ExerciseFeedbackPrompt";

export default function FeedbackCard({
  feedback,
  transcript,
}: {
  feedback: Feedback;
  transcript: string;
}) {
  return (
    <div className="space-y-6">
      {feedback.mock && (
        <div className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-2 text-sm text-slate-600">
          Mock mode — this feedback is simulated. Add an{" "}
          <code className="rounded bg-slate-200 px-1">OPENAI_API_KEY</code> to
          enable real AI assessment.
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <ScoreRing score={feedback.totalScore} />
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-slate-800">
              Assessor feedback
            </h3>
            <p className="text-slate-600">{feedback.summary}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-800">Score breakdown</h3>
          <Scorecard scores={feedback.scores} />
        </div>

        <div className="space-y-6">
          {feedback.strengths.length > 0 && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
              <h3 className="mb-3 font-semibold text-emerald-900">
                What went well
              </h3>
              <ul className="list-disc space-y-1.5 pl-5 text-sm text-emerald-900">
                {feedback.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-brand-200 bg-brand-50 p-6">
            <h3 className="mb-3 font-semibold text-brand-900">
              Learning tips
            </h3>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-brand-900">
              {feedback.learningTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      <details className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
        <summary className="cursor-pointer font-medium text-slate-700">
          View your transcribed response
        </summary>
        <p className="mt-3 whitespace-pre-wrap text-slate-600">{transcript}</p>
      </details>

      <Disclaimer />

      <ExerciseFeedbackPrompt />
    </div>
  );
}
