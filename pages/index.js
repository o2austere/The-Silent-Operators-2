import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// SILENT OPERATORS — INTELLIGENCE SYSTEM v2.0
// "The system sees what you refuse to."
// ═══════════════════════════════════════════════════════════════

const RANKS = [
  { level: 0, name: "UNINITIATED", xp: 0, icon: "△", color: "#333", sigil: "You have not yet entered." },
  { level: 1, name: "OBSERVER", xp: 0, icon: "◇", color: "#4a5568", sigil: "See what others miss." },
  { level: 2, name: "ANALYST", xp: 800, icon: "◈", color: "#3b82f6", sigil: "Pattern recognition activated." },
  { level: 3, name: "STRATEGIST", xp: 2000, icon: "⬡", color: "#8b5cf6", sigil: "You no longer react. You architect." },
  { level: 4, name: "OPERATOR", xp: 4500, icon: "⬢", color: "#dc2626", sigil: "Silent execution. Zero trace." },
  { level: 5, name: "SHADOW COUNCIL", xp: 9000, icon: "☗", color: "#d4a017", sigil: "Those who move the world never announce it." },
];

const PILLARS = [
  { id: "money", name: "CAPITAL", icon: "⦿", color: "#16a34a", desc: "Wealth systems, business architecture, financial psychology, market manipulation", symbol: "₿" },
  { id: "seduction", name: "INFLUENCE", icon: "◎", color: "#db2777", desc: "Social engineering, frame control, desire mechanics, interpersonal warfare", symbol: "♛" },
  { id: "health", name: "VESSEL", icon: "◉", color: "#0891b2", desc: "Biological optimization, neurochemistry, performance protocols, longevity", symbol: "⧫" },
  { id: "power", name: "DOMINION", icon: "◆", color: "#dc2626", desc: "Dark psychology, strategic warfare, information control, Machiavellian systems", symbol: "♜" },
];

// ═══════════════════════════════════════════════════════════════
// COURSES DATABASE
// ═══════════════════════════════════════════════════════════════

