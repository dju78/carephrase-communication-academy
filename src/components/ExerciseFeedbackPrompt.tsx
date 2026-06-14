"use client";

import { useState } from "react";
import { FEEDBACK_FORM_URL } from "@/lib/constants";

/**
 * Lightweight "was this useful?" prompt shown after an exercise result.
 * The 👍/👎 is an in-app signal (client-side acknowledgement); the detailed
 * survey opens in a new tab so it never interrupts the training session.
 */
export default function ExerciseFeedbackPrompt() {
  const [rating, setRating] = useState<null | "yes" | "no">(null);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm">
      {rating === null ? (
        <>
          <p className="font-medium text-slate-800">Was this exercise useful?</p>
          <div className="mt-3 flex justify-center gap-3">
            <button
              onClick={() => setRating("yes")}
              className="rounded-full border border-slate-300 px-5 py-2 font-medium text-slate-700 hover:bg-emerald-50 hover:border-emerald-300"
            >
              👍 Yes
            </button>
            <button
              onClick={() => setRating("no")}
              className="rounded-full border border-slate-300 px-5 py-2 font-medium text-slate-700 hover:bg-rose-50 hover:border-rose-300"
            >
              👎 No
            </button>
          </div>
        </>
      ) : (
        <p className="font-medium text-slate-800">
          Thanks for your feedback! 🙌
        </p>
      )}

      <a
        href={FEEDBACK_FORM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm font-medium text-brand-600 hover:underline"
      >
        Share detailed feedback
      </a>
    </div>
  );
}
