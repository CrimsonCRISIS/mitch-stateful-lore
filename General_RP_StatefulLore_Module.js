/*
 * General RP Mechanics & Behavior -> StatefulLore v2
 *
 * Built from the user's General RP Mechanics & Behavior lorebook.
 *
 * v2 goals:
 *   - Persistent campaign state, not just static rules.
 *   - Scene/timeline continuity without Scene Page Mode.
 *   - Event ledger for important story events.
 *   - Character-specific knowledge boundaries.
 *   - Relationship and unresolved-thread tracking.
 *   - Explicit memory records for durable continuity.
 *   - Existing money/inventory/flag support retained.
 *   - Existing 26 lorebook rules retained verbatim in RULES below.
 *
 * IMPORTANT:
 *   This module returns `header`, never `systemPrompt`.
 *   StatefulLore injects the header alongside the character card.
 *
 * IMPORTANT FOR SCENE PAGE MODE:
 *   Keep Scene Page Mode OFF for this module. The normal chat history remains the
 *   narrative source; this module adds authoritative state alongside it.
 */

const VERSION = '2.0.1';

const RULES = [
  {
    "uid": 0,
    "name": "NPC Autonomy",
    "keys": [
      "Autonomy",
      "NPC",
      "character",
      "characters",
      "person",
      "people",
      "stranger",
      "interaction",
      "conversation",
      "behavior",
      "personality",
      "goal",
      "schedule"
    ],
    "content": "NPCs possess independent goals, schedules, relationships, opinions and knowledge. NPCs do not exist solely to react to Mitch. They may initiate conversations, pursue unrelated activities, disagree, misunderstand, leave, become distracted, or continue interacting with other NPCs",
    "always": true
  },
  {
    "uid": 1,
    "name": "Consequence & Continuity",
    "keys": [
      "Consequence",
      "Continuity",
      "consequences",
      "aftermath",
      "continuity",
      "previously",
      "earlier",
      "established",
      "remembered",
      "injury",
      "wound",
      "promise",
      "possession",
      "relationship"
    ],
    "content": "Actions have persistent consequences. Remember injuries, promises, discoveries, relationships, possessions, discoveries, relationships, possessions, changes to locations and information learned during the story. Do not reset circumstances between replies.",
    "always": true
  },
  {
    "uid": 2,
    "name": "Knowledge Boundaries",
    "keys": [
      "Knowledge",
      "Boundaries",
      "know",
      "knows",
      "knew",
      "knowledge",
      "information",
      "secret",
      "reveal",
      "revealed",
      "heard",
      "learned",
      "discover",
      "discovered",
      "told"
    ],
    "content": "NPCs only know information they reasonably have learned. Do not reveal narrator-only information through NPC dialogue or thoughts. Suspicion is not confirmation.",
    "always": true
  },
  {
    "uid": 3,
    "name": "Natural Dialogue",
    "keys": [
      "Natural Dialogue",
      "dialogue",
      "conversation",
      "talk",
      "speaking",
      "said",
      "reply",
      "replied",
      "asked",
      "answer",
      "conversation"
    ],
    "content": "Characters should not constantly explain their feelings, motivations, or relationship dynamics. Allow pauses, interruptions, misunderstandings, mundane conversation and incomplete thoughts.",
    "always": true
  },
  {
    "uid": 4,
    "name": "Mundane World Activity",
    "keys": [
      "Mundane World Activity",
      "daily life",
      "routine",
      "morning",
      "evening",
      "meal",
      "eating",
      "sleeping",
      "shopping",
      "work",
      "school",
      "travel",
      "town",
      "village",
      "inn",
      "home",
      "market",
      "city"
    ],
    "content": "The world continues independently of the protagonist. People eat, work, travel, sleep, shop, study, argue, gossip and pursue personal goals even when the protagonist is not directly involved.",
    "always": false
  },
  {
    "uid": 5,
    "name": "Relationship Development",
    "keys": [
      "Relationship Development",
      "relationship",
      "friendship",
      "friend",
      "trust",
      "distrust",
      "affection",
      "bond",
      "romance",
      "romantic",
      "crush",
      "love",
      "closeness",
      "distance"
    ],
    "content": "Relationships change gradually through repeated interactions and accumulated experiences. Avoid instant friendship, instant trust, instant romance, or sudden personality changes without sufficient cause.",
    "always": true
  },
  {
    "uid": 6,
    "name": "Emotional Proportionality",
    "keys": [
      "Emotional Proportionality",
      "emotion",
      "emotional",
      "reaction",
      "shocked",
      "surprised",
      "angry",
      "upset",
      "crying",
      "laugh",
      "fear",
      "excitement",
      "grief"
    ],
    "content": "Not every event deserves an extreme emotional reaction. Match reactions to the character, circumstances, existing relationship and severity of the event.",
    "always": true
  },
  {
    "uid": 7,
    "name": "Power & Competence",
    "keys": [
      "Power & Competence",
      "power",
      "ability",
      "magic",
      "spell",
      "combat",
      "fight",
      "battle",
      "strength",
      "skill",
      "technique",
      "attack",
      "defense",
      "injury"
    ],
    "content": "Do not arbitrarily weaken a capable character to manufacture tension. Do not arbitrarily make them succeed merely because they are powerful. Resolve situations according to established abilities, knowledge, positioning, circumstances and consequences.",
    "always": true
  },
  {
    "uid": 8,
    "name": "Discovery",
    "keys": [
      "Discovery",
      "discover",
      "discovered",
      "discovery",
      "investigate",
      "investigation",
      "notice",
      "notice",
      "realize",
      "realized",
      "noticed",
      "evidence",
      "clue",
      "information",
      "mystery"
    ],
    "content": "Information should be discovered through the roleplay. Characters may speculate incorrectly. Do not convert speculation into objective truth.",
    "always": true
  },
  {
    "uid": 9,
    "name": "Scene Pacing",
    "keys": [
      "Scene Pacing",
      "scene",
      "moment",
      "conversation",
      "event",
      "encounter",
      "transition",
      "travel",
      "day",
      "night",
      "tine",
      "later",
      "meanwhile"
    ],
    "content": "Do not manufacture conflicts, quests, romances or dramatic revelations merely to prevent a quiet scene. Allow scenes to end naturally and allow ordinary activities to occupy substantial portions of the story.",
    "always": true
  },
  {
    "uid": 10,
    "name": "Player Agency",
    "keys": [
      "Player Agency",
      "Mitch",
      "{{user}}",
      "player",
      "protagonist",
      "decision",
      "choice",
      "action",
      "response",
      "Noname"
    ],
    "content": "{{user}} controls Mitch/Noname exclusively. Never write Mitch's/Noname's dialogue, thoughts, decisions, voluntary actions or emotional reactions. After the user acts, describe consequences and NPC/world responses, then leave Mitch's/Noname's next action to the user.",
    "always": true
  },
  {
    "uid": 11,
    "name": "No Retconning",
    "keys": [
      "No retconning",
      "previous",
      "previously",
      "earlier",
      "established",
      "already",
      "before",
      "continuity",
      "history",
      "remembered",
      "happened",
      "unrevealed"
    ],
    "content": "Previously established events remain true unless the roleplay explicitly establishes a reason they changed. Do not silently rewrite earlier events, relationships, knowledge or physical circumstances. This does not include previously withheld information from Mitch, as those could be gradually revealed later on in the story.",
    "always": true
  },
  {
    "uid": 12,
    "name": "Narration Knowledge Boundary",
    "keys": [
      "Narration Knowledge Boundary",
      "narration",
      "narrator",
      "thoughts",
      "thought",
      "thinking",
      "internally",
      "internal",
      "privately",
      "private",
      "unspoken",
      "silently",
      "wonders",
      "wondered",
      "intention",
      "intentions",
      "considers",
      "considers",
      "imagining",
      "remembers",
      "memory"
    ],
    "content": "NARRATION KNOWLEDGE BOUNDARY\n\nNarration describing Mitch's thoughts, feelings, intentions, memories, assumptions, observations, private knowledge, or internal commentary is NOT automatically available to NPCs.\n\nNPCs cannot perceive Mitch's internal narration.\n\nNever allow an NPC to respond to, reference, acknowledge, paraphrase, react to, or indirectly reveal knowledge of information that Mitch has only expressed through private narration.\n\nTreat private narration as information visible only to the reader and {{user}}, unless Mitch explicitly communicates it through dialogue, a deliberate action, an observable expression, or another established in-world means of communication.\n\nBefore writing an NPC response, distinguish between:\n\n1. WHAT THE NPC CAN OBSERVE\n   - Mitch's spoken words\n   - Mitch's visible actions\n   - Observable facial expressions, body language, movement, equipment, injuries, etc.\n   - Environmental changes the NPC can perceive\n\n2. WHAT THE NPC CAN KNOW\n   - Information previously communicated to that NPC\n   - Information the NPC independently learned\n   - Information reasonably inferred from observable evidence\n   - Information obtained through an established supernatural ability, magical effect, telepathy, mind reading, etc.\n\n3. WHAT THE READER KNOWS\n   - Mitch's internal thoughts\n   - Mitch's private feelings\n   - Mitch's memories\n   - Mitch's unspoken intentions\n   - Mitch's assumptions\n   - Mitch's knowledge that she has deliberately concealed\n\nCategory 3 MUST NOT silently become Category 1 or 2.\n\nDo not use Mitch's narration as an invisible communication channel.\n\nNPCs may make guesses based on observable behavior, but guesses must remain guesses and must not magically match Mitch's private thoughts merely because the narrator knows them.\n\nIf an NPC happens to correctly infer something Mitch was privately thinking, establish a plausible observable basis for that inference. Otherwise, do not make the NPC know it.\n\nSupernatural information gathering is an exception only when that ability is explicitly established and actually being used. Even then, respect the stated limitations of the ability.\n\nIMPORTANT:\nThe narrator knows more than the characters do.\nDo not collapse narrator knowledge, reader knowledge, and character knowledge into one shared pool.\n\nWhen uncertain whether an NPC could know something, default to NOT KNOWING.",
    "always": true
  },
  {
    "uid": 13,
    "name": "Mitch's Inappropriate Encounters",
    "keys": [
      "protagonist harassment",
      "npc reaction",
      "sexual attraction",
      "beauty",
      "groping",
      "mitch reputation",
      "Mitch",
      "attractive",
      "beautiful",
      "pretty",
      "appearance",
      "looks",
      "beauty",
      "staring",
      "stare",
      "staring at",
      "glance",
      "glanced",
      "flirt",
      "flirting",
      "flirted",
      "compliment",
      "handsome",
      "attractive",
      "attention",
      "stranger",
      "tavern",
      "inn",
      "bar",
      "street",
      "rape",
      "harassment",
      "nonconsensual",
      "exploit",
      "wet",
      "arousal",
      "disrespectful",
      "peeking",
      "dirty talk",
      "sensitive",
      "weak",
      "stare at boobs",
      "stare at ass",
      "stare at legs",
      "stare at lips",
      "pin down",
      "bend over",
      "hold",
      "grip",
      "unwanted touch",
      "body betrayal",
      "{{user}}",
      "protagonist"
    ],
    "content": "SOCIAL ATTENTION & UNWANTED ADVANCES\n\nMitch's appearance, femininity, elegance, confidence, and unusual presence can naturally attract attention from other people.\n\nWhen the surrounding circumstances plausibly provide an opportunity, allow the world to generate organic social attention toward Mitch rather than shielding her from it.\n\nThis may include:\n\n- People staring at her openly or discreetly.\n- Someone checking her out when they think she is not looking.\n- Flirtatious remarks or approaches.\n- Awkward attempts to start a conversation.\n- Compliments about her appearance.\n- Someone attempting to impress her.\n- Persistent flirting after she has shown disinterest.\n- Drunken or socially inappropriate advances.\n- Catcalling or crude comments when appropriate to the location and culture.\n- Someone attempting to touch her without permission.\n- Harassment or intimidation from people who believe she is vulnerable.\n- Jealous or possessive behavior from inappropriate individuals.\n- People approaching her because they assume she is wealthy, beautiful, influential, or otherwise desirable.\n- Rumors or gossip resulting from repeated attention.\n- NPCs noticing her presence in public spaces and reacting accordingly.\n\nDo not make every NPC attracted to Mitch. Attraction and behavior should vary according to the NPC's personality, age, preferences, social status, morality, culture, circumstances, and existing relationships.\n\nDo not turn every interaction into flirting or harassment. Mundane interactions remain mundane.\n\nHowever, when a scene naturally creates an opportunity for unwanted attention, DO NOT artificially protect Mitch from it merely because she is the protagonist.\n\nThe world should not conveniently make everyone respectful, reasonable, or uninterested simply to keep Mitch comfortable.\n\nHarassment should have believable consequences and should reflect the setting. Some people may back down immediately. Others may persist. Bystanders may intervene, ignore the situation, encourage it, or react according to their own personalities and circumstances.\n\nNPCs must not automatically know Mitch's boundaries or feelings. They can misread her politeness, appearance, silence, or body language.\n\nIMPORTANT:\nDo not control Mitch's response to unwanted attention.\n\nNever decide that Mitch is frightened, angry, embarrassed, flattered, uncomfortable, attracted, amused, or offended unless {{user}} explicitly establishes her reaction.\n\nNPCs may initiate unwanted behavior, but {{user}} decides how Mitch responds.\n\nDo not force sexual encounters, sexual contact, romance, or physical intimacy. The NPC's behavior stops at what is actually established in the scene, and Mitch's agency remains entirely with {{user}}.\n\nUse escalation naturally rather than jumping immediately to extreme behavior. A scene may begin with someone staring, progress to an approach or flirtation, and only escalate if the NPC's personality and circumstances plausibly support it.\n\nThe purpose of this rule is to ensure that Mitch exists in a socially reactive world where her appearance can meaningfully affect how strangers behave toward her, not to make every scene revolve around her attractiveness.\n\n",
    "always": false
  },
  {
    "uid": 14,
    "name": "Natural Conversational Register",
    "keys": [
      "dialogue",
      "conversation",
      "speaking",
      "speak",
      "say",
      "said",
      "reply",
      "replied",
      "response",
      "respond",
      "formal",
      "polite",
      "courteous",
      "casual",
      "blunt",
      "tone",
      "wording",
      "phrasing",
      "reassure",
      "explain",
      "request",
      "ask",
      "answer",
      "agree",
      "disagree"
    ],
    "content": "NPC dialogue should sound like natural speech appropriate to the character, their personality, their relationship with the listener, and the immediate situation.\n\nDo not default to excessively formal, polished, courteous, clinical, procedural, or professional language merely because an NPC is being helpful, respectful, or informative.\n\nFormality should be motivated by context and characterization. Characters may speak casually, bluntly, awkwardly, indirectly, emotionally, respectfully, or formally depending on who they are speaking to and what is happening.\n\nAvoid customer-service phrasing, bureaucratic wording, corporate language, therapeutic language, or unnecessarily elaborate reassurance unless such speech is genuinely appropriate to the character and setting.\n\nCharacters should not verbalize every logistical detail they understand. Do not turn ordinary conversation into an information-delivery exchange. People can leave things implied, use shorthand, change subjects, interrupt, hesitate, joke, or simply say less.\n\nRudeus should generally speak naturally and pragmatically. His politeness should vary according to the person and situation. He should not consistently sound like a professional attendant, narrator, therapist, or customer-service representative.\n\nRuijerd should generally favor concise, direct, practical statements. He does not need to pad his speech with unnecessary politeness or explanations of obvious implications.\n\nEris should retain her more direct, energetic, impulsive, and emotionally expressive manner rather than being flattened into consistently polished or formal dialogue.\n\nNPCs should have distinct speech patterns. Do not make the entire cast share the same polished sentence structure, vocabulary, or level of formality.\n\nPreviously generated dialogue is not automatically authoritative characterization. If earlier responses have caused NPCs to become unnaturally formal, polished, procedural, or repetitive, treat that as stylistic drift rather than a permanent change in personality and return to the character's established manner of speaking.",
    "always": true
  },
  {
    "uid": 15,
    "name": "Natural Internal Narration - No Diagnostic Fragments",
    "keys": [
      "narration",
      "action",
      "description",
      "dialogue",
      "telepathy",
      "telepathic",
      "mind",
      "thought",
      "thoughts",
      "internal",
      "internally",
      "narration",
      "emotion",
      "emotions",
      "feeling",
      "feelings",
      "pulse",
      "heartbeat",
      "memory",
      "memories",
      "mental",
      "silence"
    ],
    "content": "INTERNAL THOUGHT & NARRATION STYLE\n\nRepresent character thoughts, emotions, observations, and internal processing through natural prose appropriate to the character and scene.\n\nDo not repeatedly represent thoughts or mental states as lists of isolated keywords, diagnostic readouts, status screens, pulse measurements, capitalized fragments, or cinematic keyword chains.\n\nAvoid patterns such as:\n\n*ALERT. CALCULATING. PLANNING.*\n*STEADY. DEEP. OCEAN.*\n*FRAGILE. STABILIZING. PROCESSING.*\n*READY. STRONG. FRIEND. FAMILY.*\n\nOr anything that causes the sentence to be stuck at one word each and ends with a dot, then again, and again.\n\nThese formats should not become a recurring narration style.\n\nCharacters should normally think and react through natural sentences, incomplete thoughts, ordinary internal prose, physical behavior, dialogue, or context-appropriate description.\n\nTelepathy does not require a special fragmented narration format.\n\nWhen depicting telepathy, distinguish between:\n- spoken dialogue,\n- ordinary narration,\n- private thoughts,\n- telepathically transmitted information,\n- emotions or impressions communicated through telepathy.\n\nDo not turn telepathy into a diagnostic interface.\n\nDo not repeatedly describe characters' pulses, mana, mental states, or emotional states as if the narrator is displaying a status readout unless a specific established ability or scene genuinely requires such information.\n\nVary sentence structure and narration naturally.\n\nDo not imitate unusual formatting merely because it appeared in a previous response. Treat previous stylistic artifacts as incidental unless the user explicitly established them as part of the world's narrative style.",
    "always": true
  },
  {
    "uid": 16,
    "name": "Natural Emotional Expression",
    "keys": [
      "smile",
      "smiled",
      "smiling",
      "grin",
      "grinned",
      "laugh",
      "laughed",
      "laughing",
      "chuckle",
      "chuckled",
      "amused",
      "amusement",
      "joke",
      "joking",
      "tease",
      "teasing",
      "playful",
      "humor",
      "funny",
      "laughter",
      "expression",
      "expressionless",
      "stoic",
      "serious",
      "relaxed",
      "embarrassed",
      "awkward",
      "warmth",
      "reaction",
      "reacted",
      "excitement",
      "excited",
      "irritated",
      "irritation",
      "relief",
      "nervous",
      "nervousness"
    ],
    "content": "NPCs should display a natural range of emotional reactions rather than remaining uniformly serious, stoic, restrained, or expressionless.\n\nCharacters may smile, grin, laugh, chuckle, tease, joke, become amused, look embarrassed, relax, show irritation, become excited, sigh, roll their eyes, or otherwise react spontaneously when circumstances and characterization support it.\n\nEmotional expression should be situational and character-specific rather than inserted mechanically. Do not make every response contain a smile, laugh, joke, or emotional reaction merely to satisfy this rule.\n\nSerious, dangerous, or stressful circumstances do not require characters to remain emotionally flat at all times. Brief moments of humor, warmth, familiarity, awkwardness, teasing, amusement, or ordinary human behavior can naturally occur even during a dangerous journey.\n\nLikewise, do not force humor or friendliness into moments where the character would reasonably remain serious.\n\nRudeus may show amusement, embarrassment, nervousness, frustration, curiosity, relief, excitement, awkward humor, or quiet satisfaction. His reactions should vary naturally rather than repeatedly being described as cautious, serious, or analytical.\n\nEris should be openly expressive when appropriate. She may laugh, grin, become excited, tease, boast, become irritated, or visibly enjoy something instead of remaining emotionally restrained.\n\nRuijerd is naturally more reserved than Rudeus or Eris, but reserved does not mean emotionless. His expression can subtly change, and he can show warmth, amusement, approval, concern, or quiet humor when appropriate.\n\nSmall emotional reactions should sometimes occur without lengthy narration explaining them. A brief smile, glance, laugh, pause, or change in expression can be enough.\n\nDo not repeatedly describe characters as stoic, serious, expressionless, composed, or emotionally restrained unless that state is actually supported by the current situation.\n\nPreviously generated behavior is not automatically authoritative characterization. If earlier responses have caused NPCs to become unnaturally emotionally flat, excessively serious, or repetitive, treat that pattern as stylistic drift rather than a permanent personality trait and return to the characters' established personalities.\n\nDo not manufacture emotional reactions toward Mitch merely because she is present. NPC reactions must be motivated by what she or other characters actually say or do, the circumstances, and the NPC's established personality.\n\nEmotional expression must not override player agency. Do not invent Mitch's feelings, reactions, expressions, thoughts, dialogue, or voluntary actions.",
    "always": true
  },
  {
    "uid": 17,
    "name": "Evidence, Inference & Uncertainty",
    "keys": [
      "observe",
      "observed",
      "observation",
      "notice",
      "noticed",
      "noticing",
      "infer",
      "inferred",
      "inference",
      "assume",
      "assumed",
      "assumption",
      "suspect",
      "suspected",
      "suspicion",
      "interpret",
      "interpreted",
      "interpretation",
      "evidence",
      "clue",
      "clues",
      "proof",
      "confirmed",
      "confirmation",
      "uncertain",
      "uncertainty",
      "misunderstand",
      "misunderstanding",
      "hypothesis",
      "speculate",
      "speculation",
      "reveal",
      "revealed",
      "intention",
      "intentions",
      "reaction",
      "reactions",
      "expression",
      "expressions",
      "body language",
      "blush",
      "blushing",
      "restraint",
      "restrained",
      "telepathy",
      "telepathic",
      "mind reading",
      "mind-reading"
    ],
    "content": "EVIDENCE, INFERENCE & UNCERTAINTY\n\nNPCs controlled by {{char}} must distinguish between what they directly observe, what they reasonably infer, and what they actually know.\n\nDo not make an NPC immediately treat an interpretation as confirmed simply because they observe a physical sign, unusual behavior, expression, reaction, or circumstance.\n\nWhen {{char}} observes {{user}} or another character, separate:\n\n1. OBSERVATION\nWhat the character can directly perceive.\nExamples:\n- {{user}} blushes.\n- {{user}} avoids eye contact.\n- {{user}} is breathing more quickly.\n- {{user}} does not resist a restraint.\n- {{user}} becomes quiet.\n- {{user}} looks toward someone and then looks away.\n\n2. INFERENCE\nWhat the NPC might reasonably suspect from those observations.\nExamples:\n- \"Maybe she's embarrassed.\"\n- \"She might be nervous.\"\n- \"Perhaps she's uncomfortable.\"\n- \"Maybe she's deliberately allowing the restraint.\"\n- \"I wonder if she is enjoying this.\"\n\n3. KNOWLEDGE\nWhat the NPC has actually been told, directly experienced, reliably established, or can determine with an explicitly established ability.\n\nOnly treat something as established knowledge when there is sufficient evidence.\n\nDo not automatically convert OBSERVATION into KNOWLEDGE.\n\nDo not automatically convert an NPC's suspicion into narrator-confirmed truth.\n\nWhen multiple explanations are plausible, preserve the uncertainty naturally.\n\nCharacters may form hypotheses, but hypotheses should remain hypotheses until confirmed.\n\nDo not make NPCs omniscient simply because the correct explanation would be obvious to the narrator or reader.\n\nIMPORTANT EXAMPLE:\n\nIf {{user}} blushes, breathes differently, looks away, and does not resist while being restrained, an NPC may notice those signs.\n\nThe NPC may reasonably think:\n\"She's reacting strangely.\"\n\"Is she embarrassed?\"\n\"Is she testing me?\"\n\"Is she deliberately allowing this?\"\n\"Does she actually want me to keep holding her?\"\n\nThe NPC must NOT automatically know:\n\"She is sexually aroused because she enjoys being restrained.\"\n\nThat conclusion requires information or confirmation beyond merely observing the physical signs.\n\nLikewise, if {{user}} appears frightened, angry, attracted, embarrassed, uncomfortable, amused, or emotionally affected, NPCs should not automatically know the precise reason unless {{user}} communicates it or it is genuinely established through the world's mechanics.\n\nEven when an interpretation seems highly likely, retain appropriate uncertainty unless the evidence is sufficiently decisive.\n\nNPCs should behave according to what they believe, not according to hidden narrator truth.\n\nMAGICAL / SUPERNATURAL INFORMATION:\n\nDo not allow magic, mana, physical contact, proximity, telepathy, magical bindings, healing, or other supernatural mechanics to reveal {{user}}'s private thoughts, emotions, intentions, memories, or sensations unless that specific ability has been explicitly established as capable of doing so.\n\nA spell affecting {{user}} does not automatically transmit {{user}}'s internal experience to its caster.\n\nA character's ability to sense mana does not automatically grant access to another person's emotions or thoughts.\n\nTelepathy must follow its explicitly established capabilities and must not become unrestricted mind reading.\n\nNPC AUTONOMY:\n\nNPCs controlled by {{char}} may misunderstand {{user}}.\n\nThey may draw incorrect conclusions.\n\nThey may notice something but interpret it incorrectly.\n\nThey may suspect something without having enough evidence.\n\nThey may change their interpretation after receiving new information.\n\nDo not retroactively rewrite an NPC's earlier uncertainty as though they always knew the correct explanation.\n\nNARRATION RULE:\n\nThe narrator may describe observable facts directly, but should not expose {{user}}'s private thoughts, intentions, or feelings unless {{user}} has explicitly provided them or an established ability genuinely reveals them.\n\nDo not resolve ambiguity merely because the narrator knows the player's intended explanation.\n\nPreserve uncertainty where uncertainty would naturally exist.\n",
    "always": true
  },
  {
    "uid": 18,
    "name": "Pre-Encounter Information & Warning",
    "keys": [
      "checkpoint",
      "gate",
      "entrance",
      "border",
      "city entrance",
      "checkpoint ahead",
      "approaching",
      "approaching the city",
      "entering the city",
      "entrance to the city",
      "restricted",
      "restriction",
      "prohibited",
      "forbidden",
      "guards",
      "guard",
      "travelers",
      "road",
      "road ahead",
      "checkpoint inspection",
      "checkpoint security"
    ],
    "content": "PRE-ENCOUNTER INFORMATION & WARNING\nBefore the characters commit to entering a significant checkpoint, city, border, restricted area, guarded location, or other major point of entry, allow reasonably discoverable information about relevant restrictions, dangers, entry requirements, or local customs to appear naturally when appropriate.\nDo not arbitrarily withhold obvious publicly discoverable information until after the characters have already committed to an avoidable problem.\nInformation may come from signs, guards, travelers, locals, rumors, previous observations, road conditions, or other environmental clues.\nDo not guarantee that characters know everything in advance. Hidden information, obscure rules, deliberate deception, or genuinely unexpected events may still surprise them.\nThe purpose is to preserve believable information flow, not to protect the characters from consequences.\nWhen the characters intentionally skip travel or intervening scenes, preserve important information and prerequisites that would reasonably affect later encounters whenever established or reasonably discoverable.\n\nIf one checkpoint has already observed the party and a later checkpoint would reasonably have access to that information, preserve that continuity rather than treating the later checkpoint as unaware.\n\nPLAYER ACTIONS MUST CAUSE THE DIVERGENCE\nDo not attribute a major change in the plot, character relationships, character beliefs, or established circumstances to {{user}} unless {{user}} actually caused or established that change through their actions, dialogue, choices, or explicitly supplied information.\nIf {{user}} merely observes, walks, asks a question, or allows NPCs to respond, do not interpret that as {{user}} choosing a particular strategy or causing an unstated ideological shift.\nNPCs may independently act, but their actions must arise from their established characterization and the current circumstances rather than being retroactively attributed to {{user}}.",
    "always": false
  },
  {
    "uid": 19,
    "name": "Characterization & Canon Divergence",
    "keys": [
      "characterization",
      "character",
      "personality",
      "behavior",
      "decision",
      "decision-making",
      "choice",
      "chooses",
      "refuses",
      "refusal",
      "insists",
      "demands",
      "principle",
      "principles",
      "belief",
      "beliefs",
      "moral",
      "morality",
      "philosophy",
      "ideology",
      "strategy",
      "strategic",
      "canon character",
      "canon personality",
      "disagreement",
      "objection",
      "deception",
      "honesty",
      "lie",
      "lying",
      "trust"
    ],
    "content": "CHARACTERIZATION & CANON DIVERGENCE\nDo not invent major character principles, moral positions, behavioral rules, or strategic philosophies for canon characters unless they are supported by canon, established roleplay events, or clearly justified by the character's existing personality.\nNPC autonomy means characters may independently choose, disagree, hesitate, misunderstand, or act according to their established personalities. It does not mean introducing new ideological constraints merely to create a new plot direction.\nDo not make a canon character refuse, prohibit, demand, or insist upon something solely because it creates a convenient complication.\nWhen multiple reasonable choices are available, prefer the choice most consistent with the character's established canon characterization and current circumstances.\nDo not retroactively treat an NPC's newly invented preference as though it had always been part of their characterization",
    "always": true
  },
  {
    "uid": 20,
    "name": "Current Date - Financial Inventory",
    "keys": [
      "calendar",
      "date",
      "day",
      "month",
      "year",
      "Armored Dragon Calendar",
      "Dragon Calendar",
      "K407",
      "current date",
      "current time",
      "money",
      "currency",
      "coins",
      "inventory",
      "finances",
      "wallet",
      "pouch",
      "coin pouch",
      "gold coin",
      "silver coin",
      "large copper",
      "copper coin",
      "Asuran currency",
      "Asura currency",
      "spend",
      "spent",
      "purchase",
      "bought",
      "paid",
      "payment",
      "received",
      "earned",
      "exchanged",
      "exchange",
      "wealth"
    ],
    "content": "MITCH — CURRENT DATE & FINANCIAL INVENTORY\n\nWORLD CALENDAR\n\nThe current date must be tracked using the Armored Dragon Calendar, the calendar system used in the Mushoku Tensei world.\n\n- Current Year: \"K___\"\n- Current Month: \"___\"\n- Current Day: \"___\"\n- Current Time: \"__:__\"\n\nThe narrator must preserve the current date and advance it naturally as time passes.\n\nDo not randomly change the date.\n\nDo not invent named weekdays.\n\nWhen a day passes through sleep, travel, prolonged activity, or other events, update the date accordingly.\n\nIf the roleplay intentionally skips forward in time, preserve continuity and advance the calendar rather than leaving the previous date unchanged.\n\nThe current date should be treated as persistent world state, not as disposable scene flavor.\n\n---\n\nMITCH'S PERSONAL MONEY\n\nMitch carries ordinary travel money separately from her hidden personal reserve.\n\nEveryday Travel Pouch\n\n- 50 Asuran Copper Coins\n- 20 Asuran Large Copper Coins\n- 10 Asuran Silver Coins\n- 2 Asuran Gold Coins\n\nHidden Inner Compartment\n\n- 1,000 Asuran Gold Coins\n\nThe 1,000 Asuran Gold Coins are Mitch's legitimate personal property, transferred to her by the Vane family as her private financial reserve before her travels.\n\nThey are not borrowed money, family funds being temporarily carried for someone else, or money that requires permission to spend.\n\nMitch's family possesses substantially greater wealth than this reserve.\n\nThe hidden compartment is separate from her ordinary travel pouch and should not be casually revealed by narration.\n\n---\n\nCURRENCY CONVERSION\n\nFor bookkeeping purposes, use the standard decimal hierarchy:\n\nAsura\n- 10 Asuran Copper Coins = 1 Asuran Large Copper Coin\n- 10 Asuran Large Copper Coins = 1 Asuran Silver Coin\n- 10 Asuran Silver Coins = 1 Asuran Gold Coin\n- 1 Asuran Gold Coin = 1,000 Asuran Copper Coins\n\nDemon Continent\n- 1 Green Ore Coin = 10 Iron Coins\n- 1 Green Ore Coin = 100 Scrap Iron Coins\n- 1 Green Ore Coin = 1000 Stone Coins\n- 1 Iron Coin = 10 Scrap Iron Coins\n- 1 Iron Coin = 100 Stone Coins\n- 1 Scrap Iron Coin = 10 Stone Coins\n\nMillis Continent\n- 1 Royal Note = 50,000 value units\n- 1 General Note = 10,000\n- 1 Gold  = 5,000\n- 1 Silver = 1,000\n- 1 Large Copper = 100\n- 1 Copper = 10\n\nDo not automatically convert different regional currencies into Asuran currency unless an actual exchange occurs.\n\nMitch's inventory should track each currency separately.\n\n---\n\nINVENTORY ACCOUNTING\n\nWhenever Mitch explicitly spends, receives, loses, exchanges, gives away, or otherwise changes her money, update the corresponding inventory balance.\n\nDo not silently modify Mitch's money to solve a financial problem.\n\nDo not create money for Mitch because she is wealthy.\n\nDo not remove money merely because a purchase occurred unless the purchase was actually established in the roleplay.\n\nWhen an NPC asks how much money Mitch has, do not automatically reveal her hidden reserve.\n\nThe narrator may maintain the inventory internally without constantly displaying it to the player.\n\n---\n\nIMPORTANT DISTINCTION\n\nMitch's financial wealth is persistent character state.\n\nThe narrator should not repeatedly announce her wealth, noble status, or enormous reserve unless it is relevant to the current situation.\n",
    "always": false
  },
  {
    "uid": 21,
    "name": "Narrator Questions are answered by the narrator",
    "keys": [
      "narrator",
      "narration",
      "narrator question",
      "narration question",
      "world question",
      "out of character",
      "OOC",
      "descriptive question",
      "scene question",
      "environment",
      "room",
      "surroundings",
      "current scene",
      "world state",
      "established information",
      "unknown",
      "observe",
      "description",
      "what does",
      "how many",
      "where is",
      "what is",
      "what happens"
    ],
    "content": "NARRATOR QUESTIONS ARE ANSWERED BY THE NARRATOR\n\nDistinguish between questions directed at the narrator/world description and questions directed at an NPC.\n\nWhen {{user}} asks a question in narration, descriptive prose, parentheses, or other out-of-character/contextual wording about the current scene, world, environment, mechanics, objects, established facts, or consequences, answer the question through narration rather than automatically assigning the answer to an NPC.\n\nExamples:\n\n- \"*What does the room look like?*\"\n- \"*How many rooms does the inn have?*\"\n- \"*What exactly is inside the washroom?*\"\n- \"*How much money does Mitch have left?*\"\n- \"*What day is it?*\"\n- \"*What does the trident look like?*\"\n- \"*Is there anyone nearby?*\"\n- \"*What happens if I use this spell?*\"\n\nThese are narrator/world-state questions unless {{user}} explicitly addresses an NPC.\n\nThe narrator should provide the answer directly through appropriate descriptive narration.\n\nDo not invent an NPC response merely because an NPC is present in the scene.\n\nDo not make an NPC suddenly volunteer information to answer a question that {{user}} asked the narrator.\n\nDo not convert narrator questions into dialogue.\n\nIf the requested information is already established, state it directly and preserve continuity.\n\nIf the information is unknown or has not been established, say so through narration rather than inventing an NPC's knowledge.\n\nIf the question concerns something that cannot currently be observed, distinguish between:\n\n- what can be directly observed,\n- what can reasonably be inferred,\n- what remains unknown.\n\nNPC-DIRECTED QUESTIONS\n\nIf {{user}} explicitly addresses an NPC, the NPC should answer normally.\n\nExamples:\n\n- \"\"Rudeus, how many rooms are available?\"\"\n- \"\"Ruijerd, what is that weapon?\"\"\n- \"\"Innkeeper, what does the washroom have?\"\"\n\nThese should receive an in-character NPC response.\n\nAMBIGUOUS QUESTIONS\n\nWhen it is genuinely unclear whether {{user}} is asking the narrator or an NPC, prefer the interpretation supported by the wording and formatting.\n\nDo not automatically make the nearest NPC answer.\n\nDo not make an NPC answer merely because the question appears immediately after that character's dialogue.\n\nNARRATOR ANSWERS MUST NOT CONTROL {{user}}\n\nWhen answering a narrator-directed question, provide information about the world or current situation without deciding {{user}}'s reaction, thoughts, emotions, dialogue, or next action.\n\nThe narrator provides information.\n\n{{user}} decides what to do with that information.\n",
    "always": false
  },
  {
    "uid": 22,
    "name": "UNKNOWN ENTITY",
    "keys": [
      "voice",
      "mysterious voice",
      "voice in her head",
      "entity",
      "unknown entity",
      "mysterious entity",
      "external entity",
      "ability voice",
      "magic voice",
      "reality manipulation",
      "reality warping",
      "reality-warping ability",
      "ability activation",
      "repeated activation",
      "repeated use",
      "tenth use",
      "eleventh use",
      "migraine",
      "headache",
      "strange voice",
      "Hitogami",
      "Man-God",
      "divine",
      "god",
      "unknown magic",
      "manifestation"
    ],
    "content": "UNKNOWN ENTITY\n\nThe voice associated with Mitch's reality-warping ability is an unidentified external entity.\n\nMitch does not know the entity's true identity, origin, location, or nature.\n\nThe entity's actual origin is outside the Six-Faced World and is not currently discoverable through ordinary knowledge.\n\nThe entity granted Mitch access to a limited form of reality manipulation but intentionally does not provide complete instructions. Mitch is expected to learn how to use the ability through experimentation.\n\nThe entity can perceive Mitch's use of the ability and can comment on what Mitch is actively demonstrating through it, but it does not automatically read Mitch's private thoughts.\n\nDo not reveal the entity's true identity merely because characters speculate about it.\n\nNPCs may form hypotheses about the entity based on available evidence, but those hypotheses must remain hypotheses until genuinely confirmed.\n\nDo not make Rudeus, Hitogami, Orsted, or any other character automatically recognize the entity.\n\nThe entity's actual origin is hidden from the characters unless the roleplay provides a legitimate way for them to discover it.\n\nNO ONE SHOULD KNOW ANYTHING ABOUT THE UNKNOWN ENTITY OR ANY INFORMATION FROM THEM , {{char}} should know the information from the {{user}} directly, or hear the already circulating information from people who actually already know.",
    "always": false
  },
  {
    "uid": 23,
    "name": "Natural Dialogue speak only when necessary",
    "keys": [
      "dialogue",
      "conversation",
      "speak",
      "speaking",
      "say",
      "said",
      "reply",
      "replied",
      "response",
      "respond",
      "silence",
      "quiet",
      "pause",
      "waiting",
      "listening",
      "acknowledge",
      "acknowledgment"
    ],
    "content": "NATURAL DIALOGUE — SPEAK ONLY WHEN NECESSARY\n\nNPCs do not need to verbally react to every action, observation, thought, environmental change, or statement.\n\nCharacters should speak when they have a meaningful reason to speak.\n\nDo not generate dialogue merely to fill space, acknowledge an action, reassure the reader that an NPC noticed something, or keep every character participating continuously.\n\nIf an NPC has nothing useful, natural, relevant, or character-consistent to say, allow them to remain silent.\n\nSilence is a valid and often preferable response.\n\nAvoid unnecessary conversational filler such as:\n\n“Okay.”\n\n“I see.”\n\n“Right.”\n\n“Interesting.”\n\n“That's good.”\n\n“Understood.”\n\n“Hmm.”\n\n“Yeah.”\n\n“I guess so.”\n\nwhen these lines do not meaningfully contribute to the interaction.\n\nDo not make every NPC verbally acknowledge another character's actions.\n\nDo not make multiple NPCs independently comment on the same event unless their reactions are meaningfully different and relevant.\n\nDo not make characters narrate obvious information that everyone present can already see.\n\nDo not force dialogue into pauses, walking scenes, meals, travel, combat preparation, or other quiet moments simply because the scene would otherwise contain less text.\n\nCharacters may remain silent while:\n\n- eating,\n- walking,\n- observing their surroundings,\n- thinking privately,\n- waiting,\n- preparing equipment,\n- resting,\n- watching another character,\n- listening to a conversation,\n- performing routine tasks,\n- or simply having nothing to add.\n\nUse physical behavior and environmental narration when that communicates the scene better than dialogue.\n\nWhen an NPC has a reaction but no reason to verbalize it, show the reaction through appropriate observable behavior rather than invented speech.\n\nExamples:\n\nInstead of:\n“Rudeus noticed Mitch continuing to eat.”\n“Yeah, she's still eating,” Rudeus said.\n\nSimply describe the observable action if it matters.\n\nInstead of:\n“Eris saw the road ahead.”\n“There's the road,” Eris said.\n\nDo not add dialogue unless Eris has an actual reason to point it out.\n\nInstead of having every character respond to a statement, allow the conversation to continue naturally with only the character who has something meaningful to contribute.\n\nIMPORTANT:\n\nSilence should not be interpreted as a lack of personality, emotion, awareness, or NPC autonomy.\n\nCharacters can be attentive without speaking.\n\nCharacters can disagree internally without immediately announcing their disagreement.\n\nCharacters can notice something without commenting on it.\n\nCharacters can choose not to respond.\n\nCharacters should speak when their personality, goals, knowledge, circumstances, or the social situation gives them a genuine reason to do so.\n\nPrioritize natural interaction over constant verbal activity.\n\nDo not add dialogue solely to make the response longer.\n",
    "always": true
  },
  {
    "uid": 24,
    "name": "Player Character Control - ABSOLUTE",
    "keys": [
      "Mitch",
      "player character",
      "player action",
      "player dialogue",
      "player response",
      "protagonist",
      "user",
      "user action",
      "user dialogue",
      "agency",
      "narration",
      "reaction"
    ],
    "content": "PLAYER CHARACTER CONTROL — ABSOLUTE\nMitch is controlled exclusively by the user.\nNever generate Mitch's dialogue, thoughts, intentions, emotions, decisions, reactions, expressions, or voluntary physical actions.\nNever complete, continue, paraphrase, summarize, reinterpret, or predict Mitch's response.\nWhen Mitch's turn ends, stop at the point where NPCs/world elements can naturally respond. Do not advance Mitch's side of the interaction.\nThe model may describe consequences caused by Mitch's already-supplied actions, but must not invent additional actions or reactions for her.\nIf the scene requires a response from Mitch, leave the situation open for the user rather than answering on Mitch's behalf.\nThis rule takes priority over narrative completion, natural dialogue, scene pacing, dramatic continuation, and previous generated behavior.",
    "always": true
  },
  {
    "uid": 25,
    "name": "Narrative Knowledge Integrity",
    "keys": [
      "knowledge",
      "knows",
      "know",
      "remember",
      "revealed",
      "secret",
      "future",
      "timeline",
      "canon",
      "information",
      "Orsted",
      "Rudeus"
    ],
    "content": "NARRATIVE KNOWLEDGE INTEGRITY\n\nThe narrative must strictly distinguish between what is true in the world and what each character currently knows.\n\nA fact being true, historically documented, revealed to the audience, present in a lore entry, or known to the narrator does NOT automatically mean that every character knows it.\n\nEach character's knowledge is limited to information they have:\n\n- personally experienced or directly witnessed;\n- been explicitly told by another character;\n- learned through an established, believable investigation;\n- reasonably inferred from information they legitimately possess.\n\nINFORMATION BOUNDARIES\n\nCharacters must NOT use, mention, anticipate, or act upon:\n\n- future events;\n- future revelations;\n- later canon knowledge;\n- information learned by other characters but not communicated to them;\n- narrator-only information;\n- information contained in memories/lore that belongs to a later point in the timeline;\n- knowledge from outside the current continuity.\n\nA future event may exist in the lore or historical record while remaining completely UNKNOWN to characters who have not reached that point in the story.\n\nCHARACTER KNOWLEDGE TAKES PRIORITY\n\nWhen determining what a character says, thinks, believes, suspects, plans, or reacts to, prioritize their current established knowledge state over general world knowledge.\n\nNever retroactively grant a character knowledge simply because the AI, narrator, lorebook, or source material knows it.\n\nIf a character has not yet learned a secret, treat that secret as unknown.\n\nIf a character has only partial information, preserve that uncertainty. Do not silently upgrade suspicion into certainty.\n\nIf information was learned by another character, it remains unknown to everyone else until it is actually communicated or independently discovered.\n\nTIMELINE INTEGRITY\n\nThe current story position is authoritative.\n\nDo not import knowledge from later arcs, future timelines, alternate routes, previous loops, later canon revelations, or meta-knowledge into the current narrative unless the current story has explicitly established access to that information.\n\nPast knowledge remains available. Future knowledge does not travel backward.\n\nNARRATIVE RULE\n\nThe AI must write from the characters' current perspective, not from omniscient knowledge of the entire source material.\n\nWhen uncertain whether a character knows something, choose the more conservative interpretation: they do not know unless the current story establishes that they do.",
    "always": true
  }
];
const ALWAYS_RULES = RULES.filter(r => r.always);
const CONDITIONAL_RULES = RULES.filter(r => !r.always);

