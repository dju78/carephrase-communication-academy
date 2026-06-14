import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Install CarePhrase · CarePhrase Communication Academy",
};

export default function InstallPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <Link href="/dashboard" className="text-sm text-brand-600 hover:underline">
        ← Dashboard
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        Install CarePhrase
      </h1>
      <p className="mt-2 text-slate-600">
        Add CarePhrase Communication Academy to your phone&rsquo;s home screen
        for quick, full-screen access — no app store needed.
      </p>

      <div className="mt-8 space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-800"> iPhone &amp; iPad (Safari)</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-600">
            <li>Open this site in <strong>Safari</strong>.</li>
            <li>
              Tap the <strong>Share</strong> button (the square with an upward
              arrow).
            </li>
            <li>
              Scroll down and tap <strong>Add to Home Screen</strong>.
            </li>
            <li>
              Tap <strong>Add</strong> — the CarePhrase icon appears on your
              home screen.
            </li>
          </ol>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-800">Android (Chrome)</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-slate-600">
            <li>Open this site in <strong>Chrome</strong>.</li>
            <li>
              Tap the <strong>⋮</strong> menu (top-right), or look for the
              install prompt in the address bar.
            </li>
            <li>
              Tap <strong>Install app</strong> (or <strong>Add to Home
              screen</strong>).
            </li>
            <li>
              Confirm <strong>Install</strong> — CarePhrase is added to your
              app drawer / home screen.
            </li>
          </ol>
        </section>
      </div>

      <p className="mt-8 text-sm text-slate-500">
        Once installed, open CarePhrase from the home-screen icon and it runs
        full-screen like an app. You still need an internet connection to record
        and receive feedback.
      </p>
    </main>
  );
}
