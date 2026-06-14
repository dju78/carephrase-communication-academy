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
    available: true,
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

  // --- Module 4: Care English Academy ---
  // Short speaking exercises across healthcare vocabulary, pronunciation
  // (read-aloud), communication confidence, and professional terminology.
  // Assessed with the same 5 dashboard dimensions, framed for language use.
  {
    id: "vocab-continence",
    moduleId: "care-english",
    title: "Vocabulary: 'continence'",
    summary: "Use the term 'continence' correctly in a spoken sentence.",
    prompt:
      "Healthcare vocabulary practice. Say one clear, complete sentence you might use at work that correctly uses the word \"continence\" — for example, when supporting a resident with continence care. Speak in full, professional language.",
    context: [
      "Use the target word naturally and correctly.",
      "Speak a full sentence, not just the word.",
      "Aim for clear, professional phrasing.",
    ],
  },
  {
    id: "vocab-pressure-area",
    moduleId: "care-english",
    title: "Vocabulary: 'pressure area'",
    summary: "Use the term 'pressure area' correctly in a spoken sentence.",
    prompt:
      "Healthcare vocabulary practice. Say one clear sentence you might use during care or a handover that correctly uses the term \"pressure area\" — for example, reporting skin you have checked. Use full, professional language.",
    context: [
      "Use the target term correctly and in context.",
      "Speak a complete sentence.",
      "Keep it clear and professional.",
    ],
  },
  {
    id: "pronounce-paracetamol",
    moduleId: "care-english",
    title: "Pronunciation: 'paracetamol'",
    summary: "Read a phrase aloud clearly, focusing on a tricky term.",
    prompt:
      'Pronunciation practice. Read this phrase aloud, clearly and at a steady pace:\n\n"I have given Mrs Allen her prescribed paracetamol and recorded it on the medication chart."\n\nFocus on saying every word clearly, especially "paracetamol" and "medication".',
    context: [
      "Read the phrase exactly as written.",
      "Speak slowly and finish each word.",
      "Your transcript is shown afterwards so you can compare it with the phrase.",
    ],
  },
  {
    id: "pronounce-catheter",
    moduleId: "care-english",
    title: "Pronunciation: 'catheter'",
    summary: "Read a phrase aloud clearly, focusing on a tricky term.",
    prompt:
      'Pronunciation practice. Read this phrase aloud, clearly and at a steady pace:\n\n"The resident\'s catheter bag was emptied and the output was documented."\n\nFocus on clear pronunciation of "catheter" and "documented".',
    context: [
      "Read the phrase exactly as written.",
      "Speak slowly and clearly.",
      "Your transcript is shown afterwards so you can compare it with the phrase.",
    ],
  },
  // Care phrases — practise the key phrases used in each care context.
  {
    id: "phrases-personal-care",
    moduleId: "care-english",
    title: "Phrases: Personal care",
    summary: "Practise polite, clear phrases for supporting personal care.",
    prompt:
      "Personal care phrases. You are about to help a resident with washing and dressing. Say two or three polite, clear phrases you would use to explain what you are going to do and to offer them choice and preserve their dignity.",
    context: [
      "Use respectful, reassuring language.",
      "Offer choice and maintain dignity.",
      "Speak clearly and at a steady pace.",
    ],
  },
  {
    id: "phrases-handover",
    moduleId: "care-english",
    title: "Phrases: Handover",
    summary: "Practise key phrases used when giving a handover.",
    prompt:
      "Handover phrases. Say two or three clear phrases you would use during a shift handover to introduce a resident and summarise their day — for example, opening the handover and flagging anything the next shift should watch.",
    context: [
      "Use clear, structured phrasing.",
      "Be concise and professional.",
      "Include an opening and a point to watch.",
    ],
  },
  {
    id: "phrases-escalation",
    moduleId: "care-english",
    title: "Phrases: Escalation",
    summary: "Practise phrases for raising a concern to a senior.",
    prompt:
      "Escalation phrases. Say two or three clear phrases you would use to raise a concern with a senior colleague — for example, stating what you have observed and asking them to review the resident.",
    context: [
      "State the concern clearly and factually.",
      "Make clear what you are asking for.",
      "Convey the appropriate urgency.",
    ],
  },
  {
    id: "phrases-safeguarding",
    moduleId: "care-english",
    title: "Phrases: Safeguarding",
    summary: "Practise phrases for responding to a safeguarding concern.",
    prompt:
      "Safeguarding phrases. Say two or three appropriate phrases you would use if a resident began to tell you about possible abuse — for example, reassuring them while being honest that you cannot keep it a secret.",
    context: [
      "Be reassuring, but never promise secrecy.",
      "Use calm, non-judgemental language.",
      "Make clear you will get the right help.",
    ],
  },
  {
    id: "phrases-emergency",
    moduleId: "care-english",
    title: "Phrases: Emergency",
    summary: "Practise clear, urgent phrases for an emergency.",
    prompt:
      "Emergency phrases. A resident has collapsed. Say two or three clear, urgent phrases you would use to call for help and direct a colleague — for example, summoning the nurse and asking someone to bring equipment or call an ambulance.",
    context: [
      "Speak clearly and with urgency.",
      "Give direct, specific instructions.",
      "Stay calm and audible.",
    ],
  },

  // Workplace conversation practice — realistic spoken care conversations.
  {
    id: "convo-resident",
    moduleId: "care-english",
    title: "Conversation: Speaking to a resident",
    summary: "Have a warm, respectful conversation with a resident.",
    prompt:
      "Workplace conversation practice. A resident seems a little low this morning. Speak to them warmly: greet them, ask how they are, and offer some gentle reassurance or support. Speak as you would to them.",
    context: [
      "Be warm, patient and respectful.",
      "Listen and respond to how they feel.",
      "Keep your language clear and kind.",
    ],
  },
  {
    id: "convo-family",
    moduleId: "care-english",
    title: "Conversation: Speaking to a family member",
    summary: "Update a resident's relative professionally and warmly.",
    prompt:
      "Workplace conversation practice. A resident's daughter asks how her mother has been today. Give her a warm, professional update — mention how her mother is and reassure her appropriately, without sharing anything you should not.",
    context: [
      "Be warm, professional and reassuring.",
      "Share appropriate, factual information.",
      "Maintain confidentiality and professional boundaries.",
    ],
  },
  {
    id: "convo-handover",
    moduleId: "care-english",
    title: "Conversation: Giving a handover",
    summary: "Give a short spoken handover to a colleague.",
    prompt:
      "Workplace conversation practice. Give a short verbal handover to the colleague taking over from you: say who the resident is, how their day went, and anything the next shift should keep an eye on.",
    context: [
      "Be clear and well structured.",
      "Cover who, what happened, and what to watch.",
      "Keep it concise and professional.",
    ],
  },
  {
    id: "convo-escalation",
    moduleId: "care-english",
    title: "Conversation: Escalating to a senior carer",
    summary: "Escalate a concern to a senior carer in conversation.",
    prompt:
      "Workplace conversation practice. You are worried a resident is more unwell than usual. Speak to the senior carer: describe what you have noticed, say why you are concerned, and ask them to review the resident.",
    context: [
      "Describe your observation and concern clearly.",
      "Be specific and factual.",
      "Make clear what you are asking them to do.",
    ],
  },
  {
    id: "convo-emergency",
    moduleId: "care-english",
    title: "Conversation: Calling for help in an emergency",
    summary: "Call for help clearly during an emergency.",
    prompt:
      "Workplace conversation practice. A resident has fallen and is not responding well. Call for help out loud: summon assistance, say clearly what has happened and where, and state exactly what you need — for example, asking someone to call the nurse or an ambulance.",
    context: [
      "Speak loudly, clearly and with urgency.",
      "Say what has happened and where.",
      "State exactly what help you need.",
    ],
  },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}