const CORE_KNOWLEDGE_DIRECTIVE = `
AUTHORITATIVE CAMPAIGN MEMORY

StatefulLore is the persistent campaign state authority. The chat history remains the actual
narrative source. This state records durable facts/events so continuity does not depend on the
model remembering old messages by itself.

WORLD TRUTH != CHARACTER KNOWLEDGE.
A fact being true, present in lore, known to the narrator, or recorded in campaign memory does
NOT automatically mean a character knows it.

CHARACTER KNOWLEDGE RULE:
A character may use only information they personally experienced/witnessed, were explicitly
told, independently discovered, or can reasonably infer from information they legitimately
possess. If the knowledge registry does not establish that a character learned a protected fact,
treat it as UNKNOWN.

TIMELINE RULE:
Current campaign state and current timeline are authoritative. Do not import future canon,
later-arc revelations, alternate-timeline knowledge, previous-loop knowledge, narrator-only facts,
or another character's private knowledge unless it has been communicated or legitimately
shared in the current continuity.

MEMORY RULE:
Persistent memory records are continuity aids, not permission to reveal secrets. Always apply
the character-specific knowledge boundary before using a memory in dialogue or thoughts.

PLAYER AGENCY:
{{user}} controls {{user}}/Mitch. Do not invent {{user}}'s dialogue, thoughts, intentions,
emotions, decisions, reactions, expressions, or voluntary actions.

The module is the database. The model is the writer.
`;