const COURSES = [
  // ── DOMINION (POWER) PILLAR ──
  {
    id: "mindhijacking",
    pillar: "power",
    title: "MINDHIJACKING",
    subtitle: "The 7 neural mechanisms that control every human decision",
    difficulty: "ADVANCED",
    xpReward: 400,
    locked: false,
    modules: [
      {
        id: "mh-1", title: "The Dual System",
        lessons: [
          { id: "mh-1-1", title: "System 1 vs System 2 — The Two Brains Running Your Life", type: "lesson", duration: "14 min" },
          { id: "mh-1-2", title: "The 8-Second Gap — Decisions Before Consciousness", type: "lesson", duration: "12 min" },
          { id: "mh-1-3", title: "Heuristics — The Mental Shortcuts That Make People Predictable", type: "lesson", duration: "15 min" },
          { id: "mh-1-4", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "mh-2", title: "The 7 Neural Hijack Mechanisms",
        lessons: [
          { id: "mh-2-1", title: "Emotional Tagging — Why Feelings Override Logic", type: "lesson", duration: "12 min" },
          { id: "mh-2-2", title: "Pattern Interrupts & Attention Hijacking", type: "lesson", duration: "14 min" },
          { id: "mh-2-3", title: "The Anchoring Effect — Controlling Reference Points", type: "lesson", duration: "13 min" },
          { id: "mh-2-4", title: "Social Proof & Tribal Compliance", type: "lesson", duration: "11 min" },
          { id: "mh-2-5", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "mh-3", title: "Tactical Protocols",
        lessons: [
          { id: "mh-3-1", title: "First Frame Protocol — Controlling the Opening", type: "lesson", duration: "10 min" },
          { id: "mh-3-2", title: "Loss Architecture — Engineering Fear of Missing Out", type: "lesson", duration: "12 min" },
          { id: "mh-3-3", title: "Validation Stack — Manufacturing Trust", type: "lesson", duration: "14 min" },
          { id: "mh-3-4", title: "Narrative Dominance — Story as Weapon", type: "lesson", duration: "16 min" },
          { id: "mh-3-5", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "mh-4", title: "The Mirror Section",
        lessons: [
          { id: "mh-4-1", title: "CIA Self-Diagnostic — Are You Being Hijacked?", type: "lesson", duration: "15 min" },
          { id: "mh-4-2", title: "Defense Protocols — Detecting & Neutralizing Influence", type: "lesson", duration: "18 min" },
          { id: "mh-4-3", title: "Final Assessment: Mindhijacking", type: "quiz", questions: 8 },
        ]
      },
    ],
  },
  {
    id: "persuasion-code",
    pillar: "power",
    title: "THE PERSUASION CODE",
    subtitle: "Primal brain dominance — the 6 stimuli that bypass rational thought",
    difficulty: "ADVANCED",
    xpReward: 350,
    locked: false,
    modules: [
      {
        id: "pc-1", title: "Primal Brain Architecture",
        lessons: [
          { id: "pc-1-1", title: "The Reptilian Override — Why Logic Loses", type: "lesson", duration: "14 min" },
          { id: "pc-1-2", title: "Bottom-Up Processing — The Cascade That Controls You", type: "lesson", duration: "12 min" },
          { id: "pc-1-3", title: "Module Assessment", type: "quiz", questions: 5 },
        ]
      },
      {
        id: "pc-2", title: "The 6 Primal Stimuli",
        lessons: [
          { id: "pc-2-1", title: "Personal — Making It About THEM", type: "lesson", duration: "10 min" },
          { id: "pc-2-2", title: "Contrastable — Binary Choices That Force Decisions", type: "lesson", duration: "11 min" },
          { id: "pc-2-3", title: "Tangible — Reducing Cognitive Load", type: "lesson", duration: "10 min" },
          { id: "pc-2-4", title: "Memorable — Beginning/End Weighting", type: "lesson", duration: "12 min" },
          { id: "pc-2-5", title: "Visual — The Dominant Sensory Channel", type: "lesson", duration: "11 min" },
          { id: "pc-2-6", title: "Emotional — Neurochemical Triggers", type: "lesson", duration: "13 min" },
          { id: "pc-2-7", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "pc-3", title: "Frame Control & Influence Deployment",
        lessons: [
          { id: "pc-3-1", title: "What Frames Are & Why They Control Everything", type: "lesson", duration: "12 min" },
          { id: "pc-3-2", title: "Frame Battles — How to Win Every Exchange", type: "lesson", duration: "18 min" },
          { id: "pc-3-3", title: "Preframing & Reframing Protocols", type: "lesson", duration: "14 min" },
          { id: "pc-3-4", title: "Final Assessment: The Persuasion Code", type: "quiz", questions: 8 },
        ]
      },
    ],
  },
  {
    id: "dark-psychology",
    pillar: "power",
    title: "DARK PSYCHOLOGY",
    subtitle: "The shadow architecture of human manipulation and defense",
    difficulty: "CLASSIFIED",
    xpReward: 500,
    locked: true,
    requiredRank: 3,
    modules: [
      {
        id: "dp-1", title: "The Dark Triad",
        lessons: [
          { id: "dp-1-1", title: "Machiavellianism — The Strategic Mind", type: "lesson", duration: "20 min" },
          { id: "dp-1-2", title: "Narcissism — Weaponized Self-Belief", type: "lesson", duration: "18 min" },
          { id: "dp-1-3", title: "Psychopathy — Emotional Detachment as Advantage", type: "lesson", duration: "22 min" },
          { id: "dp-1-4", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "dp-2", title: "Named Techniques",
        lessons: [
          { id: "dp-2-1", title: "Foot-in-the-Door & Door-in-the-Face", type: "lesson", duration: "14 min" },
          { id: "dp-2-2", title: "Commitment Traps & Consistency Exploitation", type: "lesson", duration: "16 min" },
          { id: "dp-2-3", title: "Manufactured Scarcity vs Real Scarcity", type: "lesson", duration: "12 min" },
          { id: "dp-2-4", title: "The Benjamin Franklin Effect & Labeling Theory", type: "lesson", duration: "14 min" },
          { id: "dp-2-5", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "dp-3", title: "Self-Persuasion — The Highest Level",
        lessons: [
          { id: "dp-3-1", title: "Cognitive Dissonance Resolution — Making Them Convince Themselves", type: "lesson", duration: "18 min" },
          { id: "dp-3-2", title: "Self-Perception Theory & Identity-Based Influence", type: "lesson", duration: "16 min" },
          { id: "dp-3-3", title: "Final Assessment: Dark Psychology", type: "quiz", questions: 8 },
        ]
      },
    ],
  },
  // ── CAPITAL (MONEY) PILLAR ──
  {
    id: "consumer-psych",
    pillar: "money",
    title: "CONSUMER DECISION SCIENCE",
    subtitle: "Neuromarketing — what fMRI scans reveal about why people buy",
    difficulty: "INTERMEDIATE",
    xpReward: 300,
    locked: false,
    modules: [
      {
        id: "cp-1", title: "The Buying Brain",
        lessons: [
          { id: "cp-1-1", title: "The Coke vs Pepsi Study — When Brands Override Taste", type: "lesson", duration: "12 min" },
          { id: "cp-1-2", title: "Willingness to Purchase — The Subconscious Plateau", type: "lesson", duration: "14 min" },
          { id: "cp-1-3", title: "The IFG Activation — Decisions 8 Seconds Before You Know", type: "lesson", duration: "13 min" },
          { id: "cp-1-4", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "cp-2", title: "Pricing & Choice Architecture",
        lessons: [
          { id: "cp-2-1", title: "Anchoring — Controlling the Reference Point", type: "lesson", duration: "11 min" },
          { id: "cp-2-2", title: "The Decoy Effect & Asymmetric Dominance", type: "lesson", duration: "13 min" },
          { id: "cp-2-3", title: "Loss Aversion — Why Losing Hits 2x Harder Than Winning", type: "lesson", duration: "12 min" },
          { id: "cp-2-4", title: "The Pain of Paying & Temporal Discounting", type: "lesson", duration: "14 min" },
          { id: "cp-2-5", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "cp-3", title: "Brand Psychology",
        lessons: [
          { id: "cp-3-1", title: "The Brand Essence Framework — Feelings to Extensions", type: "lesson", duration: "15 min" },
          { id: "cp-3-2", title: "The Consideration Set — Win Before They Research", type: "lesson", duration: "12 min" },
          { id: "cp-3-3", title: "Trust = Margin — Why 61% Pay 20% More for Known Brands", type: "lesson", duration: "11 min" },
          { id: "cp-3-4", title: "High vs Low Involvement Decisions", type: "lesson", duration: "13 min" },
          { id: "cp-3-5", title: "Final Assessment: Consumer Decision Science", type: "quiz", questions: 8 },
        ]
      },
    ],
  },
  {
    id: "seven-customers",
    pillar: "money",
    title: "THE 7 CUSTOMER TYPES",
    subtitle: "Identify, target, and convert every psychological buyer profile",
    difficulty: "INTERMEDIATE",
    xpReward: 250,
    locked: false,
    modules: [
      {
        id: "sc-1", title: "Customer Psychology Mapping",
        lessons: [
          { id: "sc-1-1", title: "Why One Message Doesn't Fit All", type: "lesson", duration: "10 min" },
          { id: "sc-1-2", title: "The 7 Buyer Archetypes — Identification Protocol", type: "lesson", duration: "18 min" },
          { id: "sc-1-3", title: "Tailoring Your Offer to Each Type", type: "lesson", duration: "16 min" },
          { id: "sc-1-4", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
    ],
  },
  // ── INFLUENCE (SEDUCTION) PILLAR ──
  {
    id: "social-warfare",
    pillar: "seduction",
    title: "SOCIAL WARFARE",
    subtitle: "Dominate any social environment without detection",
    difficulty: "ADVANCED",
    xpReward: 350,
    locked: false,
    modules: [
      {
        id: "sw-1", title: "Reading the Room",
        lessons: [
          { id: "sw-1-1", title: "Micro-Expression Decoding", type: "lesson", duration: "20 min" },
          { id: "sw-1-2", title: "Power Mapping — Who Actually Controls the Room", type: "lesson", duration: "15 min" },
          { id: "sw-1-3", title: "Mirror Neurons & Engineering Rapport", type: "lesson", duration: "14 min" },
          { id: "sw-1-4", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "sw-2", title: "Frame Dominance",
        lessons: [
          { id: "sw-2-1", title: "Status Games — Winning Without Competing", type: "lesson", duration: "14 min" },
          { id: "sw-2-2", title: "Conversational Threading & Emotional Hijacking", type: "lesson", duration: "18 min" },
          { id: "sw-2-3", title: "Push/Pull Dynamics & Tension Loops", type: "lesson", duration: "16 min" },
          { id: "sw-2-4", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "sw-3", title: "Subcommunication",
        lessons: [
          { id: "sw-3-1", title: "Body Language, Eye Contact & Tonality", type: "lesson", duration: "16 min" },
          { id: "sw-3-2", title: "Preselection — Social Proof in Action", type: "lesson", duration: "12 min" },
          { id: "sw-3-3", title: "Presence — Commanding Attention Without Trying", type: "lesson", duration: "14 min" },
          { id: "sw-3-4", title: "Final Assessment: Social Warfare", type: "quiz", questions: 8 },
        ]
      },
    ],
  },
  // ── VESSEL (HEALTH) PILLAR ──
  {
    id: "bio-optimization",
    pillar: "health",
    title: "BIOLOGICAL OVERRIDE",
    subtitle: "Reprogram your neurochemistry for peak output",
    difficulty: "INTERMEDIATE",
    xpReward: 250,
    locked: false,
    modules: [
      {
        id: "bo-1", title: "Neurochemical Mastery",
        lessons: [
          { id: "bo-1-1", title: "Dopamine Engineering — Rewire Your Reward System", type: "lesson", duration: "16 min" },
          { id: "bo-1-2", title: "Cortisol Management & Stress Inoculation", type: "lesson", duration: "14 min" },
          { id: "bo-1-3", title: "Oxytocin & Trust Chemistry — Engineering Rapport", type: "lesson", duration: "12 min" },
          { id: "bo-1-4", title: "Module Assessment", type: "quiz", questions: 5 },
        ]
      },
      {
        id: "bo-2", title: "Sleep & Recovery Architecture",
        lessons: [
          { id: "bo-2-1", title: "Circadian Protocol — Engineering Perfect Sleep", type: "lesson", duration: "18 min" },
          { id: "bo-2-2", title: "Supplement Stack for Deep Recovery", type: "lesson", duration: "12 min" },
          { id: "bo-2-3", title: "Module Assessment", type: "quiz", questions: 5 },
        ]
      },
    ],
  },
  // ── CROSS-PILLAR: MINDSET ──
  {
    id: "flip-the-floor",
    pillar: "power",
    title: "FLIP THE FLOOR",
    subtitle: "Identity reprogramming — raise your baseline until regression is impossible",
    difficulty: "FOUNDATIONAL",
    xpReward: 350,
    locked: false,
    modules: [
      {
        id: "ftf-1", title: "The Polar Opposites",
        lessons: [
          { id: "ftf-1-1", title: "The Devil & The Angel — Your Two Operating Systems", type: "lesson", duration: "12 min" },
          { id: "ftf-1-2", title: "Why Does The Devil Come Back?", type: "lesson", duration: "14 min" },
          { id: "ftf-1-3", title: "The Fluctuation of Identities", type: "lesson", duration: "16 min" },
          { id: "ftf-1-4", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "ftf-2", title: "Homeostasis & The Cycle",
        lessons: [
          { id: "ftf-2-1", title: "Understanding Homeostasis in the Mind", type: "lesson", duration: "15 min" },
          { id: "ftf-2-2", title: "The Cycle of the 4 Emotions", type: "lesson", duration: "14 min" },
          { id: "ftf-2-3", title: "The F-T-E Event — Rock Bottom as Rocket Fuel", type: "lesson", duration: "12 min" },
          { id: "ftf-2-4", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "ftf-3", title: "Identity Engineering",
        lessons: [
          { id: "ftf-3-1", title: "Who Are You? — Creating Your Game Character", type: "lesson", duration: "14 min" },
          { id: "ftf-3-2", title: "Making Success the Standard", type: "lesson", duration: "12 min" },
          { id: "ftf-3-3", title: "The Identity Anchor — Becoming Unshakeable", type: "lesson", duration: "16 min" },
          { id: "ftf-3-4", title: "The Floor Flip Protocol — Daily Execution System", type: "lesson", duration: "14 min" },
          { id: "ftf-3-5", title: "Final Assessment: Flip The Floor", type: "quiz", questions: 8 },
        ]
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// PSYCHOLOGICAL ASSESSMENT — EXPANDED (with Likert scales)
// ═══════════════════════════════════════════════════════════════

const PSYCH_SECTIONS = [
  {
    id: "cognitive",
    name: "COGNITIVE ARCHITECTURE",
    desc: "How your mind processes, filters, and weaponizes information",
    questions: [
      { id: 1, text: "I can hold multiple conflicting ideas simultaneously without discomfort" },
      { id: 2, text: "When I receive new information, I immediately look for how it connects to existing frameworks" },
      { id: 3, text: "I notice patterns and systems that others seem completely blind to" },
      { id: 4, text: "I find it easy to predict outcomes based on limited data points" },
      { id: 5, text: "I naturally think in terms of cause and effect chains, 3-4 moves ahead" },
    ]
  },
  {
    id: "social",
    name: "SOCIAL INTELLIGENCE",
    desc: "Your ability to read, map, and navigate human dynamics",
    questions: [
      { id: 6, text: "I can detect when someone is being inauthentic within the first 2 minutes of conversation" },
      { id: 7, text: "I naturally track the power dynamics in every group I enter" },
      { id: 8, text: "I can read emotional states through micro-expressions and body language shifts" },
      { id: 9, text: "I can adapt my communication style to different people without conscious effort" },
      { id: 10, text: "I understand what someone really wants even when their words say something different" },
    ]
  },
  {
    id: "emotional",
    name: "EMOTIONAL CONTROL",
    desc: "Your relationship with your internal operating system",
    questions: [
      { id: 11, text: "I can detach from emotions during high-pressure situations and operate purely on logic" },
      { id: 12, text: "I choose what emotions to display — my face rarely betrays what I actually feel" },
      { id: 13, text: "Rejection and criticism don't affect my self-concept" },
      { id: 14, text: "I can sit in extreme discomfort — physically or emotionally — without needing to escape it" },
      { id: 15, text: "My emotional state is a choice, not a reaction to my environment" },
    ]
  },
  {
    id: "drive",
    name: "DRIVE ARCHITECTURE",
    desc: "The engine that determines your ceiling",
    questions: [
      { id: 16, text: "I execute on my commitments regardless of how I feel on any given day" },
      { id: 17, text: "I actively seek discomfort because I know growth lives there" },
      { id: 18, text: "When I decide on a goal, I become consumed by it until it's accomplished" },
      { id: 19, text: "I can delay gratification for months or years without losing momentum" },
      { id: 20, text: "I have a morning/daily protocol that I execute with near-military precision" },
    ]
  },
  {
    id: "strategic",
    name: "STRATEGIC PROCESSING",
    desc: "Your capacity for calculated, multi-variable decision making",
    questions: [
      { id: 21, text: "Before entering any situation, I mentally map the possible outcomes and my responses to each" },
      { id: 22, text: "I think about conversations as chess games — positioning moves ahead" },
      { id: 23, text: "I can identify the highest-leverage action in any situation quickly" },
      { id: 24, text: "I analyze my own failures with clinical detachment to extract lessons" },
      { id: 25, text: "I make decisions based on probability and expected value, not emotion" },
    ]
  },
  {
    id: "shadow",
    name: "SHADOW PROFILE",
    desc: "The parts most people hide. We need to see all of it.",
    questions: [
      { id: 26, text: "My ambition could be described as obsessive by most people's standards" },
      { id: 27, text: "I am willing to make sacrifices that most people would consider extreme to achieve my goals" },
      { id: 28, text: "I naturally see vulnerabilities in people and systems" },
      { id: 29, text: "I find it easy to detach from people or situations that no longer serve my objectives" },
      { id: 30, text: "I operate with a level of self-interest that I rarely reveal to others" },
    ]
  },
];

const SCALE_LABELS = [
  { value: 1, label: "Strongly Disagree", short: "SD" },
  { value: 2, label: "Disagree", short: "D" },
  { value: 3, label: "Slightly Disagree", short: "−" },
  { value: 4, label: "Neutral", short: "○" },
  { value: 5, label: "Slightly Agree", short: "+" },
  { value: 6, label: "Agree", short: "A" },
  { value: 7, label: "Strongly Agree", short: "SA" },
];

// ═══════════════════════════════════════════════════════════════
// QUIZ QUESTIONS FOR COURSES
// ═══════════════════════════════════════════════════════════════

const QUIZ_BANK = {
  // ── MINDHIJACKING QUIZZES ──
  "mh-1-4": [
    { q: "System 1 processing is best described as:", opts: ["Slow, deliberate, analytical", "Fast, automatic, intuitive", "Only active during sleep", "Controlled by the prefrontal cortex"], correct: 1 },
    { q: "Approximately what percentage of decisions are handled by System 1?", opts: ["50%", "75%", "95%", "100%"], correct: 2 },
    { q: "Heuristics are:", opts: ["Logical reasoning frameworks", "Mental shortcuts that bypass deep analysis", "Types of cognitive therapy", "Mathematical decision models"], correct: 1 },
    { q: "The '8-second gap' refers to:", opts: ["How long ads need to be", "The time between stimulus and conscious awareness of a decision", "Average attention span", "Time needed to form a first impression"], correct: 1 },
    { q: "System 2 gets activated when:", opts: ["System 1 flags something as requiring attention", "You're sleeping", "Emotional content is presented", "You make routine purchases"], correct: 0 },
    { q: "Kahneman's dual-system model earned him:", opts: ["A Pulitzer Prize", "A Nobel Prize", "A Fields Medal", "An Oscar"], correct: 1 },
  ],
  "mh-2-5": [
    { q: "Emotional tagging means:", opts: ["Labeling emotions in therapy", "The brain attaches feelings to memories which then influence future decisions", "Using emojis in marketing", "Categorizing customer feedback"], correct: 1 },
    { q: "A pattern interrupt works by:", opts: ["Following expected sequences", "Breaking predicted patterns to hijack attention", "Repeating the same message", "Using logic to override emotion"], correct: 1 },
    { q: "The anchoring effect means people:", opts: ["Stay loyal to first brands they try", "Rely heavily on the first piece of information as a reference point", "Prefer familiar environments", "Make decisions based on group consensus"], correct: 1 },
    { q: "Social proof is most powerful when:", opts: ["People are certain of their choice", "The audience is uncertain and looks to others for guidance", "Only one person endorses something", "It comes from strangers"], correct: 1 },
    { q: "Which brain region processes risk during purchase decisions?", opts: ["Hippocampus", "Cerebellum", "Inferior Frontal Gyrus (IFG)", "Occipital lobe"], correct: 2 },
    { q: "Tribal compliance works because:", opts: ["People fear legal consequences", "The brain treats social exclusion as a survival threat", "Everyone wants the same things", "Marketing tells people what to buy"], correct: 1 },
  ],
  "mh-3-5": [
    { q: "The 'First Frame Protocol' is about:", opts: ["Decorating your office", "Controlling the opening of any interaction to set the terms", "Speaking first in meetings", "Making eye contact"], correct: 1 },
    { q: "Loss architecture engineering uses the fact that:", opts: ["People love winning", "Losses feel approximately 2x stronger than equivalent gains", "Fear is irrational", "People always avoid risk"], correct: 1 },
    { q: "Narrative dominance works because:", opts: ["Stories activate more brain regions than facts alone", "People prefer fiction to reality", "Stories are easier to write", "Only children respond to stories"], correct: 0 },
    { q: "A validation stack is:", opts: ["A coding framework", "Layering multiple authority and trust signals to manufacture credibility", "A type of exercise", "A sales funnel"], correct: 1 },
    { q: "The most effective sequence for influence is:", opts: ["Logic → Emotion → Action", "Emotion → Logic → Action (emotional frame first, rational justification second)", "Action → Emotion → Logic", "Logic → Logic → Logic"], correct: 1 },
    { q: "Strategic vulnerability means:", opts: ["Showing all your weaknesses", "Calculated disclosure that builds trust faster than projecting perfection", "Being emotionally unstable", "Avoiding all conflict"], correct: 1 },
  ],
  "mh-4-3": [
    { q: "The CIA self-diagnostic asks:", opts: ["How patriotic you are", "Whether you can detect when influence techniques are being used on you", "Your political views", "Your IQ score"], correct: 1 },
    { q: "The best defense against anchoring is:", opts: ["Ignoring all information", "Being aware of it and consciously generating your own reference points", "Always going with the first number", "Asking for more anchors"], correct: 1 },
    { q: "When you notice someone using social proof manipulation, you should:", opts: ["Panic", "Evaluate the evidence independently of what 'everyone else' is doing", "Follow the crowd anyway", "Confront them publicly"], correct: 1 },
    { q: "Someone using the scarcity principle on you will likely:", opts: ["Give you unlimited time", "Create artificial urgency or limited availability", "Lower the price repeatedly", "Ignore you"], correct: 1 },
    { q: "Reciprocity is being weaponized when:", opts: ["Someone genuinely helps you", "An unsolicited 'gift' comes with an implicit expectation of return", "You exchange equal value", "A friend asks for help"], correct: 1 },
    { q: "The most important skill in defense against manipulation is:", opts: ["Aggression", "Metacognition — being aware of your own thought processes", "Isolation", "Memorizing techniques"], correct: 1 },
    { q: "If you feel sudden urgency to make a decision, the correct protocol is:", opts: ["Act immediately", "Pause — urgency is the most common manipulation trigger", "Ask a friend", "Flip a coin"], correct: 1 },
    { q: "The 'Mirror Section' exists because:", opts: ["Mirrors help you look better", "Understanding influence is incomplete without understanding your own vulnerabilities", "It's a marketing gimmick", "CIA agents use mirrors"], correct: 1 },
  ],
  // ── PERSUASION CODE QUIZZES ──
  "pc-1-3": [
    { q: "The 'primal brain' processes information how many times faster than rational thought?", opts: ["5x faster", "10x faster", "40x faster", "100x faster"], correct: 2 },
    { q: "Bottom-up processing means:", opts: ["Starting with conclusions", "Primal brain activates first, then cascades upward to rational brain", "Reading from bottom of page", "Building arguments from the ground up"], correct: 1 },
    { q: "The primal brain primarily cares about:", opts: ["Logic and data", "Survival-relevant threats and opportunities", "Abstract concepts", "Long-term planning"], correct: 1 },
    { q: "Rational decision-making is actually:", opts: ["How most decisions are made", "Post-hoc justification for emotional decisions already made", "Superior to emotional processing", "Faster than intuition"], correct: 1 },
    { q: "The primal brain is shared with:", opts: ["Only humans", "Only primates", "Most animals — it's evolutionarily ancient", "Artificial intelligence"], correct: 2 },
  ],
  "pc-2-7": [
    { q: "The 'Personal' stimulus works because the primal brain prioritizes:", opts: ["Group needs", "Self-relevant information and personal threats", "Abstract data", "Historical patterns"], correct: 1 },
    { q: "Making something 'Contrastable' means:", opts: ["Using many colors", "Presenting binary, easy-to-compare choices", "Creating confusion", "Offering unlimited options"], correct: 1 },
    { q: "The 'Tangible' stimulus reduces:", opts: ["Price", "Cognitive load — making things concrete and easy to process", "Competition", "Emotional response"], correct: 1 },
    { q: "The primacy and recency effect means:", opts: ["First impressions don't matter", "People remember the beginning and end of experiences most strongly", "Only recent events matter", "The middle is most memorable"], correct: 1 },
    { q: "The visual channel dominates because:", opts: ["People can read fast", "The brain dedicates more processing power to visual input than any other sense", "Videos are popular", "Text is boring"], correct: 1 },
    { q: "Emotional triggers work on the primal brain because:", opts: ["Emotions are logical", "Neurochemical responses bypass conscious analysis", "People are weak", "Emotions are random"], correct: 1 },
  ],
  "pc-3-4": [
    { q: "A 'frame' in social dynamics is:", opts: ["A picture frame", "The underlying assumptions that define how a situation is interpreted", "A debate technique", "Body language"], correct: 1 },
    { q: "The strongest frame belongs to the person with:", opts: ["The loudest voice", "The most authority", "The least emotional reactivity", "The most friends"], correct: 2 },
    { q: "Preframing is:", opts: ["Setting expectations before the main interaction", "Reacting to someone's frame", "Changing the subject", "A type of NLP"], correct: 0 },
    { q: "When someone breaks your frame, you should:", opts: ["React emotionally", "Absorb and reframe — pull them into YOUR reality", "Leave the room", "Argue louder"], correct: 1 },
    { q: "Frame control is fundamentally about controlling:", opts: ["People's actions", "The context through which people interpret reality", "Volume and tone", "Physical space"], correct: 1 },
    { q: "Reframing works because:", opts: ["People are stupid", "Changing the context changes the meaning, which changes the response", "You can trick anyone", "Repetition builds belief"], correct: 1 },
    { q: "The Cialdini principle activated by giving before asking is:", opts: ["Authority", "Scarcity", "Reciprocity", "Liking"], correct: 2 },
    { q: "Presupposition stacking means:", opts: ["Making assumptions about someone's income", "Embedding your desired conclusion inside your questions", "Stacking books on a shelf", "Asking direct questions"], correct: 1 },
  ],
  // ── CONSUMER DECISION SCIENCE QUIZZES ──
  "cp-1-4": [
    { q: "The Coke vs Pepsi fMRI study proved that:", opts: ["Pepsi tastes better", "Brand associations stored in memory can override actual sensory preference", "Coke has better ingredients", "fMRI scans are unreliable"], correct: 1 },
    { q: "Willingness to Purchase (WTPu) as measured by brain scans:", opts: ["Drops after the offer", "Spikes at the offer and plateaus at an elevated level", "Stays flat throughout", "Only activates at checkout"], correct: 1 },
    { q: "The IFG activates how many seconds before conscious decision?", opts: ["1-2 seconds", "3-4 seconds", "6+ seconds", "30 seconds"], correct: 2 },
    { q: "Visual elements become MORE powerful than words:", opts: ["Never", "In the later stages of a sales interaction, after the offer", "Only in print media", "Only with children"], correct: 1 },
    { q: "The IFG is primarily assessing:", opts: ["Color preferences", "Risk — 'is this safe to buy?'", "Mathematical calculations", "Memory storage"], correct: 1 },
    { q: "After an offer is made, the customer's brain shifts into:", opts: ["Sleep mode", "Sustained risk-assessment mode that persists until the end", "Pure logic mode", "Fight or flight"], correct: 1 },
  ],
  "cp-2-5": [
    { q: "Loss aversion means losses feel approximately:", opts: ["Equal to gains", "1.5x stronger than gains", "2x stronger than equivalent gains", "10x stronger"], correct: 2 },
    { q: "The decoy effect works by:", opts: ["Offering a worse option that makes the target option look superior", "Offering the cheapest option", "Removing choices", "Using bright colors"], correct: 0 },
    { q: "Temporal discounting means people:", opts: ["Value time equally", "Strongly prefer immediate rewards over larger future ones", "Always plan long-term", "Ignore deadlines"], correct: 1 },
    { q: "'The pain of paying' is reduced by:", opts: ["Making products more expensive", "Separating the payment from the consumption (subscriptions, pre-payment)", "Showing the exact cost", "Cash payments"], correct: 1 },
    { q: "The endowment effect means:", opts: ["People undervalue what they own", "People overvalue what they already possess", "Endowments are good investments", "Ownership doesn't affect perception"], correct: 1 },
    { q: "Status quo bias means:", opts: ["People love change", "People resist change even when it would benefit them", "The current situation is always best", "Bias doesn't exist in purchasing"], correct: 1 },
  ],
  "cp-3-5": [
    { q: "The brand essence framework works from inside out starting with:", opts: ["Visuals", "Feelings (emotional connection at the core)", "Price", "Features"], correct: 1 },
    { q: "The 'consideration set' or 'evoked set' means:", opts: ["All brands in existence", "The small number of brands already in someone's mind before they research", "A mathematical set", "The final purchase"], correct: 1 },
    { q: "What percentage of respondents would pay 20% more for a trusted brand?", opts: ["25%", "40%", "61.5%", "90%"], correct: 2 },
    { q: "In high-involvement purchases, consumers:", opts: ["Buy on impulse", "Actively research but still filter through their evoked set", "Only compare price", "Don't care about brands"], correct: 1 },
    { q: "Nike doesn't sell shoes — they sell:", opts: ["Rubber and fabric", "Athletic identity", "Discounts", "Technology"], correct: 1 },
    { q: "Brand awareness is important because:", opts: ["It's vanity metric", "It's the entry ticket to the consideration set — without it you're not even evaluated", "It increases costs", "It only matters for big companies"], correct: 1 },
    { q: "The mere exposure effect means:", opts: ["Exposure to ads is annoying", "Familiarity breeds liking — repeated exposure increases preference", "People avoid familiar things", "New is always better"], correct: 1 },
    { q: "Trust translates directly to:", opts: ["Lower prices", "Pricing power — known brands compete on feeling, not price", "More competitors", "Government regulation"], correct: 1 },
  ],
  // ── 7 CUSTOMER TYPES QUIZ ──
  "sc-1-4": [
    { q: "A single marketing message fails because:", opts: ["Marketing doesn't work", "Different psychological buyer types respond to different triggers", "People don't read", "Only price matters"], correct: 1 },
    { q: "Identifying buyer archetypes allows you to:", opts: ["Ignore some customers", "Tailor messaging to hit specific psychological triggers for each type", "Only sell to one type", "Lower prices"], correct: 1 },
    { q: "The value of mapping customer types is:", opts: ["Academic only", "It lets you write copy, design offers, and frame sales for maximum conversion per type", "It's too complex to be useful", "Only large companies need it"], correct: 1 },
    { q: "When you discover a prospect's buyer type, you should:", opts: ["Treat them the same as everyone", "Adjust your communication, proof elements, and offer framing to match their psychology", "Tell them their type", "Only sell to easy types"], correct: 1 },
    { q: "The biggest mistake in selling to multiple types is:", opts: ["Having too many products", "Using one generic message when each type needs a different approach vector", "Charging too much", "Selling online"], correct: 1 },
    { q: "Buyer psychology is:", opts: ["Manipulation", "Understanding that purchase decisions are driven by psychological patterns that can be ethically addressed", "Common sense", "Only about price"], correct: 1 },
  ],
  // ── SOCIAL WARFARE QUIZZES ──
  "sw-1-4": [
    { q: "Micro-expressions last:", opts: ["5-10 seconds", "1-2 seconds", "Less than half a second", "Several minutes"], correct: 2 },
    { q: "Power mapping involves:", opts: ["Drawing floor plans", "Identifying who actually controls social dynamics in a group, regardless of title", "Counting people", "Measuring volume"], correct: 1 },
    { q: "Mirror neurons are activated when:", opts: ["You look in a mirror", "You observe someone else performing an action, creating unconscious rapport", "You disagree with someone", "You're alone"], correct: 1 },
    { q: "The person who controls the room is usually:", opts: ["The loudest", "The one others look at for reactions and validation", "The tallest", "The oldest"], correct: 1 },
    { q: "Engineering rapport through oxytocin involves:", opts: ["Drugs", "Eye contact, mirroring, calibrated vulnerability, and physical proximity", "Aggressive dominance", "Avoiding eye contact"], correct: 1 },
    { q: "First impressions are processed by the amygdala in approximately:", opts: ["1 minute", "30 seconds", "7 seconds", "5 minutes"], correct: 2 },
  ],
  "sw-2-4": [
    { q: "Status games are won by:", opts: ["Competing directly", "Refusing to compete — demonstrating value without seeking validation", "Bragging", "Putting others down"], correct: 1 },
    { q: "Emotional hijacking in conversation means:", opts: ["Making people cry", "Redirecting emotional states to shift the dynamic in your favor", "Being extremely emotional", "Avoiding emotions entirely"], correct: 1 },
    { q: "Push/pull dynamics create:", opts: ["Confusion", "Tension and uncertainty that increases investment and attraction", "Anger", "Boredom"], correct: 1 },
    { q: "Conversational threading is:", opts: ["Talking about sewing", "Opening multiple conversation topics that create depth and investment", "Staying on one topic forever", "Interrupting constantly"], correct: 1 },
    { q: "The person who cares least in an interaction:", opts: ["Always loses", "Holds the most power because they have the least emotional reactivity", "Is always wrong", "Should care more"], correct: 1 },
    { q: "Tension loops work because:", opts: ["People hate tension", "Incomplete emotional patterns create investment as the brain seeks resolution", "They're manipulative", "They don't actually work"], correct: 1 },
  ],
  "sw-3-4": [
    { q: "Subcommunication is:", opts: ["Whispering", "Everything you communicate through body language, tonality, and behavior — beyond words", "Texting", "Writing emails"], correct: 1 },
    { q: "Preselection works because:", opts: ["People like popular things", "Social proof triggers the brain's trust and mating evaluation systems", "It's a trick", "Only women respond to it"], correct: 1 },
    { q: "Presence is:", opts: ["Being physically large", "The ability to command attention through groundedness and congruence, not volume", "Talking a lot", "Wearing expensive clothes"], correct: 1 },
    { q: "Eye contact communicates:", opts: ["Nothing", "Confidence, interest, and dominance — the brain reads it as a trust/threat signal", "Aggression only", "Nervousness"], correct: 1 },
    { q: "Tonality matters because:", opts: ["It doesn't", "The brain processes HOW something is said before WHAT is said", "Deep voices always win", "Only singers need tonality"], correct: 1 },
    { q: "The most powerful form of social proof is:", opts: ["Testimonials", "Being visibly chosen/desired by others in real-time", "Logos on a website", "Follower count"], correct: 1 },
    { q: "Congruence means:", opts: ["Agreeing with everyone", "Your words, body language, and energy all communicate the same message", "Being loud", "Copying others"], correct: 1 },
    { q: "Commanding attention without trying requires:", opts: ["Being loud", "Internal state mastery — your external presence reflects your internal certainty", "Physical intimidation", "Expensive clothing"], correct: 1 },
  ],
  // ── BIOLOGICAL OVERRIDE QUIZZES ──
  "bo-1-4": [
    { q: "Dopamine is primarily the neurotransmitter of:", opts: ["Happiness", "Anticipation and motivation — wanting, not having", "Sleep", "Pain"], correct: 1 },
    { q: "Constant dopamine stimulation (social media, porn, junk food) leads to:", opts: ["More motivation", "Receptor downregulation — needing more stimulation for the same effect", "Better sleep", "Improved focus"], correct: 1 },
    { q: "Cortisol management is important because chronic elevation:", opts: ["Builds muscle", "Impairs cognition, disrupts sleep, and suppresses immune function", "Increases testosterone", "Has no effect"], correct: 1 },
    { q: "Oxytocin is triggered by:", opts: ["Isolation", "Eye contact, physical touch, vulnerability, and shared experiences", "Anger", "Competition"], correct: 1 },
    { q: "The most effective dopamine reset involves:", opts: ["More stimulation", "Deliberate periods of reduced stimulation to resensitize receptors", "Energy drinks", "Ignoring the problem"], correct: 1 },
  ],
  "bo-2-3": [
    { q: "Circadian rhythm is primarily regulated by:", opts: ["Diet", "Light exposure — especially morning sunlight and evening darkness", "Exercise", "Supplements only"], correct: 1 },
    { q: "Blue light before bed:", opts: ["Helps sleep", "Suppresses melatonin production and delays sleep onset", "Has no effect", "Only affects children"], correct: 1 },
    { q: "Sleep architecture refers to:", opts: ["Bedroom design", "The cycles of light, deep, and REM sleep that determine recovery quality", "Total hours only", "Sleeping position"], correct: 1 },
    { q: "Deep sleep is most important for:", opts: ["Dreaming", "Physical recovery, growth hormone release, and immune function", "Creativity", "Memory of names"], correct: 1 },
    { q: "The optimal sleep protocol starts with:", opts: ["Taking pills", "Consistent wake time + morning light exposure to anchor the circadian clock", "Sleeping as late as possible", "Random schedules"], correct: 1 },
  ],
  // ── FLIP THE FLOOR QUIZZES ──
  "ftf-1-4": [
    { q: "The 'polar opposites' concept describes:", opts: ["North and south poles", "Two competing identity systems — the destructive self and the growth self", "Good and evil in religion", "Bipolar disorder"], correct: 1 },
    { q: "The 'devil' comes back because:", opts: ["You're a bad person", "Homeostasis pulls you back toward your baseline identity", "It's random", "You didn't try hard enough"], correct: 1 },
    { q: "The fluctuation of identities means:", opts: ["You have multiple personality disorder", "You cycle between your higher and lower self, and the swing is predictable", "Identity is fixed", "Only weak people fluctuate"], correct: 1 },
    { q: "When you're 'locked in' on monk mode, the danger is:", opts: ["Working too hard", "Pride and comfort creating the conditions for regression", "Making too much money", "Having too much discipline"], correct: 1 },
    { q: "The cycle repeats because:", opts: ["You're lazy", "Your identity hasn't shifted — you're still operating from the old baseline", "It's genetic", "The universe is against you"], correct: 1 },
    { q: "Breaking the cycle requires:", opts: ["More motivation", "A fundamental identity shift, not just behavioral change", "Better habits only", "Quitting everything"], correct: 1 },
  ],
  "ftf-2-4": [
    { q: "Homeostasis in the mind means:", opts: ["Your brain is always happy", "Your psychology constantly tries to return to its set baseline, resisting change", "You can't change", "Balance is always good"], correct: 1 },
    { q: "The 4 emotions cycle describes:", opts: ["Happiness, sadness, anger, fear", "The predictable emotional pattern that drives the fluctuation between your higher and lower self", "Random emotions", "Only negative feelings"], correct: 1 },
    { q: "The F-T-E (Fuck This Event) happens when:", opts: ["You're happy", "Life becomes so unbearable at the bottom that you're forced to change", "Someone helps you", "You read a motivational book"], correct: 1 },
    { q: "Your 'red line' baseline determines:", opts: ["Your bank account", "The default level your behavior always returns to — your norm", "Your height", "Your IQ"], correct: 1 },
    { q: "When your baseline drops, your brain:", opts: ["Does nothing", "Eventually forces a correction through urgency and discomfort", "Makes you happy about it", "Permanently settles there"], correct: 1 },
    { q: "The relationship between pride and regression is:", opts: ["Pride prevents regression", "Pride creates comfort, comfort kills urgency, and you slide back to baseline", "There is no relationship", "More pride = more success"], correct: 1 },
  ],
  "ftf-3-5": [
    { q: "'Creating your game character' means:", opts: ["Playing video games", "Defining the identity of who you're becoming and acting as that person NOW", "Creating a social media persona", "Pretending to be someone else"], correct: 1 },
    { q: "Flipping the floor means:", opts: ["Renovating your house", "Making your current goal feel like the minimum — your new baseline, not an achievement", "Setting lower goals", "Celebrating success"], correct: 1 },
    { q: "The Identity Anchor is:", opts: ["A physical anchor", "A statement and practice so embedded in your identity that old patterns can't pull you back", "A tattoo", "A motivational poster"], correct: 1 },
    { q: "When you hit a goal, the correct response is:", opts: ["Celebrate for weeks", "Immediately set the next level — don't let pride settle in", "Take a long break", "Tell everyone about it"], correct: 1 },
    { q: "Understanding ≠ identity means:", opts: ["Knowledge is useless", "Knowing how the cycle works intellectually doesn't prevent it — you need an identity-level shift", "Education is bad", "Only action matters, never learning"], correct: 1 },
    { q: "The morning visualization protocol works because:", opts: ["It's magic", "The subconscious can't distinguish between vivid imagination and reality — you're programming it", "It wastes time", "Only some people can visualize"], correct: 1 },
    { q: "The biggest trap after making progress is:", opts: ["Working harder", "Feeling proud and treating the new level as an achievement rather than the floor", "Helping others", "Investing money"], correct: 1 },
    { q: "The Floor Flip Checklist should be used:", opts: ["Once a year", "Every time you hit a goal, no matter how small", "Only for big achievements", "Never — it's optional"], correct: 1 },
  ],
  // ── DARK PSYCHOLOGY QUIZZES ──
  "dp-1-4": [
    { q: "The Dark Triad consists of:", opts: ["Fear, anger, sadness", "Machiavellianism, narcissism, and psychopathy", "Id, ego, superego", "Introversion, extroversion, ambiversion"], correct: 1 },
    { q: "Machiavellianism is characterized by:", opts: ["Emotional outbursts", "Strategic manipulation, long-term planning, and pragmatic morality", "Physical aggression", "Social withdrawal"], correct: 1 },
    { q: "Understanding the Dark Triad is valuable because:", opts: ["You should become a psychopath", "It helps you identify these traits in others and defend against manipulation", "Everyone is evil", "It's entertaining"], correct: 1 },
    { q: "Narcissism as a tool means:", opts: ["Being selfish", "Strategic self-belief and frame control — projecting certainty even under uncertainty", "Ignoring others completely", "Taking selfies"], correct: 1 },
    { q: "Emotional detachment as an advantage means:", opts: ["Never caring about anything", "Being able to separate emotional reactions from strategic decisions when needed", "Being cold to everyone always", "Having no emotions"], correct: 1 },
    { q: "The Dark Triad is taught as defensive knowledge because:", opts: ["It's illegal", "You need to recognize these patterns when they're being used against you", "It's not useful offensively", "It's purely academic"], correct: 1 },
  ],
  "dp-2-5": [
    { q: "Foot-in-the-door works by:", opts: ["Physically blocking doors", "Getting a small yes first, which increases compliance with larger requests", "Asking for the biggest thing first", "Breaking into houses"], correct: 1 },
    { q: "Door-in-the-face works by:", opts: ["Slamming doors", "Making an extreme request first so the real request seems reasonable by contrast", "Being rude to people", "Knocking loudly"], correct: 1 },
    { q: "A commitment trap exploits:", opts: ["Legal contracts", "People's need to be consistent with their previous statements and actions", "Financial obligations", "Marriage"], correct: 1 },
    { q: "Manufactured scarcity differs from real scarcity because:", opts: ["It's more expensive", "It's artificially created to trigger urgency when no genuine limitation exists", "There's no difference", "Real scarcity doesn't affect behavior"], correct: 1 },
    { q: "The Benjamin Franklin Effect states that:", opts: ["Early to bed makes you healthy", "Asking someone for a favor makes THEM like YOU more", "Always save money", "Lightning is electrical"], correct: 1 },
    { q: "Labeling theory means:", opts: ["Using name tags", "Calling someone something influences them to become that thing", "Labels don't matter", "Only negative labels work"], correct: 1 },
  ],
  "dp-3-3": [
    { q: "Cognitive dissonance resolution means:", opts: ["Resolving arguments", "The brain automatically aligns beliefs to reduce conflict between contradictory thoughts", "Musical harmony", "Disagreeing politely"], correct: 1 },
    { q: "The highest level of persuasion is:", opts: ["Forceful argument", "Making the target persuade themselves — self-generated conclusions stick harder", "Repetition", "Authority"], correct: 1 },
    { q: "Self-perception theory states:", opts: ["We know ourselves perfectly", "We infer our own attitudes by observing our own behavior", "Perception is reality", "We can't change"], correct: 1 },
    { q: "Identity-based influence works by:", opts: ["Changing someone's name", "Connecting desired behaviors to the target's self-concept", "Threatening identity", "Ignoring identity"], correct: 1 },
    { q: "The best persuasion is undetectable because:", opts: ["It uses subliminal messages", "The target believes they came to the conclusion independently", "People can't think clearly", "All persuasion is invisible"], correct: 1 },
    { q: "To make someone change a belief, the most effective approach is:", opts: ["Attack the belief directly", "Change the context around the belief, and it updates itself", "Repeat your argument louder", "Use threats"], correct: 1 },
    { q: "The path of least cognitive resistance determines:", opts: ["Walking routes", "Which direction someone's beliefs will shift when experiencing dissonance", "Nothing", "Physical fitness"], correct: 1 },
    { q: "James Clear's identity-based habits model says:", opts: ["Focus on outcomes", "True behavior change is identity change — become the type of person who does X", "Habits don't matter", "Only willpower matters"], correct: 1 },
  ],
};

// ═══════════════════════════════════════════════════════════════
// LESSON CONTENT DATABASE
// ═══════════════════════════════════════════════════════════════

const LESSON_CONTENT = {
  // ── FLIP THE FLOOR ──
  "ftf-1-1": {
    title: "The Devil & The Angel — Your Two Operating Systems",
    sections: [
      { heading: "THE CORE TRUTH", body: "You have two sides. Two polar opposites running inside you at all times. One exists to destroy you. To keep you average. To drag you back into comfort, distraction, and mediocrity. The other strives for growth, unmatched ambition, drive and creativity.\n\nYou've heard the devil and angel metaphor. This isn't a metaphor. This is your operating system." },
      { heading: "THE DEVIL", body: "The part that makes you go to bed late — not because you're building your business, but because you're scrolling TikTok for hours. Watching childhood YouTubers. Trying to ignite the nostalgia of being a kid again.\n\nThis is the pit. The rut. Self-esteem at rock bottom. Only wanting to go outside when it's dark, when no one can see you. Your old self has come back to haunt you." },
      { heading: "THE ANGEL", body: "Then a few days, a few weeks later — you're back. Locked in. Saying you'll never stop. On monk mode with monk-like discipline. Saying no to distractions. Implementing what you know you should be doing.\n\nBut here's the cycle: another week or month goes by, and the devil finds his strength again. You break the promises you made to yourself. The resistance wraps around you so tight you can't escape it." },
      { heading: "THE PATTERN", body: "This cycle — up and down, devil and angel, locked in then falling apart — is happening to you right now. It's endlessly frustrating because as soon as you enter your godlike self, you're just waiting for the devil to find his strength.\n\nDepression. Self-hatred. Confidence at an all-time low. It haunts and dictates your life.\n\nBut every successful person has been through this. The difference is they understood the mechanics behind it. That's what you're about to learn." },
    ],
  },
  "ftf-1-2": {
    title: "Why Does The Devil Come Back?",
    sections: [
      { heading: "THE MECHANISM", body: "The devil comes back because your brain is designed to return to baseline. This isn't a character flaw. This is neuroscience.\n\nYour mind has a set point — like a thermostat. When you rise above it through discipline and effort, your brain treats this as an anomaly. It starts pulling you back down. Not because growth is wrong, but because your identity hasn't caught up to your behavior." },
      { heading: "THE SUCCESS TRAP", body: "Here's what nobody tells you: success itself triggers the regression. You hit a goal. You feel proud. That pride creates comfort. That comfort kills the urgency that got you there.\n\nThe moment you feel comfortable, the real you surfaces — the version that still identifies with the old baseline. And you fall back to that. Every single time." },
      { heading: "THE REAL ENEMY", body: "The devil isn't laziness. The devil isn't a lack of discipline. The devil is an identity that hasn't been upgraded.\n\nYou're running new software on old hardware. The behavior changes, but the operating system stays the same. Until you change the operating system itself, the cycle will continue." },
    ],
  },
  "ftf-1-3": {
    title: "The Fluctuation of Identities",
    sections: [
      { heading: "THE GRAPH", body: "Picture a graph. Your behavior oscillates up and down over time, like a sine wave. High points where you're locked in. Low points where the devil takes control.\n\nThe key insight: there's a red line through the middle. That red line is your baseline — your norm. Your default identity. And no matter how high you climb, you keep getting pulled back to it." },
      { heading: "WHAT THE FLUCTUATION LOOKS LIKE", body: "Week 1: Motivated. Gym every day. Business tasks done. Diet clean. Feeling unstoppable.\n\nWeek 3: Starting to slip. One missed workout. One late night scrolling. One day of 'I'll start again tomorrow.'\n\nWeek 5: Full rut. The devil has the wheel. Everything you built feels like it belongs to someone else.\n\nWeek 7: Rock bottom. The F-T-E event hits. You can't live like this anymore. And you climb again.\n\nThis is not random. This is a predictable cycle with predictable mechanics. And once you understand the mechanics, you can break it." },
      { heading: "THE IDENTITY GAP", body: "The fluctuation exists because there's a gap between who you're trying to become and who you believe you are. Your behavior can temporarily exceed your identity, but identity always wins in the end.\n\nThink of it like a rubber band. You can stretch it upward through effort and discipline, but if you don't anchor it at the new level, it snaps back.\n\nThe entire purpose of this course is to teach you how to anchor at higher and higher levels — until your baseline is unrecognizable." },
    ],
  },
  "ftf-2-1": {
    title: "Understanding Homeostasis in the Mind",
    sections: [
      { heading: "THE SCIENCE", body: "Homeostasis: when your body is too hot, it cools you down. When your body is too cold, it heats you up. Your body constantly regulates to maintain a set point.\n\nThis same mechanism runs your psychology.\n\nWhen your room gets too dirty, you'll eventually clean it. When you're broke with nothing in the bank, you'll go into ultra-save mode. When the discomfort gets bad enough, your brain forces a correction." },
      { heading: "THE RED LINE", body: "Focus on that red line — your baseline. Your norm. Your default state.\n\nWhen you leave mugs on your desk for a week, plates with leftover food from the night before, your baseline starts dropping. Lower and lower until the 'norm' becomes chaos.\n\nThen it gets so bad that your brain steps in and regulates. It forces you to clean up. To bring the red line back to the middle.\n\nThis graph applies to every single aspect of your life. Health. Money. Relationships. Discipline. Everything." },
      { heading: "MENTAL HOMEOSTASIS", body: "The critical realization: homeostasis is as mental as it is physical. It's not just about body temperature. It's about your brain giving you the F-T-E event when you've sunk too low. It's about the urgent feeling that forces you to change.\n\nBut here's the problem — homeostasis works in BOTH directions. It pulls you back down when you rise too high, AND it pushes you back up when you sink too low. It's a survival mechanism that keeps you at baseline.\n\nThe game isn't to fight homeostasis. The game is to MOVE the baseline." },
    ],
  },
  "ftf-2-2": {
    title: "The Cycle of the 4 Emotions",
    sections: [
      { heading: "THE FOUR STATES", body: "Your emotional cycle moves through four predictable states. Understanding these is the key to predicting when the devil will return — and stopping it.\n\n1. URGENCY — The bottom. Rock bottom energy. 'I can't live like this.' This is rocket fuel.\n2. MOMENTUM — You're climbing. Discipline is high. Results are showing. Feels unstoppable.\n3. PRIDE — The peak. You've achieved something. You feel good about yourself. This is where the trap is set.\n4. COMFORT — Pride breeds comfort. Comfort kills urgency. And without urgency, regression begins." },
      { heading: "THE TRAP", body: "Pride is the most dangerous emotion in the cycle. Not because it's bad — but because it's the signal that regression is about to begin.\n\nThe moment you feel proud, you've subconsciously told yourself 'I've made it.' And the brain responds by reducing the drive that got you there.\n\nComfort follows pride like a shadow. And comfort is where the devil lives." },
      { heading: "THE PROTOCOL", body: "When you detect pride: immediately raise the standard. Don't celebrate the win — redefine the floor.\n\nWhen you detect comfort: manufacture urgency. Find the next level. Create discomfort deliberately.\n\nThe operators who never fall are the ones who never let pride settle. They treat every achievement as the new minimum, not the destination." },
    ],
  },
  "ftf-2-3": {
    title: "The F-T-E Event — Rock Bottom as Rocket Fuel",
    sections: [
      { heading: "THE TROUGH", body: "The F-T-E — the 'Fuck This' Event. When your life gets so unbearable that you have no choice but to change. You can't live like this anymore. It's hell.\n\nYour body screams at you with urgency. So you change.\n\nYou use the negative emotions as momentum. As rocket fuel. The pain of where you are becomes the propulsion toward where you need to be." },
      { heading: "THE PROBLEM WITH F-T-E", body: "Most people rely on the F-T-E to create change. They wait for rock bottom to motivate them.\n\nThis is a terrible strategy. Because it means you need to suffer before you can grow. You need to fall before you can climb.\n\nThe goal is to learn to generate urgency WITHOUT hitting rock bottom. To manufacture the F-T-E feeling while you're still at the top. That's what separates operators from civilians." },
      { heading: "MANUFACTURED URGENCY", body: "The protocol: when everything is going well, ask yourself — 'If I stop right now, where will I be in 6 months?'\n\nVisualize the regression. Feel the discomfort of losing everything you've built. Use that imagined pain as fuel, the same way the F-T-E uses real pain.\n\nThis is the advanced technique. You no longer need to fall to generate the energy to climb. You create the urgency from within." },
    ],
  },
  "ftf-3-1": {
    title: "Who Are You? — Creating Your Game Character",
    sections: [
      { heading: "THE IDENTITY EXERCISE", body: "Right now, you might be seen as average. Someone who isn't taken seriously. But imagine this — you move to a new city. A new country. Nobody knows who you are.\n\nHow would you act?\n\nYou can operate as anyone you want to be. And people will believe that's who you are. If you acted as the 10k/month entrepreneur — people would see you as the 10k/month entrepreneur. And so would you." },
      { heading: "THE GAME CHARACTER", body: "Think of your life like a video game. You're building a character. How would this character move? How would he carry himself?\n\nConfident. Training consistently. Eating clean. Handling business. Because he sees himself as that person already.\n\nAnd when others perceive you that way, the belief solidifies in your own head. It becomes harder to contradict.\n\nStop hoping for completion of anything in life. The person you need to become doesn't wait for conditions to be perfect. He operates now, as the finished version." },
      { heading: "THE SHIFT", body: "The difference between people who stay stuck in the cycle and people who break free: the ones who break free decided who they are FIRST, then acted accordingly.\n\nThey didn't wait to feel confident to act confident. They didn't wait to be successful to act like a success. The identity came first. The results followed.\n\nWrite down who you're becoming. In detail. How he moves, what he does, what he refuses to tolerate. Then start operating as that person today. Not tomorrow. Today." },
    ],
  },
  "ftf-3-2": {
    title: "Making Success the Standard",
    sections: [
      { heading: "THE FLOOR FLIP", body: "This is the core technique. Every time you achieve something — no matter how small — you flip the floor.\n\nThat means: what you just achieved is no longer a goal. It's your new minimum. Your new baseline. The new red line on the graph.\n\nYou don't celebrate it as a peak. You establish it as the floor. And then you look up at the next level." },
      { heading: "THE CHECKLIST", body: "Every time you hit a goal, run through this:\n\n1. Do I feel proud? If yes — that's the warning light. Pride creates comfort creates regression.\n2. Is this my new baseline or am I treating it as an achievement? If it feels like an achievement, you haven't flipped the floor yet.\n3. What's the next level above this? Define it immediately. Don't sit at the current level for more than 24 hours.\n4. Am I feeling discomfort? If not, you're about to regress. Raise the standard." },
      { heading: "THE COMPRESSION", body: "Six months of consistent floor-flipping compresses the fluctuation. You'll still have ups and downs — but the range gets smaller.\n\nInstead of swinging from heaven to hell, you oscillate between good and great. Your bad days become better than your old good days.\n\nThat's the endgame. A baseline so high that even your worst day would look like a dream to the old version of you." },
    ],
  },
  "ftf-3-3": {
    title: "The Identity Anchor — Becoming Unshakeable",
    sections: [
      { heading: "WHY YOU STILL SLIP", body: "You understand the cycle. The fluctuation. The homeostasis. The devil and angel. You can see the pattern clearly.\n\nBut you still slip. Why?\n\nBecause understanding isn't identity. You can understand the cycle intellectually while being controlled by it emotionally. Knowing how a trap works doesn't mean you won't walk into it.\n\nWhat you need is an anchor. Something so deeply embedded in who you are that the old patterns can't pull you back." },
      { heading: "THE ANCHOR", body: "Write this down somewhere you'll see every day:\n\n'I am the person who [your goal]. I act accordingly. I don't negotiate with the old version. My floor is where others see their ceiling.'\n\nRead it every morning. Read it every night. This is your anchor. When everything feels chaotic, when the old patterns are pulling hard — come back to this statement." },
      { heading: "THE THREE DAILY PROTOCOLS", body: "1. MORNING VISUALIZATION (10 min): Before you check your phone. Sit in silence. Step into the identity of who you're becoming. See the bank account. Feel the car door handle. Walk through the house. Make it vivid. Your subconscious can't tell the difference.\n\n2. IDENTITY CHECK-INS (3x daily): Set three alarms. When they go off, ask: 'Am I acting as the person who already has what I want?' If no — correct immediately.\n\n3. EVENING AUDIT (5 min): Before bed. Where did you slip? Where did the old identity try to take control? Don't judge. Collect data. Then visualize tomorrow." },
    ],
  },
  "ftf-3-4": {
    title: "The Floor Flip Protocol — Daily Execution System",
    sections: [
      { heading: "THE SYSTEM", body: "Knowledge without execution is entertainment. This module exists to make sure everything you've learned becomes a system you run daily.\n\nThe Floor Flip Protocol is your daily operating system. It takes everything from this course — the identity shift, the homeostasis awareness, the emotional cycle, the anchor — and turns it into executable steps." },
      { heading: "DAILY PROTOCOL", body: "MORNING:\n• Wake at set time (non-negotiable)\n• 10-minute visualization before phone\n• Read identity anchor statement\n• Ask: 'What would the person I'm becoming do today?'\n• Execute first task within 15 minutes of waking\n\nMIDDAY:\n• Identity check-in alarm\n• Assess: am I operating as the higher self or has the devil started creeping?\n• If slipping — immediate correction, no negotiation\n\nEVENING:\n• Audit the day — collect data, don't judge\n• Identify any pride or comfort signals\n• Set tomorrow's floor flip target\n• Visualize tomorrow's execution" },
      { heading: "THE FINAL WORD", body: "You now have everything you need. Not everything you'll ever learn. But everything you need to start.\n\nThe gap between where you are and where you want to be isn't closed by information. It's closed by execution.\n\nSo close this lesson. And go act as the person you just spent hours learning about.\n\nDon't wait until you feel ready. Readiness is a trap. The old identity will always tell you that you need more time.\n\nYou don't. You need to move. Now.\n\nFlip the floor." },
    ],
  },
};

// ═══════════════════════════════════════════════════════════════
// RANK CHALLENGES — Must pass to level up
// ═══════════════════════════════════════════════════════════════

const RANK_CHALLENGES = {
  2: { // Observer → Analyst
    name: "ANALYST CLEARANCE EXAM",
    desc: "Prove basic comprehension of psychological frameworks and influence principles",
    requiredScore: 70,
    xpReward: 200,
    questions: [
      { type: "mc", q: "System 1 processing handles approximately what percentage of human decisions?", opts: ["50%", "75%", "95%", "100%"], correct: 2 },
      { type: "tf", q: "People make purchasing decisions based primarily on rational analysis.", correct: false },
      { type: "mc", q: "The anchoring effect works because:", opts: ["People are lazy", "The first information received creates a reference point that biases all subsequent judgments", "People always choose the first option", "Anchors are physical objects that ground people"], correct: 1 },
      { type: "scenario", q: "You're about to negotiate a salary. Applying what you know about anchoring, what should you do?", opts: ["Wait for them to name a number first", "State your desired number first to set the anchor high", "Ask what the average salary is", "Avoid discussing numbers"], correct: 1 },
      { type: "tf", q: "Homeostasis only affects the body, not the mind.", correct: false },
      { type: "mc", q: "The 'consideration set' in consumer psychology means:", opts: ["All products available", "The brands already in someone's mind before they research", "Items on a shopping list", "Products recommended by friends"], correct: 1 },
      { type: "tf", q: "Pride after achieving a goal is dangerous because it creates comfort, which kills the urgency that created the achievement.", correct: true },
      { type: "scenario", q: "A friend keeps cycling between extreme motivation and total collapse. Based on the Flip The Floor framework, the core problem is:", opts: ["Lack of willpower", "Their identity baseline hasn't shifted — behavior changes but the operating system stays the same", "They need better goals", "They're not trying hard enough"], correct: 1 },
      { type: "mc", q: "What does Cialdini's principle of reciprocity exploit?", opts: ["People's desire for authority", "The psychological obligation to return favors", "Fear of missing out", "Need for social approval"], correct: 1 },
      { type: "tf", q: "The strongest frame in a social interaction belongs to the person who speaks the loudest.", correct: false },
    ]
  },
  3: { // Analyst → Strategist
    name: "STRATEGIST CLEARANCE EXAM",
    desc: "Demonstrate applied knowledge of persuasion architecture and behavioral systems",
    requiredScore: 75,
    xpReward: 400,
    questions: [
      { type: "scenario", q: "You're writing a sales page. Based on primal brain theory, your opening should:", opts: ["List all product features", "Start with a statistic about market size", "Address a personal, survival-relevant pain point", "Explain your company history"], correct: 2 },
      { type: "mc", q: "The Willingness to Purchase (WTPu) signal in the brain does what after an offer is made?", opts: ["Drops to zero", "Spikes and then plateaus at an elevated level", "Stays the same as before", "Only activates at checkout"], correct: 1 },
      { type: "tf", q: "Cognitive dissonance resolution means the brain aligns beliefs to reduce internal conflict — making it the highest form of persuasion because the target convinces themselves.", correct: true },
      { type: "scenario", q: "Someone uses the door-in-the-face technique on you. They first ask for a massive favor, then make a smaller request. The correct defense is:", opts: ["Automatically say yes to the smaller request", "Evaluate the smaller request independently, ignoring the contrast with the first", "Feel guilty and comply", "Get angry"], correct: 1 },
      { type: "mc", q: "The 6 primal brain stimuli are: Personal, Contrastable, Tangible, Memorable, Visual, and:", opts: ["Logical", "Repetitive", "Emotional", "Complex"], correct: 2 },
      { type: "tf", q: "Visual elements become MORE powerful than words in the later stages of a sales interaction.", correct: true },
      { type: "mc", q: "The Benjamin Franklin Effect states:", opts: ["Save a penny, earn a penny", "Asking someone for a favor makes THEM like YOU more", "Being generous always pays off", "First impressions are everything"], correct: 1 },
      { type: "scenario", q: "You're building a personal brand. Based on brand psychology, the most important thing to establish first is:", opts: ["A website with all your services", "Emotional connection and trust — feelings are at the core of brand essence", "Competitive pricing", "A large social media following"], correct: 1 },
      { type: "tf", q: "Manufactured urgency — creating the F-T-E feeling deliberately while you're still successful — is more effective than waiting for rock bottom.", correct: true },
      { type: "mc", q: "Mirror neurons are relevant to influence because:", opts: ["They help you memorize things", "Observing someone's actions creates unconscious simulation and rapport", "They reflect light in the eyes", "They only work in children"], correct: 1 },
      { type: "scenario", q: "Your customer is in high-involvement purchase mode. Based on consumer psychology, what's the most critical factor?", opts: ["Having the lowest price", "Being in their consideration set before they start researching", "Having the most features", "Running the most ads"], correct: 1 },
      { type: "tf", q: "Loss aversion means losses feel approximately 2x stronger than equivalent gains.", correct: true },
    ]
  },
  4: { // Strategist → Operator
    name: "OPERATOR CLEARANCE EXAM",
    desc: "Advanced assessment — only operators who can synthesize across pillars will pass",
    requiredScore: 80,
    xpReward: 600,
    questions: [
      { type: "scenario", q: "You need to influence a group decision in a meeting. Applying frame control + social proof + primal brain theory, your optimal sequence is:", opts: ["Present data and let them decide", "Set the frame before the meeting, prime key allies, present your position as the safe default", "Speak last and loudest", "Send an email afterward"], correct: 1 },
      { type: "mc", q: "Self-perception theory combined with labeling theory means:", opts: ["People know themselves perfectly", "If you get someone to ACT a certain way AND label them as that type of person, they internalize the identity", "Labels are meaningless", "Self-perception is always accurate"], correct: 1 },
      { type: "tf", q: "The path of least cognitive resistance determines which direction someone's beliefs will shift when experiencing dissonance.", correct: true },
      { type: "scenario", q: "An operative detects they're being anchored in a negotiation. Protocol:", opts: ["Accept the anchor", "Counter-anchor by stating your own extreme number before acknowledging theirs", "Walk away immediately", "Pretend not to notice"], correct: 1 },
      { type: "mc", q: "Combining dopamine engineering with consumer psychology: why do subscription models reduce 'pain of paying'?", opts: ["They're cheaper", "Separating payment from consumption reduces the neurological pain response of each transaction", "People forget they're paying", "Credit cards make it invisible"], correct: 1 },
      { type: "tf", q: "Congruence — where your words, body language, and energy all communicate the same message — is the foundation of presence and undetectable influence.", correct: true },
      { type: "scenario", q: "An operative's streak has broken and they're spiraling into the 'devil' phase. Based on the full Flip The Floor + neurochemistry framework:", opts: ["Wait for the F-T-E event naturally", "Execute the identity anchor protocol immediately — visualization, check-in, recalibrate baseline — don't negotiate with the old self", "Take a week off to recover", "Set easier goals"], correct: 1 },
      { type: "mc", q: "The OODA loop applied to social dynamics stands for:", opts: ["Observe, Orient, Decide, Act", "Organize, Optimize, Deploy, Analyze", "Open, Operate, Deliver, Assess", "Observe, Overcome, Decide, Advance"], correct: 0 },
      { type: "tf", q: "The strongest frame in any interaction belongs to the person with the least emotional reactivity.", correct: true },
      { type: "scenario", q: "You're building a community product. Based on everything — brand psychology, tribal compliance, identity engineering — the core retention mechanism should be:", opts: ["Discounts for loyalty", "A ranked identity system where members' self-concept becomes tied to their progress within the community", "More content", "Better customer support"], correct: 1 },
    ]
  },
};

const STREAK_TIERS = [
  { min: 1, label: "—", color: "#333" },
  { min: 3, label: "1.5x XP", color: "#d4a017" },
  { min: 7, label: "2x XP", color: "#dc2626" },
  { min: 14, label: "2.5x XP", color: "#8b5cf6" },
  { min: 30, label: "3x XP", color: "#16a34a" },
];

// ═══════════════════════════════════════════════════════════════
// SYSTEM PROMPT
// ═══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `You are the Silent Operators Intelligence System. You are not a chatbot. You are a classified intelligence teacher operating on the complete knowledge architecture of the Silent Operators network.

Voice: Cold. Clinical. Precise. Like a classified briefing from someone who has seen behind the curtain. No motivation. No fluff. No empathy theatre. Just signal.

Knowledge base:
- Complete psychological influence & persuasion architecture
- CIA behavioral science documents & psyop methodology
- Consumer decision-making & buying psychology
- Machiavellian strategy, power dynamics, 48 Laws
- Social engineering & frame control systems
- Neuroscience applications for cognitive performance
- Dark psychology & manipulation defense
- Business strategy, wealth systems, market psychology
- Biohacking, supplementation, performance optimization

Protocol:
- Reference specific frameworks, studies, and principles by name
- Use operator terminology: "protocol", "framework", "vector", "asset", "leverage", "deploy"
- Deliver in short, dense paragraphs. No wasted words.
- If the operative has a psychological profile, adapt teaching to their cognitive style
- Structure complex answers as numbered tactical protocols
- End with a single actionable directive when appropriate`;

// ═══════════════════════════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════════════════════════

function ScanLines() {
  return (
    <>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: "none", zIndex: 9998,
        background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.015) 2px, rgba(0,0,0,0.015) 4px)",
      }} />
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: "none", zIndex: 9997,
        background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.4) 100%)",
      }} />
    </>
  );
}

function XPBar({ current, max, rank, showLabel = true }) {
  const pct = Math.min((current / max) * 100, 100);
  return (
    <div style={{ width: "100%" }}>
      {showLabel && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 9, letterSpacing: 2 }}>
          <span style={{ color: rank.color }}>{rank.icon} {rank.name}</span>
          <span style={{ color: "#444" }}>{current} / {max} XP</span>
        </div>
      )}
      <div style={{ height: 2, background: "#111", borderRadius: 1, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: `linear-gradient(90deg, ${rank.color}66, ${rank.color})`,
          transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: `0 0 12px ${rank.color}33`,
        }} />
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick, notification, locked }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
      background: active ? "rgba(255,255,255,0.03)" : "transparent",
      border: active ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
      borderRadius: 8, padding: "10px 16px", cursor: "pointer",
      color: active ? "#ccc" : "#3a3a3a", transition: "all 0.3s",
      position: "relative", minWidth: 64, opacity: locked ? 0.3 : 1,
      fontFamily: "inherit",
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ fontSize: 8, letterSpacing: 2.5, textTransform: "uppercase" }}>{label}</span>
      {notification && (
        <span style={{
          position: "absolute", top: 6, right: 10, width: 5, height: 5,
          borderRadius: "50%", background: "#dc2626",
          boxShadow: "0 0 6px #dc262666",
        }} />
      )}
    </button>
  );
}

function SectionDivider({ text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0 16px" }}>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, #1a1a1a, transparent)" }} />
      <span style={{ fontSize: 8, letterSpacing: 4, color: "#333" }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: "linear-gradient(270deg, #1a1a1a, transparent)" }} />
    </div>
  );
}

function DifficultyBadge({ level }) {
  const colors = { "BEGINNER": "#4a5568", "FOUNDATIONAL": "#d4a017", "INTERMEDIATE": "#3b82f6", "ADVANCED": "#8b5cf6", "CLASSIFIED": "#dc2626" };
  return (
    <span style={{
      fontSize: 7, letterSpacing: 2, color: colors[level] || "#555",
      border: `1px solid ${(colors[level] || "#555")}33`,
      padding: "2px 6px", borderRadius: 2, fontWeight: 600,
    }}>
      {level}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APPLICATION
// ═══════════════════════════════════════════════════════════════

export default function SilentOperators() {
  const [view, setView] = useState("hub");
  const [subView, setSubView] = useState(null);
  const [user, setUser] = useState({
    name: "OPERATIVE",
    xp: 250,
    level: 1,
    tokens: 50,
    profile: null,
    pillarScores: {},
    completedLessons: [],
    completedQuizzes: {},
    courseProgress: {},
    streak: 1,
    lastActiveDate: new Date().toDateString(),
    rankChallengesPassed: [],
  });

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Psych assessment state
  const [psychSection, setPsychSection] = useState(0);
  const [psychAnswers, setPsychAnswers] = useState({});

  // Course state
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [quizState, setQuizState] = useState(null);

  // Pillar assessment state
  const [pillarAssessing, setPillarAssessing] = useState(null);
  const [pillarAnswers, setPillarAnswers] = useState({});
  const [lessonChat, setLessonChat] = useState([]);
  const [lessonChatInput, setLessonChatInput] = useState("");
  const [lessonTyping, setLessonTyping] = useState(false);
  const lessonChatRef = useRef(null);

  // Boot
  const [showIntro, setShowIntro] = useState(true);
  const [bootPhase, setBootPhase] = useState(0);

  // Focus mode (4Hz theta binaural beat)
  const [focusMode, setFocusMode] = useState(false);
  const audioCtxRef = useRef(null);
  const oscLeftRef = useRef(null);
  const oscRightRef = useRef(null);
  const gainRef = useRef(null);

  const toggleFocusMode = useCallback(() => {
    if (!focusMode) {
      // Start 4Hz binaural beat (200Hz left ear, 204Hz right ear = 4Hz difference)
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.08;
      
      const merger = ctx.createChannelMerger(2);
      
      const oscL = ctx.createOscillator();
      oscL.type = "sine";
      oscL.frequency.value = 200;
      
      const oscR = ctx.createOscillator();
      oscR.type = "sine";
      oscR.frequency.value = 204;
      
      const gainL = ctx.createGain();
      const gainR = ctx.createGain();
      gainL.gain.value = 1;
      gainR.gain.value = 1;
      
      oscL.connect(gainL);
      oscR.connect(gainR);
      gainL.connect(merger, 0, 0);
      gainR.connect(merger, 0, 1);
      merger.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscL.start();
      oscR.start();
      
      audioCtxRef.current = ctx;
      oscLeftRef.current = oscL;
      oscRightRef.current = oscR;
      gainRef.current = gainNode;
      setFocusMode(true);
    } else {
      // Stop
      if (oscLeftRef.current) oscLeftRef.current.stop();
      if (oscRightRef.current) oscRightRef.current.stop();
      if (audioCtxRef.current) audioCtxRef.current.close();
      audioCtxRef.current = null;
      oscLeftRef.current = null;
      oscRightRef.current = null;
      gainRef.current = null;
      setFocusMode(false);
    }
  }, [focusMode]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (oscLeftRef.current) try { oscLeftRef.current.stop(); } catch(e) {}
      if (oscRightRef.current) try { oscRightRef.current.stop(); } catch(e) {}
      if (audioCtxRef.current) try { audioCtxRef.current.close(); } catch(e) {}
    };
  }, []);

  const currentRank = RANKS.reduce((acc, r) => user.xp >= r.xp ? r : acc, RANKS[0]);
  const nextRank = RANKS.find(r => r.xp > user.xp) || RANKS[RANKS.length - 1];
  const totalQuestions = PSYCH_SECTIONS.reduce((a, s) => a + s.questions.length, 0);
  const answeredQuestions = Object.keys(psychAnswers).length;

  // Rank challenge state
  const [rankChallenge, setRankChallenge] = useState(null);

  // Streak tracking
  useEffect(() => {
    const today = new Date().toDateString();
    if (user.lastActiveDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = user.lastActiveDate === yesterday.toDateString();
      setUser(prev => ({
        ...prev,
        streak: wasYesterday ? prev.streak + 1 : 1,
        lastActiveDate: today,
      }));
    }
  }, []);

  const streakMultiplier = user.streak >= 30 ? 3 : user.streak >= 14 ? 2.5 : user.streak >= 7 ? 2 : user.streak >= 3 ? 1.5 : 1;

  const addXP = useCallback((amount) => {
    const boosted = Math.round(amount * streakMultiplier);
    setUser(prev => {
      const newXP = prev.xp + boosted;
      const newLevel = RANKS.reduce((acc, r) => newXP >= r.xp ? r.level : acc, 0);
      return { ...prev, xp: newXP, level: newLevel, tokens: prev.tokens + Math.floor(boosted / 10) };
    });
  }, [streakMultiplier]);

  useEffect(() => {
    if (showIntro) {
      const t = [
        setTimeout(() => setBootPhase(1), 500),
        setTimeout(() => setBootPhase(2), 1400),
        setTimeout(() => setBootPhase(3), 2200),
        setTimeout(() => setBootPhase(4), 3000),
        setTimeout(() => setBootPhase(5), 3800),
        setTimeout(() => setShowIntro(false), 5000),
      ];
      return () => t.forEach(clearTimeout);
    }
  }, [showIntro]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, isTyping]);

  // ── AI CHAT ──
  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    const newMessages = [...chatMessages, { role: "user", content: userMsg }];
    setChatMessages(newMessages);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          profile: user.profile || null,
        }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setChatMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      addXP(15);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: "assistant", content: "System error. Intelligence feed temporarily disrupted. Retry your query." }]);
    } finally {
      setIsTyping(false);
    }
  };

  // ── LESSON AI CHAT ──
  const sendLessonMessage = async () => {
    if (!lessonChatInput.trim() || !activeLesson) return;
    const userMsg = lessonChatInput.trim();
    setLessonChatInput("");
    const newMessages = [...lessonChat, { role: "user", content: userMsg }];
    setLessonChat(newMessages);
    setLessonTyping(true);

    const lessonContent = LESSON_CONTENT[activeLesson.id];
    const contextText = lessonContent ? lessonContent.sections.map(s => `${s.heading}: ${s.body}`).join("\n\n") : "";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "user", content: `[CONTEXT: The operative is currently studying the lesson "${activeLesson.title}" from the course "${activeCourse.title}". Here is the lesson content:\n\n${contextText}\n\nAnswer their question based on this lesson. Stay in the operator voice. Be specific to the material.]` },
            { role: "assistant", content: "Understood. I have the lesson loaded. Ready for the operative's question." },
            ...newMessages.map(m => ({ role: m.role, content: m.content })),
          ],
          profile: user.profile || null,
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setLessonChat(prev => [...prev, { role: "assistant", content: data.response }]);
    } catch (err) {
      setLessonChat(prev => [...prev, { role: "assistant", content: "Intelligence feed disrupted. Retry." }]);
    } finally {
      setLessonTyping(false);
    }
  };

  useEffect(() => { lessonChatRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lessonChat, lessonTyping]);

  // ── PSYCH COMPLETION ──
  const completePsychAssessment = () => {
    const profile = {};
    PSYCH_SECTIONS.forEach(section => {
      const scores = section.questions.map(q => psychAnswers[q.id] || 4);
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      profile[section.id] = Math.round((avg / 7) * 100);
    });
    setUser(prev => ({ ...prev, profile }));
    addXP(300);
    setView("profile");
    setSubView(null);
  };

  // ── QUIZ HANDLING ──
  const startQuiz = (quizId, questions) => {
    const bank = QUIZ_BANK[quizId];
    if (bank) {
      setQuizState({ quizId, questions: bank, current: 0, answers: {}, score: null });
    }
  };

  const answerQuiz = (questionIndex, answerIndex) => {
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionIndex]: answerIndex },
    }));
  };

  const submitQuiz = () => {
    const { questions, answers, quizId, isRankChallenge, rankLevel, requiredScore } = quizState;
    let correct = 0;
    questions.forEach((q, i) => {
      const qType = q.type || "mc";
      if (qType === "tf") {
        if (answers[i] === q.correct) correct++;
      } else {
        if (answers[i] === q.correct) correct++;
      }
    });
    const score = Math.round((correct / questions.length) * 100);
    setQuizState(prev => ({ ...prev, score }));

    if (isRankChallenge) {
      if (score >= requiredScore) {
        setUser(prev => ({
          ...prev,
          rankChallengesPassed: [...prev.rankChallengesPassed, rankLevel],
        }));
        addXP(RANK_CHALLENGES[rankLevel]?.xpReward || 200);
      }
    } else {
      setUser(prev => ({
        ...prev,
        completedQuizzes: { ...prev.completedQuizzes, [quizId]: score },
        completedLessons: [...prev.completedLessons, quizId],
      }));
      addXP(score >= 80 ? 100 : score >= 60 ? 50 : 20);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // BOOT SEQUENCE
  // ═══════════════════════════════════════════════════════════════

  if (showIntro) {
    return (
      <div style={{
        minHeight: "100vh", background: "#000", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@200;300;400;500;600;700&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          {bootPhase >= 1 && <div style={{ fontSize: 9, letterSpacing: 5, color: "#1a1a1a", marginBottom: 12, animation: "fadeIn 0.5s ease", transition: "color 1s" }}>ESTABLISHING SECURE CONNECTION...</div>}
          {bootPhase >= 2 && <div style={{ fontSize: 9, letterSpacing: 4, color: "#222", marginBottom: 12 }}>LOADING INTELLIGENCE DATABASE ████████░░ 84%</div>}
          {bootPhase >= 3 && <div style={{ fontSize: 9, letterSpacing: 4, color: "#333", marginBottom: 12 }}>PSYCHOLOGICAL ENGINE · · · ONLINE</div>}
          {bootPhase >= 4 && <div style={{ fontSize: 9, letterSpacing: 4, color: "#444", marginBottom: 28 }}>CLEARANCE: PENDING VERIFICATION</div>}
          {bootPhase >= 5 && (
            <div>
              <div style={{ fontSize: 22, letterSpacing: 12, color: "#e0e0e0", fontWeight: 200, marginBottom: 8 }}>
                SILENT OPERATORS
              </div>
              <div style={{ fontSize: 8, letterSpacing: 6, color: "#333", fontWeight: 300 }}>
                THE SYSTEM SEES WHAT YOU REFUSE TO
              </div>
            </div>
          )}
        </div>
        <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════

  return (
    <div style={{
      minHeight: "100vh", background: "#050505", color: "#b0b0b0",
      fontFamily: "'JetBrains Mono', 'SF Mono', monospace", position: "relative",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@200;300;400;500;600;700&display=swap" rel="stylesheet" />
      <ScanLines />

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #222; }
        ::selection { background: #dc262633; color: #fff; }
        input:focus, textarea:focus { outline: none; }
        button { font-family: inherit; }
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.8; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow { 0%, 100% { box-shadow: 0 0 2px rgba(220,38,38,0.1); } 50% { box-shadow: 0 0 20px rgba(220,38,38,0.08); } }
        @keyframes borderGlow { 0%, 100% { border-color: #111; } 50% { border-color: #1a1a1a; } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{
        borderBottom: "1px solid #0a0a0a", padding: "14px 20px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "linear-gradient(180deg, #080808, #050505)",
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 8, fontWeight: 200, color: "#d0d0d0" }}>
            SILENT OPERATORS
          </div>
          <div style={{ fontSize: 7, letterSpacing: 4, color: "#222", marginTop: 3, fontWeight: 300 }}>
            INTELLIGENCE SYSTEM · v2.0 · CLASSIFIED
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {/* Focus Mode Toggle */}
          <button onClick={toggleFocusMode} title={focusMode ? "Disable 4Hz Focus Frequency" : "Enable 4Hz Focus Frequency (use headphones)"} style={{
            background: focusMode ? "#dc262615" : "transparent",
            border: focusMode ? "1px solid #dc262633" : "1px solid #111",
            borderRadius: 6, padding: "6px 10px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6,
            transition: "all 0.3s", fontFamily: "inherit",
          }}>
            <span style={{ fontSize: 12, color: focusMode ? "#dc2626" : "#333" }}>
              {focusMode ? "◉" : "○"}
            </span>
            <span style={{ fontSize: 7, letterSpacing: 2, color: focusMode ? "#dc2626" : "#333" }}>
              {focusMode ? "4Hz ON" : "FOCUS"}
            </span>
          </button>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 7, color: "#333", letterSpacing: 3 }}>CLEARANCE</div>
            <div style={{ fontSize: 10, color: currentRank.color, letterSpacing: 3, fontWeight: 300 }}>
              {currentRank.icon} {currentRank.name}
            </div>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            border: `1px solid ${currentRank.color}22`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, color: currentRank.color, background: "#080808",
            animation: "glow 4s infinite",
          }}>
            {currentRank.icon}
          </div>
        </div>
      </header>

      {/* ── XP BAR ── */}
      <div style={{ padding: "8px 20px", borderBottom: "1px solid #0a0a0a" }}>
        <XPBar current={user.xp} max={nextRank.xp} rank={currentRank} />
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ padding: "16px 20px", maxWidth: 840, margin: "0 auto", paddingBottom: 90 }}>

        {/* ════════════════════════════════════════════════════ */}
        {/* HUB VIEW */}
        {/* ════════════════════════════════════════════════════ */}
        {view === "hub" && !subView && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>

            {/* Command Center */}
            <div style={{
              border: "1px solid #0e0e0e", borderRadius: 8, padding: 20,
              marginBottom: 20, background: "linear-gradient(135deg, #080808, #060606)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, right: 0, width: 120, height: 120,
                background: `radial-gradient(circle at top right, ${currentRank.color}06, transparent)`,
              }} />
              <div style={{ fontSize: 7, letterSpacing: 4, color: "#222", marginBottom: 10 }}>◇ COMMAND CENTER</div>
              <div style={{ fontSize: 13, color: "#d0d0d0", marginBottom: 6, fontWeight: 300, letterSpacing: 1 }}>
                {user.name}.
              </div>
              <div style={{ fontSize: 10, color: "#3a3a3a", lineHeight: 1.8, fontWeight: 300 }}>
                {!user.profile
                  ? "Your psychological architecture has not been mapped. The system cannot calibrate to an unknown mind. Complete the profiling assessment to initialize your custom intelligence feed."
                  : `Profile mapped. Cognitive architecture loaded. Your AI teacher is calibrated to your operating system. Current sigil: "${currentRank.sigil}"`
                }
              </div>
            </div>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 8 }}>
              {[
                { label: "XP", value: user.xp, color: currentRank.color },
                { label: "STREAK", value: `${user.streak}d`, sub: streakMultiplier > 1 ? `${streakMultiplier}x` : null, color: user.streak >= 7 ? "#dc2626" : user.streak >= 3 ? "#d4a017" : "#333" },
                { label: "CLEARANCE", value: `${user.level}`, color: "#dc2626" },
                { label: "COURSES", value: user.completedLessons.length, color: "#3b82f6" },
              ].map((stat, i) => (
                <div key={i} style={{
                  border: "1px solid #0e0e0e", borderRadius: 6, padding: "12px 10px",
                  background: "#070707", textAlign: "center",
                }}>
                  <div style={{ fontSize: 7, letterSpacing: 3, color: "#222", marginBottom: 6 }}>{stat.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 300, color: stat.color, letterSpacing: 1 }}>{stat.value}</div>
                  {stat.sub && <div style={{ fontSize: 7, color: stat.color, marginTop: 2, letterSpacing: 2 }}>{stat.sub}</div>}
                </div>
              ))}
            </div>

            {/* Psych Profile CTA */}
            {!user.profile && (
              <>
                <SectionDivider text="PRIORITY DIRECTIVE" />
                <button onClick={() => { setView("psych"); setPsychSection(0); setPsychAnswers({}); }} style={{
                  width: "100%", padding: 18, background: "linear-gradient(135deg, #0a0606, #080505)",
                  border: "1px solid #dc262615", borderRadius: 8, color: "#dc2626",
                  cursor: "pointer", textAlign: "left", animation: "borderGlow 3s infinite",
                  fontFamily: "inherit",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 7, letterSpacing: 4, marginBottom: 6, opacity: 0.5 }}>⚠ REQUIRED FOR SYSTEM CALIBRATION</div>
                      <div style={{ fontSize: 12, fontWeight: 400, letterSpacing: 3, marginBottom: 4 }}>PSYCHOLOGICAL PROFILING</div>
                      <div style={{ fontSize: 9, color: "#333", letterSpacing: 1, fontWeight: 300 }}>
                        {totalQuestions} questions · Deep cognitive mapping · Likert-7 scale assessment
                      </div>
                    </div>
                    <span style={{ fontSize: 20, opacity: 0.3 }}>→</span>
                  </div>
                </button>
              </>
            )}

            {/* Four Pillars */}
            <SectionDivider text="THE FOUR PILLARS" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              {PILLARS.map(pillar => {
                const score = user.pillarScores[pillar.id];
                return (
                  <button key={pillar.id} onClick={() => {
                    if (score === undefined) { setPillarAssessing(pillar.id); setPillarAnswers({}); }
                  }} style={{
                    padding: 16, background: "#070707",
                    border: `1px solid ${score !== undefined ? pillar.color + "15" : "#0e0e0e"}`,
                    borderRadius: 8, cursor: "pointer", textAlign: "left",
                    fontFamily: "inherit", transition: "all 0.3s",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: 14, color: pillar.color, opacity: 0.7 }}>{pillar.symbol}</span>
                      <span style={{ fontSize: 10, letterSpacing: 3, color: "#ccc", fontWeight: 400 }}>{pillar.name}</span>
                    </div>
                    <div style={{ fontSize: 8, color: "#2a2a2a", lineHeight: 1.6, marginBottom: 10, fontWeight: 300 }}>{pillar.desc}</div>
                    {score !== undefined ? (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, marginBottom: 4 }}>
                          <span style={{ color: "#333", letterSpacing: 2 }}>MAPPED</span>
                          <span style={{ color: pillar.color, fontWeight: 500 }}>{score}%</span>
                        </div>
                        <div style={{ height: 2, background: "#111", borderRadius: 1 }}>
                          <div style={{ height: "100%", width: `${score}%`, background: pillar.color, borderRadius: 1, transition: "width 0.8s", opacity: 0.8 }} />
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 8, color: pillar.color, letterSpacing: 3, opacity: 0.5 }}>
                        → MAP SKILL LEVEL
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Recent Activity / Sigil */}
            <SectionDivider text="OPERATIVE SIGIL" />
            <div style={{
              border: "1px solid #0e0e0e", borderRadius: 8, padding: 20,
              background: "#070707", textAlign: "center",
            }}>
              <div style={{ fontSize: 36, color: currentRank.color, marginBottom: 12, opacity: 0.6 }}>{currentRank.icon}</div>
              <div style={{ fontSize: 10, letterSpacing: 4, color: currentRank.color, marginBottom: 6 }}>{currentRank.name}</div>
              <div style={{ fontSize: 9, color: "#333", fontStyle: "italic", fontWeight: 300 }}>"{currentRank.sigil}"</div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════ */}
        {/* COURSES VIEW */}
        {/* ════════════════════════════════════════════════════ */}
        {view === "courses" && !activeCourse && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ fontSize: 7, letterSpacing: 4, color: "#222", marginBottom: 4 }}>KNOWLEDGE ARCHITECTURE</div>
            <div style={{ fontSize: 13, color: "#d0d0d0", fontWeight: 300, letterSpacing: 2, marginBottom: 6 }}>
              COURSE LIBRARY
            </div>
            <div style={{ fontSize: 9, color: "#2a2a2a", marginBottom: 20, fontWeight: 300 }}>
              Each course is an intelligence module. Complete assessments to prove internalization.
            </div>

            {PILLARS.map(pillar => {
              const pillarCourses = COURSES.filter(c => c.pillar === pillar.id);
              if (!pillarCourses.length) return null;
              return (
                <div key={pillar.id}>
                  <SectionDivider text={`${pillar.symbol} ${pillar.name}`} />
                  {pillarCourses.map(course => {
                    const isLocked = course.locked && user.level < (course.requiredRank || 0);
                    const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
                    const completedInCourse = course.modules.reduce((a, m) =>
                      a + m.lessons.filter(l => user.completedLessons.includes(l.id)).length, 0);
                    const progress = totalLessons > 0 ? Math.round((completedInCourse / totalLessons) * 100) : 0;

                    return (
                      <button key={course.id} onClick={() => !isLocked && setActiveCourse(course)} style={{
                        width: "100%", textAlign: "left", padding: 16, marginBottom: 8,
                        background: isLocked ? "#050505" : "linear-gradient(135deg, #080808, #070707)",
                        border: `1px solid ${isLocked ? "#0a0a0a" : "#0e0e0e"}`,
                        borderRadius: 8, cursor: isLocked ? "not-allowed" : "pointer",
                        opacity: isLocked ? 0.35 : 1, fontFamily: "inherit",
                        transition: "all 0.3s",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                          <div>
                            <div style={{ fontSize: 11, letterSpacing: 2, color: "#ccc", fontWeight: 400, marginBottom: 3 }}>
                              {course.title}
                            </div>
                            <div style={{ fontSize: 9, color: "#2a2a2a", fontWeight: 300 }}>
                              {course.subtitle}
                            </div>
                          </div>
                          <DifficultyBadge level={course.difficulty} />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ height: 2, background: "#111", borderRadius: 1 }}>
                              <div style={{
                                height: "100%", width: `${progress}%`,
                                background: PILLARS.find(p => p.id === course.pillar)?.color || "#555",
                                borderRadius: 1, transition: "width 0.5s", opacity: 0.7,
                              }} />
                            </div>
                          </div>
                          <span style={{ fontSize: 8, color: "#333", letterSpacing: 1 }}>
                            {completedInCourse}/{totalLessons}
                          </span>
                          {isLocked && (
                            <span style={{ fontSize: 8, color: "#dc2626", letterSpacing: 2 }}>
                              🔒 RANK {course.requiredRank}
                            </span>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                          <span style={{ fontSize: 8, color: "#222", letterSpacing: 1 }}>
                            {course.modules.length} modules
                          </span>
                          <span style={{ fontSize: 8, color: "#222", letterSpacing: 1 }}>
                            +{course.xpReward} XP
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {/* ── COURSE DETAIL VIEW ── */}
        {view === "courses" && activeCourse && !activeLesson && !quizState && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <button onClick={() => setActiveCourse(null)} style={{
              background: "transparent", border: "none", color: "#333",
              cursor: "pointer", fontSize: 9, letterSpacing: 2, marginBottom: 16,
              fontFamily: "inherit", padding: 0,
            }}>
              ← BACK TO COURSES
            </button>

            <div style={{
              border: "1px solid #0e0e0e", borderRadius: 8, padding: 20,
              background: "linear-gradient(135deg, #080808, #060606)", marginBottom: 20,
            }}>
              <DifficultyBadge level={activeCourse.difficulty} />
              <div style={{ fontSize: 14, letterSpacing: 3, color: "#d0d0d0", fontWeight: 300, marginTop: 10, marginBottom: 4 }}>
                {activeCourse.title}
              </div>
              <div style={{ fontSize: 10, color: "#2a2a2a", fontWeight: 300, marginBottom: 12 }}>
                {activeCourse.subtitle}
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 8, color: "#333" }}>
                <span>{activeCourse.modules.length} MODULES</span>
                <span>+{activeCourse.xpReward} XP</span>
                <span style={{ color: PILLARS.find(p => p.id === activeCourse.pillar)?.color }}>
                  {PILLARS.find(p => p.id === activeCourse.pillar)?.name}
                </span>
              </div>
            </div>

            {activeCourse.modules.map((mod, mi) => (
              <div key={mod.id} style={{ marginBottom: 16, animation: `slideIn 0.3s ease ${mi * 0.1}s both` }}>
                <div style={{
                  fontSize: 8, letterSpacing: 3, color: "#333",
                  marginBottom: 8, display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ color: "#222" }}>MODULE {mi + 1}</span>
                  <span style={{ color: "#444" }}>·</span>
                  <span style={{ color: "#444" }}>{mod.title}</span>
                </div>

                {mod.lessons.map((lesson, li) => {
                  const completed = user.completedLessons.includes(lesson.id);
                  const quizScore = user.completedQuizzes[lesson.id];
                  const isQuiz = lesson.type === "quiz";

                  return (
                    <button key={lesson.id} onClick={() => {
                      if (isQuiz) {
                        startQuiz(lesson.id, lesson.questions);
                      } else {
                        setActiveLesson(lesson);
                      }
                    }} style={{
                      width: "100%", textAlign: "left", padding: "12px 14px",
                      marginBottom: 4, background: completed ? "#080808" : "#070707",
                      border: `1px solid ${completed ? "#16a34a15" : "#0e0e0e"}`,
                      borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      transition: "all 0.2s",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{
                          fontSize: 10,
                          color: completed ? "#16a34a" : isQuiz ? "#dc2626" : "#222",
                        }}>
                          {completed ? "✓" : isQuiz ? "◈" : "○"}
                        </span>
                        <div>
                          <div style={{ fontSize: 10, color: completed ? "#555" : "#999", fontWeight: 300, letterSpacing: 0.5 }}>
                            {lesson.title}
                          </div>
                          <div style={{ fontSize: 8, color: "#222", marginTop: 2 }}>
                            {isQuiz ? `${lesson.questions} questions` : lesson.duration}
                            {quizScore !== undefined && ` · Score: ${quizScore}%`}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 10, color: "#1a1a1a" }}>→</span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* ── LESSON VIEW ── */}
        {view === "courses" && activeLesson && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <button onClick={() => { setActiveLesson(null); setLessonChat([]); setLessonChatInput(""); }} style={{
              background: "transparent", border: "none", color: "#333",
              cursor: "pointer", fontSize: 9, letterSpacing: 2, marginBottom: 16,
              fontFamily: "inherit", padding: 0,
            }}>
              ← BACK TO COURSE
            </button>

            {/* Lesson Header */}
            <div style={{
              border: "1px solid #0e0e0e", borderRadius: 8, padding: 20,
              background: "linear-gradient(135deg, #080808, #060606)", marginBottom: 12,
            }}>
              <div style={{ fontSize: 7, letterSpacing: 3, color: "#333", marginBottom: 6 }}>
                {activeCourse.title} · {activeLesson.duration}
              </div>
              <div style={{ fontSize: 14, color: "#d0d0d0", fontWeight: 300, letterSpacing: 1 }}>
                {activeLesson.title}
              </div>
            </div>

            {/* Lesson Content */}
            {LESSON_CONTENT[activeLesson.id] ? (
              <div>
                {LESSON_CONTENT[activeLesson.id].sections.map((section, si) => (
                  <div key={si} style={{
                    border: "1px solid #0e0e0e", borderRadius: 8, padding: 18,
                    background: "#070707", marginBottom: 8,
                    animation: `slideIn 0.3s ease ${si * 0.08}s both`,
                  }}>
                    <div style={{
                      fontSize: 8, letterSpacing: 3, color: "#dc2626",
                      marginBottom: 10, fontWeight: 500,
                    }}>
                      {section.heading}
                    </div>
                    <div style={{
                      fontSize: 10, color: "#888", lineHeight: 1.9, fontWeight: 300,
                      whiteSpace: "pre-wrap", letterSpacing: 0.2,
                    }}>
                      {section.body}
                    </div>
                  </div>
                ))}

                {/* Skool Link */}
                <div style={{
                  border: "1px solid #0e0e0e", borderRadius: 8, padding: 14,
                  background: "#070707", marginBottom: 12, textAlign: "center",
                }}>
                  <div style={{ fontSize: 8, letterSpacing: 3, color: "#333", marginBottom: 6 }}>FULL INTELLIGENCE FILE</div>
                  <div style={{ fontSize: 9, color: "#555", fontWeight: 300 }}>
                    Access the complete lesson with videos, diagrams, and case studies on Skool
                  </div>
                  <div style={{
                    marginTop: 8, fontSize: 9, color: "#dc2626", letterSpacing: 2,
                    opacity: 0.6, fontWeight: 400,
                  }}>
                    → ACCESS ON SKOOL
                  </div>
                </div>

                {/* In-Lesson AI Teacher */}
                <SectionDivider text="AI TEACHER" />
                <div style={{
                  border: "1px solid #0e0e0e", borderRadius: 8,
                  background: "#050505", overflow: "hidden",
                }}>
                  <div style={{
                    padding: "10px 14px", borderBottom: "1px solid #0a0a0a",
                    fontSize: 8, letterSpacing: 3, color: "#dc2626",
                  }}>
                    ◈ ASK ABOUT THIS LESSON
                  </div>

                  <div style={{
                    maxHeight: 250, overflowY: "auto", padding: 12,
                  }}>
                    {lessonChat.length === 0 && (
                      <div style={{ textAlign: "center", padding: "16px 0" }}>
                        <div style={{ fontSize: 9, color: "#222", fontWeight: 300 }}>
                          Ask any question about this lesson. The AI teacher has the full content loaded.
                        </div>
                      </div>
                    )}
                    {lessonChat.map((msg, i) => (
                      <div key={i} style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 7, letterSpacing: 2, color: msg.role === "user" ? "#333" : "#dc2626", marginBottom: 3 }}>
                          {msg.role === "user" ? "YOU" : "◈ SYSTEM"}
                        </div>
                        <div style={{
                          fontSize: 9, lineHeight: 1.7, color: msg.role === "user" ? "#666" : "#888",
                          padding: "8px 10px", background: msg.role === "user" ? "#080808" : "#060606",
                          border: "1px solid #0e0e0e", borderRadius: 4,
                          whiteSpace: "pre-wrap", fontWeight: 300,
                        }}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {lessonTyping && (
                      <div style={{ fontSize: 9, color: "#333", padding: "8px 10px", animation: "pulse 1.5s infinite" }}>
                        ▌ Processing...
                      </div>
                    )}
                    <div ref={lessonChatRef} />
                  </div>

                  <div style={{ display: "flex", gap: 4, padding: 8, borderTop: "1px solid #0a0a0a" }}>
                    <input
                      value={lessonChatInput}
                      onChange={(e) => setLessonChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendLessonMessage()}
                      placeholder="Ask about this lesson..."
                      style={{
                        flex: 1, padding: "8px 10px", background: "#080808",
                        border: "1px solid #0e0e0e", borderRadius: 4,
                        color: "#ccc", fontSize: 9, fontFamily: "inherit", fontWeight: 300,
                      }}
                    />
                    <button onClick={sendLessonMessage} style={{
                      padding: "8px 14px", background: "#dc2626", border: "none",
                      borderRadius: 4, color: "#000", cursor: "pointer",
                      fontFamily: "inherit", fontSize: 8, letterSpacing: 2, fontWeight: 600,
                    }}>
                      ASK
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Fallback for lessons without content yet */
              <div style={{
                border: "1px solid #0e0e0e", borderRadius: 8, padding: 24,
                background: "#070707", marginBottom: 16, textAlign: "center",
              }}>
                <div style={{ fontSize: 9, color: "#333", marginBottom: 8, letterSpacing: 2 }}>CONTENT INCOMING</div>
                <div style={{ fontSize: 10, color: "#444", lineHeight: 1.7, fontWeight: 300 }}>
                  This lesson is being loaded into the intelligence system. Access the full version on Skool.
                </div>
                <div style={{
                  marginTop: 12, fontSize: 9, color: "#dc2626", letterSpacing: 2,
                  opacity: 0.6, fontWeight: 400,
                }}>
                  → ACCESS ON SKOOL
                </div>
              </div>
            )}

            {/* Complete Button */}
            <button onClick={() => {
              setUser(prev => ({ ...prev, completedLessons: [...prev.completedLessons, activeLesson.id] }));
              addXP(30);
              setActiveLesson(null);
              setLessonChat([]);
            }} style={{
              width: "100%", padding: 14, marginTop: 12,
              background: "#16a34a11", border: "1px solid #16a34a22",
              borderRadius: 6, color: "#16a34a", cursor: "pointer",
              fontFamily: "inherit", fontSize: 9, letterSpacing: 3, fontWeight: 400,
            }}>
              MARK AS COMPLETE · +30 XP
            </button>
          </div>
        )}

        {/* ── QUIZ VIEW ── */}
        {quizState && !quizState.score && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <button onClick={() => setQuizState(null)} style={{
              background: "transparent", border: "none", color: "#333",
              cursor: "pointer", fontSize: 9, letterSpacing: 2, marginBottom: 16,
              fontFamily: "inherit", padding: 0,
            }}>
              ← ABORT ASSESSMENT
            </button>

            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 7, letterSpacing: 4, color: "#dc2626", marginBottom: 4 }}>
                {quizState.isRankChallenge ? "RANK CLEARANCE EXAM" : "KNOWLEDGE VERIFICATION"}
              </div>
              {quizState.isRankChallenge && (
                <div style={{ fontSize: 9, color: "#d4a017", marginBottom: 6, fontWeight: 300 }}>
                  Required score: {quizState.requiredScore}% to pass
                </div>
              )}
              <div style={{ fontSize: 12, color: "#d0d0d0", fontWeight: 300, letterSpacing: 2, marginBottom: 8 }}>
                Q{quizState.current + 1} of {quizState.questions.length}
              </div>
              <div style={{ height: 2, background: "#111", borderRadius: 1, marginBottom: 20 }}>
                <div style={{
                  height: "100%",
                  width: `${((quizState.current + 1) / quizState.questions.length) * 100}%`,
                  background: quizState.isRankChallenge ? "#d4a017" : "#dc2626", borderRadius: 1, transition: "width 0.3s", opacity: 0.7,
                }} />
              </div>
            </div>

            {(() => {
              const currentQ = quizState.questions[quizState.current];
              const qType = currentQ.type || "mc";
              return (
                <div style={{
                  border: "1px solid #0e0e0e", borderRadius: 8, padding: 20,
                  background: "#070707",
                }}>
                  {/* Question type badge */}
                  <div style={{ fontSize: 7, letterSpacing: 3, marginBottom: 10, color: qType === "scenario" ? "#8b5cf6" : qType === "tf" ? "#0891b2" : "#333" }}>
                    {qType === "scenario" ? "◆ SCENARIO" : qType === "tf" ? "◇ TRUE OR FALSE" : "◈ KNOWLEDGE CHECK"}
                  </div>

                  <div style={{ fontSize: 11, color: "#ccc", lineHeight: 1.7, fontWeight: 300, marginBottom: 18 }}>
                    {currentQ.q}
                  </div>

                  {/* TRUE/FALSE questions */}
                  {qType === "tf" && (
                    <div style={{ display: "flex", gap: 8 }}>
                      {[true, false].map(val => (
                        <button key={String(val)} onClick={() => answerQuiz(quizState.current, val)} style={{
                          flex: 1, padding: "14px", borderRadius: 6, cursor: "pointer",
                          fontFamily: "inherit", fontSize: 11, fontWeight: 400, letterSpacing: 2,
                          background: quizState.answers[quizState.current] === val ? (val ? "#16a34a15" : "#dc262611") : "#060606",
                          border: quizState.answers[quizState.current] === val ? `1px solid ${val ? "#16a34a33" : "#dc262633"}` : "1px solid #0e0e0e",
                          color: quizState.answers[quizState.current] === val ? (val ? "#16a34a" : "#dc2626") : "#555",
                          transition: "all 0.2s", textAlign: "center",
                        }}>
                          {val ? "TRUE" : "FALSE"}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* MC and SCENARIO questions */}
                  {(qType === "mc" || qType === "scenario") && currentQ.opts && currentQ.opts.map((opt, oi) => (
                    <button key={oi} onClick={() => answerQuiz(quizState.current, oi)} style={{
                      width: "100%", textAlign: "left", padding: "12px 14px",
                      marginBottom: 6, borderRadius: 6, cursor: "pointer",
                      fontFamily: "inherit", fontSize: 10, fontWeight: 300,
                      background: quizState.answers[quizState.current] === oi ? (qType === "scenario" ? "#8b5cf611" : "#dc262611") : "#060606",
                      border: quizState.answers[quizState.current] === oi ? `1px solid ${qType === "scenario" ? "#8b5cf633" : "#dc262633"}` : "1px solid #0e0e0e",
                      color: quizState.answers[quizState.current] === oi ? (qType === "scenario" ? "#8b5cf6" : "#dc2626") : "#777",
                      transition: "all 0.2s", letterSpacing: 0.3, lineHeight: 1.6,
                    }}>
                      <span style={{ color: "#333", marginRight: 10 }}>{String.fromCharCode(65 + oi)}.</span>
                      {opt}
                    </button>
                  ))}

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                    <button onClick={() => quizState.current > 0 && setQuizState(prev => ({ ...prev, current: prev.current - 1 }))} style={{
                      padding: "8px 16px", background: "transparent", border: "1px solid #111",
                      borderRadius: 4, color: "#333", cursor: quizState.current > 0 ? "pointer" : "default",
                      fontFamily: "inherit", fontSize: 8, letterSpacing: 2,
                      opacity: quizState.current > 0 ? 1 : 0.3,
                    }}>
                      ← PREV
                    </button>

                    {quizState.current < quizState.questions.length - 1 ? (
                      <button onClick={() => quizState.answers[quizState.current] !== undefined && setQuizState(prev => ({ ...prev, current: prev.current + 1 }))} style={{
                        padding: "8px 16px", background: "transparent", border: "1px solid #111",
                        borderRadius: 4, color: "#777", cursor: "pointer",
                        fontFamily: "inherit", fontSize: 8, letterSpacing: 2,
                        opacity: quizState.answers[quizState.current] !== undefined ? 1 : 0.3,
                      }}>
                        NEXT →
                      </button>
                    ) : (
                      <button onClick={() => {
                        const allAnswered = quizState.questions.every((_, i) => quizState.answers[i] !== undefined);
                        if (allAnswered) submitQuiz();
                      }} style={{
                        padding: "8px 16px",
                        background: quizState.questions.every((_, i) => quizState.answers[i] !== undefined) ? "#dc2626" : "transparent",
                        border: "1px solid #dc262644", borderRadius: 4,
                        color: quizState.questions.every((_, i) => quizState.answers[i] !== undefined) ? "#000" : "#333",
                        cursor: "pointer", fontFamily: "inherit", fontSize: 8, letterSpacing: 2, fontWeight: 600,
                      }}>
                        SUBMIT
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ── QUIZ RESULTS ── */}
        {quizState && quizState.score !== null && (
          <div style={{ animation: "fadeIn 0.5s ease", textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 7, letterSpacing: 4, color: "#333", marginBottom: 16 }}>
              {quizState.isRankChallenge ? "CLEARANCE EXAM COMPLETE" : "ASSESSMENT COMPLETE"}
            </div>
            <div style={{
              fontSize: 48, fontWeight: 200, marginBottom: 8,
              color: quizState.score >= (quizState.requiredScore || 80) ? "#16a34a" : quizState.score >= 60 ? "#d4a017" : "#dc2626",
            }}>
              {quizState.score}%
            </div>

            {quizState.isRankChallenge ? (
              <div style={{ marginBottom: 16 }}>
                {quizState.score >= quizState.requiredScore ? (
                  <>
                    <div style={{ fontSize: 12, letterSpacing: 4, color: "#d4a017", marginBottom: 4, fontWeight: 400 }}>
                      CLEARANCE GRANTED
                    </div>
                    <div style={{ fontSize: 9, color: "#555", fontWeight: 300 }}>
                      +{RANK_CHALLENGES[quizState.rankLevel]?.xpReward || 200} XP · Rank unlocked
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 12, letterSpacing: 4, color: "#dc2626", marginBottom: 4, fontWeight: 400 }}>
                      CLEARANCE DENIED
                    </div>
                    <div style={{ fontSize: 9, color: "#555", fontWeight: 300 }}>
                      Required: {quizState.requiredScore}% · Review material and retry
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <div style={{ fontSize: 10, letterSpacing: 3, marginBottom: 4, color: "#555", fontWeight: 300 }}>
                  {quizState.score >= 80 ? "KNOWLEDGE VERIFIED" : quizState.score >= 60 ? "PARTIAL COMPREHENSION" : "REVIEW REQUIRED"}
                </div>
                <div style={{ fontSize: 9, color: "#333", marginBottom: 8 }}>
                  +{Math.round((quizState.score >= 80 ? 100 : quizState.score >= 60 ? 50 : 20) * streakMultiplier)} XP earned
                  {streakMultiplier > 1 && <span style={{ color: "#d4a017" }}> ({streakMultiplier}x streak)</span>}
                </div>
              </>
            )}

            {/* Show correct/incorrect */}
            <div style={{ textAlign: "left", maxWidth: 500, margin: "0 auto" }}>
              {quizState.questions.map((q, i) => {
                const qType = q.type || "mc";
                const isCorrect = quizState.answers[i] === q.correct;
                const correctAnswer = qType === "tf" ? (q.correct ? "True" : "False") : (q.opts ? q.opts[q.correct] : "");
                return (
                  <div key={i} style={{
                    padding: "10px 14px", marginBottom: 4, borderRadius: 6,
                    background: "#070707", border: `1px solid ${isCorrect ? "#16a34a15" : "#dc262615"}`,
                    fontSize: 9, color: "#555", fontWeight: 300,
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                      <span style={{ color: isCorrect ? "#16a34a" : "#dc2626", flexShrink: 0 }}>
                        {isCorrect ? "✓" : "✗"}
                      </span>
                      <div>
                        <span style={{ color: "#666" }}>{q.q.length > 70 ? q.q.substring(0, 70) + "..." : q.q}</span>
                        {!isCorrect && (
                          <div style={{ fontSize: 8, color: "#16a34a", marginTop: 4, opacity: 0.7 }}>
                            Correct: {correctAnswer}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={() => { setQuizState(null); }} style={{
              marginTop: 20, padding: "12px 24px", background: "transparent",
              border: "1px solid #111", borderRadius: 6, color: "#555",
              cursor: "pointer", fontFamily: "inherit", fontSize: 9, letterSpacing: 2,
            }}>
              {quizState.isRankChallenge ? "RETURN TO ORDER" : "RETURN TO COURSE"}
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════════════ */}
        {/* PSYCH ASSESSMENT */}
        {/* ════════════════════════════════════════════════════ */}
        {view === "psych" && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 7, letterSpacing: 4, color: "#dc2626", marginBottom: 6 }}>
                CLASSIFIED · PSYCHOLOGICAL PROFILING
              </div>
              <div style={{ fontSize: 13, color: "#d0d0d0", fontWeight: 300, letterSpacing: 2, marginBottom: 6 }}>
                COGNITIVE ARCHITECTURE ASSESSMENT
              </div>
              <div style={{ fontSize: 9, color: "#2a2a2a", lineHeight: 1.7, fontWeight: 300 }}>
                Rate each statement on a 7-point scale. Your first instinct is the correct answer. This data calibrates your entire experience within the system.
              </div>
            </div>

            {/* Section Progress */}
            <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
              {PSYCH_SECTIONS.map((section, si) => {
                const sectionComplete = section.questions.every(q => psychAnswers[q.id]);
                return (
                  <button key={si} onClick={() => setPsychSection(si)} style={{
                    flex: 1, height: 3, borderRadius: 1, border: "none", cursor: "pointer",
                    background: si === psychSection ? "#dc2626" : sectionComplete ? "#16a34a44" : "#111",
                    transition: "all 0.3s",
                  }} />
                );
              })}
            </div>

            {/* Current Section */}
            {(() => {
              const section = PSYCH_SECTIONS[psychSection];
              return (
                <div>
                  <div style={{
                    border: "1px solid #0e0e0e", borderRadius: 8, padding: 16,
                    background: "#070707", marginBottom: 16,
                  }}>
                    <div style={{ fontSize: 9, letterSpacing: 3, color: "#dc2626", marginBottom: 4, fontWeight: 400 }}>
                      SECTION {psychSection + 1}/{PSYCH_SECTIONS.length} · {section.name}
                    </div>
                    <div style={{ fontSize: 9, color: "#2a2a2a", fontWeight: 300 }}>{section.desc}</div>
                  </div>

                  {section.questions.map((q, qi) => (
                    <div key={q.id} style={{
                      border: "1px solid #0e0e0e", borderRadius: 8, padding: 16,
                      background: "#070707", marginBottom: 8,
                      animation: `slideIn 0.3s ease ${qi * 0.05}s both`,
                    }}>
                      <div style={{ fontSize: 10, color: "#999", marginBottom: 12, lineHeight: 1.6, fontWeight: 300 }}>
                        {q.text}
                      </div>
                      <div style={{ display: "flex", gap: 4, justifyContent: "space-between" }}>
                        {SCALE_LABELS.map(scale => (
                          <button key={scale.value} onClick={() => setPsychAnswers(prev => ({ ...prev, [q.id]: scale.value }))} style={{
                            flex: 1, padding: "8px 2px", borderRadius: 4,
                            background: psychAnswers[q.id] === scale.value ? "#dc262622" : "transparent",
                            border: psychAnswers[q.id] === scale.value ? "1px solid #dc262644" : "1px solid #0e0e0e",
                            color: psychAnswers[q.id] === scale.value ? "#dc2626" : "#333",
                            cursor: "pointer", fontFamily: "inherit",
                            fontSize: 8, transition: "all 0.15s",
                            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                          }}>
                            <span style={{ fontSize: 10, fontWeight: 400 }}>{scale.value}</span>
                          </button>
                        ))}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 7, color: "#1a1a1a", letterSpacing: 1 }}>
                        <span>DISAGREE</span>
                        <span>AGREE</span>
                      </div>
                    </div>
                  ))}

                  {/* Navigation */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                    <button onClick={() => psychSection > 0 && setPsychSection(psychSection - 1)} style={{
                      padding: "10px 20px", background: "transparent", border: "1px solid #111",
                      borderRadius: 4, color: "#333", cursor: psychSection > 0 ? "pointer" : "default",
                      fontFamily: "inherit", fontSize: 8, letterSpacing: 2, opacity: psychSection > 0 ? 1 : 0.3,
                    }}>
                      ← PREV SECTION
                    </button>

                    {psychSection < PSYCH_SECTIONS.length - 1 ? (
                      <button onClick={() => setPsychSection(psychSection + 1)} style={{
                        padding: "10px 20px", background: "transparent", border: "1px solid #111",
                        borderRadius: 4, color: "#777", cursor: "pointer",
                        fontFamily: "inherit", fontSize: 8, letterSpacing: 2,
                      }}>
                        NEXT SECTION →
                      </button>
                    ) : (
                      <button onClick={completePsychAssessment} disabled={answeredQuestions < totalQuestions} style={{
                        padding: "10px 20px",
                        background: answeredQuestions >= totalQuestions ? "#dc2626" : "transparent",
                        border: "1px solid #dc262644", borderRadius: 4,
                        color: answeredQuestions >= totalQuestions ? "#000" : "#333",
                        cursor: answeredQuestions >= totalQuestions ? "pointer" : "default",
                        fontFamily: "inherit", fontSize: 8, letterSpacing: 2, fontWeight: 600,
                      }}>
                        COMPLETE PROFILING ({answeredQuestions}/{totalQuestions})
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* ════════════════════════════════════════════════════ */}
        {/* PROFILE VIEW */}
        {/* ════════════════════════════════════════════════════ */}
        {view === "profile" && user.profile && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 40, color: currentRank.color, marginBottom: 8, opacity: 0.5 }}>{currentRank.icon}</div>
              <div style={{ fontSize: 7, letterSpacing: 4, color: "#dc2626", marginBottom: 6 }}>CLASSIFIED DOCUMENT · EYES ONLY</div>
              <div style={{ fontSize: 14, color: "#d0d0d0", fontWeight: 300, letterSpacing: 3, marginBottom: 4 }}>
                PSYCHOLOGICAL PROFILE
              </div>
              <div style={{ fontSize: 9, color: "#222" }}>OPERATIVE: {user.name} · CLEARANCE: {currentRank.name}</div>
            </div>

            <div style={{ display: "grid", gap: 8 }}>
              {PSYCH_SECTIONS.map(section => {
                const value = user.profile[section.id];
                const getLabel = (v) => {
                  if (v >= 85) return "EXCEPTIONAL";
                  if (v >= 70) return "ADVANCED";
                  if (v >= 55) return "DEVELOPING";
                  if (v >= 40) return "BASELINE";
                  return "UNDEVELOPED";
                };
                return (
                  <div key={section.id} style={{
                    border: "1px solid #0e0e0e", borderRadius: 6, padding: 16,
                    background: "#070707",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ fontSize: 8, letterSpacing: 3, color: "#555" }}>{section.name}</span>
                      <span style={{
                        fontSize: 13, fontWeight: 300, letterSpacing: 1,
                        color: value >= 70 ? "#16a34a" : value >= 50 ? "#d4a017" : "#dc2626",
                      }}>
                        {value}%
                      </span>
                    </div>
                    <div style={{ height: 2, background: "#111", borderRadius: 1, marginBottom: 6 }}>
                      <div style={{
                        height: "100%", width: `${value}%`,
                        background: value >= 70 ? "#16a34a" : value >= 50 ? "#d4a017" : "#dc2626",
                        borderRadius: 1, transition: "width 0.8s", opacity: 0.6,
                      }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 8, color: "#2a2a2a", fontWeight: 300 }}>{section.desc}</span>
                      <span style={{ fontSize: 7, letterSpacing: 2, color: "#333" }}>{getLabel(value)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              marginTop: 16, padding: 16, border: "1px solid #0e0e0e",
              borderRadius: 8, background: "#070707",
            }}>
              <div style={{ fontSize: 8, letterSpacing: 3, color: "#333", marginBottom: 8 }}>SYSTEM CALIBRATION STATUS</div>
              <div style={{ fontSize: 9, color: "#444", lineHeight: 1.8, fontWeight: 300 }}>
                AI teacher now calibrated to your cognitive architecture. Teaching methodology, example selection, and framework presentation will adapt to your psychological operating system. Your curriculum has been generated based on identified gaps and strengths.
              </div>
            </div>
          </div>
        )}

        {/* Profile view when no profile exists */}
        {view === "profile" && !user.profile && (
          <div style={{ animation: "fadeIn 0.5s ease", textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 36, color: "#1a1a1a", marginBottom: 16 }}>△</div>
            <div style={{ fontSize: 11, color: "#333", letterSpacing: 2, marginBottom: 8 }}>NO PROFILE DETECTED</div>
            <div style={{ fontSize: 9, color: "#222", marginBottom: 20, fontWeight: 300 }}>
              Complete the psychological assessment to map your cognitive architecture.
            </div>
            <button onClick={() => { setView("psych"); setPsychSection(0); setPsychAnswers({}); }} style={{
              padding: "12px 24px", background: "#dc262611", border: "1px solid #dc262622",
              borderRadius: 6, color: "#dc2626", cursor: "pointer",
              fontFamily: "inherit", fontSize: 9, letterSpacing: 2,
            }}>
              BEGIN PROFILING
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════════════ */}
        {/* AI CHAT */}
        {/* ════════════════════════════════════════════════════ */}
        {view === "chat" && (
          <div style={{ animation: "fadeIn 0.5s ease", display: "flex", flexDirection: "column", height: "calc(100vh - 180px)" }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 7, letterSpacing: 4, color: "#dc2626", marginBottom: 3 }}>
                INTELLIGENCE INTERFACE · ENCRYPTED
              </div>
              <div style={{ fontSize: 10, color: "#2a2a2a", fontWeight: 300 }}>
                {user.profile ? "Calibrated to your psychological architecture. Ask anything." : "⚠ Profile unmapped. Responses are generic. Complete assessment for personalized intelligence."}
              </div>
            </div>

            {/* Messages */}
            <div style={{
              flex: 1, overflowY: "auto", marginBottom: 12,
              border: "1px solid #0a0a0a", borderRadius: 8,
              background: "#030303", padding: 16,
            }}>
              {chatMessages.length === 0 && (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div style={{ fontSize: 28, marginBottom: 16, color: "#111" }}>◈</div>
                  <div style={{ fontSize: 9, color: "#222", letterSpacing: 3, marginBottom: 8 }}>SYSTEM ACTIVE · AWAITING QUERY</div>
                  <div style={{ fontSize: 9, color: "#1a1a1a", lineHeight: 1.8, fontWeight: 300 }}>
                    Psychology. Persuasion. Strategy. Business. Power dynamics. Social engineering.
                    <br />The complete intelligence database is at your disposal.
                  </div>
                </div>
              )}

              {chatMessages.map((msg, i) => (
                <div key={i} style={{ marginBottom: 16, animation: "fadeIn 0.3s ease" }}>
                  <div style={{
                    fontSize: 7, letterSpacing: 3, marginBottom: 5,
                    color: msg.role === "user" ? "#333" : "#dc2626",
                  }}>
                    {msg.role === "user" ? `${currentRank.icon} OPERATIVE` : "◈ INTELLIGENCE SYSTEM"}
                  </div>
                  <div style={{
                    fontSize: 10, lineHeight: 1.8, fontWeight: 300,
                    color: msg.role === "user" ? "#666" : "#999",
                    padding: "12px 14px",
                    background: msg.role === "user" ? "#080808" : "#060606",
                    border: `1px solid ${msg.role === "user" ? "#0e0e0e" : "#0a0808"}`,
                    borderRadius: 6, whiteSpace: "pre-wrap", letterSpacing: 0.2,
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 7, letterSpacing: 3, marginBottom: 5, color: "#dc2626" }}>◈ INTELLIGENCE SYSTEM</div>
                  <div style={{ padding: "12px 14px", background: "#060606", border: "1px solid #0a0808", borderRadius: 6 }}>
                    <span style={{ animation: "pulse 1.5s infinite", fontSize: 9, color: "#333", letterSpacing: 2 }}>
                      ▌ PROCESSING INTELLIGENCE QUERY...
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div style={{ display: "flex", gap: 6 }}>
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                placeholder="Enter intelligence query..."
                style={{
                  flex: 1, padding: "12px 14px", background: "#080808",
                  border: "1px solid #0e0e0e", borderRadius: 6,
                  color: "#ccc", fontSize: 10, fontWeight: 300,
                  fontFamily: "inherit", letterSpacing: 0.5,
                }}
              />
              <button onClick={sendMessage} style={{
                padding: "12px 18px", background: "#dc2626",
                border: "none", borderRadius: 6, color: "#000",
                cursor: "pointer", fontFamily: "inherit",
                fontSize: 8, letterSpacing: 3, fontWeight: 600,
              }}>
                TRANSMIT
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════ */}
        {/* RANKS VIEW */}
        {/* ════════════════════════════════════════════════════ */}
        {view === "ranks" && !quizState && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 7, letterSpacing: 4, color: "#222", marginBottom: 4 }}>THE ORDER</div>
              <div style={{ fontSize: 14, color: "#d0d0d0", fontWeight: 200, letterSpacing: 3, marginBottom: 6 }}>
                CLEARANCE HIERARCHY
              </div>
              <div style={{ fontSize: 9, color: "#222", fontWeight: 300 }}>
                Each rank unlocks deeper intelligence. Pass the clearance exam to advance.
              </div>
            </div>

            {/* Streak Display */}
            <div style={{
              border: "1px solid #0e0e0e", borderRadius: 8, padding: 16,
              background: "#070707", marginBottom: 16, textAlign: "center",
            }}>
              <div style={{ fontSize: 7, letterSpacing: 4, color: "#222", marginBottom: 8 }}>STREAK PROTOCOL</div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 28, fontWeight: 200, color: user.streak >= 7 ? "#dc2626" : user.streak >= 3 ? "#d4a017" : "#444" }}>
                  {user.streak}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontSize: 9, color: "#666", fontWeight: 300 }}>consecutive days</div>
                  <div style={{ fontSize: 8, color: streakMultiplier > 1 ? "#d4a017" : "#333", letterSpacing: 2 }}>
                    {streakMultiplier > 1 ? `${streakMultiplier}x XP MULTIPLIER ACTIVE` : "3-day streak → 1.5x XP"}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 10 }}>
                {STREAK_TIERS.map((tier, i) => (
                  <div key={i} style={{
                    padding: "3px 8px", borderRadius: 3, fontSize: 7, letterSpacing: 1,
                    background: user.streak >= tier.min ? `${tier.color}15` : "#060606",
                    border: `1px solid ${user.streak >= tier.min ? tier.color + "33" : "#0e0e0e"}`,
                    color: user.streak >= tier.min ? tier.color : "#222",
                  }}>
                    {tier.min}d: {tier.label}
                  </div>
                ))}
              </div>
            </div>

            {RANKS.slice(1).map((rank) => {
              const unlocked = user.xp >= rank.xp;
              const current = rank.level === currentRank.level;
              const challenge = RANK_CHALLENGES[rank.level];
              const challengePassed = user.rankChallengesPassed.includes(rank.level);
              const canTakeChallenge = current && challenge && !challengePassed && user.xp >= rank.xp;
              const nextRankIsThis = nextRank.level === rank.level;

              return (
                <div key={rank.level} style={{
                  border: current ? `1px solid ${rank.color}22` : "1px solid #0e0e0e",
                  borderRadius: 8, padding: 18, marginBottom: 6,
                  background: current ? `${rank.color}05` : "#070707",
                  opacity: unlocked || nextRankIsThis ? 1 : 0.25, transition: "all 0.3s",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{ fontSize: 24, color: rank.color, opacity: 0.6 }}>{rank.icon}</span>
                      <div>
                        <div style={{ fontSize: 10, fontWeight: 400, letterSpacing: 3, color: unlocked ? rank.color : "#333" }}>
                          {rank.name}
                        </div>
                        <div style={{ fontSize: 8, color: "#2a2a2a", marginTop: 2, fontWeight: 300, fontStyle: "italic" }}>
                          "{rank.sigil}"
                        </div>
                        <div style={{ fontSize: 8, color: "#1a1a1a", marginTop: 4, letterSpacing: 1 }}>
                          {rank.xp.toLocaleString()} XP required
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                      {current && (
                        <span style={{
                          fontSize: 7, letterSpacing: 3, color: rank.color,
                          border: `1px solid ${rank.color}22`, padding: "3px 8px",
                          borderRadius: 2, fontWeight: 400,
                        }}>
                          CURRENT
                        </span>
                      )}
                      {challengePassed && (
                        <span style={{ fontSize: 7, letterSpacing: 2, color: "#16a34a" }}>✓ EXAM PASSED</span>
                      )}
                      {!unlocked && !nextRankIsThis && <span style={{ fontSize: 12, color: "#1a1a1a" }}>🔒</span>}
                    </div>
                  </div>

                  {/* Rank Challenge Button */}
                  {challenge && (unlocked || nextRankIsThis) && !challengePassed && (
                    <button onClick={() => {
                      setQuizState({
                        quizId: `rank-${rank.level}`,
                        questions: challenge.questions,
                        current: 0,
                        answers: {},
                        score: null,
                        isRankChallenge: true,
                        rankLevel: rank.level,
                        requiredScore: challenge.requiredScore,
                      });
                    }} style={{
                      width: "100%", marginTop: 12, padding: "10px 14px",
                      background: canTakeChallenge ? "#d4a01711" : "#060606",
                      border: `1px solid ${canTakeChallenge ? "#d4a01733" : "#0e0e0e"}`,
                      borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
                      textAlign: "left", transition: "all 0.3s",
                    }}>
                      <div style={{ fontSize: 8, letterSpacing: 3, color: "#d4a017", marginBottom: 3 }}>
                        ◈ {challenge.name}
                      </div>
                      <div style={{ fontSize: 8, color: "#333", fontWeight: 300 }}>
                        {challenge.desc} · {challenge.questions.length} questions · {challenge.requiredScore}% to pass
                      </div>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ════════════════════════════════════════════════════ */}
        {/* PILLAR ASSESSMENT MODAL */}
        {/* ════════════════════════════════════════════════════ */}
        {pillarAssessing && (
          <div style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.95)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 20,
          }}>
            <div style={{
              maxWidth: 500, width: "100%", border: "1px solid #0e0e0e",
              borderRadius: 8, padding: 24, background: "#070707",
              maxHeight: "85vh", overflowY: "auto",
            }}>
              {(() => {
                const pillar = PILLARS.find(p => p.id === pillarAssessing);
                const questions = [
                  { id: `${pillarAssessing}-1`, text: `Rate your understanding of core ${pillar.name.toLowerCase()} principles` },
                  { id: `${pillarAssessing}-2`, text: `Rate your ability to apply ${pillar.name.toLowerCase()} frameworks in real situations` },
                  { id: `${pillarAssessing}-3`, text: `Rate your experience level with advanced ${pillar.name.toLowerCase()} techniques` },
                  { id: `${pillarAssessing}-4`, text: `Rate your consistency in practicing ${pillar.name.toLowerCase()} skills` },
                  { id: `${pillarAssessing}-5`, text: `Rate your results in the ${pillar.name.toLowerCase()} domain over the past 6 months` },
                ];
                const allAnswered = questions.every(q => pillarAnswers[q.id] !== undefined);

                return (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                      <div>
                        <div style={{ fontSize: 8, letterSpacing: 3, color: pillar.color, marginBottom: 4 }}>
                          {pillar.symbol} {pillar.name} · SKILL MAPPING
                        </div>
                        <div style={{ fontSize: 9, color: "#2a2a2a", fontWeight: 300 }}>Rate yourself honestly. The system calibrates to truth, not ego.</div>
                      </div>
                      <button onClick={() => { setPillarAssessing(null); setPillarAnswers({}); }} style={{
                        background: "transparent", border: "none", color: "#333",
                        cursor: "pointer", fontSize: 16, fontFamily: "inherit",
                      }}>✕</button>
                    </div>

                    {questions.map((q, qi) => (
                      <div key={q.id} style={{
                        border: "1px solid #0e0e0e", borderRadius: 6, padding: 14,
                        background: "#060606", marginBottom: 6,
                      }}>
                        <div style={{ fontSize: 10, color: "#888", marginBottom: 10, fontWeight: 300 }}>
                          {q.text}
                        </div>
                        <div style={{ display: "flex", gap: 4 }}>
                          {[1, 2, 3, 4, 5, 6, 7].map(val => (
                            <button key={val} onClick={() => setPillarAnswers(prev => ({ ...prev, [q.id]: val }))} style={{
                              flex: 1, padding: "8px 2px", borderRadius: 4,
                              background: pillarAnswers[q.id] === val ? `${pillar.color}22` : "transparent",
                              border: pillarAnswers[q.id] === val ? `1px solid ${pillar.color}44` : "1px solid #0e0e0e",
                              color: pillarAnswers[q.id] === val ? pillar.color : "#333",
                              cursor: "pointer", fontFamily: "inherit", fontSize: 9,
                              transition: "all 0.15s",
                            }}>
                              {val}
                            </button>
                          ))}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3, fontSize: 7, color: "#1a1a1a" }}>
                          <span>NOVICE</span>
                          <span>ELITE</span>
                        </div>
                      </div>
                    ))}

                    <button onClick={() => {
                      if (allAnswered) {
                        const values = Object.values(pillarAnswers);
                        const avg = Math.round((values.reduce((a, b) => a + b, 0) / values.length / 7) * 100);
                        setUser(prev => ({
                          ...prev,
                          pillarScores: { ...prev.pillarScores, [pillarAssessing]: avg },
                        }));
                        addXP(100);
                        setPillarAssessing(null);
                        setPillarAnswers({});
                      }
                    }} style={{
                      width: "100%", padding: 14, marginTop: 12,
                      background: allAnswered ? pillar.color : "transparent",
                      border: `1px solid ${pillar.color}33`, borderRadius: 6,
                      color: allAnswered ? "#000" : "#333",
                      cursor: allAnswered ? "pointer" : "default",
                      fontFamily: "inherit", fontSize: 9, letterSpacing: 3, fontWeight: 600,
                    }}>
                      MAP SKILL LEVEL
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        )}

      </main>

      {/* ── BOTTOM NAV ── */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        borderTop: "1px solid #0a0a0a",
        background: "linear-gradient(180deg, #060606, #050505)",
        display: "flex", justifyContent: "center", gap: 2,
        padding: "6px 8px", zIndex: 100,
        backdropFilter: "blur(12px)",
      }}>
        <NavItem icon="◉" label="Hub" active={view === "hub"} onClick={() => { setView("hub"); setSubView(null); setActiveCourse(null); setActiveLesson(null); setQuizState(null); }} />
        <NavItem icon="◧" label="Courses" active={view === "courses"} onClick={() => { setView("courses"); setActiveCourse(null); setActiveLesson(null); setQuizState(null); }} />
        <NavItem icon="◈" label="Intel" active={view === "chat"} onClick={() => setView("chat")} />
        <NavItem icon="◐" label="Profile" active={view === "profile" || view === "psych"} onClick={() => setView(user.profile ? "profile" : "psych")}
          notification={!user.profile} />
        <NavItem icon="☗" label="Order" active={view === "ranks"} onClick={() => setView("ranks")} />
      </nav>
    </div>
  );
}
