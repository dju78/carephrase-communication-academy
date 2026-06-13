import type { ModuleId, Scenario } from "./types";

export interface ModuleMeta {
  id: ModuleId;
  title: string;
  tagline: string;
  description: string;
  /** Tailwind accent classes for cards. */
  accent: string;
  /** Whether this module is fully implemented in the MVP foundation. */
  available: boolean;
}

export const MODULES: ModuleMeta[] = [
  {
    id: "handover",
    title: "Handover Communication Academy",
    tagline: "Deliver structured, complete handovers",
    description:
      "Practise giving clear end-of-shift and clinical handovers. The AI assessor scores clarity, completeness, professional language, risk communication and structure.",
    accent: "from-brand-500 to-brand-700",
    available: true,
  },
  {
    id: "escalation",
    title: "Escalation Skills Academy",
    tagline: "Raise concerns appropriately",
    description:
      "Practise escalating concerns using the Observation → Concern → Action Taken → Escalation Required framework.",
    accent: "from-emerald-500 to-emerald-700",
    available: false,
  },
  {
    id: "care-english",
    title: "Care English Academy",
    tagline: "Build healthcare communication confidence",
    description:
      "Vocabulary, pronunciation and confidence practice with short AI feedback on language and terminology use.",
    accent: "from-amber-500 to-amber-700",
    available: false,
  },
];

export function getModule(id: string): ModuleMeta | undefined {
  return MODULES.find((m) => m.id === id);
}

export const SCENARIOS: Scenario[] = [
  // --- Module 1: Handover Communication Academy ---
  {
    id: "end-of-shift-handover",
    moduleId: "handover",
    title: "End-of-shift handover",
    summary: "Hand over a resident's day to the incoming staff member.",
    prompt:
      "It is the end of your shift. You are handing over Mrs Doris Allen, an 82-year-old resident, to the incoming care worker. During your shift she ate two-thirds of her lunch, declined her afternoon snack, mobilised to the lounge with her frame, and reported mild discomfort in her left hip which she rated 3/10. Her daughter is visiting at 18:00. Give a clear, structured verbal handover.",
    context: [
      "You have 60-90 seconds.",
      "Cover what matters for the next shift to keep Mrs Allen safe and comfortable.",
      "Speak as you would to a colleague taking over.",
    ],
  },
  {
    id: "resident-deterioration",
    moduleId: "handover",
    title: "Resident deterioration",
    summary: "Communicate a resident's worsening condition to a colleague.",
    prompt:
      "You have noticed that Mr Frank Owusu, a 76-year-old resident, seems more drowsy than usual this afternoon. He is harder to rouse, his speech is slightly slurred, and he has eaten very little today. His skin feels clammy. You need to hand this over clearly to the senior carer coming on shift so they understand the change and what to watch for.",
    context: [
      "Focus on what has changed and why it matters.",
      "Be specific about your observations.",
      "Make clear what action is needed and how urgently.",
    ],
  },
  {
    id: "medication-concern",
    moduleId: "handover",
    title: "Medication concern",
    summary: "Hand over a concern about a missed or refused medication.",
    prompt:
      "During the morning medication round, Mrs Patricia Hughes refused her prescribed blood pressure tablet, saying it 'makes her dizzy'. You recorded the refusal. Her lunchtime medication is due soon and you are going off shift. Hand this concern over to the incoming staff member so the situation is managed safely and appropriately.",
    context: [
      "State the facts of what happened clearly.",
      "Avoid giving clinical advice — focus on communicating the concern.",
      "Be clear about what the next person needs to do.",
    ],
  },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function getScenariosForModule(moduleId: ModuleId): Scenario[] {
  return SCENARIOS.filter((s) => s.moduleId === moduleId);
}