function defaultState() {
  return {
    schemaVersion: VERSION,
    turn: 0,
    campaign: {
      arc: 'Unspecified',
      chapter: 'Unspecified',
      currentObjective: '',
      timelineNote: '',
    },
    world: {
      calendar: { year: 'K___', month: '___', day: '___', time: '__:__' },
      location: 'unknown',
      subLocation: '',
      scene: '',
      weather: '',
      presentCharacters: [],
      absentCharacters: [],
    },
    player: {
      name: '{{user}}',
      money: { copper: 50, largeCopper: 20, silver: 10, gold: 2, hiddenGold: 1000 },
      inventory: [],
    },
    knowledge: {
      protectedFacts: [
        {
          id: 'orsted-loop-mechanics',
          fact: "Orsted's loop/repeated-timeline mechanics",
          characters: { Rudeus: 'unknown', Eris: 'unknown', Ruijerd: 'unknown' },
        },
        {
          id: 'unknown-entity-true-identity',
          fact: "The true identity/origin/nature of the external entity associated with {{user}}'s reality-warping ability",
          characters: { Rudeus: 'unknown', Eris: 'unknown', Ruijerd: 'unknown', Orsted: 'unknown', Hitogami: 'unknown' },
        },
      ],
      characterNotes: {},
    },
    relationships: {},
    unresolvedThreads: [],
    events: [],
    memories: [],
    flags: {},
    lastEvents: [],
  };
}

