import Link from "next/link";

/** Site-wide branding + compliance footer. */
export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-3xl px-4 py-10 text-center text-sm text-slate-500">
        <p className="font-semibold text-slate-700">
          CarePhrase Communication Academy
        </p>
        <p className="mt-1">
          Professional communication training for health and social care staff.
        </p>

        <p className="mt-3">A product of Daramola Digital Labs</p>
        <p className="mt-1 text-slate-400">comms.carephrase.com</p>

        <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-slate-600">
          <Link href="/contact" className="hover:text-slate-900 hover:underline">
            Contact Us
          </Link>
          <span aria-hidden className="text-slate-300">
            •
          </span>
          <Link
            href="/accessibility"
            className="hover:text-slate-900 hover:underline"
          >
            Accessibility
          </Link>
          <span aria-hidden className="text-slate-300">
            •
          </span>
          <Link href="/privacy" className="hover:text-slate-900 hover:underline">
            Privacy
          </Link>
        </nav>

        <p className="mx-auto mt-6 max-w-2xl text-xs leading-relaxed text-slate-400">
          CarePhrase Communication Academy is a communication training tool. It
          is not a care record system, clinical decision-support tool, or
          medical device. Users should always follow their organisation&rsquo;s
          policies, safeguarding procedures and professional judgement.
        </p>

        <p className="mt-6 text-xs text-slate-400">Version 1.0 Pilot</p>
        <p className="mt-1 text-xs text-slate-400">
          © 2026 Daramola Digital Labs. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
