import { NextResponse } from "next/server";
import { generateFeedback } from "@/lib/openai";
import { getScenario } from "@/lib/scenarios";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { scenarioId, transcript } = (await request.json()) as {
      scenarioId?: string;
      transcript?: string;
    };

    if (!scenarioId || !transcript?.trim()) {
      return NextResponse.json(
        { error: "Missing scenarioId or transcript." },
        { status: 400 }
      );
    }

    const scenario = getScenario(scenarioId);
    if (!scenario) {
      return NextResponse.json(
        { error: "Unknown scenario." },
        { status: 404 }
      );
    }

    const feedback = await generateFeedback(scenario, transcript);

    // Persist the attempt for the signed-in learner (best-effort).
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await supabase.from("attempts").insert({
          user_id: user.id,
          module_id: scenario.moduleId,
          scenario_id: scenario.id,
          transcript,
          total_score: feedback.totalScore,
          scores: feedback.scores,
          feedback,
        });
      }
    } catch (saveErr) {
      // Don't fail the request if saving fails — the learner still sees feedback.
      console.error("Failed to save attempt:", saveErr);
    }

    return NextResponse.json({ feedback });
  } catch (err) {
    console.error("Feedback generation failed:", err);
    return NextResponse.json(
      { error: "Could not generate feedback. Please try again." },
      { status: 500 }
    );
  }
}
