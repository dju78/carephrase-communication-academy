import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MODULES } from "@/lib/scenarios";

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
        <span className="grid mx-auto h-14 w-14 place-items-center rounded-2xl bg-brand-600 text-lg font-bold text-white">
          CP
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          CarePhrase Communication Academy
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
          AI-powered communication training for UK health and social care
          staff. Practise real workplace scenarios by voice and get structured,
          scored feedback.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-full bg-brand-600 px-6 py-3 font-medium text-white shadow hover:bg-brand-700"
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

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {MODULES.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div
              className={`mb-4 h-2 w-12 rounded-full bg-gradient-to-r ${m.accent}`}
            />
            <h2 className="font-semibold text-slate-800">{m.title}</h2>
            <p className="mt-1 text-sm font-medium text-brand-600">
              {m.tagline}
            </p>
            <p className="mt-2 text-sm text-slate-600">{m.description}</p>
            {!m.available && (
              <span className="mt-3 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-500">
                Coming soon
              </span>
            )}
          </div>
        ))}
      </div>

      <p className="mx-auto mt-12 max-w-2xl text-center text-xs text-slate-400">
        Training and professional development tool only. Not clinical decision
        support, not a care record system, not a medical device.
      </p>
    </main>
  );
}