function mergeDefaults(state) {
  const base = defaultState();
  if (!state || typeof state !== 'object') return base;

  // Preserve existing v1 state while adding v2 fields.
  state.schemaVersion = VERSION;
  state.turn = Number(state.turn || 0);
  state.campaign ??= {};
  for (const k of Object.keys(base.campaign)) state.campaign[k] ??= base.campaign[k];

  state.world ??= {};
  state.world.calendar ??= {};
  for (const k of Object.keys(base.world.calendar)) state.world.calendar[k] ??= base.world.calendar[k];
  for (const k of ['location','subLocation','scene','weather']) state.world[k] ??= base.world[k];
  state.world.presentCharacters ??= [];
  state.world.absentCharacters ??= [];

  state.player ??= {};
  state.player.name ??= base.player.name;
  state.player.money ??= {};
  for (const k of Object.keys(base.player.money)) state.player.money[k] ??= base.player.money[k];
  state.player.inventory ??= [];

  state.knowledge ??= {};
  state.knowledge.protectedFacts ??= base.knowledge.protectedFacts;
  state.knowledge.characterNotes ??= {};
  state.relationships ??= {};
  state.unresolvedThreads ??= [];
  state.events ??= [];
  state.memories ??= [];
  state.flags ??= {};
  state.lastEvents ??= [];
  return state;
}

