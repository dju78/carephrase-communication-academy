import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getModule,
  getScenariosForModule,
} from "@/lib/scenarios";
import Nav from "@/components/Nav";
import type { ModuleId } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  const module = getModule(moduleId);
  if (!module) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  if (!module.available) {
    return (
      <>
        <Nav email={user.email} />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-slate-900">{module.title}</h1>
          <p className="mt-3 text-slate-600">{module.description}</p>
          <span className="mt-6 inline-block rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-500">
            Coming soon in a future release
          </span>
          <div className="mt-8">
            <Link href="/dashboard" className="text-brand-600 hover:underline">
              ← Back to dashboard
            </Link>
          </div>
        </main>
      </>
    );
  }

  const scenarios = getScenariosForModule(moduleId as ModuleId);

  // Which scenarios has the learner already attempted?
  const { data: attempts } = await supabase
    .from("attempts")
    .select("scenario_id, total_score")
    .eq("module_id", moduleId);

  const bestByScenario = new Map<string, number>();
  for (const a of attempts ?? []) {
    const prev = bestByScenario.get(a.scenario_id) ?? 0;
    if (a.total_score > prev) bestByScenario.set(a.scenario_id, a.total_score);
  }

  return (
    <>
      <Nav email={user.email} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href="/dashboard"
          className="text-sm text-brand-600 hover:underline"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {module.title}
        </h1>
        <p className="mt-1 text-slate-600">{module.description}</p>

        <div className="mt-6 space-y-3">
          {scenarios.map((s) => {
            const best = bestByScenario.get(s.id);
            return (
              <Link
                key={s.id}
                href={`/modules/${moduleId}/${s.id}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <h2 className="font-semibold text-slate-800">{s.title}</h2>
                  <p className="mt-0.5 text-sm text-slate-500">{s.summary}</p>
                </div>
                <div className="ml-4 shrink-0 text-right">
                  {best != null ? (
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                      Best {best}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-brand-600">
                      Start →
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
