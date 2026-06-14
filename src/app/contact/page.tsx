import Link from "next/link";
import type { Metadata } from "next";
import { FEEDBACK_FORM_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us · CarePhrase Communication Academy",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Link href="/" className="text-sm text-brand-600 hover:underline">
        ← Home
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Contact Us</h1>

      <div className="mt-6 space-y-4 text-slate-600">
        <p>
          CarePhrase Communication Academy is a pilot product of Daramola
          Digital Labs.
        </p>
        <p>
          During the pilot, the best way to reach us is the feedback survey —
          we read every response and use it to improve the platform.
        </p>
        <p>
          <a
            href={FEEDBACK_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
          >
            Open the feedback survey
          </a>
        </p>
        <p className="text-sm text-slate-500">
          If you are taking part through your employer, you can also raise
          questions with your training coordinator.
        </p>
      </div>
    </main>
  );
}
