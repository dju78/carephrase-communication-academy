"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import VoiceRecorder from "./VoiceRecorder";
import FeedbackCard from "./FeedbackCard";
import Disclaimer from "./Disclaimer";
import { exampleFor, getModule } from "@/lib/scenarios";
import type { Feedback, Scenario } from "@/lib/types";

type Phase = "record" | "processing" | "result";

export default function ScenarioRunner({ scenario }: { scenario: Scenario }) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("record");
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function handleSubmit(audio: Blob) {
    setError(null);
    setPhase("processing");

    try {
      // 1. Transcribe via Whisper.
      setStatus("Transcribing your response…");
      const form = new FormData();
      const ext = audio.type.includes("mp4") ? "mp4" : "webm";
      form.append("audio", audio, `response.${ext}`);

      const tRes = await fetch("/api/transcribe", {
        method: "POST",
        body: form,
      });
      if (!tRes.ok) throw new Error("Transcription failed.");
      const { transcript: text } = (await tRes.json()) as {
        transcript: string;
      };
      setTranscript(text);

      // 2. Generate AI feedback (and save the attempt server-side).
      setStatus("Generating feedback…");
      const fRes = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioId: scenario.id, transcript: text }),
      });
      if (!fRes.ok) throw new Error("Could not generate feedback.");
      const { feedback: fb } = (await fRes.json()) as { feedback: Feedback };

      setFeedback(fb);
      setPhase("result");
      // Refresh server data so the dashboard/module reflect the new attempt.
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Try again."
      );
      setPhase("record");
    }
  }

  function tryAgain() {
    setFeedback(null);
    setTranscript("");
    setError(null);
    setPhase("record");
  }

  return (
    <div className="space-y-6">
      {/* Scenario prompt */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">
          {scenario.title}
        </h2>
        <p className="mt-3 whitespace-pre-wrap text-slate-700">
          {scenario.prompt}
        </p>
        {scenario.context && scenario.context.length > 0 && (
          <ul className="mt-4 space-y-1 border-t border-slate-100 pt-4 text-sm text-slate-500">
            {scenario.context.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-brand-500">•</span>
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <p className="rounded-md bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {phase !== "result" && (
        <>
          <ExampleGuide example={exampleFor(scenario)} />
          <VoiceRecorder
            onSubmit={handleSubmit}
            isProcessing={phase === "processing"}
          />
          {phase === "processing" && (
            <p className="text-center text-sm text-slate-500">{status}</p>
          )}
          <Disclaimer />
        </>
      )}

      {phase === "result" && feedback && (
        <>
          <div className="rounded-xl bg-gradient-to-r from-brand-600 to-brand-800 p-6 text-center text-white shadow">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-100">
              Completed
            </p>
            <h2 className="mt-2 text-xl font-bold">{scenario.title}</h2>
            {getModule(scenario.moduleId) && (
              <p className="text-sm text-brand-100">
                {getModule(scenario.moduleId)!.title.replace(/ Academy$/, "")}
              </p>
            )}
            <p className="mt-4 text-4xl font-extrabold">
              {feedback.totalScore}
              <span className="ml-1 text-lg font-medium text-brand-100">
                /100
              </span>
            </p>
            <p className="mt-4 text-sm font-semibold">
              CarePhrase Communication Academy
            </p>
            <p className="text-xs text-brand-100">comms.carephrase.com</p>
          </div>

          <FeedbackCard feedback={feedback} transcript={transcript} />
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={tryAgain}
              className="rounded-full bg-brand-600 px-6 py-3 font-medium text-white shadow hover:bg-brand-700"
            >
              Try again
            </button>
            <Link
              href={`/modules/${scenario.moduleId}`}
              className="rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Back to module
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

/**
 * "Example of what to say" — a guide, not a model answer. Collapsed by default
 * so it supports learners without inviting them to copy word-for-word.
 */
function ExampleGuide({
  example,
}: {
  example: { include: string[]; phrase: string } | null;
}) {
  if (!example) return null;
  return (
    <details className="rounded-xl border border-slate-200 bg-slate-50 p-5">
      <summary className="cursor-pointer font-semibold text-slate-800">
        💬 Example of what to say
      </summary>

      <div className="mt-4 space-y-4">
        <div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            What to include
          </h4>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {example.include.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Example phrase
          </h4>
          <blockquote className="border-l-4 border-brand-300 bg-white px-4 py-3 text-sm italic text-slate-700">
            &ldquo;{example.phrase}&rdquo;
          </blockquote>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Your turn
          </h4>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            <li>Record your own response.</li>
            <li>Try not to copy word-for-word.</li>
          </ul>
          <p className="mt-3 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Use this as a guide. Your response should reflect the actual
            situation.
          </p>
        </div>
      </div>
    </details>
  );
}
