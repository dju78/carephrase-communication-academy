import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MODULES, getScenario, SCENARIOS } from "@/lib/scenarios";
import Nav from "@/components/Nav";
import { FEEDBACK_FORM_URL } from "@/lib/constants";
import type { Attempt } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: attemptsData } = await supabase
    .from("attempts")
    .select("*")
    .order("created_at", { ascending: false });

  const attempts = (attemptsData ?? []) as Attempt[];

  // --- Aggregate stats ---
  const completedScenarioIds = new Set(attempts.map((a) => a.scenario_id));
  const completedCount = completedScenarioIds.size;
  const totalScenarios = SCENARIOS.length;
  const averageScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((sum, a) => sum + a.total_score, 0) / attempts.length
        )
      : 0;
  const bestScore =
    attempts.length > 0 ? Math.max(...attempts.map((a) => a.total_score)) : 0;

  // Most recent learning tips become the recommendations.
  const recommendations = attempts[0]?.feedback?.learningTips ?? [];

  const greetingName =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ||
    "there";

  return (
    <>
      <Nav email={user.email} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Hello, {greetingName}
        </h1>
        <p className="mt-1 text-slate-500">
          Your communication training progress at a glance.
        </p>

        {/* Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <Stat label="Average score" value={`${averageScore}`} suffix="/100" />
          <Stat label="Best score" value={`${bestScore}`} suffix="/100" />
          <Stat
            label="Scenarios completed"
            value={`${completedCount}`}
            suffix={`/${totalScenarios}`}
          />
          <Stat label="Total attempts" value={`${attempts.length}`} />
        </div>

        {/* Modules */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">Modules</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {MODULES.map((m) => {
              const card = (
                <div
                  className={`flex h-full flex-col rounded-2xl border bg-white p-5 shadow-sm transition ${
                    m.available
                      ? "border-slate-200 hover:shadow-md"
                      : "border-slate-200 opacity-70"
                  }`}
                >
                  <div
                    className={`mb-3 h-2 w-12 rounded-full bg-gradient-to-r ${m.accent}`}
                  />
                  <h3 className="font-semibold text-slate-800">{m.title}</h3>
                  <p className="mt-1 flex-1 text-sm text-slate-600">
                    {m.tagline}
                  </p>
                  <span className="mt-3 text-sm font-medium text-brand-600">
                    {m.available ? "Start practising →" : "Coming soon"}
                  </span>
                </div>
              );
              return m.available ? (
                <Link key={m.id} href={`/modules/${m.id}`}>
                  {card}
                </Link>
              ) : (
                <div key={m.id}>{card}</div>
              );
            })}
          </div>
        </section>

        {/* Pilot feedback */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">
            Pilot Feedback
          </h2>
          <p className="mt-1 text-slate-600">
            Help us improve CarePhrase Communication Academy by sharing your
            experience.
          </p>
          <a
            href={FEEDBACK_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-full bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700"
          >
            Complete Feedback Survey
          </a>
        </section>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <section className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-6">
            <h2 className="mb-3 text-lg font-semibold text-brand-900">
              Recommended focus areas
            </h2>
            <p className="mb-3 text-sm text-brand-800">
              Based on your most recent practice:
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-sm text-brand-900">
              {recommendations.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Recent attempts */}
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-slate-800">
            Recent practice
          </h2>
          {attempts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
              No practice yet. Choose a module above to record your first
              response.
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Scenario</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 text-right font-medium">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {attempts.slice(0, 10).map((a) => {
                    const scenario = getScenario(a.scenario_id);
                    return (
                      <tr key={a.id}>
                        <td className="px-4 py-3 text-slate-800">
                          {scenario?.title ?? a.scenario_id}
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {new Date(a.created_at).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-900">
                          {a.total_score}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

function Stat({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-1 text-3xl font-bold text-slate-900">
        {value}
        {suffix && (
          <span className="ml-0.5 text-base font-medium text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
