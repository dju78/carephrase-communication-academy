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
          a product of Daramola Digital Labs. CarePhrase Communication Academy
          is a communication <strong>training platform only</strong>.
        </p>

        <h2 className="pt-2 font-semibold text-slate-800">What we store</h2>
        <p>
          When you create an account we store your name and email address. When
          you complete an exercise we store the written transcription of your
          spoken response, your scores, and the feedback generated. Your audio
          is transcribed to produce that text and is not itself stored.
        </p>

        <h2 className="pt-2 font-semibold text-slate-800">
          How your responses are processed
        </h2>
        <p>
          Your spoken response is transcribed into text so we can give you
          training feedback. That transcript and any written responses may be
          sent to OpenAI, which processes them to generate your feedback. They
          are used only to provide your feedback and progress dashboard — your
          data is private to your account, protected by row-level security, and
          is not sold or shared for other purposes.
        </p>

        <h2 className="pt-2 font-semibold text-slate-800">
          Do not enter real patient information
        </h2>
        <p>
          Please <strong>do not enter real, patient- or resident-identifiable
          information</strong> when recording your responses. Use the scenario
          details provided, or made-up examples, only.
        </p>

        <h2 className="pt-2 font-semibold text-slate-800">
          What this platform is not
        </h2>
        <p>
          CarePhrase Communication Academy is not a care record system, a
          clinical decision-support tool, or a medical device. It does not
          replace your employer&rsquo;s policies, safeguarding procedures or
          your professional judgement — always follow those.
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
