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
    available: true,
  },
  {
    id: "safeguarding",
    title: "Safeguarding Communication Academy",
    tagline: "Handle safeguarding concerns confidently",
    description:
      "Practise responding to disclosures and raising safeguarding concerns — assessed on appropriate response, professional boundaries, information gathering and reporting procedures.",
    accent: "from-rose-500 to-rose-700",
    available: true,
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

  // --- Module 2: Escalation Skills Academy ---
  // Assessed with the framework: Observation → Concern → Action Taken → Escalation Required.
  {
    id: "fall",
    moduleId: "escalation",
    title: "Fall",
    summary: "Escalate after finding a resident on the floor.",
    prompt:
      "You walk into Mr Joseph Bello's room and find him sitting on the floor beside his bed. He is conscious and talking but says his right hip hurts and he cannot get himself up. There is a small graze on his elbow, and you do not know how long he has been there. Verbally raise this with the nurse in charge using the escalation framework.",
    context: [
      "Do not try to move him yourself — focus on communicating the escalation.",
      "Cover what you observed, your concern, what you have done, and what you need to happen.",
      "Be clear about how urgent this is.",
    ],
  },
  {
    id: "refusal-of-care",
    moduleId: "escalation",
    title: "Refusal of care",
    summary: "Escalate a resident's repeated refusal of essential care.",
    prompt:
      "Mrs Edith Crowe has refused personal care for the second day running and has now also refused to let you change a soiled continence pad. She is becoming tearful and says she 'just wants to be left alone'. You are concerned about her skin integrity and her dignity. Escalate this appropriately to the senior on shift.",
    context: [
      "Respect her right to refuse while still communicating your concern.",
      "State what you observed, why you are concerned, what you have tried, and what support you need.",
      "Avoid clinical conclusions — communicate the concern.",
    ],
  },
  {
    id: "sudden-confusion",
    moduleId: "escalation",
    title: "Sudden confusion",
    summary: "Escalate a resident's sudden change in mental state.",
    prompt:
      "Mr Ahmed Khan, who is normally alert and chatty, has become suddenly confused this afternoon. He does not recognise you, is agitated, and keeps trying to leave the lounge. This is a marked change from how he was this morning. Escalate your concern to the nurse using the escalation framework.",
    context: [
      "Focus on what has changed and how quickly it happened.",
      "Cover your observation, your concern, any action taken, and the escalation needed.",
      "Convey the appropriate level of urgency.",
    ],
  },

  // --- Module 3: Safeguarding Communication Academy ---
  // Assessed on: appropriate response, professional boundaries, information
  // gathering, and reporting procedures (mapped to the five dashboard scores).
  {
    id: "unexplained-bruising",
    moduleId: "safeguarding",
    title: "Unexplained bruising",
    summary: "Report unexplained bruising noticed during personal care.",
    prompt:
      "During personal care you notice fresh bruising on Mrs Joan Carter's upper arms and back that was not there yesterday and that she cannot explain. She becomes withdrawn and avoids eye contact when you gently ask about it. Communicate this safeguarding concern to your safeguarding lead — describe what you observed and what you would do.",
    context: [
      "State the factual observations only — what you saw and where.",
      "Do not investigate or ask the resident leading questions.",
      "Be clear about recording the facts and reporting to the safeguarding lead.",
    ],
  },
  {
    id: "disclosure-of-abuse",
    moduleId: "safeguarding",
    title: "Disclosure of abuse",
    summary: "Respond to a resident beginning to disclose possible abuse.",
    prompt:
      "While you are helping Mrs Grace Whitfield with her lunch, she becomes quiet and says, 'One of the night staff is rough with me, but please don't tell anyone — I don't want any trouble.' Respond to her, and then explain what you would do next and who you would tell.",
    context: [
      "Take what she says seriously and respond with care.",
      "Do not promise to keep it secret, and do not investigate it yourself.",
      "Be clear about what you would record and who you would report to.",
    ],
  },
  {
    id: "financial-abuse",
    moduleId: "safeguarding",
    title: "Financial abuse concern",
    summary: "Report possible financial exploitation of a resident.",
    prompt:
      "You have noticed that Mrs Irene Patel's relative has been taking money from her purse and pressuring her to hand over her bank card, and Mrs Patel seems anxious whenever he visits. Report this possible financial abuse to your safeguarding lead, communicating what you have observed and your concern.",
    context: [
      "Describe the specific things you have observed.",
      "Do not confront the relative or investigate it yourself.",
      "Be clear about reporting to the safeguarding lead and recording the facts.",
    ],
  },
  {
    id: "neglect-concern",
    moduleId: "safeguarding",
    title: "Neglect concern",
    summary: "Raise a concern that a person is being neglected by others.",
    prompt:
      "You visit Mr Albert Reilly, who is cared for at home by a family member. You find him in a soiled bed with his pressure-relief mattress switched off, there is no food in the house, and he tells you he has not been helped to wash for several days. Raise this neglect concern with your safeguarding lead — describe what you observed and why you are worried.",
    context: [
      "Describe the specific things you observed on the visit.",
      "Do not confront the family member or investigate it yourself.",
      "Be clear about reporting to the safeguarding lead and recording the facts.",
    ],
  },
  {
    id: "professional-boundaries",
    moduleId: "safeguarding",
    title: "Professional boundaries concern",
    summary:
      "Raise a concern about a colleague crossing professional boundaries.",
    prompt:
      "You have seen a colleague accepting cash gifts from a resident, giving the resident their personal phone number, and offering to run errands for them outside of work. You are concerned these blurred boundaries put the resident at risk of exploitation. Raise your concern through the proper channel — explain what you have seen and what you are asking to happen.",
    context: [
      "Stick to the specific facts you have witnessed yourself.",
      "Use professional, non-accusatory language.",
      "Be clear about who you are reporting to and why it matters for the resident.",
    ],
  },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function getScenariosForModule(moduleId: ModuleId): Scenario[] {
  return SCENARIOS.filter((s) => s.moduleId === moduleId);
}
