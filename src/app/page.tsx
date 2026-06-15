import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MODULES } from "@/lib/scenarios";
import InstallPrompt from "@/components/InstallPrompt";
import PilotAccessForm from "@/components/PilotAccessForm";

// Canonical + og:url resolve against metadataBase (siteUrl) so they follow the
// production domain automatically. Description + keywords target the platform's
// core search terms.
export const metadata: Metadata = {
  description:
    "Care communication training for UK health and social care staff — practise handover, escalation and safeguarding communication and care English by voice, with AI feedback. Request pilot access for your organisation.",
  keywords: [
    "care communication training",
    "healthcare communication skills",
    "care worker communication training",
    "safeguarding communication training",
    "handover communication training UK",
  ],
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default async function Home() {
  // If Supabase is configured and the user is signed in, go to the dashboard.
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/dashboard");
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-full.png"
          alt="CarePhrase Communication Academy"
          className="mx-auto h-24 w-auto sm:h-28"
        />
        <h1 className="sr-only">CarePhrase Communication Academy</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          AI-powered communication training for UK health and social care
          staff. Practise real workplace scenarios by voice and get structured,
          scored feedback.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="#request-pilot-access"
            className="rounded-full bg-brand-600 px-6 py-3 font-medium text-white shadow hover:bg-brand-700"
          >
            Request Pilot Access
          </a>
          <Link
            href="/signup"
            className="rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
          >
            Sign in
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-md text-left">
        <InstallPrompt />
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {MODULES.map((m) => (
          <div
            key={m.id}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div
              className={`mb-4 h-2 w-12 rounded-full bg-gradient-to-r ${m.accent}`}
            />
            <h2 className="font-semibold text-slate-800">{m.title}</h2>
            <p className="mt-1 text-sm font-medium text-brand-600">
              {m.tagline}
            </p>
            <p className="mt-2 text-sm text-slate-600">{m.description}</p>

            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Learners will
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                {m.outcomes.map((o, i) => (
                  <li key={i}>{o}</li>
                ))}
              </ul>
            </div>

            {!m.available && (
              <span className="mt-3 inline-block self-start rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                Coming soon
              </span>
            )}

            <div className="mt-auto pt-6">
              <a
                href="#request-pilot-access"
                className="inline-block rounded-full border border-brand-600 px-4 py-1.5 text-sm font-medium text-brand-700 hover:bg-brand-50"
              >
                Request pilot access
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* SEO content */}
      <section className="mt-20 border-t border-slate-200 pt-12">
        <h2 className="text-2xl font-bold text-slate-900">
          Communication training built for health and social care
        </h2>
        <div className="mt-4 grid gap-6 text-sm leading-relaxed text-slate-600 sm:grid-cols-2">
          <p>
            CarePhrase Communication Academy provides{" "}
            <strong>care communication training</strong> and practical{" "}
            <strong>healthcare communication skills</strong> practice for
            frontline teams. Learners rehearse real workplace conversations by
            voice and receive structured, scored AI feedback — turning theory
            into confident, day-to-day communication.
          </p>
          <p>
            From <strong>care worker communication training</strong> for new
            starters and international staff, to{" "}
            <strong>safeguarding communication training</strong> and structured{" "}
            <strong>handover communication training in the UK</strong>, each
            Academy targets the conversations that keep people safe: handovers,
            escalation, safeguarding disclosures and clear professional
            language.
          </p>
        </div>
      </section>

      {/* For Care Providers */}
      <section className="mt-20 border-t border-slate-200 pt-12">
        <h2 className="text-2xl font-bold text-slate-900">For Care Providers</h2>
        <p className="mt-3 max-w-3xl text-slate-600">
          CarePhrase Communication Academy supports communication skills
          development across health and social care teams.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Benefits
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
              {[
                "Improved communication during handovers, escalation conversations and day-to-day care interactions",
                "Reduced misunderstandings between team members",
                "Better documentation quality through clearer communication",
                "Enhanced staff confidence before real workplace situations",
                "Support for induction training, especially for new staff and overseas recruits",
                "Consistent training experience across teams and locations",
                "Professional development through realistic workplace scenarios and feedback",
                "Scalable workforce development without relying only on classroom sessions",
              ].map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Suitable for
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {[
                "Care homes",
                "Supported living services",
                "Home care providers",
                "NHS and healthcare teams",
                "Training providers",
                "Adult social care organisations",
              ].map((s) => (
                <li
                  key={s}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-6 text-center">
          <p className="text-slate-700">
            Interested in exploring how CarePhrase could support your
            organisation?
          </p>
          <a
            href="#request-pilot-access"
            className="mt-4 inline-block rounded-full bg-brand-600 px-6 py-3 font-medium text-white shadow hover:bg-brand-700"
          >
            Request pilot access
          </a>
        </div>
      </section>

      {/* Request Pilot Access */}
      <section
        id="request-pilot-access"
        className="mt-20 scroll-mt-8 border-t border-slate-200 pt-12"
      >
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900">
            Request Pilot Access
          </h2>
          <p className="mt-3 text-slate-600">
            Interested in piloting CarePhrase Communication Academy in your
            organisation?
          </p>
          <p className="mt-2 text-slate-600">
            Complete the form and our team will contact you to discuss
            suitability, training objectives and pilot availability.
          </p>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <PilotAccessForm />
          </div>
        </div>
      </section>

      <p className="mx-auto mt-12 max-w-2xl text-center text-xs text-slate-400">
        Training and professional development tool only. Not clinical decision
        support, not a care record system, not a medical device.
      </p>
    </main>
  );
}