export function getScenariosForModule(moduleId: ModuleId): Scenario[] {
  return SCENARIOS.filter((s) => s.moduleId === moduleId);
}

// ---------------------------------------------------------------------------
// "Example of what to say" — a guide for each exercise, NOT a model to copy.
// Each example has a "what to include" checklist (module-level by default)
// and a sample phrase. The UI shows these with a note reminding learners to
// reflect the real situation rather than copy word-for-word.
// ---------------------------------------------------------------------------

/** Default "what to include" per module, framed around each module's approach. */
const MODULE_INCLUDE: Partial<Record<ModuleId, string[]>> = {
  handover: [
    "Who the resident is and the situation",
    "Key events during your shift",
    "Current status and any risks",
    "What the next shift needs to do",
  ],
  escalation: [
    "Observation — what you saw",
    "Concern — why it matters",
    "Action taken — what you have already done",
    "Next step — the escalation or review you need",
  ],
  safeguarding: [
    "Appropriate response — stay calm and take it seriously",
    "Professional boundaries — don't investigate or promise secrecy",
    "Information gathering — note the facts in their own words",
    "Reporting — who you will tell and what you will record",
  ],
};

interface ScenarioExample {
  /** Overrides the module default when present (used for Care English). */
  include?: string[];
  phrase: string;
}

