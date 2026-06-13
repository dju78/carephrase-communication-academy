import OpenAI from "openai";
import type { Feedback, ModuleId, ScoreBreakdown, Scenario } from "./types";

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

const BASE_PROMPT = `You are a senior health and social care training assessor in the UK.
You evaluate a care worker's spoken response to a workplace communication scenario.

Rules:
- Assess ONLY the communication, not clinical correctness. Never give clinical advice or replace professional judgement.
- Score five dimensions from 0-100: clarity, completeness, professionalLanguage, safetyAwareness, structure.
- Write all feedback in plain English a care worker can act on. Be encouraging but honest.
- Provide 2-3 specific, actionable learning tips.
- This is a training tool only. Do not produce care records or clinical decisions.`;

/** Module-specific assessment focus, injected into the system prompt. */
const MODULE_FRAMEWORK: Record<ModuleId, string> = {
  handover: `This is a HANDOVER scenario. Assess how clearly and completely the learner hands over to a colleague: who the resident is, the key events, current status, any risks, and what the next shift must do. Reward a clear opening, a logical order, and an explicit close.`,
  escalation: `This is an ESCALATION scenario. Assess the response against the framework: Observation → Concern → Action Taken → Escalation Required.
A strong answer (1) states clear, factual OBSERVATIONS; (2) explains the CONCERN and why it matters; (3) describes the ACTION TAKEN so far; and (4) makes explicit what ESCALATION is required — to whom and how urgently.
Map the framework onto the five scores: completeness = how many of the four O-C-A-E elements are present and detailed; structure = a logical O→C→A→E flow; safetyAwareness = recognising urgency/risk and escalating to the right person promptly. Name any missing element in the feedback.`,
  safeguarding: `This is a SAFEGUARDING scenario. Assess the response against good safeguarding communication practice:
- APPROPRIATE RESPONSE: stay calm, listen, reassure, take the concern seriously, and never promise to keep a disclosure secret.
- PROFESSIONAL BOUNDARIES: do not investigate, interrogate, lead the person, or confront an alleged abuser.
- INFORMATION GATHERING: note the facts in the person's own words without asking leading questions.
- REPORTING PROCEDURES: report to the right person (safeguarding lead/manager) promptly and record factually.
Map onto the five scores: completeness = how many of these four elements are covered; safetyAwareness = recognising the risk and the duty to report and act; structure = a calm, logical flow; professionalLanguage = respectful, non-judgemental language and appropriate boundaries; clarity = how clearly the concern is communicated. Name any missing element in the feedback.`,
  "care-english": `This is a CARE ENGLISH scenario. Assess clarity of speech, correct use of healthcare vocabulary and professional terminology, and overall communication confidence.`,
};

const JSON_SHAPE = `Return ONLY valid JSON matching this exact shape (no markdown, no commentary):
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

function buildSystemPrompt(scenario: Scenario): string {
  return `${BASE_PROMPT}

ASSESSMENT FOCUS FOR THIS SCENARIO:
${MODULE_FRAMEWORK[scenario.moduleId]}

${JSON_SHAPE}`;
}

export async function generateFeedback(
  scenario: Scenario,
  transcript: string
): Promise<Feedback> {
  if (!client) {
    return mockFeedback(scenario, transcript);
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
        { role: "system", content: buildSystemPrompt(scenario) },
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
    return mockFeedback(scenario, transcript);
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
  // Neutral placeholder: the transcribe step has no scenario context, and this
  // reads sensibly for any module.
  return (
    "This is a simulated transcription because no OpenAI key is configured. " +
    "In a live session your spoken response would appear here, transcribed by " +
    "Whisper, ready for the assessor to evaluate against the scenario."
  );
}

/** Module-specific mock feedback copy, keyed by module. */
const MOCK_CONTENT: Record<
  ModuleId,
  { summary: string; strengths: string[]; learningTips: string[] }
> = {
  handover: {
    summary:
      "Your handover covered the key points and used a reasonable structure. Adding a clear opening and stating the action needed would strengthen it further.",
    strengths: [
      "You identified the resident and the main events of the shift.",
      "You used professional, respectful language.",
    ],
    learningTips: [
      "Open with the resident's name and a one-line summary so the listener knows who and what straight away.",
      "Be explicit about any risks and what the next shift must do, e.g. 'please reassess the hip pain after tea'.",
      "Finish with a clear close — confirm if there is anything outstanding to follow up.",
    ],
  },
  escalation: {
    summary:
      "Your escalation covered your observation and concern and used professional language. Stating the action you have already taken, and exactly what escalation you need — to whom and how urgently — would make it stronger.",
    strengths: [
      "You described what you observed and why you were concerned.",
      "You communicated respectfully and professionally.",
    ],
    learningTips: [
      "Follow the framework in order: Observation → Concern → Action Taken → Escalation Required.",
      "Be explicit about the action you have already taken before asking for help.",
      "State clearly who you need to escalate to and how urgently, e.g. 'I need the nurse to review him now'.",
    ],
  },
  safeguarding: {
    summary:
      "Your response showed you took the concern seriously and communicated respectfully. Being explicit that you would not promise secrecy, recording the facts in the person's own words, and stating exactly who you would report to would make it stronger.",
    strengths: [
      "You responded calmly and took the concern seriously.",
      "You used respectful, non-judgemental language.",
    ],
    learningTips: [
      "Reassure the person and listen, but never promise to keep a disclosure secret.",
      "Record the facts in the person's own words — don't investigate, lead, or ask probing questions.",
      "Be explicit about reporting: tell your safeguarding lead or manager promptly and document factually.",
    ],
  },
  "care-english": {
    summary:
      "Your response was understandable and used some appropriate care vocabulary. Slowing down and using full professional terms would strengthen it.",
    strengths: [
      "You communicated your main message clearly.",
      "You used some correct healthcare vocabulary.",
    ],
    learningTips: [
      "Speak slowly and finish each word clearly.",
      "Use the full professional term where you can, e.g. 'continence pad' rather than informal words.",
      "Practise key phrases aloud until they feel natural.",
    ],
  },
};

/**
 * Deterministic, transcript-aware mock so the app feels real without a key.
 * Longer, more detailed answers score higher. Copy is tailored per module.
 */
function mockFeedback(scenario: Scenario, transcript: string): Feedback {
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

  const content = MOCK_CONTENT[scenario.moduleId];
  return {
    totalScore,
    scores,
    summary: `This is simulated feedback (mock mode — no OpenAI key configured). ${content.summary}`,
    strengths: content.strengths,
    learningTips: content.learningTips,
    mock: true,
  };
}
