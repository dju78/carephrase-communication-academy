// Shared domain types for CarePhrase Communication Academy (MVP).

export type ModuleId = "handover" | "escalation" | "care-english";

export interface Scenario {
  id: string;
  moduleId: ModuleId;
  title: string;
  /** Short one-line summary shown in lists. */
  summary: string;
  /** The full written prompt the learner reads before recording. */
  prompt: string;
  /** Optional context bullet points to frame the situation. */
  context?: string[];
}

/**
 * The five assessment dimensions. The Handover module uses the brief's
 * categories; Escalation reframes them around its O-C-A-E framework but we
 * keep a consistent shape so the dashboard can aggregate uniformly.
 */
export interface ScoreBreakdown {
  clarity: number;
  completeness: number;
  professionalLanguage: number;
  safetyAwareness: number;
  structure: number;
}

export interface Feedback {
  /** 0-100 overall score. */
  totalScore: number;
  scores: ScoreBreakdown;
  /** Plain-English summary suitable for a care worker. */
  summary: string;
  /** What the learner did well. */
  strengths: string[];
  /** 2-3 specific, actionable learning tips. */
  learningTips: string[];
  /** True when produced by the mock engine (no OpenAI key configured). */
  mock?: boolean;
}

/** A saved practice attempt, mirrors the `attempts` table. */
export interface Attempt {
  id: string;
  user_id: string;
  module_id: ModuleId;
  scenario_id: string;
  transcript: string;
  total_score: number;
  scores: ScoreBreakdown;
  feedback: Feedback;
  created_at: string;
}

export const SCORE_LABELS: Record<keyof ScoreBreakdown, string> = {
  clarity: "Clarity",
  completeness: "Completeness",
  professionalLanguage: "Professional language",
  safetyAwareness: "Safety awareness",
  structure: "Structure",
};