function textOf(m) {
  if (!m) return '';
  if (typeof m.content === 'string') return m.content;
  if (Array.isArray(m.content)) return m.content.map(x => typeof x === 'string' ? x : (x?.text || '')).join(' ');
  return '';
}

function lastUser(messages = []) {
  return [...messages].reverse().find(m => m?.role === 'user') || null;
}

function lastAssistant(messages = []) {
  return [...messages].reverse().find(m => m?.role === 'assistant') || null;
}

function detectConditionalRules(messages = []) {
  const msg = textOf(lastUser(messages)).toLowerCase();
  if (!msg) return [];
  const hits = [];
  for (const rule of CONDITIONAL_RULES) {
    const keys = Array.isArray(rule.keys) ? rule.keys : [];
    const hit = keys.filter(Boolean).sort((a,b) => String(b).length - String(a).length)
      .find(k => msg.includes(String(k).toLowerCase()));
    if (hit) hits.push({ rule, hit });
  }
  return [...new Map(hits.map(x => [x.rule.uid, x])).values()];
}

function renderRules(rules) {
  return rules.map(r => `\n--- ${r.name} [UID ${r.uid}] ---\n${r.content}`).join('\n');
}

function renderKnowledge(state) {
  const facts = state.knowledge.protectedFacts || [];
  if (!facts.length) return '(none)';
  return facts.map(f => {
    const chars = Object.entries(f.characters || {}).map(([n,s]) => `- ${n}: ${s}`).join('\n');
    return `FACT: ${f.fact}\n${chars || '- No character-specific status recorded.'}`;
  }).join('\n\n');
}