const EXAMPLES: Record<string, ScenarioExample> = {
  // --- Handover ---
  "end-of-shift-handover": {
    phrase:
      "This is the end-of-shift handover for Mrs Doris Allen, 82. She ate about two-thirds of her lunch but declined her afternoon snack, and mobilised to the lounge with her frame. She reported mild left hip discomfort, around 3 out of 10. Her daughter visits at six. Please offer her snack again later and keep an eye on the hip pain.",
  },
  "resident-deterioration": {
    phrase:
      "I want to hand over a change in Mr Frank Owusu, 76. This afternoon he is more drowsy than usual and harder to rouse, his speech is slightly slurred, his skin feels clammy, and he has eaten very little. This is new compared with this morning. I have kept him comfortable and observed him; please review him soon and monitor closely.",
  },
  "medication-concern": {
    phrase:
      "A handover concern about Mrs Patricia Hughes. On the morning round she refused her prescribed blood pressure tablet, saying it makes her dizzy, and I recorded the refusal. Her lunchtime medication is due shortly and I am going off shift. Please follow up on the refusal and check whether it needs raising with the nurse.",
  },
  // --- Escalation ---
  fall: {
    phrase:
      "I went into Mr Joseph Bello's room and found him sitting on the floor by his bed. He is conscious and talking but says his right hip hurts and he cannot get up, and there is a small graze on his elbow. I do not know how long he has been there. I have stayed with him and not moved him. Please come and review him now — I think this needs assessing urgently.",
  },
  "refusal-of-care": {
    phrase:
      "I am concerned about Mrs Edith Crowe. She has refused personal care for a second day and has now refused to let me change a soiled continence pad. She is tearful and says she wants to be left alone. I am worried about her skin and her dignity. I have respected her choice and reassured her. Could you come and help me work out how best to support her?",
  },
  "sudden-confusion": {
    phrase:
      "I need to raise a concern about Mr Ahmed Khan. He is normally alert and chatty, but this afternoon he is suddenly confused — he does not recognise me, he is agitated, and he keeps trying to leave the lounge. This is a marked change from this morning. I have stayed with him to keep him safe. Please can you review him now, as this came on quickly.",
  },
  // --- Safeguarding ---
  "unexplained-bruising": {
    phrase:
      "I need to report a safeguarding concern about Mrs Joan Carter. During personal care I noticed fresh bruising on her upper arms and back that was not there yesterday and that she could not explain. She seemed withdrawn and avoided eye contact. I did not question her further. I have recorded exactly what I saw in her own words and I am reporting it to you as the safeguarding lead.",
  },
  "disclosure-of-abuse": {
    phrase:
      "Thank you for telling me, Grace — I am taking it seriously. I cannot promise to keep it a secret, because I have to make sure you are safe, but I will only share it with the people who need to know to help you. (To the lead:) Mrs Whitfield disclosed that a member of night staff is rough with her. I have recorded her words and I am reporting it to you now.",
  },
  "financial-abuse": {
    phrase:
      "I would like to report a possible financial abuse concern about Mrs Irene Patel. I have noticed her relative taking money from her purse and pressuring her to hand over her bank card, and she seems anxious when he visits. I have not confronted him or investigated. I have written down what I observed and the dates, and I am reporting it to you as the safeguarding lead.",
  },
  "neglect-concern": {
    phrase:
      "I am raising a neglect concern about Mr Albert Reilly. On my visit I found him in a soiled bed with his pressure-relief mattress switched off, no food in the house, and he told me he had not been helped to wash for several days. I did not confront the family member. I have recorded what I saw and I am reporting it to you so we can act on it.",
  },
  "professional-boundaries": {
    phrase:
      "I want to raise a professional boundaries concern about a colleague. I have seen them accept cash gifts from a resident, give the resident their personal phone number, and offer to run errands outside work. I am worried this puts the resident at risk of exploitation. I am sticking to what I have witnessed, and I am asking you to look into it through the proper process.",
  },
  // --- Care English (per-exercise "what to include") ---
  "vocab-continence": {
    include: ["The target word used correctly", "A full, natural sentence", "Clear, professional tone"],
    phrase:
      "I am going to support Mrs Allen with her continence care now, and I will make sure she is comfortable and her dignity is maintained.",
  },
  "vocab-pressure-area": {
    include: ["The target term used correctly", "A full sentence in context", "Clear, professional tone"],
    phrase:
      "When I checked Mr Owusu's pressure areas this morning, the skin on his heels was intact with no redness.",
  },
  "pronounce-paracetamol": {
    include: ["Read the phrase exactly as written", "Clear pronunciation of 'paracetamol' and 'medication'", "A steady, even pace"],
    phrase:
      "I have given Mrs Allen her prescribed paracetamol and recorded it on the medication chart.",
  },
  "pronounce-catheter": {
    include: ["Read the phrase exactly as written", "Clear pronunciation of 'catheter' and 'documented'", "A steady, even pace"],
    phrase:
      "The resident's catheter bag was emptied and the output was documented.",
  },
  "phrases-personal-care": {
    include: ["Explain what you are going to do", "Offer choice", "A reassuring, respectful tone"],
    phrase:
      "Hello Mrs Allen, is it alright if I help you get washed and dressed now? Would you prefer the blue cardigan or the green one today? I will take my time — just let me know if you would like a break.",
  },
  "phrases-handover": {
    include: ["Open with who, and a one-line summary", "The key point of the day", "Anything to watch"],
    phrase:
      "This is the handover for Mr Owusu — he has had a settled day and ate well. One thing to watch: he was a little unsteady this afternoon, so please keep an eye on him when he mobilises.",
  },
  "phrases-escalation": {
    include: ["State what you observed", "Say what you are asking for", "Convey the urgency"],
    phrase:
      "I have noticed Mrs Crowe is more breathless than usual and her colour looks pale. Could you come and review her, please — I think it needs checking now.",
  },
  "phrases-safeguarding": {
    include: ["Reassure and take it seriously", "Be honest you cannot keep secrets", "Say you will get the right help"],
    phrase:
      "Thank you for telling me — that is really important, and I am glad you did. I cannot keep it a secret, but I will only tell the people who need to know so we can keep you safe.",
  },
  "phrases-emergency": {
    include: ["Call for help clearly", "Say what has happened and where", "Give a specific instruction"],
    phrase:
      "Can I have some help in the lounge, please — Mr Bello has collapsed! Sue, please call the nurse and bring the first aid kit now.",
  },
  "convo-resident": {
    include: ["A warm greeting", "Ask how they are", "Gentle reassurance"],
    phrase:
      "Good morning, Mrs Allen — it is lovely to see you. You seem a little quiet today; how are you feeling? I am here if you would like to talk, and we can sit together for a while if that helps.",
  },
  "convo-family": {
    include: ["A warm, professional greeting", "An appropriate, factual update", "Reassurance, within confidentiality"],
    phrase:
      "Hello, it is nice to see you. Your mum has had a comfortable day — she enjoyed her lunch and spent some time in the lounge with the others. She is settled this afternoon. Is there anything in particular you would like to ask me about?",
  },
  "convo-handover": {
    include: ["Who the resident is", "How the day went", "What to watch next"],
    phrase:
      "Handing over Mrs Allen — she has had a good day, ate most of her meals and mobilised well with her frame. Just keep an eye on her left hip; she mentioned mild discomfort, around 3 out of 10, this afternoon.",
  },
  "convo-escalation": {
    include: ["What you have noticed", "Why you are concerned", "What you are asking them to do"],
    phrase:
      "I am a bit worried about Mr Owusu — he is more drowsy than usual and his speech seems slightly slurred, which is new today. Could you come and review him, please? I do not think it should wait.",
  },
  "convo-emergency": {
    include: ["Call for help loudly", "Say what happened and where", "State what you need"],
    phrase:
      "Help, please — quickly! Mrs Patel has fallen in the bathroom and she is not responding properly. Can someone call the nurse and dial for an ambulance — I will stay with her.",
  },
};

export function exampleFor(
  scenario: Scenario
): { include: string[]; phrase: string } | null {
  const ex = EXAMPLES[scenario.id];
  if (!ex) return null;
  return {
    include: ex.include ?? MODULE_INCLUDE[scenario.moduleId] ?? [],
    phrase: ex.phrase,
  };
}
