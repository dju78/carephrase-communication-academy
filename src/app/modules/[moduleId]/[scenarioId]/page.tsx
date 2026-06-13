import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getModule, getScenario } from "@/lib/scenarios";
import Nav from "@/components/Nav";
import ScenarioRunner from "@/components/ScenarioRunner";

export const dynamic = "force-dynamic";

export default async function ScenarioPage({
  params,
}: {
  params: Promise<{ moduleId: string; scenarioId: string }>;
}) {
  const { moduleId, scenarioId } = await params;

  const module = getModule(moduleId);
  const scenario = getScenario(scenarioId);
  if (!module || !scenario || scenario.moduleId !== moduleId) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <>
      <Nav email={user.email} />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href={`/modules/${moduleId}`}
          className="text-sm text-brand-600 hover:underline"
        >
          ← {module.title}
        </Link>
        <h1 className="mt-2 mb-6 text-2xl font-bold text-slate-900">
          Practise: {scenario.title}
        </h1>
        <ScenarioRunner scenario={scenario} />
      </main>
    </>
  );
}