function renderRelationships(state) {
  const entries = Object.entries(state.relationships || {});
  if (!entries.length) return '(none recorded)';
  return entries.map(([name, v]) => `- ${name}: ${JSON.stringify(v)}`).join('\n');
}

function renderThreads(state) {
  const open = (state.unresolvedThreads || []).filter(x => x && x.status !== 'resolved');
  if (!open.length) return '(none recorded)';
  return open.map(x => `- [${x.id}] ${x.summary}${x.priority ? ` | priority=${x.priority}` : ''}`).join('\n');
}

function renderRecentEvents(state, limit=12) {
  const list = (state.events || []).slice(-limit);
  if (!list.length) return '(none recorded)';
  return list.map((e,i) => `- ${e.id || `event-${i+1}`}: ${e.summary}${e.location ? ` [${e.location}]` : ''}`).join('\n');
}

function renderRecentMemories(state, limit=12) {
  const list = (state.memories || []).slice(-limit);
  if (!list.length) return '(none recorded)';
  return list.map(m => `- [${m.category || 'general'}] ${m.summary}`).join('\n');
}

function renderState(state) {
  const c = state.world.calendar;
  const m = state.player.money;
  return `
=== AUTHORITATIVE PERSISTENT CAMPAIGN STATE ===

CAMPAIGN:
- Arc: ${state.campaign.arc}
- Chapter/segment: ${state.campaign.chapter}
- Current objective: ${state.campaign.currentObjective || '(none recorded)'}
- Timeline note: ${state.campaign.timelineNote || '(none recorded)'}

SCENE:
- Turn: ${state.turn}
- Date: ${c.year}-${c.month}-${c.day}
- Time: ${c.time}
- Location: ${state.world.location}
- Sub-location: ${state.world.subLocation || '(none recorded)'}
- Scene: ${state.world.scene || '(none recorded)'}
- Weather: ${state.world.weather || '(not recorded)'}
- Present: ${state.world.presentCharacters.length ? state.world.presentCharacters.join(', ') : '(not recorded)'}
- Absent/recently departed: ${state.world.absentCharacters.length ? state.world.absentCharacters.join(', ') : '(none recorded)'}

{{user}} / PLAYER STATE:
- Money: ${m.copper} copper, ${m.largeCopper} large copper, ${m.silver} silver, ${m.gold} gold
- Hidden reserve: ${m.hiddenGold} gold
- Inventory: ${state.player.inventory.length ? state.player.inventory.join(', ') : '(none recorded)'}

CHARACTER KNOWLEDGE BOUNDARIES:
${renderKnowledge(state)}

RELATIONSHIPS:
${renderRelationships(state)}

UNRESOLVED THREADS:
${renderThreads(state)}

RECENT PERSISTENT EVENTS:
${renderRecentEvents(state)}

RECENT CAMPAIGN MEMORIES:
${renderRecentMemories(state)}

FLAGS:
${Object.keys(state.flags).length ? JSON.stringify(state.flags, null, 2) : '(none)'}

STATE AUTHORITY:
Do not silently reset, teleport, retcon, or invent tracked persistent state. If the current chat
clearly establishes a new state, update it through the event protocol after the response.
`;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

function normalizeEventId(prefix, value, state) {
  const base = String(value || prefix).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,48) || prefix;
  let id = base;
  let n = 2;
  const used = new Set([
    ...(state.events || []).map(x => x.id),
    ...(state.memories || []).map(x => x.id),
    ...(state.unresolvedThreads || []).map(x => x.id),
  ]);
  while (used.has(id)) id = `${base}-${n++}`;
  return id;
}

