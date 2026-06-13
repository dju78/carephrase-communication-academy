import OpenAI from "openai";
import type { Feedback, ScoreBreakdown, Scenario } from "./types";

const apiKey = process.env.OPENAI_API_KEY?.trim();

/** True when no key is configured — the app runs in mock mode. */
export const MOCK_MODE = !apiKey;

const client = apiKey ? new OpenAI({ apiKey }) : null;

const FEEDBACK_MODEL = process.env.OPENAI_FEEDBACK_MODEL || "gpt-4o";
const TRANSCRIBE_MODEL = process.env.OPENAI_TRANSCRIBE_MODEL || "whisper-1";

// ---------------------------------------------------------------------------
// Transcription (Whisper)
// ---------------------------------------------------------------------------

export async function transcribeAudio(file: File): Promise<string> {
  if (!client) {
    return mockTranscript();
  }
  try {
    const result = await client.audio.transcriptions.create({
      file,
      model: TRANSCRIBE_MODEL,
      language: "en",
    });
    return result.text.trim();
  } catch (err) {
    // Bad key, no credits, rate limit, or any API error: fall back to mock so
    // the learner's session never hard-fails.
    console.error("Whisper transcription failed — falling back to mock:", err);
    return mockTranscript();
  }
}

// ---------------------------------------------------------------------------
// Feedback (GPT-4o)
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are a senior health and social care training assessor in the UK.
You evaluate a care worker's spoken response to a workplace communication scenario.

Rules:
- Assess ONLY the communication, not clinical correctness. Never give clinical advice or replace professional judgement.
- Score five dimensions from 0-100: clarity, completeness, professionalLanguage, safetyAwareness, structure.
- Write all feedback in plain English a care worker can act on. Be encouraging but honest.
- Provide 2-3 specific, actionable learning tips.
- This is a training tool only. Do not produce care records or clinical decisions.

Return ONLY valid JSON matching this exact shape (no markdown, no commentary):
{
  "totalScore": <0-100 integer, roughly the average of the five scores>,
  "scores": {
    "clarity": <0-100>,
    "completeness": <0-100>,
    "professionalLanguage": <0-100>,
    "safetyAwareness": <0-100>,
    "structure": <0-100>
  },
  "summary": "<2-3 sentence plain-English overview>",
  "strengths": ["<short point>", "..."],
  "learningTips": ["<specific tip>", "<specific tip>", "<optional third>"]
}`;

export async function generateFeedback(
  scenario: Scenario,
  transcript: string
): Promise<Feedback> {
  if (!client) {
    return mockFeedback(transcript);
  }

  const userPrompt = `SCENARIO: ${scenario.title}
SCENARIO PROMPT:
${scenario.prompt}

LEARNER'S TRANSCRIBED RESPONSE:
"""
${transcript}
"""

Assess this response against the scenario and return the JSON.`;

  try {
    const completion = await client.chat.completions.create({
      model: FEEDBACK_MODEL,
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw) as Partial<Feedback>;
    return normaliseFeedback(parsed);
  } catch (err) {
    // Bad key, no credits, rate limit, malformed JSON, or any API error:
    // fall back to mock feedback so the learner still gets a result.
    console.error("OpenAI feedback failed — falling back to mock:", err);
    return mockFeedback(transcript);
  }
}

/** Clamp and fill any missing fields so the UI always gets a valid shape. */
function normaliseFeedback(input: Partial<Feedback>): Feedback {
  const clamp = (n: unknown) =>
    Math.max(0, Math.min(100, Math.round(Number(n) || 0)));
  const scores: ScoreBreakdown = {
    clarity: clamp(input.scores?.clarity),
    completeness: clamp(input.scores?.completeness),
    professionalLanguage: clamp(input.scores?.professionalLanguage),
    safetyAwareness: clamp(input.scores?.safetyAwareness),
    structure: clamp(input.scores?.structure),
  };
  const avg = Math.round(
    (scores.clarity +
      scores.completeness +
      scores.professionalLanguage +
      scores.safetyAwareness +
      scores.structure) /
      5
  );
  return {
    totalScore: input.totalScore != null ? clamp(input.totalScore) : avg,
    scores,
    summary: input.summary ?? "",
    strengths: input.strengths ?? [],
    learningTips: input.learningTips ?? [],
  };
}

// ---------------------------------------------------------------------------
// Mock engine (used when OPENAI_API_KEY is not set)
// ---------------------------------------------------------------------------

function mockTranscript(): string {
  return (
    "This is a simulated transcription because no OpenAI key is configured. " +
    "Handing over Mrs Allen, she ate most of her lunch but declined her snack, " +
    "mobilised to the lounge with her frame, and reported mild left hip discomfort at three out of ten. " +
    "Her daughter is visiting at six. Please keep an eye on her pain and offer the snack again later."
  );
}

/**
 * Deterministic, transcript-aware mock so the app feels real without a key.
 * Longer, more detailed answers score higher.
 */
function mockFeedback(transcript: string): Feedback {
  const words = transcript.trim().split(/\s+/).filter(Boolean).length;
  const base = Math.max(45, Math.min(92, 50 + Math.round(words / 3)));
  const jitter = (offset: number) =>
    Math.max(40, Math.min(98, base + offset));

  const scores: ScoreBreakdown = {
    clarity: jitter(4),
    completeness: jitter(-3),
    professionalLanguage: jitter(2),
    safetyAwareness: jitter(-1),
    structure: jitter(-5),
  };
  const totalScore = Math.round(
    (scores.clarity +
      scores.completeness +
      scores.professionalLanguage +
      scores.safetyAwareness +
      scores.structure) /
      5
  );

  return {
    totalScore,
    scores,
    summary:
      "This is simulated feedback (mock mode — no OpenAI key configured). Your handover covered the key points and used a reasonable structure. Adding a clear opening and stating the action needed would strengthen it further.",
    strengths: [
      "You identified the resident and the main events of the shift.",
      "You used professional, respectful language.",
    ],
    learningTips: [
      "Open with the resident's name and a one-line summary so the listener knows who and what straight away.",
      "Be explicit about any risks and what the next shift must do, e.g. 'please reassess the hip pain after tea'.",
      "Finish with a clear close — confirm if there is anything outstanding to follow up.",
    ],
    mock: true,
  };
}
