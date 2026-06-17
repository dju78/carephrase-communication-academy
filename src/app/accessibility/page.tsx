import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility · CarePhrase Communication Academy",
  description:
    "CarePhrase Communication Academy's accessibility commitment: how we make voice-based care communication training usable for all UK health and social care staff.",
};

export default function AccessibilityPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Link href="/" className="text-sm text-brand-600 hover:underline">
        ← Home
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Accessibility</h1>
      <p className="mt-2 text-sm text-slate-500">Pilot statement — Version 1.0</p>

      <div className="mt-6 space-y-4 text-slate-600">
        <p>
          CarePhrase Communication Academy aims to be usable by everyone in the
          health and social care workforce, including international staff and
          people using assistive technology.
        </p>

        <p>We have designed the pilot to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>support keyboard navigation and screen readers;</li>
          <li>use clear text, readable type sizes and strong colour contrast;</li>
          <li>
            let you re-record a spoken response as many times as you like before
            submitting;
          </li>
          <li>show written prompts and a guide alongside every exercise.</li>
        </ul>

        <p className="text-sm text-slate-500">
          This is a pilot and we are still improving. If you encounter any
          accessibility barrier, please tell us via the{" "}
          <Link href="/contact" className="text-brand-600 hover:underline">
            feedback channels
          </Link>{" "}
          so we can fix it.
        </p>
      </div>
    </main>
  );
}