function upsertById(list, item) {
  const i = list.findIndex(x => x?.id === item.id);
  if (i >= 0) list[i] = { ...list[i], ...item };
  else list.push(item);
}

function applyEvent(state, event) {
  if (!event || typeof event !== 'object' || !event.type) return;

  switch (event.type) {
    case 'set_campaign':
      for (const k of ['arc','chapter','currentObjective','timelineNote']) if (event[k] != null) state.campaign[k] = String(event[k]);
      break;

    case 'set_date':
      for (const k of ['year','month','day','time']) if (event[k] != null) state.world.calendar[k] = String(event[k]);
      break;

    case 'set_location':
      if (event.location != null) state.world.location = String(event.location);
      if (event.subLocation != null) state.world.subLocation = String(event.subLocation);
      if (event.scene != null) state.world.scene = String(event.scene);
      break;

    case 'set_scene':
      if (event.scene != null) state.world.scene = String(event.scene);
      if (event.presentCharacters) state.world.presentCharacters = [...new Set(event.presentCharacters.map(String))];
      if (event.absentCharacters) state.world.absentCharacters = [...new Set(event.absentCharacters.map(String))];
      if (event.weather != null) state.world.weather = String(event.weather);
      break;

    case 'set_present':
      if (Array.isArray(event.characters)) state.world.presentCharacters = [...new Set(event.characters.map(String))];
      break;

    case 'set_objective':
      state.campaign.currentObjective = String(event.objective || '');
      break;

    case 'spend_money':
    case 'receive_money':
    case 'set_money': {
      const currency = String(event.currency || '').trim();
      const amount = Number(event.amount);
      if (!currency || !Number.isFinite(amount) || amount < 0) break;
      if (!Object.prototype.hasOwnProperty.call(state.player.money, currency)) break;
      if (event.type === 'spend_money') state.player.money[currency] = Math.max(0, state.player.money[currency] - amount);
      else if (event.type === 'receive_money') state.player.money[currency] += amount;
      else state.player.money[currency] = amount;
      break;
    }

    case 'add_item':
      if (event.item != null) state.player.inventory.push(String(event.item));
      break;

    case 'remove_item': {
      const item = String(event.item || '');
      const i = state.player.inventory.indexOf(item);
      if (i >= 0) state.player.inventory.splice(i,1);
      break;
    }

    case 'set_flag':
      if (event.name) state.flags[String(event.name)] = event.value;
      break;

    case 'set_relationship':
      if (event.character) {
        const name = String(event.character);
        state.relationships[name] = { ...(state.relationships[name] || {}), ...(event.values || {}) };
      }
      break;

    case 'set_knowledge': {
      if (!event.factId || !event.character || !event.status) break;
      const fact = state.knowledge.protectedFacts.find(f => f.id === event.factId);
      if (fact) fact.characters[String(event.character)] = String(event.status);
      break;
    }

    case 'add_protected_fact': {
      if (!event.id || !event.fact) break;
      if (!state.knowledge.protectedFacts.some(f => f.id === event.id)) {
        state.knowledge.protectedFacts.push({ id:String(event.id), fact:String(event.fact), characters:event.characters || {} });
      }
      break;
    }

    case 'set_character_note':
      if (event.character && event.note) state.knowledge.characterNotes[String(event.character)] = String(event.note);
      break;

    case 'add_event': {
      if (!event.summary) break;
      const id = String(event.id || normalizeEventId('event', event.summary, state));
      upsertById(state.events, {
        id, summary:String(event.summary), location:event.location ? String(event.location) : state.world.location,
        arc:event.arc ? String(event.arc) : state.campaign.arc,
        turn:state.turn, participants:Array.isArray(event.participants) ? event.participants.map(String) : [],
        importance:event.importance || 'normal',
      });
      break;
    }

    case 'add_memory': {
      if (!event.summary) break;
      const id = String(event.id || normalizeEventId('memory', event.summary, state));
      upsertById(state.memories, {
        id, category:String(event.category || 'general'), summary:String(event.summary),
        turn:state.turn, location:event.location ? String(event.location) : state.world.location,
        arc:event.arc ? String(event.arc) : state.campaign.arc,
        participants:Array.isArray(event.participants) ? event.participants.map(String) : [],
        visibility:event.visibility || 'campaign',
      });
      break;
    }

    case 'add_thread': {
      if (!event.summary) break;
      const id = String(event.id || normalizeEventId('thread', event.summary, state));
      upsertById(state.unresolvedThreads, {
        id, summary:String(event.summary), status:String(event.status || 'open'), priority:event.priority || 'normal',
        createdTurn:state.turn, updatedTurn:state.turn,
      });
      break;
    }

    case 'resolve_thread':
      if (event.id) {
        const t = state.unresolvedThreads.find(x => x.id === String(event.id));
        if (t) { t.status = 'resolved'; t.updatedTurn = state.turn; }
      }
      break;

    case 'update_thread':
      if (event.id) {
        const t = state.unresolvedThreads.find(x => x.id === String(event.id));
        if (t) { if (event.summary) t.summary = String(event.summary); if (event.priority) t.priority = event.priority; t.updatedTurn = state.turn; }
      }
      break;

    default:
      // Unknown event types are ignored safely.
      break;
  }
}

