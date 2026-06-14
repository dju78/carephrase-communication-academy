import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy · CarePhrase Communication Academy",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Link href="/" className="text-sm text-brand-600 hover:underline">
        ← Home
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Pilot draft — Version 1.0</p>

      <div className="mt-6 space-y-4 text-slate-600">
        <p>
          This is the pilot privacy notice for CarePhrase Communication Academy,
          a product of Daramola Digital Labs.
        </p>

        <h2 className="pt-2 font-semibold text-slate-800">What we store</h2>
        <p>
          When you create an account we store your name and email address. When
          you complete an exercise we store the text transcription of your
          spoken response, your scores, and the feedback generated. Audio is
          processed only to produce the transcription and is not stored.
        </p>

        <h2 className="pt-2 font-semibold text-slate-800">How it is used</h2>
        <p>
          Your data is used solely to provide your training feedback and your
          progress dashboard. It is private to your account, protected by
          row-level security, and is not sold or shared.
        </p>

        <h2 className="pt-2 font-semibold text-slate-800">Important</h2>
        <p>
          CarePhrase is a training tool only. It is not a care record system.
          Please do not enter real, identifiable resident or patient information
          when recording your responses.
        </p>

        <p className="text-sm text-slate-500">
          This notice is a pilot draft and will be formalised before wider
          release. For questions, see{" "}
          <Link href="/contact" className="text-brand-600 hover:underline">
            Contact Us
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