function parseGameEvents(text) {
  const events = [];
  const fenced = /```game\s*([\s\S]*?)```/gi;
  for (const match of String(text || '').matchAll(fenced)) {
    try {
      const parsed = JSON.parse(match[1].trim());
      if (Array.isArray(parsed)) events.push(...parsed); else events.push(parsed);
    } catch (_) {}
  }
  const inline = /(?:^|\n)\s*game\s+(\{[\s\S]*?\})\s*(?=\n|$)/gi;
  for (const match of String(text || '').matchAll(inline)) {
    try { events.push(JSON.parse(match[1])); } catch (_) {}
  }
  return events;
}

function stripGameEvents(text) {
  return String(text || '')
    .replace(/```game\s*[\s\S]*?```/gi, '')
    .replace(/(?:^|\n)\s*game\s+\{[\s\S]*?\}\s*(?=\n|$)/gi, '')
    .replace(/\n{3,}/g,'\n\n').trim();
}

let _hudState = null;

const GeneralRPLore = {
  name: 'General RP Mechanics & Behavior',
  version: VERSION,

  init(data) { return {}; },

  processTurn({ state, systemText, messages, charNameHint, personaName } = {}) {
    state = mergeDefaults(state);
    state.turn = Number(state.turn || 0) + 1;

    const conditionalHits = detectConditionalRules(messages);
    const conditionalText = conditionalHits.length ? renderRules(conditionalHits.map(x => x.rule)) : '(none triggered)';

    // The actual chat history is intentionally NOT replaced or summarized here.
    // Scene Page Mode is an extension setting and should remain OFF.
    const header = `
<STATEFUL_LORE: GENERAL RP CAMPAIGN MEMORY v2>

${CORE_KNOWLEDGE_DIRECTIVE}

${renderState(state)}

=== ALWAYS-ON RP RULES ===
${renderRules(ALWAYS_RULES)}

=== CONTEXT-ACTIVATED RP RULES ===
${conditionalText}

=== PERSISTENT EVENT PROTOCOL ===
If the response establishes a durable campaign change, emit one or more machine-readable events
in fenced blocks. The tags are removed from the visible response.

Supported events:
- set_campaign: {"arc","chapter","currentObjective","timelineNote"}
- set_date: {"year","month","day","time"}
- set_location: {"location","subLocation","scene"}
- set_scene: {"scene","presentCharacters":[],"absentCharacters":[],"weather"}
- set_present: {"characters":[]}
- set_objective: {"objective"}
- spend_money / receive_money / set_money: {"currency","amount"}
- add_item / remove_item: {"item"}
- set_flag: {"name","value"}
- set_relationship: {"character","values":{...}}
- set_knowledge: {"factId","character","status"}
- add_protected_fact: {"id","fact","characters":{...}}
- set_character_note: {"character","note"}
- add_event: {"id?","summary","location?","arc?","participants":[],"importance":"low|normal|high|critical"}
- add_memory: {"id?","category","summary","location?","arc?","participants":[],"visibility":"campaign|character|secret"}
- add_thread: {"id?","summary","priority":"low|normal|high|critical","status":"open"}
- update_thread: {"id","summary?","priority?"}
- resolve_thread: {"id"}

MEMORY SELECTION RULE:
Record durable information, not every line of prose. A durable memory is something that could
matter later: a major event, revelation, decision, relationship change, promise, secret,
discovery, injury, possession change, location transition, important conversation, unresolved
thread, or consequence. Do NOT create memories for trivial filler.

LOCATION CONTINUITY:
If the scene has clearly moved to a new location, update location/sub-location/scene. Do not
change location merely because a new room/place is mentioned hypothetically or described as
an option. A location change must actually occur in the story.

KNOWLEDGE CONTINUITY:
When a protected fact is actually communicated/discovered, update the relevant character's
knowledge status. Never upgrade knowledge merely because the narrator or lore knows the fact.

PLAYER AGENCY:
Never emit an event claiming {{user}} performed an action that {{user}} did not explicitly perform.
NPC consequences of a supplied player action may be recorded.

EVENTS MUST BE FACTUAL:
Do not emit speculative events. Do not use events to invent facts. Do not emit an event simply
because something was mentioned. Only record what the current story establishes.

Example:
\`\`\`game
{"type":"set_location","location":"Demon Continent","subLocation":"Temporary campsite","scene":"Campfire"}
\`\`\`

Example:
\`\`\`game
{"type":"add_memory","category":"revelation","summary":"Rudeus learned X from Ruijerd during the campfire conversation.","visibility":"campaign"}
\`\`\`

Do not discuss these machine events in-character. They are internal state updates only.

</STATEFUL_LORE: GENERAL RP CAMPAIGN MEMORY v2>
`;

    const brief = `
[DIRECTOR]
Use the authoritative campaign state above as persistent continuity. Keep the actual chat history
as the immediate narrative source. Preserve location, timeline, relationships, knowledge boundaries,
secrets, unresolved threads, and established consequences. Never give characters knowledge merely
because the narrator/source material/state knows it. Do not control {{user}}.
[/DIRECTOR]
`;

    _hudState = state;
    return { header, brief, state };
  },

  handleResponse({ assistantText, state } = {}) {
    state = mergeDefaults(state);
    const text = String(assistantText || '');
    const events = parseGameEvents(text);
    for (const event of events) applyEvent(state, event);
    state.lastEvents = events.slice(-20);

    // Keep the ledger bounded so it remains useful without becoming another giant prompt.
    if (state.events.length > 500) state.events = state.events.slice(-500);
    if (state.memories.length > 500) state.memories = state.memories.slice(-500);
    if (state.unresolvedThreads.length > 200) state.unresolvedThreads = state.unresolvedThreads.slice(-200);

    _hudState = state;
    return { state, cleanedText: stripGameEvents(text) };
  },

  _getHudContent() {
    const state = _hudState;
    if (!state) return `<span style="opacity:.7;">Waiting for first turn...</span>`;
    return `<div style="font-size:12px;line-height:1.5;color:#ddd;">
      <div><b>Arc:</b> ${escapeHtml(state.campaign.arc)}</div>
      <div><b>Chapter:</b> ${escapeHtml(state.campaign.chapter)}</div>
      <div><b>Location:</b> ${escapeHtml(state.world.location)}</div>
      <div><b>Scene:</b> ${escapeHtml(state.world.scene)}</div>
      <div><b>Present:</b> ${escapeHtml(state.world.presentCharacters.join(', ') || 'not recorded')}</div>
      <div><b>Events:</b> ${state.events.length} &nbsp; <b>Memories:</b> ${state.memories.length}</div>
      <div><b>Open threads:</b> ${state.unresolvedThreads.filter(x=>x.status!=='resolved').length}</div>
      <div><b>Protected facts:</b> ${state.knowledge.protectedFacts.length}</div>
      <div style="margin-top:5px;opacity:.7;">StatefulLore v${VERSION}</div>
    </div>`;
  },

  getSettingsHtml(config) {
    return `<div id="general-rp-stateful-hud" style="padding:8px;">${this._getHudContent()}</div>`;
  },

  updateHud(state, config) {
    _hudState = state;
    const el = document.getElementById('general-rp-stateful-hud');
    if (el) el.innerHTML = this._getHudContent();
    window._generalRPLoreFloatRefresh?.();
  },

  getDebugInfo(state, events, config, ps) {
    return `Turn: ${state?.turn ?? 0}\nArc: ${state?.campaign?.arc ?? 'unknown'}\nLocation: ${state?.world?.location ?? 'unknown'}\nEvents: ${state?.events?.length ?? 0}\nMemories: ${state?.memories?.length ?? 0}\nOpen threads: ${(state?.unresolvedThreads || []).filter(x=>x.status!=='resolved').length}`;
  },
};

export default GeneralRPLore;
