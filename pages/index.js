import { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════
// THE OPERATOR ECHELON — INTELLIGENCE SYSTEM v2.0
// "The system sees what you refuse to."
// ═══════════════════════════════════════════════════════════════

const RANKS = [
  { level: 0, name: "UNINITIATED", xp: 0, icon: "△", color: "#999", sigil: "You have not yet entered." },
  { level: 1, name: "OBSERVER", xp: 0, icon: "◇", color: "#4a5568", sigil: "See what others miss." },
  { level: 2, name: "ANALYST", xp: 800, icon: "◈", color: "#3b82f6", sigil: "Pattern recognition activated." },
  { level: 3, name: "STRATEGIST", xp: 2000, icon: "⬡", color: "#8b5cf6", sigil: "You no longer react. You architect." },
  { level: 4, name: "OPERATOR", xp: 4500, icon: "⬢", color: "#dc2626", sigil: "Silent execution. Zero trace." },
  { level: 5, name: "SHADOW COUNCIL", xp: 9000, icon: "☗", color: "#d4a017", sigil: "Those who move the world never announce it." },
];

const PILLARS = [
  { id: "psychology", name: "PSYCHOLOGY", icon: "◆", color: "#dc2626", desc: "Dark psychology, persuasion, frame control, Machiavellian systems", symbol: "♜" },
  { id: "money", name: "MONEY", icon: "⦿", color: "#d4a017", desc: "Wealth systems, business architecture, selling, market psychology", symbol: "₿" },
  { id: "health", name: "HEALTH", icon: "◉", color: "#16a34a", desc: "Biological optimization, neurochemistry, dopamine, performance", symbol: "⧫" },
  { id: "seduction", name: "SEDUCTION", icon: "◎", color: "#8b5cf6", desc: "Social dynamics, attraction, subcommunication, interpersonal warfare", symbol: "♛" },
];

// ═══════════════════════════════════════════════════════════════
// COURSES DATABASE
// ═══════════════════════════════════════════════════════════════

const COURSES = [
  // ── DOMINION (POWER) PILLAR ──
  {
    id: "mindhijacking",
    pillar: "psychology",
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
    pillar: "psychology",
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
    pillar: "psychology",
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
  {
    id: "breakthrough-copy",
    pillar: "money",
    title: "BREAKTHROUGH COPYWRITING",
    subtitle: "Schwartz's frameworks for building overwhelming desire on the page",
    difficulty: "ADVANCED",
    xpReward: 400,
    locked: false,
    modules: [
      {
        id: "bc-1", title: "Intensification — Building Desire",
        lessons: [
          { id: "bc-1-1", title: "The Core Principle — Reinforce, Don't Repeat", type: "lesson", duration: "12 min" },
          { id: "bc-1-2", title: "The 13 Techniques (Part 1) — Show, Don't Tell", type: "lesson", duration: "16 min" },
          { id: "bc-1-3", title: "The 13 Techniques (Part 2) — Proof & Contrast", type: "lesson", duration: "16 min" },
          { id: "bc-1-4", title: "The 13 Techniques (Part 3) — Ease, Metaphor & Close", type: "lesson", duration: "16 min" },
          { id: "bc-1-5", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "bc-2", title: "Identification — Selling Identity",
        lessons: [
          { id: "bc-2-1", title: "The Longing for Identification", type: "lesson", duration: "13 min" },
          { id: "bc-2-2", title: "Character Roles vs Achievement Roles", type: "lesson", duration: "15 min" },
          { id: "bc-2-3", title: "The Material Personality & The 50% Rule", type: "lesson", duration: "14 min" },
          { id: "bc-2-4", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "bc-3", title: "Camouflage — Borrowing Believability",
        lessons: [
          { id: "bc-3-1", title: "Why Ad Language Triggers Skepticism", type: "lesson", duration: "12 min" },
          { id: "bc-3-2", title: "The Three Methods — Format, Phraseology, Understatement", type: "lesson", duration: "16 min" },
          { id: "bc-3-3", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "bc-4", title: "Concentration — Competitive Positioning",
        lessons: [
          { id: "bc-4-1", title: "Proving the Old Way Ineffectual", type: "lesson", duration: "13 min" },
          { id: "bc-4-2", title: "The Bad-Good Structure", type: "lesson", duration: "15 min" },
          { id: "bc-4-3", title: "Then vs Now & The Compressed Version", type: "lesson", duration: "14 min" },
          { id: "bc-4-4", title: "Final Assessment: Breakthrough Copywriting", type: "quiz", questions: 8 },
        ]
      },
    ],
  },
  {
    id: "halbert-letters",
    pillar: "money",
    title: "MILLION DOLLAR SALES LETTERS",
    subtitle: "Halbert's direct-response method — salesmanship in print",
    difficulty: "ADVANCED",
    xpReward: 400,
    locked: false,
    modules: [
      {
        id: "hb-1", title: "The Starving Crowd — Market First",
        lessons: [
          { id: "hb-1-1", title: "The Starving Crowd — The Only Question That Matters", type: "lesson", duration: "13 min" },
          { id: "hb-1-2", title: "Market, Offer, Copy — The Hierarchy", type: "lesson", duration: "14 min" },
          { id: "hb-1-3", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "hb-2", title: "Getting Opened & Read",
        lessons: [
          { id: "hb-2-1", title: "The A-Pile vs The B-Pile", type: "lesson", duration: "14 min" },
          { id: "hb-2-2", title: "Salesmanship in Print — Writing to One Person", type: "lesson", duration: "15 min" },
          { id: "hb-2-3", title: "The Grabber — Openings & Involvement Devices", type: "lesson", duration: "14 min" },
          { id: "hb-2-4", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "hb-3", title: "The Architecture of the Letter",
        lessons: [
          { id: "hb-3-1", title: "AIDA — The Spine of Every Letter", type: "lesson", duration: "14 min" },
          { id: "hb-3-2", title: "The Slippery Slide — Every Line Sells the Next", type: "lesson", duration: "13 min" },
          { id: "hb-3-3", title: "Reason-Why Copy — Make Every Claim Believable", type: "lesson", duration: "14 min" },
          { id: "hb-3-4", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "hb-4", title: "The Offer & The Close",
        lessons: [
          { id: "hb-4-1", title: "Building & Sweetening the Offer", type: "lesson", duration: "14 min" },
          { id: "hb-4-2", title: "Guarantee, Urgency & the Call to Action", type: "lesson", duration: "14 min" },
          { id: "hb-4-3", title: "Final Assessment: Million Dollar Sales Letters", type: "quiz", questions: 8 },
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
  {
    id: "game-layer",
    pillar: "psychology",
    title: "THE GAME LAYER",
    subtitle: "Transactional Analysis — the hidden games running under every interaction",
    difficulty: "ADVANCED",
    xpReward: 450,
    locked: false,
    modules: [
      {
        id: "gl-1", title: "The Hungers & The Currency",
        lessons: [
          { id: "gl-1-1", title: "The Two Tracks — The Game Layer Is Always Running", type: "lesson", duration: "12 min" },
          { id: "gl-1-2", title: "The Three Hungers — Stimulus, Recognition, Structure", type: "lesson", duration: "15 min" },
          { id: "gl-1-3", title: "Strokes — Positive, Negative, and None", type: "lesson", duration: "14 min" },
          { id: "gl-1-4", title: "The Six Ways We Structure Time", type: "lesson", duration: "14 min" },
          { id: "gl-1-5", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "gl-2", title: "The Three Selves",
        lessons: [
          { id: "gl-2-1", title: "The Parent — Your Recording System", type: "lesson", duration: "13 min" },
          { id: "gl-2-2", title: "The Adult — Your Processing System", type: "lesson", duration: "12 min" },
          { id: "gl-2-3", title: "The Child — Where the Power Lives", type: "lesson", duration: "13 min" },
          { id: "gl-2-4", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "gl-3", title: "Transactions",
        lessons: [
          { id: "gl-3-1", title: "Complementary & Crossed Transactions", type: "lesson", duration: "14 min" },
          { id: "gl-3-2", title: "The Two Levels — Social vs Psychological", type: "lesson", duration: "14 min" },
          { id: "gl-3-3", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "gl-4", title: "The Game Operating System",
        lessons: [
          { id: "gl-4-1", title: "The Anatomy of a Game", type: "lesson", duration: "15 min" },
          { id: "gl-4-2", title: "Why Games Are So Hard to Stop", type: "lesson", duration: "14 min" },
          { id: "gl-4-3", title: "The Degree System", type: "lesson", duration: "12 min" },
          { id: "gl-4-4", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "gl-5", title: "The Games That Matter",
        lessons: [
          { id: "gl-5-1", title: "'Why Don't You / Yes But' & 'Ain't It Awful'", type: "lesson", duration: "15 min" },
          { id: "gl-5-2", title: "'Look How Hard I've Tried' & 'If It Weren't For You'", type: "lesson", duration: "15 min" },
          { id: "gl-5-3", title: "'Courtroom', 'Uproar' & 'Wooden Leg'", type: "lesson", duration: "15 min" },
          { id: "gl-5-4", title: "'I'm Only Trying to Help', 'Indigence' & 'Peasant'", type: "lesson", duration: "15 min" },
          { id: "gl-5-5", title: "Module Assessment", type: "quiz", questions: 6 },
        ]
      },
      {
        id: "gl-6", title: "The Meta-Skill",
        lessons: [
          { id: "gl-6-1", title: "Seeing the Game Layer in Real Time", type: "lesson", duration: "14 min" },
          { id: "gl-6-2", title: "Stepping Outside — Autonomy & Real Connection", type: "lesson", duration: "15 min" },
          { id: "gl-6-3", title: "Final Assessment: The Game Layer", type: "quiz", questions: 8 },
        ]
      },
    ],
  },
  // ── CROSS-PILLAR: MINDSET ──
  {
    id: "flip-the-floor",
    pillar: "psychology",
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
    id: "psychology",
    name: "PSYCHOLOGY",
    desc: "Your shadow architecture, conflict wiring, frame control, and emotional regulation",
    questions: [
      // Identity & Self-Concept (5)
      { id: 1, text: "I have a clear, defined identity that doesn't shift based on who I'm around" },
      { id: 2, text: "When I achieve a goal, I immediately treat it as my new minimum — not a peak" },
      { id: 3, text: "I cycle between extreme motivation and complete collapse" },
      { id: 4, text: "I know exactly who I'm becoming — I could describe my future self in detail" },
      { id: 5, text: "I tend to abandon projects or directions when early results are slow" },
      // Shadow & Dark Psychology (5)
      { id: 6, text: "I naturally see vulnerabilities in people and systems without trying" },
      { id: 7, text: "I can detach from people or situations that no longer serve my objectives" },
      { id: 8, text: "My ambition could be described as obsessive by most people's standards" },
      { id: 9, text: "I operate with a level of self-interest that I rarely reveal to others" },
      { id: 10, text: "I understand manipulation techniques well enough to spot them being used on me" },
      // Frame Control & Conflict (5)
      { id: 11, text: "In disagreements, I hold my position calmly — I don't get emotionally reactive" },
      { id: 12, text: "I'm the one who typically sets the tone and direction of conversations" },
      { id: 13, text: "When someone challenges my frame, I absorb it and redirect rather than fight" },
      { id: 14, text: "I avoid confrontation even when I know I should push back" },
      { id: 15, text: "I can make someone feel understood while simultaneously steering them toward my position" },
      // Emotional Regulation (5)
      { id: 16, text: "I choose what emotions to display — my face rarely betrays what I actually feel" },
      { id: 17, text: "I can operate under extreme pressure without my decision-making degrading" },
      { id: 18, text: "Rejection and criticism don't affect my self-concept for more than a few minutes" },
      { id: 19, text: "I often feel overwhelmed by emotions and need time to process before responding" },
      { id: 20, text: "I can sit in extreme discomfort — physically or emotionally — without needing to escape it" },
      // Cognitive Architecture (5)
      { id: 21, text: "I hold multiple conflicting ideas simultaneously without discomfort" },
      { id: 22, text: "I notice patterns and systems that others seem completely blind to" },
      { id: 23, text: "I think about situations 3-4 moves ahead, like a chess game" },
      { id: 24, text: "I analyze my own failures with clinical detachment to extract lessons" },
      { id: 25, text: "I make decisions based on probability and expected value, not emotion" },
      // Scenario-Based (5)
      { id: 26, text: "Someone publicly dismisses my idea in a meeting — my first instinct is to stay silent and outmaneuver later, not react immediately" },
      { id: 27, text: "When I'm deep in a 'locked in' phase, I can feel when pride is about to trigger a regression" },
      { id: 28, text: "If I caught someone using a manipulation technique on me, I'd play along while planning my counter-move" },
      { id: 29, text: "I struggle to maintain discipline for more than 2-3 weeks before my old patterns return" },
      { id: 30, text: "I would rather lose a relationship than compromise who I'm becoming" },
    ]
  },
  {
    id: "health",
    name: "HEALTH",
    desc: "Your neurochemistry, dopamine sensitivity, stress architecture, and physical discipline",
    questions: [
      // Dopamine & Reward System (5)
      { id: 31, text: "I can resist the pull of social media, YouTube, or entertainment when I have work to do" },
      { id: 32, text: "I frequently find myself scrolling or consuming content as a way to avoid real tasks" },
      { id: 33, text: "I deliberately create periods of reduced stimulation to reset my reward system" },
      { id: 34, text: "I need increasing amounts of stimulation (new content, new ideas, new projects) to stay interested" },
      { id: 35, text: "I can work on a single boring but important task for 2+ hours without switching" },
      // Stress & Cortisol (5)
      { id: 36, text: "I recover from stressful situations quickly — I don't carry tension into the next day" },
      { id: 37, text: "I frequently feel physically tense, have disrupted sleep, or notice stress-related symptoms" },
      { id: 38, text: "I have a deliberate stress management protocol (breathing, cold exposure, movement)" },
      { id: 39, text: "High-pressure situations activate me positively — I perform better under stress" },
      { id: 40, text: "I use substances (caffeine, nicotine, alcohol) to manage my emotional state" },
      // Sleep & Recovery (5)
      { id: 41, text: "I go to bed and wake up at consistent times, including weekends" },
      { id: 42, text: "I regularly sacrifice sleep for work, content consumption, or socializing" },
      { id: 43, text: "I've optimized my sleep environment (light, temperature, screens)" },
      { id: 44, text: "I wake up feeling genuinely recovered and ready to execute" },
      { id: 45, text: "My energy crashes predictably at specific times of day" },
      // Physical Discipline (5)
      { id: 46, text: "I train my body consistently — at least 4 days per week, regardless of how I feel" },
      { id: 47, text: "My diet is deliberate and aligned with my goals, not random" },
      { id: 48, text: "I track and measure my physical performance over time" },
      { id: 49, text: "I use training as a way to build mental discipline, not just physical results" },
      { id: 50, text: "I frequently skip workouts when motivation is low" },
      // Addiction & Vulnerability (5)
      { id: 51, text: "I have at least one habit I know is harmful but continue anyway" },
      { id: 52, text: "I can go a full weekend with zero screens (no phone, laptop, TV) without anxiety" },
      { id: 53, text: "I notice when a behaviour is becoming compulsive and can interrupt the pattern" },
      { id: 54, text: "I use food, entertainment, or substances as emotional regulation rather than genuine enjoyment" },
      { id: 55, text: "I've successfully eliminated a destructive habit through deliberate protocol" },
      // Scenario-Based (5)
      { id: 56, text: "It's 10pm. I know I should sleep but there's an interesting video series I've been watching — I'd turn it off and go to bed" },
      { id: 57, text: "After a stressful day, my default recovery method is productive (training, walking, reading) rather than consuming (scrolling, eating, drinking)" },
      { id: 58, text: "I've experimented with supplements, cold exposure, or biohacking protocols to optimize my biology" },
      { id: 59, text: "If I took a dopamine fast (24 hours, zero stimulation), I would find it almost impossible" },
      { id: 60, text: "My body is a tool I actively maintain and upgrade, not something I just inhabit" },
    ]
  },
  {
    id: "seduction",
    name: "SEDUCTION",
    desc: "Your social calibration, reading ability, subcommunication, and attraction dynamics",
    questions: [
      // Social Calibration (5)
      { id: 61, text: "I can enter any social environment and quickly identify the power dynamics" },
      { id: 62, text: "I adapt my communication style to different people without conscious effort" },
      { id: 63, text: "I'm often the person others look at for reactions and social cues" },
      { id: 64, text: "I feel uncomfortable or anxious in unfamiliar social situations" },
      { id: 65, text: "I can hold attention in a group without raising my voice or dominating the conversation" },
      // Reading People (5)
      { id: 66, text: "I can detect when someone is being inauthentic within the first 2 minutes" },
      { id: 67, text: "I read emotional states through micro-expressions and body language shifts" },
      { id: 68, text: "I understand what someone really wants even when their words say something different" },
      { id: 69, text: "I can predict how someone will behave based on their personality patterns" },
      { id: 70, text: "I often miss social cues or realize too late what someone was really communicating" },
      // Subcommunication & Presence (5)
      { id: 71, text: "My body language, tonality, and words all communicate the same message — I'm congruent" },
      { id: 72, text: "I command attention when I walk into a room without needing to announce myself" },
      { id: 73, text: "My eye contact is deliberate — I know when to hold it and when to break it" },
      { id: 74, text: "I tend to take up less physical space than I should — I make myself smaller" },
      { id: 75, text: "People have described me as 'magnetic' or 'hard to read' or 'mysteriously confident'" },
      // Tension & Attraction (5)
      { id: 76, text: "I can create and sustain tension in a conversation without feeling the need to resolve it" },
      { id: 77, text: "I understand push/pull dynamics and use them naturally in interactions" },
      { id: 78, text: "I seek validation from others — I need external confirmation that I'm doing well" },
      { id: 79, text: "I can walk away from any social situation or person without emotional attachment" },
      { id: 80, text: "The person who cares least in an interaction holds the power — and I understand how to embody that" },
      // Rapport & Influence (5)
      { id: 81, text: "I can engineer rapport deliberately — mirroring, matching, calibrated vulnerability" },
      { id: 82, text: "People tend to open up to me quickly, often sharing things they don't tell others" },
      { id: 83, text: "I can persuade someone to change their position without them feeling pressured" },
      { id: 84, text: "I struggle to assert my needs or boundaries in relationships" },
      { id: 85, text: "I understand that the strongest form of persuasion is making the other person feel they came to the conclusion themselves" },
      // Scenario-Based (5)
      { id: 86, text: "At a networking event where I know nobody, I'd approach groups confidently and lead the conversation within 5 minutes" },
      { id: 87, text: "If someone tried to AMOG me (assert dominance over me in a group), I'd deflect with humor and reframe rather than compete directly" },
      { id: 88, text: "I can tell within 30 seconds of meeting someone whether they're in Parent, Adult, or Child ego state" },
      { id: 89, text: "When someone I'm interested in pulls away, my instinct is to give space (not chase)" },
      { id: 90, text: "I've noticed that when I stop trying to impress people, they become more interested in me" },
    ]
  },
  {
    id: "money",
    name: "MONEY",
    desc: "Your risk wiring, delayed gratification, selling psychology, and value creation patterns",
    questions: [
      // Risk & Decision Making (5)
      { id: 91, text: "I can make high-stakes decisions quickly without paralysis" },
      { id: 92, text: "I tend to over-research and over-plan instead of executing" },
      { id: 93, text: "I'm comfortable investing money in myself (courses, tools, coaching) before I see the return" },
      { id: 94, text: "I calculate expected value before making financial decisions — not just gut feel" },
      { id: 95, text: "I avoid financial risk even when the potential upside significantly outweighs the downside" },
      // Delayed Gratification (5)
      { id: 96, text: "I can work for months on something with zero visible results and maintain intensity" },
      { id: 97, text: "I frequently pivot to new ideas when the current one doesn't show quick returns" },
      { id: 98, text: "I understand that compound effects mean early results are always the slowest" },
      { id: 99, text: "I've sacrificed short-term pleasure for long-term positioning and don't regret it" },
      { id: 100, text: "I get frustrated when effort doesn't translate to immediate results" },
      // Selling & Persuasion (5)
      { id: 101, text: "I understand that people buy emotionally and justify logically" },
      { id: 102, text: "I can frame an offer so the prospect feels they'd lose more by NOT buying" },
      { id: 103, text: "I'm uncomfortable with the idea of 'selling' — it feels manipulative" },
      { id: 104, text: "I can identify which of the 7 buyer types someone is within a conversation" },
      { id: 105, text: "I understand pricing psychology — anchoring, decoys, pain of paying" },
      // Value Creation (5)
      { id: 106, text: "I think in terms of creating value for others as the mechanism for generating wealth" },
      { id: 107, text: "I can identify market gaps and unmet needs that others miss" },
      { id: 108, text: "I have multiple potential income streams I could activate if needed" },
      { id: 109, text: "I consume more than I create — I spend more time learning than building" },
      { id: 110, text: "I understand that attention is currency and I'm building systems to capture it" },
      // Scarcity vs Abundance (5)
      { id: 111, text: "I operate from an abundance mindset — there's always more money to be made" },
      { id: 112, text: "I hoard resources out of fear rather than deploying them strategically" },
      { id: 113, text: "I'm willing to spend money to save time — my time is my most valuable asset" },
      { id: 114, text: "I've built or am building assets that generate income while I sleep" },
      { id: 115, text: "Money decisions stress me out — I avoid looking at my finances" },
      // Scenario-Based (5)
      { id: 116, text: "Someone offers me a guaranteed £500 or a 50% chance of £1500 — I'd take the gamble" },
      { id: 117, text: "If my current business model showed zero results after 60 days, I'd stick to the plan for the full 90 days rather than pivot" },
      { id: 118, text: "I could write a sales page that uses anchoring, loss framing, and social proof without a template" },
      { id: 119, text: "I know exactly what my next 90-day financial goal is and the specific actions needed to hit it" },
      { id: 120, text: "I'd rather build a business around my psychology knowledge than get a high-paying job" },
    ]
  },
];

const SCALE_LABELS = [
  { value: 1, label: "Disagree", short: "Disagree" },
  { value: 2, label: "Slightly Disagree", short: "Slightly Disagree" },
  { value: 3, label: "Neutral", short: "Neutral" },
  { value: 4, label: "Slightly Agree", short: "Slightly Agree" },
  { value: 5, label: "Agree", short: "Agree" },
];

// ═══════════════════════════════════════════════════════════════
// QUIZ QUESTIONS FOR COURSES
// ═══════════════════════════════════════════════════════════════

const QUIZ_BANK = {
  // ── THE GAME LAYER (TRANSACTIONAL ANALYSIS) QUIZZES ──
  "gl-1-5": [
    { type: "mc", q: "The three hungers are:", opts: ["Power, money, status", "Stimulus, recognition, structure", "Food, water, shelter", "Attention, validation, approval"], correct: 1 },
    { type: "tf", q: "A person would rather receive a negative stroke than no stroke at all.", correct: true },
    { type: "mc", q: "A 'stroke' is:", opts: ["A type of manipulation", "Any unit of recognition that you exist", "A compliment only", "A physical touch only"], correct: 1 },
    { type: "scenario", q: "A colleague keeps failing in loud, visible ways. The game-layer reframe is to ask:", opts: ["Why are they so incompetent?", "Why do they need recognition this badly, and why only negative?", "How do I get them fired?", "Nothing — ignore it"], correct: 1 },
    { type: "mc", q: "Which time-structure has the highest stroke potential and the highest risk?", opts: ["Rituals", "Pastimes", "Intimacy", "Withdrawal"], correct: 2 },
    { type: "tf", q: "You can permanently satisfy the three hungers by front-loading strokes and structure.", correct: false },
  ],
  "gl-2-4": [
    { type: "mc", q: "The Parent ego state primarily:", opts: ["Processes current data", "Plays back recordings from authority figures", "Reacts with raw emotion", "Calculates probabilities"], correct: 1 },
    { type: "tf", q: "The Adult is the only ego state genuinely capable of learning and updating.", correct: true },
    { type: "mc", q: "Under stress, people tend to:", opts: ["Stay firmly in Adult", "Drop out of Adult into Parent or Child because those are cheaper", "Become more logical", "Stop having ego states"], correct: 1 },
    { type: "scenario", q: "Someone lectures you using 'you always' and 'you should.' Which ego state is active?", opts: ["Adult", "Critical Parent", "Natural Child", "None"], correct: 1 },
    { type: "mc", q: "Berne located the real drives, wants, and fears — 'the power' — in the:", opts: ["Parent", "Adult", "Child", "Superego"], correct: 2 },
    { type: "tf", q: "Games are usually played Adult to Adult on the psychological level.", correct: false },
  ],
  "gl-3-3": [
    { type: "mc", q: "A complementary transaction is one where:", opts: ["The lines cross", "The response matches the ego state addressed", "Communication breaks down", "Someone lies"], correct: 1 },
    { type: "tf", q: "A crossed transaction tends to stop or derail communication.", correct: true },
    { type: "mc", q: "The 'psychological level' of a transaction is:", opts: ["What is literally said", "What is actually being communicated underneath", "The grammar used", "The volume of speech"], correct: 1 },
    { type: "scenario", q: "'This is our best model, but I'm not sure it fits your budget.' The hidden psychological message targets the:", opts: ["Adult, with neutral info", "Child, with a dare to prove they can afford it", "Parent, with a rule", "Nobody"], correct: 1 },
    { type: "mc", q: "When a reasonable-sounding statement creates a strong pull in you to prove yourself or defend, that pull is:", opts: ["The social level", "The psychological level landing", "Irrelevant", "Always genuine"], correct: 1 },
    { type: "tf", q: "The outcome of a game is determined by the social level, not the psychological one.", correct: false },
  ],
  "gl-4-4": [
    { type: "mc", q: "The four defining features of a game are:", opts: ["Loud, fast, public, fun", "Ulterior, patterned, predictable, payoff", "Honest, open, clear, kind", "Random, novel, surprising, rare"], correct: 1 },
    { type: "tf", q: "Games are usually conscious strategies the player has deliberately chosen.", correct: false },
    { type: "mc", q: "In the game sequence, the 'gimmick' is:", opts: ["The opening move", "The vulnerability in the target the hook exploits", "The final payoff", "The confusion"], correct: 1 },
    { type: "scenario", q: "Someone blacks out the night before a major test of their ability. In game terms this is most likely:", opts: ["Bad luck", "Self-sabotage that creates an alibi against 'I'm not good enough'", "A scheduling error", "Genuine relaxation"], correct: 1 },
    { type: "mc", q: "Why does insight alone rarely stop a game?", opts: ["People are stupid", "The six simultaneous payoffs are too comprehensive to give up easily", "Games aren't real", "Insight always stops games"], correct: 1 },
    { type: "tf", q: "Every game tends to end by confirming the players' existing beliefs about themselves.", correct: true },
  ],
  "gl-5-5": [
    { type: "mc", q: "In 'Why Don't You / Yes But,' the other person is really collecting:", opts: ["Useful solutions", "Proof that their situation is impossible", "New friends", "Money"], correct: 1 },
    { type: "tf", q: "'Ain't It Awful' bonds people through shared complaint while quietly avoiding any action.", correct: true },
    { type: "mc", q: "In 'If It Weren't For You,' the restriction the person complains about often:", opts: ["Was forced on them randomly", "Protects them from facing what they claim to want", "Has no psychological function", "Is always removable easily"], correct: 1 },
    { type: "scenario", q: "Someone documents enormous effort but produces no results and seems to want praise for trying. The honest response is to:", opts: ["Gush over the effort", "Examine the method and redirect to the outcome", "Attack them for failing", "Ignore them"], correct: 1 },
    { type: "mc", q: "In 'Indigence' (the endless seeker), the most freeing move is to:", opts: ["Chase harder", "Map whether they're a real buyer and stop investing if not", "Lower the price", "Beg them to commit"], correct: 1 },
    { type: "tf", q: "In 'Wooden Leg,' acknowledging the limitation as real AND asking 'given that, what can you do?' is a sound response.", correct: true },
  ],
  "gl-6-3": [
    { type: "mc", q: "The single best question to keep running in any interaction is:", opts: ["How do I win?", "What do they want, underneath?", "Am I smarter than them?", "How do I look?"], correct: 1 },
    { type: "tf", q: "Naming a game out loud to someone usually backfires and is often its own game.", correct: true },
    { type: "mc", q: "'I see everyone's games and play none' is:", opts: ["True mastery", "Itself a game (Psychiatrist), with a payoff of superiority", "Impossible", "The goal of the course"], correct: 1 },
    { type: "scenario", q: "You feel an automatic response being triggered and sense a rehearsed quality to the interaction. The recommended move is to:", opts: ["React faster", "Pause, stay in Adult, and ask what's expected of you", "Name the game immediately", "Leave without a word"], correct: 1 },
    { type: "mc", q: "Berne's goal of 'autonomy' is made up of:", opts: ["Power, money, status", "Awareness, spontaneity, and the capacity for intimacy", "Winning every game", "Never feeling emotion"], correct: 1 },
    { type: "tf", q: "The real destination of this material is manipulating people more efficiently.", correct: false },
    { type: "mc", q: "Spontaneity, in Berne's sense, means:", opts: ["Being impulsive", "The freedom to choose Parent, Adult, or Child as the situation genuinely calls for", "Always using Adult", "Reacting automatically"], correct: 1 },
    { type: "scenario", q: "Which structure actually feeds the hungers rather than just managing them?", opts: ["Withdrawal", "Rituals", "Games", "Intimacy"], correct: 3 },
  ],
  // ── MILLION DOLLAR SALES LETTERS (HALBERT) QUIZZES ──
  "hb-1-3": [
    { type: "mc", q: "In Halbert's hamburger-stand parable, the single advantage that beats all others is:", opts: ["The best meat", "The lowest price", "A starving crowd", "The best location"], correct: 2 },
    { type: "tf", q: "You should fall in love with your product first, then go find people who want it.", correct: false },
    { type: "mc", q: "The 'starving crowd' principle means:", opts: ["Make your copy more aggressive", "Find a market already desperate for what you sell before anything else", "Lower your price until people buy", "Use more bonuses"], correct: 1 },
    { type: "scenario", q: "You're about to write a sales letter. Per Halbert, your first move is to:", opts: ["Write a clever headline", "Identify who's already losing sleep over this problem", "Design the logo", "Pick the font"], correct: 1 },
    { type: "mc", q: "A mediocre offer to a ravenous market versus a brilliant offer to an indifferent market —", opts: ["The brilliant offer always wins", "The ravenous market wins almost every time", "They perform identically", "Neither sells"], correct: 1 },
    { type: "tf", q: "If you can't name your starving crowd, you're ready to write.", correct: false },
  ],
  "hb-2-4": [
    { type: "mc", q: "Halbert's order of importance for a campaign is:", opts: ["Copy, offer, market", "Market, offer, copy", "Offer, copy, market", "Copy, market, offer"], correct: 1 },
    { type: "tf", q: "Great copy can save a weak offer aimed at the wrong market.", correct: false },
    { type: "mc", q: "The 'A-pile' is:", opts: ["Obvious junk mail", "Personal-looking mail that gets opened eagerly", "Bills only", "Mail thrown away unopened"], correct: 1 },
    { type: "scenario", q: "You want your email opened. Applying the A-pile principle, you'd:", opts: ["Use a screaming all-caps promotional subject line", "Make it read like a message from a friend, not a broadcast", "Add more emojis and exclamation marks", "Send it from a no-reply corporate address"], correct: 1 },
    { type: "mc", q: "Halbert defined a sales letter as:", opts: ["Corporate communication", "Salesmanship in print", "Literature", "A legal document"], correct: 1 },
    { type: "tf", q: "You should write a sales letter to one specific person, not to a crowd.", correct: true },
  ],
  "hb-3-4": [
    { type: "mc", q: "AIDA stands for:", opts: ["Attention, Interest, Desire, Action", "Ask, Inform, Decide, Act", "Attract, Inspire, Deliver, Achieve", "Attention, Intent, Drive, Acquire"], correct: 0 },
    { type: "tf", q: "The only job of your headline is to get the first sentence read.", correct: true },
    { type: "mc", q: "The 'slippery slide' principle means:", opts: ["Make the reader work to continue", "Each element's job is to get the next element read", "Use long dense paragraphs", "End the copy as fast as possible"], correct: 1 },
    { type: "scenario", q: "A reader understands your letter but doesn't feel any pull to buy. Which AIDA stage is likely weak?", opts: ["Attention", "Desire", "Action", "None — it's the font"], correct: 1 },
    { type: "mc", q: "Reason-why copy works because:", opts: ["People ignore reasons", "The brain accepts claims that arrive with a believable reason attached", "Reasons make copy longer", "It hides the price"], correct: 1 },
    { type: "tf", q: "A vague reason ('limited spots') is more believable than a specific one ('I only take twelve clients a quarter').", correct: false },
  ],
  "hb-4-3": [
    { type: "mc", q: "In Halbert's hierarchy, the offer ranks:", opts: ["Below the copy", "Above the copy, below the market", "Above the market", "Equal to the copy"], correct: 1 },
    { type: "tf", q: "The goal of an offer is a fair, even trade.", correct: false },
    { type: "mc", q: "Sweetening an offer primarily means:", opts: ["Lowering the price to zero", "Stacking unexpected value so it dwarfs the price", "Removing the guarantee", "Hiding the bonuses"], correct: 1 },
    { type: "scenario", q: "At the decision point, the reader fears looking stupid if it doesn't work. The strongest fix is:", opts: ["A bold, specific guarantee that transfers the risk to you", "Raising the price", "Removing the deadline", "Adding more features"], correct: 0 },
    { type: "mc", q: "Per Halbert and reason-why, urgency should be:", opts: ["Faked with resetting timers", "Genuine, with a real reason behind the deadline", "Removed entirely", "Hidden from the reader"], correct: 1 },
    { type: "tf", q: "A common way to lose a sale you've already won is failing to clearly tell the reader exactly what to do next.", correct: true },
    { type: "mc", q: "The call to action should be:", opts: ["Vague and open-ended", "Explicit, simple, and frictionless", "Buried in the middle", "Optional"], correct: 1 },
    { type: "scenario", q: "You've built desire and removed risk, but sales are low. Per the course, check whether you've:", opts: ["Made the next step explicit and easy", "Added enough adjectives", "Used a bigger font", "Mentioned your company history"], correct: 0 },
  ],
  // ── BREAKTHROUGH COPYWRITING QUIZZES ──
  "bc-1-5": [
    { type: "mc", q: "Intensification builds desire by:", opts: ["Making more and bigger promises", "Presenting the same promise through different perspectives", "Repeating the core claim louder", "Lowering the price repeatedly"], correct: 1 },
    { type: "tf", q: "Repetition and reinforcement are the same thing.", correct: false },
    { type: "mc", q: "The 'Picture the Black Side' technique works by:", opts: ["Hiding the problem", "Painting the problem in full before applying the solution", "Only describing benefits", "Comparing prices"], correct: 1 },
    { type: "scenario", q: "You've described your result vividly, then put the reader in the scene living it. Per Schwartz, a strong next layer would be to:", opts: ["Repeat the description in the same words", "Stretch the benefit out over weeks and months", "End the copy immediately", "List your company's credentials"], correct: 1 },
    { type: "mc", q: "'Show How Easy' creates desire through:", opts: ["Technical detail", "The gap between tiny effort and massive benefit", "Long instructions", "Expert jargon"], correct: 1 },
    { type: "tf", q: "You should use all 13 intensification techniques in every piece of copy.", correct: false },
  ],
  "bc-2-4": [
    { type: "mc", q: "The 'longing for identification' is the desire for:", opts: ["Physical satisfaction", "Expression — acting out and announcing roles", "Lower prices", "More information"], correct: 1 },
    { type: "tf", q: "A prospect is more ready to believe a flattering character role you imply than your product's performance claims.", correct: true },
    { type: "mc", q: "Character roles differ from achievement roles in that character roles are:", opts: ["Titles that must be displayed", "Implied personality traits that are never openly claimed or tested", "Always about money", "Physical products"], correct: 1 },
    { type: "scenario", q: "A man buys a 150-mph sports car he only drives in slow traffic. Per Schwartz, the real purchase is:", opts: ["The engineering he'll use daily", "The role of 'successful sportsman' it gives him", "Fuel savings", "Resale value"], correct: 1 },
    { type: "mc", q: "The '50% rule' states that:", opts: ["Half of buyers want discounts", "At least half of all purchases can't be explained by function alone", "Products should cost half as much", "Half of copy should be images"], correct: 1 },
    { type: "tf", q: "You can force any identification onto a product regardless of its history or social associations.", correct: false },
  ],
  "bc-3-3": [
    { type: "mc", q: "Camouflage works by:", opts: ["Hiding the product entirely", "Borrowing believability from trusted editorial formats", "Using more superlatives", "Lowering the price"], correct: 1 },
    { type: "tf", q: "People sort content into two mental bins: editorial (trustworthy) and advertising (suspicious).", correct: true },
    { type: "mc", q: "When Schwartz rebuilt an ad to exactly match the Wall Street Journal's format, the result was:", opts: ["Lower response", "Roughly double the believability and pulling power", "No change", "Legal trouble"], correct: 1 },
    { type: "scenario", q: "Your bold claims are triggering instant skepticism in a publication with strong editorial identity. The camouflage move is to:", opts: ["Add more exclamation marks", "Match the publication's format, phraseology, and restrained tone", "Make the claims bigger", "Use a brighter color scheme"], correct: 1 },
    { type: "mc", q: "The Volkswagen ads demonstrate which camouflage method?", opts: ["Maximum hype", "Understatement — few adjectives, no superlatives", "Celebrity endorsement", "Fear appeals"], correct: 1 },
    { type: "tf", q: "Camouflage should be used even when the audience expects direct selling and the medium has no editorial identity to borrow.", correct: false },
  ],
  "bc-4-4": [
    { type: "mc", q: "Concentration is the process of:", opts: ["Praising your own product only", "Proving ineffectual the other ways of satisfying the prospect's desire", "Lowering prices below competitors", "Ignoring competition entirely"], correct: 1 },
    { type: "tf", q: "You should never attack a weakness unless you can provide the solution to that weakness at the same time.", correct: true },
    { type: "mc", q: "The core structure of concentration is:", opts: ["Good, good, good", "Bad — good, bad — good, repeated", "Price, price, price", "Question, answer, question"], correct: 1 },
    { type: "scenario", q: "Your prospect is loyal to a competitor and you're outspent ten to one. Per Schwartz, your first job is to:", opts: ["Outspend them on ads", "Prove their current method doesn't work, while offering your solution", "Lower your price to zero", "Copy their product exactly"], correct: 1 },
    { type: "mc", q: "Reframing ordinary diet plans as 'passive' is an example of:", opts: ["Understatement", "Redefinition as a weapon", "Social proof", "Guarantee as summary"], correct: 1 },
    { type: "tf", q: "'SHRINKS HEMORRHOIDS WITHOUT SURGERY' is concentration compressed into a single headline.", correct: true },
    { type: "mc", q: "In the 'Then vs Now' structure, the buried implication is that:", opts: ["The customer is to blame for past failure", "The method failed, not the person", "The product is too expensive", "Nothing can help them"], correct: 1 },
    { type: "scenario", q: "When should you NOT use concentration?", opts: ["When you're outspent", "When you dominate the field and your story stands alone", "When prospects use a competitor", "When direct comparison favors you"], correct: 1 },
  ],
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
  // ═══════════════ THE GAME LAYER (TRANSACTIONAL ANALYSIS) ═══════════════
  "gl-1-1": {
    title: "The Two Tracks — The Game Layer Is Always Running",
    sections: [
      { heading: "TWO TRACKS AT ONCE", body: "Every interaction you've ever had ran on two tracks at the same time. The words being said — and the game being played underneath. Most people only ever hear the words. They take what's said at face value, then wonder why conversations go sideways, why the same patterns repeat with different people, why they keep ending up in the same situations.\n\nIt's because they're reacting to the surface while the real exchange happens below it. Two unconscious programs running into each other and producing the same predictable output, every time." },
      { heading: "NO ONE OPTS OUT", body: "Here's the uncomfortable part: no one can stop playing games. You can't, and neither can the people around you. The game layer is always running. The only question is whether you can see it.\n\nThis isn't cynical. It's the foundation of a framework developed by the psychiatrist Eric Berne — Transactional Analysis. His whole point wasn't to make people better manipulators. It was the opposite: once you can see the games, you can finally choose which ones to play, when, and when to step out of them entirely — toward something real." },
      { heading: "WHY THIS MATTERS", body: "Once you see the game layer, everything changes. You stop taking provocations at face value. You stop getting pulled into roles you never agreed to. You start noticing the rehearsed quality of certain interactions — the sense that you're being slotted into someone's script.\n\nThis course gives you the map: the hungers that drive all of it, the three selves running inside every person, how transactions work, the anatomy of a game, the specific games you'll meet constantly, and the skill of seeing them in real time. The goal at the end isn't manipulation. It's clarity — and the genuine connection that becomes possible once the games are visible." },
    ],
  },
  "gl-1-2": {
    title: "The Three Hungers — Stimulus, Recognition, Structure",
    sections: [
      { heading: "STIMULUS HUNGER", body: "Humans run on three hungers, stacked on top of each other. The first is stimulus hunger — your nervous system requires input to function. Take away all input through sensory deprivation and the brain starts manufacturing its own: hallucinations within hours, breakdown within days. The system cannot tolerate emptiness.\n\nThe starkest evidence: infants who aren't touched can fail to develop and die — a condition once called marasmus, 'failure to thrive.' The body gives up when it gets no physical recognition that it exists. This is the floor everything else is built on: the body's raw requirement for input." },
      { heading: "RECOGNITION HUNGER", body: "As you grow, you can't be constantly held like an infant, so the nervous system learns to accept symbolic recognition instead. A look. A word. A nod. These become stand-ins for physical contact. The system adapts to run on symbols rather than touch.\n\nAny unit of recognition — any acknowledgment that you exist — is what Berne called a stroke. The next lesson covers strokes in depth, because they're the currency the entire game economy runs on. For now: the need to be recognized is not a weakness or a vanity. It's a biological hunger as real as the need for food." },
      { heading: "STRUCTURE HUNGER", body: "The third hunger is structure hunger. Time has to go somewhere. You wake up with sixteen hours of consciousness ahead of you, and the mind cannot tolerate large blocks of unstructured time — an empty calendar can feel like a low-grade existential threat, because at some level it's time you'll never get back being spent on nothing.\n\nSo we structure time compulsively, filling every gap with patterns and routines. These three hungers never get permanently full — you can't stockpile strokes or front-load structure. They regenerate constantly. That relentless, bottomless demand for input, recognition, and structure is the engine driving almost all human behavior." },
    ],
  },
  "gl-1-3": {
    title: "Strokes — Positive, Negative, and None",
    sections: [
      { heading: "THE THREE KINDS", body: "A stroke is any acknowledgment that you exist. There are three kinds. A positive stroke: 'I see you and I like what I see.' A negative stroke: 'I see you and I don't like what I see.' And no stroke: 'I don't see you at all.'\n\nThat third one is the killer. Here's the principle that explains an enormous amount of human behavior: a person would rather have a negative stroke than no stroke at all. Being disliked is better than being invisible — because dislike is still recognition, still contact, still input. Invisibility registers to the nervous system as a kind of starvation." },
      { heading: "WHAT THIS EXPLAINS", body: "Suddenly behaviors that look irrational make sense. The colleague who keeps failing in loud, visible ways. The person who starts conflict over nothing. They may be stroke-starved, and they've learned — often in childhood — that negative attention is easier to get than positive attention. So they optimize for it.\n\nThe reframe is powerful: when you see someone doing something that's guaranteed to get a negative reaction, don't ask 'why would they do that?' Ask 'why do they need recognition this badly, and why is negative the only kind they know how to get?' That question turns annoyance into understanding." },
      { heading: "THE ECONOMY OF ATTENTION", body: "People differ in their stroke economy. Someone who receives constant attention becomes saturated — more of the same does little. Someone who's rarely acknowledged is starved, and a single genuine stroke lands enormously.\n\nThis is worth understanding for relationships of every kind. The starved person isn't 'needy' for the sake of it — they're running on empty. The saturated person isn't 'cold' — their hunger is already met. Reading where someone sits on that spectrum tells you how your attention will actually land. Used with care, this builds genuine connection. Used to manipulate, it becomes a game — which is exactly what the rest of this course teaches you to recognize." },
    ],
  },
  "gl-1-4": {
    title: "The Six Ways We Structure Time",
    sections: [
      { heading: "FROM SAFEST TO RICHEST", body: "Berne mapped six ways humans structure time, ordered roughly by how much they risk and how many strokes they yield. Withdrawal: retreating into your own head — daydreams, fantasy. Safe, because no one else is involved, but no strokes either. Rituals: pre-programmed exchanges. 'How are you?' 'Fine.' No real information passes; just mutual acknowledgment that each exists.\n\nPastimes: semi-structured talk — weather, sports, the news. Fills time and generates some strokes, but stays safe because nothing real is exchanged. This is why pure small talk feels hollow: it's low-stroke by design." },
      { heading: "ACTIVITIES, GAMES, INTIMACY", body: "Activities: work and tasks, structured by external goals rather than social scripts. Games: the big one — ongoing patterns with a hidden agenda and a predictable payoff, which the rest of this course is about. And intimacy: game-free connection. Unscripted, vulnerable, the highest stroke potential of all — and therefore the highest risk.\n\nIntimacy is so exposed that most people experience it only a handful of times in their lives. The other five structures keep them safe. They also keep them a little starved." },
      { heading: "WHERE PEOPLE LIVE", body: "Most people spend their lives between withdrawal and games, occasionally dropping into a game without realizing it, almost never reaching intimacy. The structure of their days keeps them safe and keeps them hungry at the same time.\n\nGames are popular for a simple reason: they're efficient. They feed all three hungers at once — stimulation (something's happening), recognition (both players get strokes), and structure (the pattern is predictable). Games are the junk food of human interaction: fast, satisfying in the moment, and leaving you empty after. Intimacy is the real meal — slower, riskier, genuinely nourishing. Seeing the difference is the start of choosing it." },
    ],
  },
  "gl-2-1": {
    title: "The Parent — Your Recording System",
    sections: [
      { heading: "THE RECORDING", body: "You contain three distinct operating systems — not metaphors, but observable patterns with different voices, postures, and priorities. Berne called them Parent, Adult, and Child. The first is the Parent: your recording system. Everything you absorbed from authority figures in your earliest years — not just your actual parents, but teachers, older siblings, even TV characters your young brain coded as authority.\n\nThe key fact about the Parent: it doesn't think. It plays back recordings. When the Parent is running, you're not responding to the present — you're replaying responses programmed into you decades ago." },
      { heading: "TWO MODES", body: "The Parent runs in two modes. Critical Parent is the voice of judgment, rules, and prohibitions — 'you should,' 'you must,' 'that's wrong.' The internal policeman that tells you what you're doing wrong before you've even done it. (In Freudian terms, close to the superego.) Nurturing Parent is the voice of protection and care — 'be careful,' 'let me help,' 'you poor thing.' The internal mother hen.\n\nYou can spot the Parent in others fast. When someone lectures, moralizes, or talks in absolutes — always, never, should, ought — that's Critical Parent. When someone fusses and over-protects, that's Nurturing Parent. Same recording, different mode." },
      { heading: "WHY IT MATTERS", body: "Because the Parent is a recording, it activates automatically under stress and explains why people repeat their childhood patterns — why someone becomes their own parents even after swearing they never would. The tapes are deep.\n\nThere's a reading benefit here: when you catch the Parent firing in someone, you're getting a glimpse of how they were raised — the rules and tone their early authority figures used, played back through them in real time. That's not a tool for manipulation; it's a window into where a person is coming from, which lets you respond to the human in front of you instead of the recording running through them." },
    ],
  },
  "gl-2-2": {
    title: "The Adult — Your Processing System",
    sections: [
      { heading: "THE PROCESSOR", body: "The Adult is your processing system. Data in, analysis, output. No recordings, no automatic emotion — just computation. When the Adult is active, you're actually responding to what's in front of you: gathering information, weighing probabilities, making decisions based on current reality rather than old programming.\n\nThe Adult sounds like: what are the facts here? what's the likely outcome of each option? what do I actually know versus what am I assuming?" },
      { heading: "THE ONLY PART THAT LEARNS", body: "The Adult is the only part of you capable of genuine learning. The Parent just replays. The Child just reacts. Only the Adult actually processes new information and updates.\n\nBut it has a cost: the Adult is expensive to run. It takes energy and deliberate effort. Under stress, people drop out of the Adult and into Parent or Child, because those programs are cheaper — automatic responses instead of real-time processing. This is why people make their worst decisions when tired, threatened, or overwhelmed: the processor goes offline and the recordings take over." },
      { heading: "STAYING IN ADULT", body: "Much of self-mastery is the ability to stay in Adult when everything is pulling you into Parent or Child. The pause before reacting. The question 'what's actually happening here?' instead of the automatic response.\n\nYou can't be in Adult all the time — nor should you be; the Child holds your aliveness and the Parent holds useful values. But you want Adult available on demand, especially in the moments that matter. The whole skill of seeing games, which this course builds toward, depends on it: you cannot watch the game layer from inside an automatic reaction. You can only see it from Adult." },
    ],
  },
  "gl-2-3": {
    title: "The Child — Where the Power Lives",
    sections: [
      { heading: "THE ORIGINAL SYSTEM", body: "The Child is your original operating system — your responses from birth to about age five, preserved intact. All the needs, fears, joys, and survival strategies you developed before you could think abstractly. It runs in two modes. Natural Child is the uncorrupted original: spontaneous, curious, playful, creative — and also selfish and demanding. Raw aliveness, pure want and reaction.\n\nAdapted Child is the version that learned to modify itself to survive. Compliant Child learned obedience gets approval. Rebellious Child learned defiance gets attention. Withdrawn Child learned invisibility is safety." },
      { heading: "SPOTTING THE CHILD", body: "When someone giggles, pouts, sulks, throws a tantrum, rebels for no clear reason, or goes wide-eyed with wonder — the Child is active. It's the most visible of the three states once you know what you're looking at.\n\nAnd here's the central insight: this is where all the real juice is. The wants. The fears. The motivations. The drives that actually determine behavior. Parent is programming. Adult is processing. Child is power." },
      { heading: "WHY GAMES LIVE HERE", body: "Games are played Child to Child, even when they look like calm Adult conversations on the surface. The real transaction is almost always happening at the Child level — under the reasonable words, two Children are reacting to each other.\n\nThis is why purely logical arguments so often fail to move people: you're addressing the Adult while the decision is being made by the Child. Understanding this changes how you communicate — and, crucially, how you read what's really going on. When you feel an interaction getting charged or strange, look past the words and ask which Child is reacting to what. That's where the truth of the exchange is." },
    ],
  },

  // ─── Game Layer continued: Transactions & The Game OS ───
  "gl-3-1": {
    title: "Complementary & Crossed Transactions",
    sections: [
      { heading: "WHAT A TRANSACTION IS", body: "A transaction is one ego state in you activating an ego state in someone else and getting a response. That's the basic unit of all communication. When the response matches what was sent, communication flows. When it doesn't, communication breaks.\n\nComplementary transactions are when the response matches what was requested. Adult to Adult: 'What time is it?' 'Three o'clock.' Parent to Child: 'Did you finish the report?' 'Yes, it's done.' The lines stay parallel — the exchange can continue indefinitely because each person is getting the response their ego state expected." },
      { heading: "CROSSED TRANSACTIONS", body: "Crossed transactions are when the response comes from a different ego state than the one addressed. Someone asks 'What time is it?' — a simple Adult-to-Adult question — and gets back 'Why do you always need to know everything?' That answer came from Parent, treating the asker like a Child.\n\nThe lines cross. Communication stops. Confusion, friction, the sense of being wronged. This is where most everyday conflict originates: someone sends a transaction expecting one kind of response and gets a different one, and both people end up irritated without quite knowing why." },
      { heading: "USING THE MODEL", body: "The first-level fix is simple: notice which ego state someone is transacting from, and respond deliberately rather than automatically. If they send Adult, meeting them with Adult keeps it clean. If a crossed transaction is heating things up, you can consciously re-cross it back toward Adult to cool it down.\n\nBut there's a catch that the next lesson unpacks: most transactions aren't actually what they appear to be on the surface. The words say one thing while a second, hidden message runs underneath — and that hidden layer is where games live." },
    ],
  },
  "gl-3-2": {
    title: "The Two Levels — Social vs Psychological",
    sections: [
      { heading: "TWO MESSAGES AT ONCE", body: "Every transaction can carry two levels at the same time. The social level is what's literally being said. The psychological level is what's actually being communicated underneath. When the two don't match, the psychological level is the one that determines the outcome.\n\nA classic example: a salesperson says, 'This is our best model, but I'm not sure it's right for your budget.' On the social level that's Adult to Adult — neutral information about a product. On the psychological level it's aimed at the Child: 'I dare you to prove you can afford it.'" },
      { heading: "THE HIDDEN ARROW", body: "If the customer replies 'I'll take it,' the social level looks like a calm Adult purchasing decision. The psychological level is the Child responding to a dare: 'I'll show you.' The surface said one thing; the real transaction was the salesperson's words targeting the part of the customer that can't resist a challenge.\n\nThis is how games work. The surface transaction always looks reasonable — that's the disguise. The real transaction runs underneath, Child to Child, and the outcome is set by the psychological level, not the social one." },
      { heading: "READING THE REAL MESSAGE", body: "Once you know to look for it, you start hearing the second message. The 'innocent' question with an edge. The compliment that's really a test. The offer of help that's really a bid for control. The words give you the social level; tone, timing, body language, and the feeling in your gut give you the psychological one.\n\nThe defensive value is enormous: when a reasonable-sounding statement produces a strong pull in you — to prove yourself, to defend, to rescue, to comply — that pull is the psychological level landing. Naming it to yourself ('what's the real arrow here?') pulls you back into Adult and out of the game before it runs." },
    ],
  },
  "gl-4-1": {
    title: "The Anatomy of a Game",
    sections: [
      { heading: "WHAT A GAME IS", body: "A game is an ongoing series of transactions with a hidden agenda that produces a predictable outcome. Four features define it. Ulterior: there's something running underneath the surface. Patterned: specific moves in a specific sequence. Predictable: it ends the same way every time. Payoff: someone collects something at the end — usually a familiar bad feeling that confirms how they already see the world.\n\nGames look like normal interaction. That's the disguise. Underneath, they're structured programs running toward a preset outcome — and the players usually don't know they're running them." },
      { heading: "THE SEQUENCE", body: "Every game follows the same skeleton: hook + gimmick → response → switch → crossup → payoff. The hook is the opening move, reasonable on the surface. The gimmick is the vulnerability in the target the hook exploits — the need to help, to be right, to rescue, to prove oneself. Everyone has gimmicks.\n\nThe response is the target taking the bait, because their gimmick got activated. The switch is when the game-player suddenly changes the rules — what looked like one kind of interaction becomes another. The crossup is the moment of confusion: 'wait, what just happened?' And the payoff is when both players collect their reward — usually feelings that confirm each one's existing worldview." },
      { heading: "WHY NEITHER PLAYER SEES IT", body: "The critical point: games are unconscious. Learned in childhood, repeated compulsively. The player thinks they're just living their life — they don't realize they keep landing in the same situation because they keep running the same program. Both people genuinely believe the surface story. The game runs itself, and neither sees it.\n\nThe training move is simple. After any interaction that left you frustrated or confused, ask: what was the surface transaction? what was the psychological one? what was the payoff for each of us? Do that for a week and the patterns start jumping out — first in others, eventually in yourself." },
    ],
  },
  "gl-4-2": {
    title: "Why Games Are So Hard to Stop",
    sections: [
      { heading: "SIX PAYOFFS AT ONCE", body: "Games are persistent because they pay out on six levels simultaneously — stopping means giving up all six at once. Internal psychological: the game reinforces your self-image ('I'm helpful,' 'I'm a victim,' 'I'm smarter than everyone'). External psychological: it protects you from situations that would challenge that image. Internal social: it gives intimate relationships a shared script — a routine to fall into.\n\nExternal social: it provides content for conversation with others ('you won't believe what happened to me'). Biological: it delivers strokes, even negative ones — the fight is still contact, the drama is still stimulation. Existential: it confirms your deepest belief about reality ('people always let me down,' 'I'm not good enough')." },
      { heading: "THE CORE INSIGHT", body: "Underneath all six is one truth worth keeping: people are constantly trying to confirm what they already believe about themselves and the world. The mind hates dissonance, so it engineers evidence for its existing position — every single time.\n\nThis is why insight alone rarely stops a game. Knowing you're playing isn't enough, because the benefits are too comprehensive. It's also why self-sabotage is so common: a person can unconsciously arrange to fail in a way that protects them from a worse fear. If they fail while not really trying, they never have to face the question 'what if I tried my hardest and still wasn't enough?' The failure becomes the safer option." },
      { heading: "THE SCAPEGOAT", body: "Watch for the scapegoat move: the 'something' a person can pin the blame on so they never have to face the real fear. 'It wasn't me, it was the circumstances.' It's the Child escaping the Parent — finding an alibi.\n\nUnderstanding this changes how you respond to people stuck in patterns, and how you treat yourself. You don't break a game by exposing it cleverly (that's usually its own game). You break it by finding the payment — what is each person getting out of this, even though it feels bad? — and by being willing to give up your own payoff. That last part is the hard one, and it's where real change starts." },
    ],
  },
  "gl-4-3": {
    title: "The Degree System",
    sections: [
      { heading: "SAME GAME, DIFFERENT STAKES", body: "The same game can be played at very different intensities. Berne described three degrees. First degree is socially acceptable — small stakes, minor payoff, the kind of thing you'd mention to a friend and you'd both shrug about. Second degree is not discussed openly — the players hide the damage, and the consequences quietly affect relationships, careers, and finances.\n\nThird degree plays for keeps — the version that ends in real, lasting damage: the hospital, the courtroom, ruined lives. The structure of the game is the same at every degree; only the stakes change." },
      { heading: "ASSESS THE DEGREE FIRST", body: "When you identify a game, immediately assess its degree, because that decides how to handle it. A first-degree game can sometimes be engaged with lightly — the stakes are trivial. A higher-degree game is one to step out of entirely, because the consequences down the line are real.\n\nThe rule of thumb: never get pulled into a game whose payoff will cost you something you can't afford to lose. If your gut says an interaction is escalating past the trivial, that's the signal to disengage rather than 'win.'" },
      { heading: "THE THROUGH-LINE", body: "Remember the core fact across all degrees: every game ends by confirming the players' beliefs about themselves. Someone who sees themselves as 'always used' will tend to act in ways that get them used again — not because the world forces it, but because the subconscious resists contradicting itself.\n\nThis applies far beyond conflict. A salesperson who believes 'my product doesn't really sell' will subtly behave in ways that make sure it doesn't, because selling it would contradict the belief and the mind hates contradiction. The way out is upstream: change the belief, and the behavior — and the games it generates — change with it." },
    ],
  },

  // ─── Game Layer continued: The Games & The Meta-Skill ───
  "gl-5-1": {
    title: "'Why Don't You / Yes But' & 'Ain't It Awful'",
    sections: [
      { heading: "WHY DON'T YOU / YES BUT", body: "The most common game there is — you'll see it several times a day. Someone presents a problem with an undertone of helplessness. You offer a solution. They reply 'yes, but…' — I tried that, that won't work, you don't understand my situation. Every suggestion gets a reasonable-sounding rejection until you run dry and fall silent.\n\nThe hook is your need to be helpful, your identity as a capable person with good advice. What's really happening: they aren't collecting solutions, they're collecting proof that their situation is impossible. Your suggestions are ammunition, not assistance. The payoff for them: 'no one can help me, so I'm justified in staying stuck.' For you: 'I tried to help and got rejected.' Both positions confirmed." },
      { heading: "HOW TO STEP OUT", body: "You have options once you see it. Decline to play — don't supply the thing they need to 'yes but.' 'That sounds genuinely hard.' Silence. If they ask what they should do: 'I think you'll figure it out.' Or redirect to Adult: 'You know your situation better than I do — if you had to take one action in the next 24 hours, what would it be?' That hands responsibility back while staying warm.\n\nYou can even agree with the stuck position: 'You're right, maybe nothing would work.' Strangely, people often start arguing for solutions when you stop supplying them. The one danger: don't deploy this when someone genuinely wants help. The tell is whether they engage seriously with the first suggestion or immediately reach for 'yes but.'" },
      { heading: "AIN'T IT AWFUL", body: "The default social pastime. 'Terrible weather, eh?' 'Can you believe what they did?' The conversation centers on something bad, and each person contributes more examples of the awfulness. The energy is negative and oddly satisfying — it's bonding through shared complaint, an 'us versus them' that feels like connection but is really a mutual agreement not to do anything.\n\nIf you don't want to invest in this person, you can simply not add fuel — minimal acknowledgment, no content, and the game starves out. If you do want to connect, you can play along lightly ('especially when X happens') and they'll warm to you, because you accepted the invitation. Or you can redirect to agency — 'yeah, that's frustrating; what are you going to do about it?' — which gently tests whether they want to vent or actually move." },
    ],
  },
  "gl-5-2": {
    title: "'Look How Hard I've Tried' & 'If It Weren't For You'",
    sections: [
      { heading: "LOOK HOW HARD I'VE TRIED", body: "Common everywhere, especially at work. Someone documents their effort in detail — everything they attempted, how much they put in. The effort itself is presented as the achievement, while the actual results are poor or missing. The hook is your respect for effort, the cultural rule that trying hard is virtuous, your reluctance to criticize someone clearly working.\n\nWhat's really happening: the effort is often chosen precisely because it looks impressive but won't work — it's an alibi for the absent result. A scapegoat. The honest response isn't to gush over the effort or to attack it; it's to examine the method ('walk me through how you decided what to try') and redirect to the outcome. One caution: genuine effort should be recognized — this game is specifically about effort performed as a substitute for results, not real work that happened to fall short." },
      { heading: "IF IT WEREN'T FOR YOU", body: "A classic relationship game. Someone repeatedly complains that another person's restrictions stop them from doing something they claim to want — and they've been complaining for years without changing anything. Suggest solutions and they explain why each won't work. The hook is your sympathy and your belief that they're a victim of circumstance.\n\nWhat's really happening, in Berne's analysis: they unconsciously chose the restrictor, because the restriction protects them from having to face what they say they want. Someone who insists their partner 'won't let' them pursue a dream may be quietly grateful for the excuse — because pursuing it would mean risking failure at the thing itself. The restriction is the shield." },
      { heading: "STEPPING OUT OF IT", body: "The move is hypothetical removal: 'If that obstacle vanished tomorrow, what would you actually do?' This reveals whether they want the thing or just want to want it. Often the answer is vague — because the obstacle was never really the problem.\n\nYou can also probe the choice gently rather than rescue or argue. What you're refusing to do is the two roles the game offers: cheerleading the victim, or playing the villain who tells them they're 'just making excuses.' Both keep the game running. Genuine questions, held with patience, give them room to notice the pattern themselves — which is the only way it ever shifts." },
    ],
  },
  "gl-5-3": {
    title: "'Courtroom', 'Uproar' & 'Wooden Leg'",
    sections: [
      { heading: "COURTROOM", body: "Common in relationships, epidemic in breakups. A dispute gets presented to you as a case requiring judgment. Each side lays out evidence; third parties get recruited as jury. The real goal isn't resolution — it's being declared right. The hook is your sense of fairness and your belief that if you just understand both sides, you can help.\n\nWhat they actually want is the stroke of 'you're right.' Whoever's side you pick will like you for it — which is exactly why playing judge is a trap. The way out is to decline the role: 'I'm not going to rule on who's right. What does each of you actually want here?' That redirects from verdict to need, which is where anything useful lives." },
      { heading: "UPROAR", body: "A fight erupts seemingly out of nowhere — escalating until someone storms off and physical or emotional distance is achieved. Later, both people genuinely wonder how it started. The hook is whatever reliably triggers your anger; they'll find it.\n\nWhat's really happening: the fight is an avoidance mechanism. One or both people fear the closeness that was approaching, and the uproar manufactures distance that now feels justified. Recognizing it is most of the defense — when a conflict flares with strange speed right before a moment of connection, that timing is the tell. You don't have to take the bait; naming to yourself 'this is creating distance, not resolving anything' lets you stay in Adult instead of getting pulled into the blow-up." },
      { heading: "WOODEN LEG", body: "A handicap — real or perceived — is invoked to excuse all failures. 'What do you expect from someone with my anxiety / my background / my history?' The question is rhetorical; the answer they want is 'nothing — we expect nothing from you.' The handicap is never worked around, because any improvement would threaten the excuse. The hook is your compassion and your reluctance to push someone with a genuine difficulty.\n\nThe honest, respectful response holds both things at once: acknowledge the limitation as real, then ask 'given that, what can you do?' That refuses to pretend the difficulty doesn't exist while also refusing to accept it as a permanent exemption. Often there's a pause — because they haven't considered an answer other than 'nothing.' That pause is where growth can start." },
    ],
  },
  "gl-5-4": {
    title: "'I'm Only Trying to Help', 'Indigence' & 'Peasant'",
    sections: [
      { heading: "I'M ONLY TRYING TO HELP", body: "High frequency in helping roles. Someone is intensely helpful — but the help never quite works, and the helper seems to need the helping more than you need the help. When help succeeds, they seem oddly deflated. The hook is your willingness to accept help and your assumption that helpers want you to succeed.\n\nWhat's really happening: they need to be needed. Your success threatens them because it ends the relationship that gives them their role, so they help in ways that keep you dependent while they get to feel virtuous. The recognition skill: notice when 'help' consistently leaves you more dependent rather than more capable. Real help works to make itself unnecessary; this game works to make itself permanent." },
      { heading: "INDIGENCE", body: "Common in client and sales contexts. Someone seeks endlessly — engaged, interested, asking — but never actually commits. There's always a reason this opportunity isn't quite right. The hook is your hope that enough nurturing will eventually convert them. What's really happening: the seeking is the game, not a step toward a decision. They get the feeling of shopping, the attention, the sense of possibility — without ever having to risk, commit, or spend.\n\nThe move is simple and freeing: map whether someone is an actual buyer, and if not, stop investing. In a sales setting you can disqualify honestly — 'based on what you've described, this probably isn't the right fit; best of luck finding something that is.' Reversing the dynamic — releasing instead of chasing — both respects your time and, occasionally, snaps a genuine prospect out of the pattern." },
      { heading: "PEASANT", body: "Common in expert/client relationships. Someone admires your expertise intensely — deep interest in your methods, flattery that runs a little hot — but nothing in their situation ever changes. The hook is your ego, the pleasure of being appreciated by someone who 'really gets it.'\n\nWhat's really happening: the admiration is the game. Genuine students implement and come back with results and questions; this player comes back with more admiration and no action — trapped in a thinking loop rather than a doing loop. Recognize the difference and don't mistake praise for progress. The kind response is to keep redirecting toward action ('what will you actually do with this?'), because admiration that never converts helps no one — least of all them." },
    ],
  },
  "gl-6-1": {
    title: "Seeing the Game Layer in Real Time",
    sections: [
      { heading: "A TRAINABLE SKILL", body: "Knowing the games isn't enough — you have to see them while they're happening. This is trainable, in stages. Start with post-hoc analysis: after each significant conversation, ask what was the surface transaction, what was the psychological one, which ego states were active, what was the payoff for each person. Do it for a week and patterns start surfacing.\n\nThen delayed recognition — the same questions within an hour, the gap closing. Then real-time recognition — catching the game as the first move is made. Then, eventually, preemptive recognition: knowing someone's favorite game before you even engage, by watching how they interact with others and what roles they cast themselves in." },
      { heading: "THE SIGNALS", body: "A few signals tell you a game is starting: the transaction feels subtly off; your automatic response is being triggered; you feel yourself being pulled into a role; there's a rehearsed quality to what's happening. When you notice these, pause. Don't respond on autopilot. Ask: what game is starting, what response is expected, and what happens if I don't provide it?\n\nThat pause is worth more than any technique. It pulls you out of System 1 and into Adult, where you can actually choose. And silence, in that pause, is fine — it carries composure, not weakness. You're allowed to respond at your own pace rather than the speed the game wants." },
      { heading: "THE ONE QUESTION", body: "If you keep a single question running in every interaction, make it this: what do they want? Not the surface request — the real one underneath. The recognition, the stroke, the confirmation of some belief about themselves.\n\nA companion practice: notice your own ego-state shifts for a day. When do you drop into Parent? What pulls you into Child? What brings you back to Adult? You can't control what you can't see — and the same lens you use to read others is the one that, turned inward, finally lets you read yourself." },
    ],
  },
  "gl-6-2": {
    title: "Stepping Outside — Autonomy & Real Connection",
    sections: [
      { heading: "WHERE THE FRAMEWORK ENDS", body: "This map has limits, and honesty about them is part of using it well. Not everything is a game — some people are simply direct, and some interactions are exactly what they appear to be. Reading games into everything is its own distortion.\n\nNaming a game out loud usually backfires, too. Telling someone 'you're running a predictable pattern on me' tends to feel like an attack — especially when you're right — and it's often just your own game: the hunger to be stroked for your cleverness. Before naming anything, ask whether the person can actually hear it, and whether it would help them or just make you feel sharp." },
      { heading: "YOU'RE PLAYING TOO", body: "The most important humility: you're in the games, not above them. You have default games you run unconsciously. 'I see everyone's games and play none' is itself a game — Berne literally named it (Psychiatrist), and its payoff is superiority. The framework can quietly become a meta-game where you collect proof of how perceptive you are.\n\nSo hold it lightly. The point of seeing the game layer was never to win more or to manage people more efficiently. Used that way, it curdles — and people feel it. The point is clarity: seeing what's actually in front of you instead of what your programming expects to see." },
      { heading: "AUTONOMY AND INTIMACY", body: "Berne's actual goal for all of this was autonomy — three capacities working together. Awareness: perceiving reality directly, past the filters. Spontaneity: the freedom to choose your response rather than fire an automatic one — accessing Parent, Adult, or Child as the situation genuinely calls for, instead of being locked in one. And the capacity for intimacy: game-free connection, the one structure that actually feeds the hungers instead of just managing them.\n\nThat's the real destination. Games are the junk food; intimacy is the meal. Seeing the games clearly is what finally makes it possible to put some of them down — and to be, with the people who matter, something rarer than a skilled player: a real one. The map got you here. Now you walk it." },
    ],
  },

  // ═══════════════ MILLION DOLLAR SALES LETTERS (HALBERT) ═══════════════
  "hb-1-1": {
    title: "The Starving Crowd — The Only Question That Matters",
    sections: [
      { heading: "THE QUESTION", body: "Halbert used to ask his students one question. If you and I both opened a hamburger stand and competed, and you could have any single advantage you wanted — the best meat, the lowest price, the best location, the best buns — which would you take?\n\nStudents would pick all sorts of advantages. Then he'd say: I'll give you every advantage you named. I only want one thing in return. And with that one thing, I will destroy you every time. I want a starving crowd." },
      { heading: "MARKET BEFORE EVERYTHING", body: "The lesson underneath it is the most important in all of selling: the hungry market beats everything else. Before you obsess over your product, your copy, your headline, your price — find a crowd that is already desperate for what you're selling.\n\nMost people do this backwards. They fall in love with a product, then go hunting for someone to want it. The operator finds the starving crowd first, then feeds it. A mediocre offer to a ravenous market beats a brilliant offer to an indifferent one, every time." },
      { heading: "WATCH FOR IT", body: "Apply it before you write a single word. Who is already losing sleep over the problem you solve? Who is already spending money trying to fix it? Who is angry, scared, or obsessed about this exact thing right now?\n\nThat's your starving crowd. If you can't name them, you're not ready to write — you're ready to research. The biggest copywriting wins don't come from clever words. They come from pointing decent words at a market that was already starving before you showed up." },
    ],
  },
  "hb-1-2": {
    title: "Market, Offer, Copy — The Hierarchy",
    sections: [
      { heading: "THE ORDER OF POWER", body: "Halbert taught that the elements of a successful campaign have a strict order of importance. First the market — who you're selling to. Second the offer — what you're putting in front of them. Third, and only third, the copy — the words you use.\n\nMost beginners spend 90% of their energy on the copy, which is the least important of the three. The pros spend their energy in the right order: nail the market, build an irresistible offer, then write." },
      { heading: "WHY COPY IS LAST", body: "This isn't saying copy doesn't matter — it matters enormously. It's saying copy can't save a bad offer to the wrong market. The best sentence ever written, aimed at people who don't want the thing, sells nothing.\n\nThink of it like a fire. The market is the dry wood. The offer is the fuel. The copy is the match. A match thrown onto wet wood does nothing, no matter how good the match. But strike a match over dry wood soaked in fuel and the whole thing goes up. Your words are the match — and they only work when the first two layers are right." },
      { heading: "THE OPERATOR'S SEQUENCE", body: "Before writing, run the hierarchy. Is this market hungry and reachable? Is this offer something they'd feel stupid saying no to? Only when both are yes do you earn the right to worry about word choice.\n\nWhen a campaign fails, diagnose in the same order: market first (wrong people?), offer second (weak deal?), copy last. Beginners always blame the copy. The pros check the market first — because that's where most failures actually live." },
    ],
  },
  "hb-2-1": {
    title: "The A-Pile vs The B-Pile",
    sections: [
      { heading: "TWO PILES OF MAIL", body: "Halbert's most practical insight came from watching how people sort their mail. Everyone, he said, unconsciously splits their mail into two piles. The A-pile: personal letters — things that look like they came from a real human who knows you. The B-pile: obvious commercial mail, junk, anything that screams 'I am trying to sell you something.'\n\nThe A-pile gets opened first, eagerly. The B-pile gets opened later, reluctantly, or thrown away unopened." },
      { heading: "THE GOAL: LOOK LIKE A-PILE", body: "The entire battle is won or lost before your message is even read — at the moment someone decides which pile you're in. So the operator's job is to make commercial communication look and feel like personal communication.\n\nReal stamp instead of a printed indicia. Handwritten-style address. A plain envelope with no screaming offer on the outside. Anything that makes the recipient think 'this is a letter from a person,' not 'this is an ad.' The same principle maps directly to email subject lines and DMs today: the message that reads like it's from a friend gets opened; the one that reads like a broadcast gets deleted." },
      { heading: "WHY IT WORKS", body: "This is the same mechanism behind Schwartz's camouflage — people have their guard down for personal communication and up for advertising. Get into the A-pile and you bypass the guard entirely. You're being read by someone who's curious, not someone who's bracing to be sold.\n\nWatch your own inbox today. Notice which emails you open instantly and which you trash without thinking. The difference is almost never the offer — it's whether it pattern-matched to 'personal' or 'commercial' in the first half-second. That split-second is the whole game." },
    ],
  },
  "hb-2-2": {
    title: "Salesmanship in Print — Writing to One Person",
    sections: [
      { heading: "ONE READER, NOT A CROWD", body: "Halbert's definition of a sales letter: salesmanship in print. Not literature. Not corporate communication. A salesman, doing his job, on paper — talking to one person.\n\nThe fatal error is writing to a crowd. 'Dear valued customers, we are pleased to announce...' is the sound of a corporation broadcasting. Nobody feels spoken to. The operator writes 'Dear Friend' and then writes as if to a single human being sitting across the table." },
      { heading: "THE CONVERSATIONAL VOICE", body: "Read your copy out loud. If it sounds like a brochure, it's dead. If it sounds like one person talking to another — with contractions, short sentences, the rhythm of real speech — it's alive.\n\nHalbert wrote the way people actually talk. Simple words. Personal. Direct. He'd say something, then say 'Now, here's the thing...' and lean in, exactly like a friend telling you something they're excited about. The brain reads conversational copy as a person and corporate copy as a machine — and people buy from people, not machines." },
      { heading: "THE TEST", body: "Before sending anything, ask: does this sound like a letter from a friend who happens to have something great for me, or does it sound like a company talking at a market segment?\n\nThe 'one person' rule changes everything about how you write. You stop saying 'many of our customers find...' and start saying 'you're going to find...'. You stop hedging and start talking. Picture one specific person from your starving crowd, and write the whole thing to them alone. Everyone else reading it will feel like you're talking to them, too." },
    ],
  },
  "hb-2-3": {
    title: "The Grabber — Openings & Involvement Devices",
    sections: [
      { heading: "THE FIRST JOB", body: "Once the envelope is opened, you have seconds. The opening — Halbert's 'grabber' — has one job: stop them and pull them in before they drift away. Not to sell yet. Just to make stopping irresistible.\n\nA weak opening loses a reader who was willing to be sold. The grabber earns the right to the next sentence, which earns the right to the one after that." },
      { heading: "INVOLVEMENT DEVICES", body: "One of Halbert's signatures was the involvement device — a physical object or pattern interrupt that makes the reader engage before they can resist. He was famous for things like fixing a real coin or a small object to the top of a letter, then opening with a line that explained it.\n\nThe object creates instant curiosity and obligation — the eye goes to it, the hand touches it, and now the reader is involved. The modern equivalents are the open loop, the startling first line, the unexpected question. Anything that makes the brain go 'wait, what's this?' before it can go 'this is an ad.'" },
      { heading: "OPENINGS THAT WORK", body: "Strong grabbers share a quality: they create an open loop the reader needs to close. A confession ('I have to tell you something I probably shouldn't...'). A bold or strange claim. A story dropped in mid-action. A question that pokes the exact pain of the starving crowd.\n\nWatch for it in any piece of content that hooks you — the first line almost never explains itself. It creates a gap, and your brain reads on to close it. Build your openings the same way: open the loop, then make them read to resolve it." },
    ],
  },
  "hb-3-1": {
    title: "AIDA — The Spine of Every Letter",
    sections: [
      { heading: "THE FOUR STAGES", body: "Underneath every great sales letter runs a simple skeleton: AIDA. Attention, Interest, Desire, Action. It's old because it's true. Every persuasive message moves the reader through these four stages in order.\n\nAttention: stop them (the grabber). Interest: make them care (relevance to their problem). Desire: make them want it (paint the result, build the want). Action: tell them exactly what to do now. Skip a stage and the letter collapses." },
      { heading: "WHERE LETTERS BREAK", body: "Most failed copy breaks at a predictable seam. Some never get attention — they open soft and lose everyone. Some get attention but never build desire — they inform without making anyone want. And a huge number build real desire and then fail to ask clearly for the action — they let a hot reader cool off with no clear next step.\n\nThink of AIDA like a staircase. Each step has to be there or the reader can't climb. Miss the desire step and they understand but don't care. Miss the action step and they care but don't move." },
      { heading: "RUNNING THE SPINE", body: "Map any letter you write against AIDA. Does the open grab attention? Does the next section convert that into interest by hitting their problem? Does the body build genuine desire for the outcome? Does the close make the action obvious and urgent?\n\nThis is the diagnostic Halbert-trained writers run instinctively. When something isn't converting, find which of the four stages is weak and fix that one. The spine is simple — the skill is making each stage actually land on your specific starving crowd." },
    ],
  },
  "hb-3-2": {
    title: "The Slippery Slide — Every Line Sells the Next",
    sections: [
      { heading: "THE ONLY JOB OF A SENTENCE", body: "Here's the principle that separates copy that gets read from copy that gets abandoned: the only job of your headline is to get the first sentence read. The only job of the first sentence is to get the second sentence read. And so on, all the way down.\n\nHalbert and the direct-response greats called this the slippery slide, or the greased chute. Once a reader starts, the copy should be so frictionless that stopping feels harder than continuing." },
      { heading: "GREASING THE CHUTE", body: "You grease it with momentum. Short opening sentences. White space. Transitions that pull the eye forward — 'But here's the thing...', 'And it gets better...', 'Now, watch what happens...'. Curiosity gaps that aren't closed until the next line. A rhythm that never lets the reader find a comfortable place to stop.\n\nPicture an actual playground slide coated in oil. Once you're on it, you're going to the bottom whether you planned to or not. That's what a page of copy should feel like — the reader meant to skim, and somehow they're at the order button." },
      { heading: "KILLING FRICTION", body: "Friction is anything that gives the reader an exit. A long, dense paragraph. A confusing sentence they have to re-read. A boring stretch with no curiosity pulling them forward. Each one is a place they put the letter down and never pick it back up.\n\nEdit ruthlessly for the slide. Read it and mark every spot where your attention dips — that's a leak. Every line earns its place by making you need the next one. If a sentence doesn't pull you forward, it's pushing the reader out." },
    ],
  },
  "hb-3-3": {
    title: "Reason-Why Copy — Make Every Claim Believable",
    sections: [
      { heading: "THE BRAIN WANTS A REASON", body: "People are skeptical, and rightly so — they've been lied to by advertising their whole lives. The fix is reason-why copy: for every claim, every price, every offer, you give a believable reason. The 'why' is what turns a suspicious claim into a credible one.\n\nWhy is it this cheap? Why are you giving this bonus away? Why is there a deadline? Why should they believe you? Answer the why and the guard comes down." },
      { heading: "WHY 'WHY' WORKS", body: "An unexplained claim triggers suspicion. 'This is 70% off' makes the brain ask 'what's wrong with it?' But 'This is 70% off because we over-ordered inventory and need the warehouse space before year-end' satisfies the brain — now there's a reason, and the reason makes it real.\n\nThere's a famous behavioral study where simply adding the word 'because' — even with a flimsy reason — dramatically increased compliance with a request. The brain is wired to accept things that come with a reason attached. Reason-why copy weaponizes that, honestly: give the real reason, and believability follows." },
      { heading: "BUILDING BELIEF", body: "Go through your copy and find every claim that floats without support. The big promise, the discount, the urgency, the guarantee. Attach a credible, specific reason to each one.\n\nSpecificity multiplies it — vague reasons feel like excuses, specific reasons feel like facts. 'Limited spots' is weak; 'I only take twelve clients a quarter because that's all I can personally manage' is believable. The operator never asks the reader to just trust a claim. Every claim arrives with its reason already attached, so trust is never required — only understanding." },
    ],
  },
  "hb-4-1": {
    title: "Building & Sweetening the Offer",
    sections: [
      { heading: "THE OFFER IS THE DEAL", body: "Remember the hierarchy — the offer sits above the copy. The offer is the actual deal: what they get, what they pay, what they risk, and what makes it feel like a steal. A strong enough offer can carry mediocre copy. A weak offer can't be saved by any words.\n\nHalbert obsessed over making offers people would feel stupid refusing. The goal isn't a fair trade. The goal is an offer so stacked in the buyer's favor that saying no feels like a mistake." },
      { heading: "SWEETENING IT", body: "You sweeten an offer by stacking value the reader didn't expect. Bonuses — extra items that cost you little but add real perceived value. A premium for acting fast. Throwing in the thing competitors charge separately for. Each addition widens the gap between what they get and what they pay.\n\nThink of it like loading a plate. They came expecting the main item. Then you add this, and this, and this — and by the time you name the price, the value on the plate so outweighs the cost that the decision tilts. The price stops feeling like a cost and starts feeling like a bargain." },
      { heading: "VALUE STACKING IN PRACTICE", body: "List everything the buyer receives, assign honest value to each, and let the total tower over the price. Then justify it with reason-why — why they get all this for so little.\n\nThe operator designs the offer before writing the copy, because the copy's job is just to communicate an offer that's already irresistible. If you're relying on clever words to make a weak deal sound good, stop and fix the deal. Sweeten the offer until the words barely have to work." },
    ],
  },
  "hb-4-2": {
    title: "Guarantee, Urgency & the Call to Action",
    sections: [
      { heading: "REMOVE THE RISK", body: "At the moment of decision, the reader's brain is screaming 'what if this doesn't work and I look stupid?' The guarantee answers that fear. A strong, specific guarantee transfers the risk from the buyer to you — and a buyer with nothing to lose is far easier to move.\n\nThe bolder the guarantee, the more it does two things at once: it removes risk, and it signals confidence. A weak, hedged guarantee whispers doubt. A bold one shouts 'I know this works.'" },
      { heading: "REAL URGENCY", body: "People delay, and a delayed decision is usually a dead one. Urgency forces the choice now, while they're hot. A genuine deadline, a real limit on quantity, a bonus that expires — these convert 'maybe later' into 'decide now.'\n\nThe key word is genuine. Halbert taught reason-why, and urgency needs a why too. Fake countdowns and phantom scarcity get exposed and torch your credibility. Real urgency — a true limit, honestly explained — moves people without costing you trust. 'I close enrollment Friday because the program starts Monday' is urgency that survives scrutiny." },
      { heading: "THE CALL TO ACTION", body: "The most common way to lose a sale you've already won: failing to clearly tell the reader what to do next. Desire built, risk removed, urgency set — and then a vague ending that lets them drift away.\n\nThe call to action must be explicit and simple. Exactly what to do, exactly how, right now. 'Click the button below and complete the short form — it takes two minutes.' No ambiguity, no friction, no decisions left to make. You've walked them through attention, interest, desire, and the offer. Don't fumble at the goal line. Tell them precisely how to say yes, and make saying yes the easiest thing on the page." },
    ],
  },

  // ═══════════════ BREAKTHROUGH COPYWRITING ═══════════════
  "bc-1-1": {
    title: "The Core Principle — Reinforce, Don't Repeat",
    sections: [
      { heading: "INTENSIFICATION", body: "Intensification is the first technique of breakthrough copy: the process of building desire. Not by making more promises, but by presenting the SAME promise through different perspectives until the desire becomes overwhelming.\n\nEugene Schwartz mapped 13 ways to do this. Each one gives you a fresh angle to reinforce your core claim without repetition. You make one claim feel undeniable by showing it through lens after lens." },
      { heading: "THE TWO FORCES YOU FIGHT", body: "You're working against two things. First, market saturation — the sheer amount of material already written about products like yours. Second, your own phraseology — once you've said something one way, saying it the same way again kills its power.\n\nSo you can't repeat. But you CAN reinforce. That distinction is the entire game. Repetition is saying the same thing the same way. Reinforcement is saying the same thing a new way, so it lands fresh each time and compounds." },
      { heading: "THE TURNING POINT", body: "You don't use all 13 techniques in every piece. The question for each one is simple: does this additional perspective continue to BUILD desire, or has it become mere repetition?\n\nIf it's different and dramatic enough to renew interest, use it. If it's just restating what you've already said, cut it. The exact point where reinforcement becomes repetition is where you stop. Master that line and your copy intensifies without ever feeling redundant." },
    ],
  },
  "bc-1-2": {
    title: "The 13 Techniques (Part 1) — Show, Don't Tell",
    sections: [
      { heading: "1. DIRECT DESCRIPTION  ·  2. PRODUCT IN ACTION", body: "Direct Description is the baseline: full vivid sensory detail of the result. You paint the picture so they SEE it — 'giant buds begin to swell with vigor, tired old shrubs straighten out and fatten up.'\n\nProduct in Action goes further: show the mechanism working in real time, step by step. Don't just describe the result — show the cause creating the effect. 'First the pellets give a burst of growth. Then within two weeks, automatically, the second stage begins.' You're showing the process, not just the outcome." },
      { heading: "3. BRING IN THE READER  ·  4. DEMONSTRATION AS TEST", body: "Bring In The Reader puts THEM in the scene, in first person, in their own life: 'One week from today, you walk to your car, lift the hood, pour this in.' Now it's not abstract — it's happening to them.\n\nDemonstration as Test lets them visualize proving it themselves. You hand them the test protocol: 'That first evening, without referring to the book, you sit down and write twenty facts you could never memorize before — then the next morning you amaze your family.' They can see themselves running the experiment and winning." },
      { heading: "5. STRETCH BENEFITS IN TIME", body: "Show the product at work not for a day, but over weeks and months. Extend their vision further and further — a continuous, compounding flow of benefits.\n\n'First the burst of growth. But that's just the beginning — within two weeks the second stage begins. And then, the most remarkable part of all, at the moment of full height, a third wonder-working ingredient is released.' Time becomes a multiplier. The benefits don't just happen — they keep happening, and the reader feels the value stacking." },
    ],
  },
  "bc-1-3": {
    title: "The 13 Techniques (Part 2) — Proof & Contrast",
    sections: [
      { heading: "6. BRING IN AN AUDIENCE  ·  7. SHOW EXPERTS APPROVING", body: "New participants give fresh perspectives — seen through their eyes, the product becomes new again. This is celebrities (testimonials) and ordinary people (case histories): 'These men and women didn't give up the foods they loved — they reported feeling more energy than they'd known in years.' The reader sees themselves in the story.\n\nShow Experts Approving adds surprise + competition + discovery. 'Just picture the astonishment on the experts' faces when Nearly Wild produced 15 times more blossoms than all other roses combined.' If the experts are amazed, it must be real." },
      { heading: "8. COMPARE & CONTRAST  ·  9. PICTURE THE BLACK SIDE", body: "Compare, Contrast, Prove Superiority: lay the disadvantages of the old beside the advantages of the new. 'While your friends paid $3.95, club members got the same exact book for 99¢.' Direct contrast, steep difference.\n\nPicture the Black Side: irritate the wound, then apply the salve. Paint the problem in full black before the solution — 'that spark plug is choked, strangled, fouled with black filthy carbon' — then the relief. Two currents of motivation at once: repulsion from the problem, attraction to the solution." },
      { heading: "WHY CONTRAST INTENSIFIES", body: "Both of these work because the brain judges by comparison, not in a vacuum. A benefit stated alone is mild. The same benefit set against the painful old way becomes vivid.\n\nThe black-side technique especially is one of the most powerful: people are moved more by escaping pain than by reaching for gain. Show them the carbon-fouled plug they're living with now, and the clean one becomes salvation rather than a mere product. Never leave the wound open — always pair the black side immediately with the solution." },
    ],
  },
  "bc-1-4": {
    title: "The 13 Techniques (Part 3) — Ease, Metaphor & Close",
    sections: [
      { heading: "10. SHOW HOW EASY  ·  11. METAPHOR & ANALOGY", body: "Show How Easy contrasts tiny effort with massive benefit: '30 seconds of work — and you improve the car's performance in eight different ways.' The gap between effort and result IS the sell. Effort: minimal. Result: enormous.\n\nMetaphor, Analogy, Imagination presents facts in more dramatic form, outside rigid realism. A grammar book becomes 'an everlasting mentor at your elbow, who would not laugh at you but support you.' The abstract becomes concrete. A method becomes a companion you can feel." },
      { heading: "12. CATALOG SUMMARY", body: "Pile applications or benefits in rapid succession. Two types. Horizontal expansion lists applications: 'does 101 jobs — laying tile, thawing pipes, soldering gutters, loosening rusty bolts...' Vertical expansion deepens one desire: 'it frees you forever from digging for worms, forever from paying $5 for dead lures, forever from tying your own flies.'\n\nThis is the shotgun — the last chance to catch anyone you missed with the earlier, more focused angles." },
      { heading: "13. GUARANTEE AS SUMMARY  ·  THE STRUCTURE", body: "Turn the guarantee into the climax — each guarantee point restating a benefit. 'These plugs must give you 9 more miles per gallon — or your money back. Must give 31 more horsepower — or your money back.' The guarantee becomes the close, every line another benefit claim.\n\nThe typical structure: open with description or product-in-action, bring in the reader, stretch benefits in time, show experts or audience reacting, compare with the old way, show how easy, catalog summary, then guarantee as the final summary. Each layer builds on the last. Desire compounds. One claim, multiple lenses, until it's undeniable." },
    ],
  },
  "bc-2-1": {
    title: "The Longing for Identification",
    sections: [
      { heading: "THE SECOND DIMENSION OF DESIRE", body: "Most copywriters only see the first dimension of desire: physical satisfaction. The hungry man feels his stomach. The overweight woman feels her embarrassment.\n\nBut there's a second kind — more subtle, partly unconscious — that doesn't want satisfaction. It wants expression. Schwartz called it the longing for identification: the desire to act out roles, to define yourself to the world, to announce who you've become. Understanding this changes everything about how you sell." },
      { heading: "PEOPLE BUY ROLES, NOT PRODUCTS", body: "Only the poor man buys food for physical satisfaction alone. The average person SELECTS food: modern foods (to be up-to-date), non-fattening foods (to be youthful and slim), foods from every country (to be cosmopolitan, adventurous, sophisticated).\n\nHe's not buying food. He's buying roles. That's six new desires from one product category. Every role your prospect covets gives you another desire to harness — and the role is often more powerful than the function." },
      { heading: "TWO WAYS YOUR PRODUCT SERVES IT", body: "Your product can serve identification two ways: as an instrument for ACHIEVING a role, or as an acknowledgement that the role has ALREADY been achieved.\n\nEvery product should offer both — physical satisfaction (what it does) and role definition (who it makes them). When you write copy, don't just answer 'what does this do?' Answer 'who does this make me, and how will others see me when I own it?' That second answer taps a desire that never sleeps — the desire to be seen, acknowledged, to be somebody." },
    ],
  },
  "bc-2-2": {
    title: "Character Roles vs Achievement Roles",
    sections: [
      { heading: "CHARACTER ROLES", body: "Character roles are personality traits, usually expressed as adjectives: progressive, chic, charming, brilliant, well-read, sophisticated. They belong to your prospect — his task is to develop them, then spotlight them for acknowledgement.\n\nThe key insight: because these are never claimed openly, only hinted at and implied, they can never truly be tested. They live partly in the subconscious. This means your prospect is FAR more ready to believe a flattering character role you assign him than your product's performance claims. No direct claim, no test required — acceptance is easy and painless." },
      { heading: "ACHIEVEMENT ROLES", body: "Achievement roles are status, class, and position roles — usually nouns that serve as titles. For men: executive, home owner, 'man on his way up.' For women: fashion setter, career woman, patron of the arts.\n\nEach is an achievement to be won, held, and — most importantly — DISPLAYED. Display is vital because none of these is physically visible. They're immaterial titles. They need to be translated into physical symbols everyone can see. And the easiest symbols of success? Products." },
      { heading: "THE THREE FUNCTIONS", body: "Analyze your product for three identification powers. One: what identity does it help ACHIEVE? (A philosophy book helps achieve 'well-read.') Two: what identity does it SPEED UP or simplify? (A speed-reading course.) Three: what identity does it SYMBOLIZE to others? (A bookshelf displaying both.)\n\nThe most powerful products do all three. Use character roles to supplement your verbal claims in every piece — a flattering, subtly-implied trait the reader can quietly accept without needing proof. That's identification working beneath the surface." },
    ],
  },
  "bc-2-3": {
    title: "The Material Personality & The 50% Rule",
    sections: [
      { heading: "THE MATERIAL PERSONALITY", body: "In the modern world, we are known by the products we own. We construct 'material personalities' — collections of possessions whose function is to define us instantly to whoever we meet.\n\nThe newlywed's first act in her role as 'wife' is to receive a gift with no function but to define her — the ring. Then new sheets, new furniture, a new wardrobe. She's a new woman; she must express it in everything she owns. The 'man on his way up' trades his Ford for a Buick; made executive, he trades the Buick for a Cadillac. The possession announces the role." },
      { heading: "THE SPORTS CAR", body: "Why would a man spend a fortune on a 150-mph sports car he only drives on congested 35-mph roads? Functionally it makes no sense.\n\nBut it becomes completely rational once you see it: the top speed, the hand-shift, the cornering all give him the role of 'sportsman' — and very probably 'successful sportsman.' He's not buying performance he'll never use. He's buying an identity he wears every time he's seen in it. The function is the excuse; the role is the purchase." },
      { heading: "THE 50% RULE", body: "Schwartz's bold claim: at least half of all purchases today cannot be understood in terms of function alone. Half.\n\nWhen your product does the same job as competitors at a similar price, the prospect's choice overwhelmingly depends on the DIFFERENCE IN ROLE your product offers. Your job is to create that role in your copy. But you can't force an unrealistic identification — people assign roles based on a product's structure, history, cost, and social associations. Work within those expectations or expand them; never contradict them. Discover the most compelling role your prospect will accept, then present it so vividly it becomes irresistible." },
    ],
  },
  "bc-3-1": {
    title: "Why Ad Language Triggers Skepticism",
    sections: [
      { heading: "THE GUARD GOES UP", body: "Advertising language creates automatic skepticism. The second someone recognizes 'this is an ad,' their guard goes up and they stop believing.\n\nCamouflage is the art of bypassing that guard — by borrowing believability from places where it's already stored. People don't read a publication to see ads; they read it to learn, to be informed, to be entertained. They have faith in it. And Schwartz's discovery: that faith carries over from the editorial pages to the advertising pages." },
      { heading: "STORED BELIEVABILITY", body: "It goes deeper than 'my publication wouldn't run this if it weren't true.' After reading something repeatedly, people get conditioned — they associate that source's STYLE with truth. The format. The phraseology. The way it presents information.\n\nThat style triggers trust automatically, regardless of the content it wraps. This is stored believability you can tap. The same facts in 'advertising language' get rejected; in 'editorial language' they get accepted. It's all in how it's received." },
      { heading: "THE TWO CATEGORIES", body: "People sort everything into two mental bins: editorial content (trustworthy) and advertising (suspicious). Your job is to get your message into bin one.\n\nYou do that by making it look like editorial, sound like editorial, feel like editorial. The deeper principle for an operator: the best copywriters don't just think about WHAT to say — they think about HOW it will be received. Same message, wrapped in hype, gets doubted. Same message, wrapped in a trusted format, gets believed." },
    ],
  },
  "bc-3-2": {
    title: "The Three Methods — Format, Phraseology, Understatement",
    sections: [
      { heading: "1. ADOPT THE FORMAT", body: "Merge your piece with the look of the medium so the reader enters with the least possible mental shift from 'editorial' to 'advertisement.'\n\nSchwartz's example: the same ad, generic across many magazines, was mildly successful. Rebuilt to match the Wall Street Journal exactly — Journal typeface, double subheads, line drawing instead of photo, subheads to the extreme left — it became 'corny, old-fashioned, rather ugly' and ran for years with twice the believability and pulling power. Why? It tapped the trust readers already had for the Journal itself." },
      { heading: "2. ADOPT THE PHRASEOLOGY", body: "Certain media use stereotyped phrases that take on believability of their own. Newspapers have the dateline, the city of origin, the by-line.\n\n'SKIN SPECIALIST DEMONSTRATES... By Claire Hoffman. New York, N.Y. — A leading doctor today showed an audience of...' That's an ad reading like a news report. The news tone is set by the by-line, the city, the word 'today,' the 'showed an audience.' Study the channels people believe in — newsletters, refund checks, government correspondence — and adopt their tone, feel, and sincerity so there's no jarring transition." },
      { heading: "3. ADOPT UNDERSTATEMENT", body: "Advertising language is biased, emotionally charged language — it produces counter-reaction by its very appearance. One escape from the hard-sell stereotype is understatement: fewer color words, fewer adjectives, no superlatives, short sentences that fall rather than rise.\n\nThe Volkswagen ads are the model. An entire ad: 'You never run out of air. You also won't worry about draining the radiator in spring. There is no radiator. Or hoses.' The lack of hype IS the proof. Use camouflage when the medium has strong editorial identity and your claims might trigger skepticism — but not when the audience expects direct selling, or the style clashes with your product." },
    ],
  },
  "bc-4-1": {
    title: "Proving the Old Way Ineffectual",
    sections: [
      { heading: "WHEN YOU DON'T DOMINATE", body: "Most copywriters ignore competition and focus on their own promises. That works when you dominate a field. But what if your prospect is already loyal to someone else — already buying from your competitor?\n\nThen your first job isn't to sell. It's to shatter. Schwartz called this Concentration: 'the careful, logical, documented process of proving ineffectual other ways of satisfying your prospect's desire.' You're not attacking the competitor's product directly — you're proving that their METHOD of satisfaction doesn't work." },
      { heading: "THE CRITICAL RULE", body: "Never attack a weakness unless you can provide the solution to that weakness at the same time. If you can only attack — without showing how your product fixes it — say nothing.\n\nWhy? Your prospect knows your attack is biased. Attack only for your own benefit and you create resistance and dislike. But show the attack is for THEIR benefit — because your product eliminates the weakness — and they'll listen. They'll question even their most ingrained loyalty. Attacking the product breeds skepticism; attacking the method while handing them the cure breeds sales." },
      { heading: "REDEFINITION AS WEAPON", body: "The sharpest tool inside concentration is redefinition: take the old way and rename it in a way that makes your way feel like relief. Schwartz's reducing-pill example reframed every ordinary diet plan as 'passive' — 'they depend strictly on your own will power, they can't ACTIVELY help you.'\n\nThat single word — passive — sets up the hero product as the active solution. And buried in the copy: 'it was the failure of the pills that caused the failure of the diet.' The method failed, not the person. Redefine the old method as the thing standing between them and what they want." },
    ],
  },
  "bc-4-2": {
    title: "The Bad-Good Structure",
    sections: [
      { heading: "BAD — GOOD, BAD — GOOD", body: "The structure of concentration is rhythmic: point out a weakness in the competition, show how your product eliminates it. Point out another weakness, eliminate it. Repeat.\n\nBad — good. Bad — good. Bad — good. Each cycle deepens the contrast. Each cycle makes the switch more inevitable. Schwartz's spark-plug ad ran it perfectly: 'A spark plug jumps a spark across an air gap — the most wasteful way to move electricity. A fire injector fires on the surface of a conductor — the most efficient way.' Then the next pair. Then the next." },
      { heading: "THE TECHNIQUES INSIDE", body: "Several mechanisms operate at once. Interweaving contrast — the weakness is immediately counteracted by your benefit, never leaving the wound open. Parallel repetition — 'a spark plug... a fire injector...' over and over, creating a rhythm of inevitability.\n\nImage contrast — 'a thin skimpy spark' versus 'a heavy powerful flame,' so they can picture the difference. And mechanism documentation — every weakness has a WHY: 'because the electrode is always burning away.' Logical proof under each claim. The reader isn't just told the old way is worse — they're shown exactly why, in pictures and mechanism." },
      { heading: "THE COMPRESSED VERSION", body: "Concentration doesn't need length. It can live in a single headline: 'SHRINKS HEMORRHOIDS WITHOUT SURGERY.' That's concentration in four words — implied weakness in other methods (they require surgery), compensating promise in yours (no surgery).\n\nContrast, mechanism, solution — done. Whether you run it across a full page of bad-good pairs or compress it into one line, the engine is the same: make the prospect question a habit they never examined, then show them the better path exists." },
    ],
  },
  "bc-4-3": {
    title: "Then vs Now & The Compressed Version",
    sections: [
      { heading: "THE SECOND STRUCTURE", body: "Sometimes you can't do a point-by-point comparison — maybe you're dealing with a time sequence, a recurring bad experience your prospect already knows. Then use Then vs Now: what happens to you NOW with the products you're using, versus what will happen when you switch.\n\nThe reducing-pill copy: 'So what happened? You took your pills religiously. You pushed away the foods you love. Week after week of torture. And then your will power snapped, the fat flowed back heavier than ever.' She's lived this. Every line is a 'yes... yes... yes' that builds trust." },
      { heading: "THE TECHNIQUES INSIDE", body: "Symptom recognition is the heart of it — she recognizes every detail because she's lived the exact experience, and each recognition deepens belief. Logical cause-and-effect frames it: 'so what happened?' makes everything that follows feel like inevitable consequence.\n\nAnd the buried implication does the quiet work: 'the fat flowed back' because of the pills, not because of her. The method failed, not the person. You destroy the old method while removing the prospect's shame about their past failure — which makes them ready for the hero." },
      { heading: "WHEN TO USE CONCENTRATION", body: "Use it when your budget is smaller than the competition's, when most of your prospects are already their customers, when you need to crack their image before you can sell, or when direct comparison favors you.\n\nDon't use it when you dominate the field, when your story is strong enough to stand alone, or when attacking would hand a weak competitor prestige they don't deserve — and never when you can't provide the solution to the weakness you expose. Done right, concentration is how you take customers from a competitor who outspends you ten to one: not by shouting louder, but by quietly proving their way doesn't work and yours does." },
    ],
  },

  // ═══════════════ DARK PSYCHOLOGY ═══════════════
  // (Taught as defensive intelligence — study these patterns to recognize and neutralize them when used on you, and to influence ethically.)
  "dp-1-1": {
    title: "Machiavellianism — The Strategic Mind",
    sections: [
      { heading: "THE PATTERN", body: "Machiavellianism is the trait cluster built around strategic self-interest, long-range planning, and a flexible relationship with the rules. The Machiavellian doesn't react — they calculate. They think in moves and consequences, not feelings and impulses.\n\nYou study this not to become cold, but to recognize it. Some of the most consequential people you'll deal with operate this way, and if you can't see the pattern, you can't defend against it." },
      { heading: "HOW IT SHOWS UP", body: "The Machiavellian keeps their real intentions private and reveals only what serves the position. They build alliances by utility, not affection. They stay several moves ahead — what looks like a small favor now is often setup for a request later.\n\nWatch for it: someone unusually patient, who never tips their hand, whose 'generosity' tends to create obligations. That's not friendliness. That's positioning." },
      { heading: "THE DEFENSIVE TAKE", body: "The usable lesson is strategic patience and emotional detachment from decisions — separating what you feel from what's optimal. That's a tool, not a personality.\n\nThe defense matters more: when someone is running a long game on you, the tell is that their kindness always seems to set up a future ask. Track the pattern over time, not the single gesture. Intentions reveal themselves across moves, not in moments." },
    ],
  },
  "dp-1-2": {
    title: "Narcissism — Weaponized Self-Belief",
    sections: [
      { heading: "THE TRAIT", body: "Clinical narcissism is a disorder. But the sub-clinical trait — extreme self-belief, hunger for status, projected certainty — is something you'll encounter constantly, and a controlled dose of its mechanics is genuinely useful.\n\nThe narcissist's superpower isn't ego. It's unshakeable projected certainty, which other people unconsciously read as competence and follow." },
      { heading: "WHY CERTAINTY WORKS", body: "Humans use confidence as a shortcut for competence. The person who speaks with total conviction gets believed over the more knowledgeable person who hedges. The brain assumes 'they're that sure, they must know.'\n\nThis is why the loudest certainty often wins rooms it doesn't deserve. The narcissist exploits the certainty-competence shortcut — and so can you, ethically, by actually backing your conviction with substance." },
      { heading: "THE LESSON & THE DEFENSE", body: "Usable: project calibrated certainty in domains where you've earned it. Hesitation leaks, and people follow conviction. Hold your frame with belief, not apology.\n\nDefense: don't mistake confidence for correctness. The most certain person in the room is often just the most certain — not the most right. When someone's projecting absolute conviction, evaluate the substance underneath it, not the volume of the delivery." },
    ],
  },
  "dp-1-3": {
    title: "Psychopathy — Emotional Detachment as Advantage",
    sections: [
      { heading: "THE COLD TRAIT", body: "Psychopathy as a clinical condition is dangerous and rare. But one sub-component — the ability to stay emotionally cool under pressure and separate feeling from decision — is something high-performers borrow deliberately. Surgeons, fighter pilots, elite negotiators all train a version of it.\n\nThe edge isn't being unfeeling. It's being able to set feeling aside in the moment that demands a clear head." },
      { heading: "PRESSURE AND CLARITY", body: "When most people hit high stakes, emotion floods in and decision quality collapses. The detached operator stays cold exactly when others panic — and clarity under fire is a massive advantage.\n\nThink of a surgeon mid-operation. If they felt the full emotional weight of a life in their hands in real time, their hands would shake. They compartmentalize, act, and process the emotion later. That's controlled detachment, deployed on purpose." },
      { heading: "BORROW IT, DON'T BECOME IT", body: "Usable: build the capacity to act under pressure without emotional flooding. Decide cold, feel later. This is trainable through deliberate exposure to discomfort.\n\nThe critical line: this is a tool you pick up for specific moments, not an identity. Genuine emotional detachment from people is a liability — it isolates you. Defense: recognize that someone who feels nothing about harming others isn't 'strong,' they're broken. Don't admire it, and don't let it near you." },
    ],
  },
  "dp-2-1": {
    title: "Foot-in-the-Door & Door-in-the-Face",
    sections: [
      { heading: "TWO COMPLIANCE LADDERS", body: "Two opposite techniques, both exploiting how the brain handles requests. Foot-in-the-door: get a small yes first, then a bigger one — because people stay consistent with prior commitments. Door-in-the-face: open with an extreme request you expect refused, then the real (smaller) request feels reasonable by contrast.\n\nThey're everywhere in sales, fundraising, and negotiation. Knowing them is how you stop being walked up the ladder." },
      { heading: "SEE THEM RUN", body: "Foot-in-the-door: a charity asks you to 'just sign a petition' (tiny yes). Weeks later they ask for a donation — and you comply, because you've already self-identified as someone who supports the cause. The small commitment reshaped your self-image.\n\nDoor-in-the-face: 'Can you volunteer 10 hours a week?' No. 'Okay, could you do just one hour?' That one hour now feels generous and easy — but you'd likely have said no if they'd opened with it." },
      { heading: "DEPLOY & DEFEND", body: "Ethical deploy: foot-in-the-door builds genuine momentum — small commitments toward a real goal. Use it to help people start, not to trap them.\n\nDefense: notice when a tiny initial yes is being used to set up a larger one, and judge each request on its own merits. And when a request suddenly 'shrinks' to something reasonable, ask whether the first one was ever serious — or just an anchor to make the second look small." },
    ],
  },
  "dp-2-2": {
    title: "Commitment Traps & Consistency Exploitation",
    sections: [
      { heading: "THE NEED TO BE CONSISTENT", body: "Once someone takes a position — out loud, in writing, in public — the brain works hard to stay consistent with it, even against their own interest. Consistency is a deep drive: it signals reliability to the tribe and reduces mental effort. But it can be turned into a trap.\n\nGet someone committed to a small position and you can lever it into far larger compliance." },
      { heading: "PUBLIC AND WRITTEN", body: "Commitments made publicly or in writing bind hardest. This is why salespeople get you to say your goals out loud, why 'just confirm you're interested' is step one, why writing down a pledge increases follow-through.\n\nWatch the escalation: 'You did say results matter to you, right?' Now backing out feels like contradicting yourself — and the brain would rather spend money than feel inconsistent. The trap is built from your own earlier words." },
      { heading: "THE TWO SIDES", body: "Ethical use: get genuine commitment to real goals — public, written, specific — to strengthen follow-through. This is the legitimate engine behind accountability.\n\nDefense: the most freeing realization is that you're allowed to be inconsistent when you've learned new information. Changing your mind isn't weakness — it's updating. When you feel cornered by something you said earlier, remember: a past statement is not a contract with your future self." },
    ],
  },
  "dp-2-3": {
    title: "Manufactured Scarcity vs Real Scarcity",
    sections: [
      { heading: "SCARCITY DRIVES ACTION", body: "Scarcity multiplies perceived value and triggers urgency — the fear of missing out overrides deliberation. The brain treats 'limited' as 'valuable' and 'running out' as 'act now.' But there's a hard ethical line between real scarcity and manufactured scarcity.\n\nReal: genuine limits — true capacity, real deadlines, actual supply. Manufactured: fake countdowns, invented 'only 3 left,' phantom urgency designed purely to pressure." },
      { heading: "THE COUNTDOWN TRICK", body: "You've seen the timer that resets when you refresh the page. The '2 seats remaining' that never hits zero. The 'sale ends tonight' that runs every night. That's manufactured scarcity — and once a customer catches it, trust is gone permanently.\n\nReal scarcity, by contrast, is honest: 'I take 5 clients a quarter, 2 are open.' It creates the same urgency without the lie, and it survives scrutiny." },
      { heading: "THE OPERATOR'S CHOICE", body: "Deploy real scarcity ruthlessly — genuine limits, communicated clearly, are one of the strongest honest motivators you have. Never manufacture it; the short-term lift isn't worth the long-term collapse in trust when it's exposed.\n\nDefense: when you feel urgency, ask 'is this limit real, or is it engineered to stop me thinking?' Test it — walk away and see if the 'last chance' was ever real. Genuine scarcity holds up. Fake scarcity always cracks under a pause." },
    ],
  },
  "dp-2-4": {
    title: "The Benjamin Franklin Effect & Labeling Theory",
    sections: [
      { heading: "TWO IDENTITY LEVERS", body: "Two subtle mechanisms that shift behavior by shifting self-perception. The Benjamin Franklin Effect: getting someone to do you a small favor makes them like you more — because the brain reasons backward, 'I helped him, so I must like him.' Labeling theory: assign someone a trait and they tend to grow into it.\n\nBoth work because people infer who they are from how they act and what they're told they are." },
      { heading: "BACKWARD REASONING", body: "Franklin won over a rival by asking to borrow a rare book. The rival, having done the favor, then reasoned himself into liking Franklin. The action came first; the feeling rearranged to match. Counterintuitive — we assume we help people we like, but it runs the other way too.\n\nLabeling: tell a kid 'you're so honest' and honesty becomes part of their identity to protect. Tell a customer 'you're clearly someone who does their research' and they live up to it in the conversation." },
      { heading: "ETHICAL USE & DEFENSE", body: "Ethical use: let people do small things for you — it builds genuine rapport, not just one-directional giving. And label people with the positive traits you want to reinforce; it's how good leaders and parents operate.\n\nDefense: notice when a flattering label is being used to maneuver you ('a smart guy like you would obviously see the value here') — the label is doing work the argument can't. Accept traits because they're true, not because someone assigned them to close you." },
    ],
  },
  "dp-3-1": {
    title: "Cognitive Dissonance Resolution — Self-Convincing",
    sections: [
      { heading: "THE HIGHEST LEVEL", body: "The most powerful persuasion isn't convincing someone — it's arranging things so they convince themselves. Cognitive dissonance is the discomfort of holding two conflicting beliefs or acting against a belief. The brain resolves it automatically by adjusting the beliefs to fit the actions.\n\nGet someone to act, and their beliefs will quietly reorganize to justify the action. Self-generated belief is the stickiest kind there is." },
      { heading: "ACTION CHANGES BELIEF", body: "People assume belief drives action. It runs powerfully in reverse too. Someone who invests effort, money, or public commitment into something will adjust their beliefs to justify it — 'I spent this much, so it must be worth it.' The mind can't tolerate 'I did something pointless,' so it rewrites the value.\n\nThis is why hard-won initiations create loyalty, why small purchases lead to bigger ones, why effort breeds attachment. The dissonance resolves toward 'this was worth it.'" },
      { heading: "DEPLOY & DEFEND", body: "Ethical use: invite genuine participation and small actions toward a real goal — when people act, their conviction follows, and that's how authentic commitment is built (it's the engine behind this whole platform's design).\n\nDefense: the awareness itself is the shield. When you notice yourself defending something mainly because you've already invested in it, that's dissonance resolution, not reasoning. Ask: 'If I were deciding fresh today, with no sunk cost, would I still choose this?'" },
    ],
  },
  "dp-3-2": {
    title: "Self-Perception Theory & Identity-Based Influence",
    sections: [
      { heading: "WE INFER OURSELVES", body: "Self-perception theory: people don't have perfect access to their own attitudes — they infer them by observing their own behavior. You watch what you do and conclude who you are. This is the deepest lever in influence, because it means you can shift identity by shifting action.\n\nAnd identity is the strongest driver of all. People act in line with who they believe they are, far more reliably than with what they're told to do." },
      { heading: "IDENTITY OVER INSTRUCTION", body: "Tell someone 'stop smoking' and you fight their habit. Get them to say 'I'm not a smoker' and the behavior follows the identity. James Clear built a whole system on this: don't aim for outcomes, become the type of person who produces them. 'I'm the kind of person who trains' beats 'I should go to the gym.'\n\nThe brain protects identity fiercely. Anchor a behavior to identity and it stops requiring willpower — it becomes self-expression." },
      { heading: "THE MASTER MOVE", body: "Ethical use: connect the behavior you want to a person's self-concept — including your own. To change what you do, change who you believe you are first. This is exactly why this platform makes you an 'operative,' not a 'user.'\n\nDefense: notice when someone tries to box you into an identity that serves them ('you're a loyal customer,' 'you're not the type to back down'). Identity-based influence is the most invisible form there is — choose your own labels deliberately, before someone chooses them for you." },
    ],
  },

  // ═══════════════ THE 7 CUSTOMER TYPES ═══════════════
  "sc-1-1": {
    title: "Why One Message Doesn't Fit All",
    sections: [
      { heading: "THE BROADCAST FAILURE", body: "Most people sell with one message aimed at everyone — and it lands weakly on all of them. The reason is simple: different people buy for completely different psychological reasons. The same product solves a different emotional problem for each buyer.\n\nA generic message tries to speak to everyone and ends up resonating with no one. Precision beats breadth." },
      { heading: "SAME PRODUCT, DIFFERENT WHY", body: "Take a gym membership. One person buys it for health and longevity. Another for how they'll look. Another for the discipline and identity. Another for the social scene. Same membership — four entirely different purchases happening in four different heads.\n\nIf your message only speaks to 'health,' you've lost the other three. Each buyer runs a different internal program, and you have to speak to the program that's actually running." },
      { heading: "THE SHIFT", body: "Stop asking 'what's my message?' Start asking 'who am I talking to, and what does this solve for them specifically?' The operator maps the psychological types in their market and speaks to each one's real driver.\n\nThe next lessons break down the buyer archetypes and how to identify and address each. The principle underneath it all: people don't buy what you sell — they buy what it does for their specific psychology." },
    ],
  },
  "sc-1-2": {
    title: "The 7 Buyer Archetypes — Identification Protocol",
    sections: [
      { heading: "THE SEVEN DRIVERS", body: "Buyers cluster into recognizable types, each driven by a dominant motive. The Status Buyer (signal success and superiority). The Security Buyer (safety, guarantees, no risk). The Savings Buyer (the deal, the win, the value). The Convenience Buyer (easy, fast, frictionless).\n\nThen: the Identity Buyer (express who they are). The Connection Buyer (belonging, relationship, being part of something). And the Results Buyer (the outcome, nothing else)." },
      { heading: "READING THE TYPE", body: "You identify the type by what they ask about and what they object to. The Security Buyer asks 'what if it doesn't work?' The Savings Buyer asks 'is there a discount?' The Status Buyer asks 'who else uses this?' The Results Buyer asks 'how fast and how much?'\n\nTheir questions are a confession of their dominant driver. Listen for the repeated theme — it tells you which program is running before they've consciously told you anything." },
      { heading: "THE PROTOCOL", body: "In any sales conversation, your first job is diagnosis: identify the type before you pitch. Ask open questions and listen for the driver — what they emphasize, what they fear, what excites them.\n\nGet the type wrong and you'll pitch savings to a status buyer or risk-reduction to a results buyer — speaking past them entirely. Get it right and you speak directly to the engine of their decision. Identification first, always. Then you tailor." },
    ],
  },
  "sc-1-3": {
    title: "Tailoring Your Offer to Each Type",
    sections: [
      { heading: "ONE OFFER, SEVEN ANGLES", body: "You don't need seven products. You need seven ways to frame the same offer, each hitting a different buyer's driver. The product stays constant; the angle shifts to match the psychology in front of you.\n\nThis is leverage — one thing you sell, framed precisely for whoever you're talking to, converting across the whole spectrum instead of just one slice." },
      { heading: "MATCHING THE FRAME", body: "For Status: emphasize exclusivity, prestige, who else is in. For Security: lead with guarantees, proof, reversibility. For Savings: frame the value and the deal. For Convenience: stress how easy and fast.\n\nFor Identity: connect it to who they are. For Connection: sell the community and belonging. For Results: cut straight to the outcome and numbers, skip everything else. Same offer, seven different doorways in." },
      { heading: "DEPLOYING IT", body: "One-to-one: diagnose the type, then frame live. To many: build different messages, hooks, and pages for different segments rather than one bland catch-all.\n\nThe master skill is fluency — flipping between frames in real time as you read the person. You're not changing what you sell. You're changing the story you tell about it to match the story already running in their head. That's how one offer converts seven different people." },
    ],
  },

  // ═══════════════ SOCIAL WARFARE ═══════════════
  "sw-1-1": {
    title: "Micro-Expression Decoding",
    sections: [
      { heading: "THE FACE LEAKS", body: "Before someone consciously controls their expression, the true emotion flashes across their face — a micro-expression, often under half a second. It's involuntary, driven by the limbic system, and appears before the social mask goes up. The face tells the truth before the mouth gets a chance to lie.\n\nLearn to catch these and you read what people actually feel, not what they're performing." },
      { heading: "WHAT TO WATCH", body: "The key emotions leak in recognizable ways: genuine surprise lifts the brows and drops the jaw for an instant; contempt pulls one corner of the mouth; real smiles crinkle the eyes (fake ones don't); suppressed anger tightens the lips and lowers the brows.\n\nThe tell is speed and asymmetry. A flash that vanishes fast, or an expression that only half-fires, is the real emotion breaking through before control resumes. Watch the moment right after you say something that matters — that's when it leaks." },
      { heading: "USING IT", body: "Don't announce that you're reading people — that breaks rapport. Use it silently to calibrate: if you see suppressed disagreement when someone says 'sounds good,' you know to address the real objection they're hiding.\n\nThis is reading the truth beneath the words. Combined with body language, it lets you respond to what someone actually means instead of what they're willing to say. The face is broadcasting — most people just never learn to watch." },
    ],
  },
  "sw-1-2": {
    title: "Power Mapping — Who Actually Controls the Room",
    sections: [
      { heading: "TITLES LIE, DYNAMICS DON'T", body: "Every group has a real power structure that often has nothing to do with official titles. The actual influence flows to whoever the group instinctively defers to, watches, and seeks approval from. Power mapping is reading that hidden structure within minutes of entering a room.\n\nMisread it and you court the wrong person. Read it right and you know exactly who to win." },
      { heading: "THE EYES REVEAL IT", body: "The fastest tell: watch where people look after they speak or when something funny or tense happens. Eyes flick to the real authority for a reaction — that micro-glance for approval reveals who the group treats as the center.\n\nThe loudest person is rarely the most powerful. The powerful one is often quieter, gets interrupted less, and is the one others check with. Watch who gets deferred to, whose jokes everyone laughs at, who can change the subject and have it stick." },
      { heading: "MAPPING IN PRACTICE", body: "When you enter any group, spend the first minutes observing before acting. Track the glances, the deference, the interruption patterns. Identify the real center of gravity.\n\nThen direct your energy strategically — win the actual influencer, not the loudest voice or the nominal leader. In any room, a small number of people hold the real sway. Find them first, and your effort goes where it actually moves the group." },
    ],
  },
  "sw-1-3": {
    title: "Mirror Neurons & Engineering Rapport",
    sections: [
      { heading: "THE BRAIN THAT COPIES", body: "Mirror neurons fire both when you perform an action and when you watch someone else perform it — your brain partially simulates other people. This is the biological root of empathy and rapport. When you subtly match someone, their mirror system registers 'this person is like me,' and trust rises automatically.\n\nRapport isn't magic. It's a neurological response you can deliberately trigger." },
      { heading: "MATCHING AND MIRRORING", body: "Subtly align with the other person's posture, pace of speech, energy level, and breathing, and their brain reads similarity as safety. Done well, it's invisible and the person just feels inexplicably comfortable with you.\n\nThink of two close friends in conversation — without trying, they've synced posture and rhythm. You can reverse-engineer that closeness by matching first. The warning: overt mimicry reads as mockery. The skill is subtlety — match the general energy, not every gesture." },
      { heading: "ENGINEERING IT", body: "Lead with matching to build the bridge, then begin to lead — shift your own energy and watch them follow, which confirms rapport is established. Match, then lead.\n\nAdd calibrated vulnerability: sharing something real accelerates connection because it triggers reciprocal openness and releases oxytocin, the trust chemical. Rapport is a state you build deliberately — mirror to create similarity, open up to deepen trust, then guide the interaction from inside that connection." },
    ],
  },
  "sw-2-1": {
    title: "Status Games — Winning Without Competing",
    sections: [
      { heading: "THE PARADOX OF STATUS", body: "Status is constantly being negotiated in every interaction, below the surface. But here's the paradox: the harder you visibly compete for it, the more you signal you don't have it. High status is demonstrated by not needing to prove it.\n\nThe person grasping for status reveals scarcity. The person who already has it is relaxed, unbothered, and indifferent to winning small exchanges." },
      { heading: "THE NON-COMPETE", body: "Watch two people when someone makes a status play — a brag, a subtle put-down, a flex. The low-status response is to compete back, matching brag for brag. The high-status response is amused indifference — not engaging, because the game is beneath them.\n\nThe man who doesn't react to the provocation, who can be teased without flinching, who doesn't need to win the exchange, reads as the highest status in the room. Reacting is the tell that you're playing. Not playing is the win." },
      { heading: "EMBODYING IT", body: "Stop competing for status directly. Demonstrate it through calm, through non-reaction to provocations, through the ability to give status to others freely (only the secure can). Genuine indifference to winning small games signals you've already won the big one.\n\nThis ties to frame control: the one who cares least holds the most power. Status isn't taken by force. It's signaled by the absence of need — and that absence is what makes others grant it to you." },
    ],
  },
  "sw-2-2": {
    title: "Conversational Threading & Emotional Hijacking",
    sections: [
      { heading: "THREADING", body: "Most conversations die because people treat each topic as a dead end — statement, response, silence, scramble for a new subject. Threading is the skill of pulling multiple live threads from what someone says, so you always have somewhere rich to go and the conversation builds depth instead of stalling.\n\nEvery sentence someone says contains several hooks — a place, an emotion, a person, an opinion. Threading is grabbing the interesting one." },
      { heading: "RIDING EMOTION", body: "Emotional hijacking is steering the emotional tone of a conversation deliberately — lifting energy when it's flat, creating intrigue, shifting someone's state. The brain remembers conversations by their emotional peaks, not their content.\n\nThink of someone who can walk into a dull room and lift the whole energy — they're not saying anything profound, they're managing the emotional state. You can do this on purpose: inject curiosity, humor, or intensity to move the room where you want it emotionally." },
      { heading: "THE TECHNIQUE", body: "Listen for the threads in what people say and pull the one with the most emotional charge — that's where connection deepens. Don't interrogate (question after question kills energy); follow the emotion.\n\nManage the emotional arc deliberately: notice the current state, decide where it should go, and steer with your own energy and questions. People won't remember your clever lines. They'll remember how the conversation made them feel — so engineer the feeling." },
    ],
  },
  "sw-2-3": {
    title: "Push/Pull Dynamics & Tension Loops",
    sections: [
      { heading: "TENSION CREATES INTEREST", body: "Constant agreement and availability kills attraction and interest — it removes all tension, and tension is what holds attention. Push/pull is the deliberate alternation of warmth and distance, drawing close then creating space, that keeps someone engaged and invested.\n\nUnbroken pull (always available, always agreeing) becomes boring. Unbroken push (always distant) breaks connection. The dynamic lives in the alternation." },
      { heading: "THE INCOMPLETE LOOP", body: "The brain hates an unresolved pattern — an open loop demands closure, which is why cliffhangers work. A tension loop is creating a small unresolved charge — a tease, a challenge, a 'maybe' — that the other person feels compelled to resolve, pulling them toward you.\n\nThink of the difference between someone instantly, totally available and someone warm but slightly elusive. The second creates a loop the brain wants to close. That pull is investment, and investment is interest." },
      { heading: "USING IT WELL", body: "Mix genuine warmth with moments of playful challenge or space. Don't be a wall (cold push only) or a doormat (warm pull only) — alternate. A tease followed by warmth, interest followed by a little distance.\n\nThe ethical frame: this isn't game-playing to manipulate — it's the natural rhythm of any compelling dynamic. Authentic tension comes from genuine standards and a real life of your own. The push is real when you actually have somewhere else to be." },
    ],
  },
  "sw-3-1": {
    title: "Body Language, Eye Contact & Tonality",
    sections: [
      { heading: "THE BRAIN READS THE BODY FIRST", body: "Before a single word is processed, the brain has already read your body and tone and formed a judgment. Communication is dominated by the nonverbal — posture, movement, eye contact, and the music of the voice carry more weight than the words themselves.\n\nYou can say the right words and still lose the room if your body and tone contradict them. The signal underneath the words is the one people actually trust." },
      { heading: "THE SIGNALS", body: "Body: take up space calmly, move deliberately and unhurried — fast, fidgety movement signals anxiety and low status; stillness signals security. Eye contact: hold it with comfort, know when to break it — too little reads as weak, unbroken staring reads as aggressive.\n\nTonality: the brain processes HOW you speak before WHAT you say. A slow, grounded, downward-inflected tone signals authority; a fast, rising, uncertain tone signals you're seeking approval. Statements should land like statements, not questions." },
      { heading: "BUILDING PRESENCE", body: "Slow everything down — movement, speech, reactions. Speed leaks insecurity; stillness projects control. Hold eye contact with ease, break it deliberately not nervously. Drop your vocal tone and let sentences land.\n\nThe through-line is congruence: when your words, body, and tone all say the same thing, you're believed and magnetic. When they conflict, people trust the body and tone and distrust you. Align all three and your presence does the persuading before you've finished a sentence." },
    ],
  },
  "sw-3-2": {
    title: "Preselection — Social Proof in Action",
    sections: [
      { heading: "VALUE BY ASSOCIATION", body: "Preselection is the principle that being visibly valued by others makes you more valued by everyone else. It's social proof applied to a person: the brain uses 'do others want this?' as a shortcut for 'is this worth wanting?' Someone clearly respected, sought-after, or surrounded by quality people becomes instantly more attractive and credible.\n\nWe don't evaluate people in a vacuum. We read the room's verdict and adopt it." },
      { heading: "THE CROWD SIGNAL", body: "Think of two people at an event: one standing alone, one in the center of an engaged group laughing with them. Before you know anything about either, the second seems more interesting — the group has done your evaluation for you.\n\nThis is why testimonials, being seen with respected people, and visible demand all raise your standing. The brain reasons 'others have already vetted this person, so I can skip the work.' Real-time social proof — being chosen in front of others — is the strongest form there is." },
      { heading: "BUILDING IT HONESTLY", body: "Cultivate genuine social proof: surround yourself with quality relationships, let your real reputation and results be visible, don't hide the respect you've earned. Being authentically valued by good people raises how everyone perceives you.\n\nThe ethical line: this should reflect real value, not manufactured illusion (fake followers, staged crowds collapse on contact). Defense: notice when you're inflating someone's worth just because others seem to. Evaluate the person directly, not just the crowd around them." },
    ],
  },
  "sw-3-3": {
    title: "Presence — Commanding Attention Without Trying",
    sections: [
      { heading: "THE FINAL SKILL", body: "Presence is the quality that makes people turn when you enter, listen when you speak, and remember you after you leave — without you doing anything to demand it. It's the culmination of everything: frame, status, body language, and internal state, fused into a way of being.\n\nYou can't fake it with volume or effort. Trying hard to be noticed is the opposite of presence. It comes from the inside out." },
      { heading: "STILLNESS AND CERTAINTY", body: "Presence is built on internal stillness and self-certainty. The person with presence isn't performing — they're grounded, comfortable in silence, unbothered by the need for approval. That internal state radiates outward and others feel it as gravity.\n\nThink of someone who walks into a room calm and unhurried, says little, and yet everyone orients around them. They're not chasing attention — their inner certainty makes attention come to them. The external presence is just the visible surface of an internal state." },
      { heading: "DEVELOPING IT", body: "Presence can't be bolted on externally — it's built by developing genuine internal security and self-mastery. The external signals (stillness, grounded tone, comfortable eye contact, taking your space) flow from an inner state of not needing anything from the room.\n\nThis is where the whole pillar converges: master your internal state and the external presence follows automatically. Commanding attention without trying is the proof that the work is done on the inside. Build the inner certainty, and the room responds on its own." },
    ],
  },

  // ═══════════════ BIOLOGICAL OVERRIDE ═══════════════
  "bo-1-1": {
    title: "Dopamine Engineering — Rewire Your Reward System",
    sections: [
      { heading: "THE MOLECULE OF MORE", body: "Dopamine isn't the pleasure chemical — it's the pursuit chemical. It drives wanting, seeking, and motivation, not the enjoyment of having. It fires in anticipation of reward, pushing you to chase. Understanding this distinction is the key to controlling your own drive instead of being controlled by it.\n\nThe wanting and the having are different systems. Modern life hijacks the wanting." },
      { heading: "THE HIJACK", body: "Social media, junk food, porn, endless scrolling — these deliver huge, cheap dopamine hits with zero effort. The problem: the brain adapts by downregulating receptors, so you need more stimulation to feel the same, and ordinary effortful goals (building a business, training) start to feel flat by comparison.\n\nThis is why someone can scroll for hours but can't focus for ten minutes on hard work. Their baseline is jacked so high by cheap hits that real pursuits can't compete. The wanting system is fried." },
      { heading: "THE RESET PROTOCOL", body: "The fix is deliberate reduction of cheap, high-stimulation inputs to resensitize receptors — a dopamine reset. Strip out the easy hits (notifications, scrolling, junk) for a period and the baseline recovers, making effortful goals feel rewarding again.\n\nThen front-load effort before reward: earn the dopamine through hard things first, so your brain re-links pleasure to productive pursuit. The principle — guard your reward system like the asset it is. Whoever controls your dopamine controls your behavior. Make sure that's you." },
    ],
  },
  "bo-1-2": {
    title: "Cortisol Management & Stress Inoculation",
    sections: [
      { heading: "THE STRESS HORMONE", body: "Cortisol is the primary stress hormone — useful in short bursts (it sharpens focus and mobilizes energy for a real threat), destructive when chronically elevated. Sustained high cortisol degrades cognition, disrupts sleep, suppresses immunity, and breaks the body down over time.\n\nThe goal isn't zero stress — it's controlling the response so stress works for you in the moment and switches off afterward." },
      { heading: "ACUTE VS CHRONIC", body: "Acute stress is adaptive: the pressure before a big performance that sharpens you. Chronic stress is the killer: the low-grade, always-on cortisol drip from unmanaged pressure and no recovery. The body was built for short sprints of stress followed by recovery, not a continuous flood.\n\nThe tell of chronic elevation: disrupted sleep, constant tension, wired-but-tired, getting sick often, struggling to switch off. That's cortisol that never came back down after the threat passed." },
      { heading: "INOCULATION & CONTROL", body: "Manage acute stress with tools that physically lower cortisol: controlled breathing (long exhales activate the calming nervous system), deliberate cold exposure, and intense exercise (which burns it off). Build recovery in deliberately — the off-switch matters as much as the on.\n\nStress inoculation: controlled, voluntary exposure to discomfort (cold, hard training, fasting) trains your system to handle stress and recover faster, raising your threshold. You're not avoiding stress — you're building a body that processes it efficiently and returns to baseline on command." },
    ],
  },
  "bo-1-3": {
    title: "Oxytocin & Trust Chemistry",
    sections: [
      { heading: "THE BONDING MOLECULE", body: "Oxytocin is the chemistry of trust, bonding, and connection. It lowers defenses, increases generosity and cooperation, and creates the felt sense of closeness between people. Understanding its triggers lets you build genuine connection deliberately, and recognize when it's being engineered on you.\n\nTrust isn't only psychological. It has a chemical signature, and that signature can be activated." },
      { heading: "THE TRIGGERS", body: "Oxytocin releases through eye contact, physical touch (a handshake, a hand on the shoulder), shared vulnerability, acts of generosity, and shared experiences — especially intense ones. This is why people bond fast through hardship together, why opening up accelerates closeness, why a warm physical greeting shifts a dynamic.\n\nThink of how a genuine moment of vulnerability from someone instantly makes you trust them more — that's oxytocin doing its work, lowering the guard on both sides." },
      { heading: "BUILDING CONNECTION", body: "To deepen genuine relationships, use the real triggers — present eye contact, appropriate warmth, sharing something real, creating shared experiences. This is how authentic trust and rapport get built at the biological level.\n\nDefense: recognize that manufactured vulnerability and forced intimacy are manipulation tactics — when someone fast-tracks closeness through staged 'openness' to lower your guard, that's the chemistry being weaponized. Real connection builds through genuine, mutual triggers over time. Engineered connection rushes it for an agenda." },
    ],
  },
  "bo-2-1": {
    title: "Circadian Protocol — Engineering Perfect Sleep",
    sections: [
      { heading: "THE MASTER CLOCK", body: "Your body runs on a circadian rhythm — an internal 24-hour clock that governs sleep, energy, hormones, and focus. It's set primarily by light. Get the light signals right and the clock runs clean: deep sleep at night, sharp energy by day. Get them wrong and everything degrades — sleep, mood, cognition, recovery.\n\nSleep isn't fixed by lying in bed longer. It's fixed by setting the clock correctly." },
      { heading: "LIGHT IS THE SIGNAL", body: "Morning sunlight is the anchor: getting bright light into your eyes early tells the master clock 'day has started,' which sets the timer for melatonin release roughly 16 hours later and stabilizes the whole rhythm. Conversely, bright light and screens at night — especially blue light — suppress melatonin and push your clock later, wrecking sleep onset.\n\nThe modern problem in one line: too little light in the morning, too much at night. The clock gets no clean signal, so sleep gets no clean structure." },
      { heading: "THE PROTOCOL", body: "Anchor the clock: get sunlight in your eyes within an hour of waking (even on cloudy days), keep a consistent wake time including weekends, and dim lights and kill screens in the hour before bed. Cool, dark room for sleep.\n\nThe sequence that fixes most sleep: consistent wake time + morning light to set the clock, then darkness at night to release melatonin on schedule. Don't chase sleep with willpower or pills — engineer the light signals and the clock does the work for you." },
    ],
  },
  "bo-2-2": {
    title: "Supplement Stack for Deep Recovery",
    sections: [
      { heading: "SUPPLEMENTS ARE THE FINISHING LAYER", body: "Supplements don't replace the fundamentals — sleep, training, light, and nutrition do the heavy lifting. Supplements are the finishing layer that optimizes recovery once the basics are handled. Get the foundation right first; a stack on top of a broken routine is wasted money.\n\nThink of them as fine-tuning, not the engine. The engine is your daily protocol." },
      { heading: "THE RECOVERY-RELEVANT BASICS", body: "The most evidence-backed recovery supports are unglamorous: magnesium (involved in sleep quality and muscle relaxation, commonly low in modern diets), vitamin D (especially if you get little sunlight — it affects mood, immunity, and hormones), and omega-3s (which support brain and recovery).\n\nThese aren't exotic. They're the gaps modern living tends to create. Filling genuine deficiencies produces real returns; piling on trendy compounds on top of a full diet usually doesn't." },
      { heading: "THE APPROACH", body: "Prioritize the fundamentals first, then fill genuine gaps with well-supported basics rather than chasing every trending compound. Test where you can (bloodwork beats guessing), introduce one thing at a time so you can tell what's actually working, and be skeptical of hype.\n\nImportant: this is educational, not medical advice — consult a doctor before starting any supplement, especially if you have health conditions or take medication. The operator optimizes from a foundation, verifies what works, and doesn't outsource judgment to marketing." },
    ],
  },

  // ═══════════════ MINDHIJACKING ═══════════════
  "mh-1-1": {
    title: "System 1 vs System 2 — The Two Brains Running Your Life",
    sections: [
      { heading: "THE TWO SYSTEMS", body: "You think you make decisions. You don't. Two separate systems do, and only one of them feels like 'you.'\n\nSystem 1 is fast, automatic, emotional. It runs the show without asking permission. It's the gut feeling, the snap judgment, the instant like or dislike. It fires in milliseconds and it never sleeps.\n\nSystem 2 is slow, deliberate, logical. It's effortful. It's the part you think of as your conscious mind. The problem? It's lazy. It only wakes up when System 1 flags something as worth the energy." },
      { heading: "WATCH IT HAPPEN", body: "Someone shows you two coffee cups. One says '£2.' One says '£8, artisan single-origin.' Before you've thought about anything, System 1 has already decided the £8 one tastes better. It hasn't touched your tongue. The decision was made before logic showed up.\n\nThat gap — between the instant System 1 verdict and the slow System 2 justification — is where every influence operation lives." },
      { heading: "WHY THIS MATTERS", body: "Kahneman won a Nobel Prize for proving roughly 95% of decisions run on System 1. Ninety-five percent. People are convinced they're rational agents weighing options. They're not. They're emotional machines that hire a lawyer (System 2) afterward to defend whatever System 1 already chose.\n\nThe operator's job is simple: stop talking to System 2. Everyone else is pitching the lawyer. You go straight to the client." },
    ],
  },
  "mh-1-2": {
    title: "The 8-Second Gap — Decisions Before Consciousness",
    sections: [
      { heading: "THE DELAY", body: "Brain scans show something disturbing: your brain commits to a decision up to several seconds before 'you' become aware of having decided. The conscious experience of choosing is a story your mind tells you after the fact.\n\nYou don't decide and then act. You act, and then your mind writes a press release explaining why — and you believe the press release." },
      { heading: "THE PICKPOCKET EXAMPLE", body: "Imagine you found £100 on the pavement. Good feeling. Now imagine you had £100 in your pocket and someone lifted it. That second feeling is roughly twice as strong as the first.\n\nSame £100. Wildly different emotional weight. Your brain processed 'loss' and spiked a threat response before you could reason about it. By the time logic arrives, the body has already reacted." },
      { heading: "THE LEVER", body: "If the decision is made before awareness, then whoever shapes the input shapes the output. You're not persuading a conscious mind. You're loading the conditions that the unconscious mind will react to.\n\nThis is why timing, framing, and first impressions outweigh argument. The argument arrives after the verdict. Aim earlier." },
    ],
  },
  "mh-1-3": {
    title: "Heuristics — The Mental Shortcuts That Make People Predictable",
    sections: [
      { heading: "THE SHORTCUTS", body: "The brain processes a flood of information every second. It can't analyze all of it, so it built shortcuts — heuristics. Rules of thumb that let it decide fast without thinking hard.\n\n'Expensive means good.' 'Confident means competent.' 'Familiar means safe.' 'Everyone's doing it means it's correct.' These run automatically, below awareness." },
      { heading: "SHORTCUTS ARE PREDICTABLE", body: "Here's the gift: shortcuts make people predictable. A truly rational agent would be hard to influence — you'd have to out-argue them. But nobody's running pure logic. They're running shortcuts. And shortcuts can be triggered.\n\nThink of it like a vending machine. Press the right button, get the predictable output. Authority shortcut, social proof shortcut, scarcity shortcut — each is a button." },
      { heading: "THE WATCH-FOR", body: "Start noticing them in your own life. The watch you assume is quality because of the price. The opinion you trust because the person sounded sure. The product you bought because '10,000 five-star reviews.'\n\nEvery one of those is a heuristic firing. Once you see them in yourself, you'll see them in everyone — and that's the beginning of control." },
    ],
  },
  "mh-2-1": {
    title: "Emotional Tagging — Why Feelings Override Logic",
    sections: [
      { heading: "THE TAG", body: "Every memory you hold has an emotional tag attached. The brain doesn't store information neutrally — it staples a feeling to it. And when you make a future decision, you don't retrieve the facts. You retrieve the feeling.\n\nThis is why a brand can spend millions to attach one emotion to a logo. They're not selling features. They're stapling a feeling to a symbol so that when you see it, the feeling fires first." },
      { heading: "FEEL IT", body: "Picture a Coca-Cola ad. Friends, summer, laughter, ice-cold bottle. None of that is information about a sugary drink. It's emotional tagging. They're welding 'happiness' onto a red can so that in the shop, your System 1 reaches for the feeling, not the beverage.\n\nNow picture a cigarette warning: a diseased lung. Same mechanism, reversed. Staple disgust to the object." },
      { heading: "DEPLOYMENT", body: "When you communicate — in copy, in conversation, in a pitch — you are tagging. Every word leaves an emotional residue. The operator chooses the residue deliberately.\n\nDon't describe your offer. Attach a feeling to it. People forget what you said. They never forget how you made them feel — because the feeling is the only thing that gets stored." },
    ],
  },
  "mh-2-2": {
    title: "Pattern Interrupts & Attention Hijacking",
    sections: [
      { heading: "THE PREDICTION MACHINE", body: "Your brain is a prediction engine. It runs on autopilot, anticipating what comes next so it can conserve energy. Most of life, it's barely paying attention — it's just confirming predictions.\n\nWhich means the way to seize attention is not to be louder. It's to break the prediction. A pattern interrupt." },
      { heading: "THE BROKEN HANDSHAKE", body: "Classic example: someone reaches to shake your hand and instead you do something unexpected — a pause, a different move. For a split second their autopilot crashes and the conscious mind snaps online, scrambling for footing. In that gap, they're suggestible.\n\nYou see this in great hooks. A sentence that violates expectation. The scroll stops. The autopilot broke." },
      { heading: "USING IT", body: "In writing: open with something that contradicts what they expect to hear. In conversation: break the social script. In content: the first line should make the prediction engine stall.\n\nAttention isn't won by volume. It's won by surprise. The moment the pattern breaks, the conscious mind wakes up — and that's the only moment it's listening." },
    ],
  },
  "mh-2-3": {
    title: "The Anchoring Effect — Controlling Reference Points",
    sections: [
      { heading: "THE FIRST NUMBER WINS", body: "The first piece of information sets the reference point everything else gets measured against. Drop an anchor, and every judgment that follows drifts toward it — even when the anchor is arbitrary.\n\nThe brain hates evaluating in a vacuum. Give it a starting point and it will cling to it, adjusting only slightly from there." },
      { heading: "THE DEALERSHIP", body: "Walk into a car dealership. The salesman says '£45,000.' You were thinking £30k. But now £35k feels like a win — like you beat him. You didn't. He moved your entire reference frame by £5,000 with a single sentence, then let you 'negotiate' down to exactly where he wanted you.\n\nThe £45k was never real. It was an anchor." },
      { heading: "DEPLOY & DEFEND", body: "Deploy: state your number first. In any negotiation, pricing, or expectation-setting, whoever anchors first controls the field. Anchor high, justify after.\n\nDefend: when someone throws a number at you, recognize it as an anchor and consciously generate your own reference point before responding. The feeling of 'that's a lot' or 'that's reasonable' is the anchor working on you. Reset it deliberately." },
    ],
  },
  "mh-2-4": {
    title: "Social Proof & Tribal Compliance",
    sections: [
      { heading: "THE HERD INSTINCT", body: "For most of human history, being cast out of the tribe meant death. So the brain evolved a brutal rule: if everyone's doing it, it's safe — do it too. Going against the group registers as a survival threat.\n\nThis is social proof. And it's strongest exactly when people are uncertain. The less sure someone is, the harder they scan others for the 'correct' move." },
      { heading: "THE EMPTY RESTAURANT", body: "Two restaurants side by side. One is packed with a queue. One is empty. You'll wait for the busy one — even though the empty one would seat you now. The crowd is doing your thinking for you. 'They must know something.'\n\nWatch for it: '10,000 sold.' 'Join 50,000 subscribers.' 'As seen on.' Every one of these is feeding your brain the herd signal so it stops evaluating and starts following." },
      { heading: "THE OPERATOR LENS", body: "Deploy: show the crowd. Numbers, testimonials, visible demand. Don't claim you're good — show that others have already decided you are. The brain trusts the verdict of the many over the claim of the one.\n\nDefend: when you feel the pull of 'everyone's doing it,' that's the exact moment to evaluate independently. The crowd has been wrong before. Tribal compliance is a shortcut, not a truth." },
    ],
  },
  "mh-3-1": {
    title: "First Frame Protocol — Controlling the Opening",
    sections: [
      { heading: "THE FRAME IS THE FIELD", body: "Every interaction happens inside a frame — the unspoken set of assumptions about what this is, who has status, and what the rules are. Whoever sets the frame first controls the entire exchange, because everything afterward gets interpreted through it.\n\nMost people walk into interactions accepting whatever frame they're handed. The operator sets it." },
      { heading: "THE INTERVIEW FLIP", body: "Two candidates. One walks in thinking 'I hope they like me' — that's a supplicant frame, and every answer comes out slightly begging. The other walks in thinking 'Let's see if this company is good enough for me' — and asks calm, evaluating questions.\n\nSame qualifications. The second one reframed the room. Now the interviewer is subtly auditioning. The frame did that, not the résumé." },
      { heading: "SETTING IT", body: "The opening seconds carry the most weight — primacy effect. Your first move, first line, first energy establishes the frame. Set it deliberately: calm, certain, unhurried.\n\nThe person with the least need controls the frame. Need is the tell that collapses it. Walk in with nothing to prove, and the frame is yours before a word is spoken." },
    ],
  },
  "mh-3-2": {
    title: "Loss Architecture — Engineering Fear of Missing Out",
    sections: [
      { heading: "LOSS BEATS GAIN", body: "Losing something hits roughly twice as hard as gaining the same thing. The brain is wired to protect what it has far more fiercely than to pursue what it doesn't. This asymmetry is one of the most exploitable facts about human beings.\n\nFrame something as a gain and people are mildly interested. Frame the identical thing as a loss they're about to suffer and they move." },
      { heading: "FEEL THE FLIP", body: "'Sign up and save £100.' Mild. 'You're currently losing £100 every month you wait.' Urgent. Same £100. The second version activates the threat response; the first just makes an offer.\n\nThis is why deadlines, limited spots, and 'don't miss out' work. They convert a passive gain into an active loss. The brain can ignore a missed gain. It cannot ignore a loss in progress." },
      { heading: "THE BUILD", body: "Don't tell people what they'll get. Show them what they're losing by staying where they are. The cost of inaction. The price of the status quo. The thing slipping away.\n\nUse it honestly — manufactured false scarcity gets exposed and destroys trust. But real stakes, framed as loss, are the strongest mover you have." },
    ],
  },
  "mh-3-3": {
    title: "Validation Stack — Manufacturing Trust",
    sections: [
      { heading: "TRUST IS BUILT IN LAYERS", body: "Nobody trusts a single claim. But stack enough independent trust signals and skepticism collapses under the weight. This is the validation stack — layering authority, proof, and consistency until doubt becomes exhausting to maintain.\n\nOne signal is a claim. Five aligned signals feel like reality." },
      { heading: "THE LAYERS", body: "Authority: credentials, expertise, the appearance of knowing. Social proof: others already vouching. Consistency: the message matches across every surface. Specificity: precise numbers and details, because the brain reads precision as truth ('47%' beats 'about half').\n\nWatch any high-converting sales page. Logo bar, testimonials, founder story, data, guarantee. That's a stack, built to make 'no' feel irrational." },
      { heading: "ASSEMBLY", body: "When you want to be believed, don't lean on one pillar. Layer them. Each signal alone is weak; together they compound.\n\nAnd the most underrated layer: calibrated vulnerability. Admitting a small flaw makes every other claim more believable, because perfection reads as a lie. Strategic honesty is a trust accelerant." },
    ],
  },
  "mh-3-4": {
    title: "Narrative Dominance — Story as Weapon",
    sections: [
      { heading: "THE BRAIN RUNS ON STORY", body: "Facts activate two small language regions of the brain. A story activates those plus the sensory, motor, and emotional regions — the listener's brain partially simulates the events as if living them. You don't hear a story. You run it.\n\nThis is why story outperforms argument every time. An argument invites resistance. A story bypasses it, because the mind is too busy living the scene to defend against it." },
      { heading: "THE SLIDE PAST THE GUARD", body: "Tell someone 'you should be more disciplined' and their defenses go up — they argue back in their head. Tell them a story about a man who wasted a decade in comfort and woke up at 40 with nothing, and they draw the conclusion themselves.\n\nThe conclusion they reach on their own is the only one that sticks. Story is the delivery system for self-generated belief." },
      { heading: "WEAPONIZING IT", body: "Stop asserting. Start narrating. Wrap the lesson inside a scene with a character, a tension, and a turn. Let them feel it, and let them arrive at the point themselves.\n\nStructure: relatable character → tension or stakes → turn → the realization. Don't state the moral. The mind that completes the story owns the meaning." },
    ],
  },
  "mh-4-1": {
    title: "CIA Self-Diagnostic — Are You Being Hijacked?",
    sections: [
      { heading: "THE MIRROR TURNS", body: "You've spent this course learning to deploy these mechanisms. Now the harder question: how often are they being run on you? Every technique you've studied is being used against you daily — by advertisers, platforms, salespeople, and people who want something.\n\nThe operative who can deploy but can't detect is just a more sophisticated target." },
      { heading: "THE TELLS", body: "Run the diagnostic. Sudden urgency you didn't generate yourself? Scarcity trigger. A number stuck in your head shaping your sense of 'reasonable'? Anchor. Doing something because 'everyone is'? Social proof. Trusting a claim because the person sounded certain? Authority shortcut. An unsolicited gift that left you feeling you owe something? Reciprocity.\n\nEach is a fingerprint. Learn the fingerprints and the invisible becomes obvious." },
      { heading: "METACOGNITION", body: "The master skill is metacognition — thinking about your own thinking. Watching your reactions as they form, asking 'why am I feeling this pull right now, and who benefits if I follow it?'\n\nThe single most reliable tell: urgency. Almost every manipulation needs you to act before System 2 wakes up. So the protocol is simple — when you feel sudden pressure to decide, pause. The pause is where your mind comes back online." },
    ],
  },
  "mh-4-2": {
    title: "Defense Protocols — Detecting & Neutralizing Influence",
    sections: [
      { heading: "THE PAUSE", body: "Every influence technique shares one requirement: speed. They need the decision made on System 1 before System 2 arrives. So the foundational defense is the deliberate pause.\n\nWhen you feel the pull — to buy, to agree, to commit — stop. Say 'I'll think about it.' Watch what happens. Real value survives a pause. Manipulation evaporates without urgency, because urgency was the whole mechanism." },
      { heading: "NAME IT TO NEUTRALIZE IT", body: "The instant you label a technique, it loses most of its power. Naming pulls the decision out of automatic System 1 and into conscious System 2.\n\n'That's an anchor.' 'That's manufactured scarcity.' 'That's a reciprocity play.' The mechanism works in the dark. Naming turns the light on, and it can't operate while you're watching it." },
      { heading: "THE STANDING DEFENSES", body: "Build permanent guards. Generate your own reference points before accepting anchors. Evaluate independently before following the crowd. Treat unsolicited gifts as what they are, not as debts. Distrust urgency on principle.\n\nThe paradox of this entire course: learning to deploy these tools is also what immunizes you against them. The hunter who understands the trap is the hardest animal to catch." },
    ],
  },

  // ═══════════════ THE PERSUASION CODE ═══════════════
  "pc-1-1": {
    title: "The Reptilian Override — Why Logic Loses",
    sections: [
      { heading: "THE OLDEST BRAIN", body: "Underneath the rational mind sits an ancient structure — the primal brain. It's the part you share with every animal that ever had to survive. It controls fight, flight, food, and threat. And critically: it decides first.\n\nEvery message you send hits this primal brain before it reaches the rational one. If it doesn't pass the primal filter, the rational brain never even gets the memo." },
      { heading: "SURVIVAL FIRST", body: "The primal brain asks one question about everything: 'Does this concern my survival?' It doesn't care about your features, your logic, or your nuance. It cares about threats, opportunities, and self-interest. It's selfish, fast, and visual.\n\nThis is why a clever, logical pitch falls flat while a simple, vivid, self-interested one lands. The clever pitch was aimed at the wrong brain." },
      { heading: "THE IMPLICATION", body: "Stop pitching the rational mind. It's the gatekeeper's boss who never takes meetings. The primal brain is the gatekeeper, and it only responds to a specific set of signals.\n\nThe next module breaks down those signals — the six stimuli the primal brain cannot ignore. Master them and you stop arguing with people and start triggering them." },
    ],
  },
  "pc-1-2": {
    title: "Bottom-Up Processing — The Cascade That Controls You",
    sections: [
      { heading: "THE CASCADE", body: "Information doesn't enter top-down through logic. It enters bottom-up: primal brain first, emotional brain second, rational brain last. By the time the rational mind engages, the lower two have already colored everything.\n\nThis is the cascade. And it means the rational arguments you lead with are landing on a decision that's already half-made downstairs." },
      { heading: "EMOTION IN THE MIDDLE", body: "Between primal and rational sits the emotional brain — the limbic system. It assigns feeling and, crucially, it's where decisions actually get made. Neurological fact: people with damage to the emotional brain, but intact logic, become unable to decide. They can list every pro and con and still freeze.\n\nNo emotion, no decision. Logic informs. Emotion commits." },
      { heading: "RIDING THE CASCADE", body: "Sequence your influence to match the cascade. First, hit the primal brain — grab survival-level attention. Then move the emotional brain — make them feel. Only then offer the rational brain its justification, so it can defend the decision already made.\n\nMost people run this backwards: facts first, feelings never. Reverse it. Primal, emotional, rational. In that order." },
    ],
  },
  "pc-2-1": {
    title: "Stimulus 1: Personal — Making It About THEM",
    sections: [
      { heading: "THE SELFISH BRAIN", body: "The primal brain is completely self-centered. It evolved to protect one organism — its owner. So it only truly wakes up for things that concern its own survival and wellbeing. Anything that isn't about 'me' gets filtered as background noise.\n\nThis is the first stimulus: make it personal. Make it unmistakably about them." },
      { heading: "THE PIVOT", body: "Watch the difference. 'Our company has 20 years of experience and a 50-person team.' The primal brain hears nothing — that's about you. 'You'll stop losing sleep over this within a week.' Now it's listening — that's about them.\n\nEvery 'we' and 'our' is a missed shot. Every 'you' and 'your' is a direct hit. The brain on the other end is asking 'what's in it for me?' — answer that question or be ignored." },
      { heading: "DEPLOYMENT", body: "Audit your message. Count the 'we's versus the 'you's. Flip the ratio hard toward them. Lead with their pain, their gain, their world — not your credentials.\n\nThe credentials matter, but they're rational-brain food, served last. The primal brain eats first, and it only eats 'you.'" },
    ],
  },
  "pc-2-2": {
    title: "Stimulus 2: Contrastable — Binary Choices That Force Decisions",
    sections: [
      { heading: "THE BRAIN NEEDS CONTRAST", body: "The primal brain can't evaluate in the abstract. It needs comparison to decide — before/after, with/without, us/them. Contrast is what allows it to make a fast call without burning energy. Remove the contrast and it stalls.\n\nThis is the second stimulus: give the brain a clear, contrastable choice." },
      { heading: "BEFORE AND AFTER", body: "Every effective fitness ad is built on this: the before photo and the after photo. The brain instantly grasps the gap and wants to cross it. No contrast, no desire — just a neutral image that means nothing.\n\nSame with your offer. 'Here's your life now. Here's your life after.' The space between the two states is where motivation is generated." },
      { heading: "USING IT", body: "Frame choices as binaries: the painful status quo versus the desired outcome. Show the gap clearly and let the contrast pull them across.\n\nAnd avoid the killer mistake — too many options. A confused brain defaults to the safest choice: doing nothing. Reduce to a clear contrast. The clearer the comparison, the faster the decision." },
    ],
  },
  "pc-2-3": {
    title: "Stimulus 3: Tangible — Reducing Cognitive Load",
    sections: [
      { heading: "THE LAZY BRAIN", body: "The primal brain is allergic to effort. Anything abstract, complex, or requiring mental work gets rejected — not because it's wrong, but because it's tiring. The brain conserves energy ruthlessly.\n\nThird stimulus: make it tangible. Concrete, simple, immediately graspable. The easier it is to process, the more the brain trusts and accepts it." },
      { heading: "ABSTRACT VS CONCRETE", body: "'We optimize cross-functional synergy to maximize ROI.' The brain hits a wall — abstract, effortful, meaningless. 'We get you 3 extra clients a month.' Instant. Concrete. The brain pictures it and relaxes.\n\nNumbers, images, physical outcomes — these are tangible. Concepts, jargon, and abstraction force the brain to work, and a working brain is a resistant brain." },
      { heading: "THE TRANSLATION", body: "Take every abstract claim and translate it into something the brain can hold. 'Save time' → 'get your evenings back.' 'Improve efficiency' → 'leave work an hour earlier.'\n\nThe rule: if they can't picture it, they can't want it. Tangibility is what turns a concept into a craving." },
    ],
  },
  "pc-2-4": {
    title: "Stimulus 4: Memorable — Beginning and End Weighting",
    sections: [
      { heading: "PRIMACY AND RECENCY", body: "The brain doesn't remember experiences evenly. It heavily weights the beginning and the end, and largely forgets the middle. Two effects: primacy (the start sets the frame) and recency (the end is what lingers).\n\nFourth stimulus: engineer the open and the close, because that's all they'll actually retain." },
      { heading: "THE STRONG OPEN AND CLOSE", body: "Think about any conversation you remember. You recall how it started and how it ended. The middle is a blur. Same with a pitch, a piece of content, a sales call.\n\nSo front-load your strongest hook and end on your most powerful note. A weak opening loses them before you've begun. A weak ending erases everything that came before it." },
      { heading: "THE BUILD", body: "Put your most important message at the start and repeat it at the end. Never bury the critical point in the middle — that's the memory dead zone.\n\nStructure: open with the strongest claim or hook, deliver the body, then close by returning to that claim with force. First and last. Everything else is support." },
    ],
  },
  "pc-2-5": {
    title: "Stimulus 5: Visual — The Dominant Sensory Channel",
    sections: [
      { heading: "THE EYES HAVE IT", body: "The primal brain is overwhelmingly visual. A huge share of its processing power is devoted to sight, and the optic nerve connects to it directly and almost instantly. The brain processes images orders of magnitude faster than text.\n\nFifth stimulus: think visually. Show before you tell, because the brain sees before it reads." },
      { heading: "SEE IT FIRST", body: "'Don't think of a red elephant.' Too late — you saw it. The visual fired before you could stop it. That's the speed and involuntary power of the visual channel.\n\nThis is why a single strong image can outsell a page of copy, and why describing a vivid scene beats listing features. You're not informing the brain. You're making it see." },
      { heading: "DEPLOYING VISION", body: "Use real images where you can. Where you can't, paint visual pictures with words — concrete scenes the mind renders automatically. 'Imagine walking into the office and your inbox is already at zero.' They see it. Seeing it is wanting it.\n\nAbstract words leave the brain blind. Visual language switches the lights on." },
    ],
  },
  "pc-2-6": {
    title: "Stimulus 6: Emotional — Neurochemical Triggers",
    sections: [
      { heading: "EMOTION IS THE TRIGGER", body: "The final and most powerful stimulus. Emotions create measurable neurochemical events in the brain, and those events are what actually drive action. No emotion, no movement. A perfectly logical case with zero emotional charge produces nothing.\n\nEmotion is not the decoration on the message. Emotion is the engine." },
      { heading: "THE CHEMISTRY", body: "Different emotions release different chemicals, each driving different behavior. Fear and urgency spike cortisol and force action. Excitement and reward release dopamine and drive pursuit. Trust and connection release oxytocin and lower defenses.\n\nThe operator chooses the emotion based on the action they want. Want urgency? Trigger loss and fear. Want desire? Trigger reward and anticipation. Want compliance? Build trust and safety first." },
      { heading: "ENGINEERING FEELING", body: "Decide the single emotion you need them to feel, then build everything toward it. Don't scatter — concentrate. One dominant emotion, fully activated, beats five half-felt ones.\n\nCombine all six stimuli and you have the code: personal, contrastable, tangible, memorable, visual, and emotional. Hit all six and you're no longer making an argument. You're triggering a decision the primal brain experiences as its own." },
    ],
  },
  "pc-3-1": {
    title: "What Frames Are & Why They Control Everything",
    sections: [
      { heading: "THE INVISIBLE CONTEXT", body: "A frame is the context that determines meaning. The same words, the same offer, the same action mean completely different things depending on the frame around them. Control the frame and you control the interpretation — which means you control the response.\n\nMost people fight over facts. Operators control frames, because the frame decides what the facts even mean." },
      { heading: "SAME FACT, DIFFERENT FRAME", body: "A surgery with a '90% survival rate' versus the same surgery with a '10% death rate.' Identical fact. People accept the first and refuse the second. The frame did that — not the data.\n\n'It's expensive' versus 'it's an investment.' 'I'm unemployed' versus 'I'm between ventures, choosing carefully.' The reframe changes the entire emotional reality without changing a single fact." },
      { heading: "THE PRINCIPLE", body: "Whoever sets the frame wins, because everyone inside it is forced to react on its terms. The person reacting to a frame has already lost ground to the person who set it.\n\nThe rest of this module is about winning frame battles and reframing on command. But it starts here: stop arguing inside other people's frames. Set your own." },
    ],
  },
  "pc-3-2": {
    title: "Frame Battles — How to Win Every Exchange",
    sections: [
      { heading: "FRAMES COLLIDE", body: "When two people interact, their frames meet — and one absorbs the other. This happens in seconds, usually below awareness. The stronger frame wins, and from that point the interaction runs on the winner's terms.\n\nStrength here isn't volume or aggression. The strongest frame belongs to the person with the least emotional reactivity and the least need." },
      { heading: "THE NON-REACTION", body: "Someone throws a provocation, a test, a challenge — trying to knock you into their frame. The amateur reacts: defends, justifies, gets flustered. The reaction is the surrender. You've entered their frame to argue on their terms.\n\nThe operator doesn't flinch. A calm pause, mild amusement, an unbothered response — and the challenge dissolves. Non-reaction signals 'your frame has no power here,' and theirs collapses into yours." },
      { heading: "WINNING", body: "Hold your frame through stillness, not force. When tested, slow down instead of speeding up. Treat provocations as minor, not threatening. The one who cares least controls the most.\n\nIt's like being the calm adult while someone has a tantrum. You don't win by tantruming louder. You win by being unmoved — and your composure becomes the frame everyone defaults to." },
    ],
  },
  "pc-3-3": {
    title: "Preframing & Reframing Protocols",
    sections: [
      { heading: "PREFRAME: WIN BEFORE YOU START", body: "Preframing is setting the interpretation before the event happens, so the other person experiences it through the lens you installed. Plant the frame in advance and the actual moment confirms it automatically.\n\n'You're going to think this is too good to be true, but hear me out.' Now skepticism reads as predicted, and openness as smart. The frame was set before the pitch began." },
      { heading: "REFRAME: FLIP IT LIVE", body: "Reframing is changing the context of something in real time to change its meaning. An objection, an attack, a setback — caught and recast.\n\n'You're too expensive.' → 'I'm priced for people who are serious about results — and cheap options are exactly why you're still dealing with this.' Same price, flipped meaning. The objection becomes evidence for buying." },
      { heading: "THE PROTOCOLS", body: "Preframe by setting expectations before key moments — disarm objections before they form. Reframe by never accepting the meaning you're handed; find the angle that serves you and recast instantly.\n\nThe master move is presupposition: embed your conclusion inside the question. 'When you start seeing results, what changes first?' presupposes results are coming. The brain accepts the buried premise while answering the surface question. That's frame control at its most invisible." },
    ],
  },

  // ═══════════════ CONSUMER DECISION SCIENCE ═══════════════
  "cp-1-1": {
    title: "The Coke vs Pepsi Study — When Brands Override Taste",
    sections: [
      { heading: "THE EXPERIMENT", body: "Researchers ran a blind taste test in a brain scanner. Without labels, most people preferred Pepsi, and their brains lit up in the reward region — pure sensory pleasure. Then they ran it again with the brands visible.\n\nThe moment people saw the Coke label, the result flipped. They now preferred Coke — and a completely different brain region activated: the area tied to memory, identity, and emotional association." },
      { heading: "WHAT IT PROVES", body: "The label literally changed what people experienced on their tongue. The brand association — decades of emotional tagging — overrode the raw sensory signal. People weren't tasting a drink. They were tasting a memory, an identity, a feeling welded onto a logo.\n\nThis is the foundational truth of consumer psychology: people don't buy the product. They buy what the product means." },
      { heading: "THE LEVER", body: "If brand association can override taste itself, then the battle isn't won on product quality alone. It's won in the emotional memory you build around the product.\n\nFor anything you sell: the feeling and identity you attach to it can outweigh the thing itself. Build the meaning and you can win even against a 'better' product — because the brain experiences the meaning as part of the reality." },
    ],
  },
  "cp-1-2": {
    title: "Willingness to Purchase — The Subconscious Plateau",
    sections: [
      { heading: "THE HIDDEN SIGNAL", body: "Brain imaging can detect a buying signal — call it willingness to purchase — before the person consciously decides anything. Researchers can watch it rise and fall in real time as someone evaluates an offer.\n\nThe striking finding: once a compelling offer is made, this signal doesn't spike and fade. It spikes and then plateaus at an elevated level, staying high through the rest of the interaction." },
      { heading: "WHAT THE PLATEAU MEANS", body: "The decision to buy is largely made at the moment of the offer, then the brain shifts into a sustained state of justification and risk-assessment that holds until the close. The person feels like they're 'still deciding' — but the core verdict is already in.\n\nWhat they're actually doing during that plateau is looking for reasons to feel safe about a decision they've mostly made." },
      { heading: "THE APPLICATION", body: "Front-load your strongest case to spike the signal at the offer. Then, through the plateau, feed the brain what it's looking for: reassurance, proof, risk reduction. Guarantees, testimonials, specifics.\n\nThe sequence: hit hard at the offer to create the spike, then remove risk to protect the plateau all the way to the close. Lose them in the plateau and you lose a sale that was nearly won." },
    ],
  },
  "cp-1-3": {
    title: "The IFG Activation — Decisions Before You Know",
    sections: [
      { heading: "THE RISK DETECTOR", body: "A region called the inferior frontal gyrus activates during purchase decisions — and it fires several seconds before the person is consciously aware of deciding. Its job is essentially risk assessment: 'Is this safe? Will I regret this?'\n\nThe buying decision is being computed below awareness, and the conscious 'choice' arrives after the brain has mostly made up its mind." },
      { heading: "RISK IS THE GATEKEEPER", body: "What this region is really screening for is danger — financial loss, social embarrassment, wasted money, looking foolish. If perceived risk is too high, it kills the purchase before logic even weighs the benefits.\n\nThis reframes selling entirely. You're not just adding reasons to buy. You're removing reasons to fear. Often the sale isn't lost because the upside was too small — it's lost because the risk felt too large." },
      { heading: "DISARMING RISK", body: "Lower perceived risk at every turn. Guarantees, free trials, social proof, reversibility, clear expectations — each one quiets the threat detector.\n\nAlso note: visuals and emotional signals carry more weight in the later stages, after the offer, when the brain is in risk-assessment mode. Reassure visually and emotionally, not just logically. Make the safe choice feel safe and the gatekeeper stands down." },
    ],
  },
  "cp-2-1": {
    title: "Anchoring — Controlling the Reference Point",
    sections: [
      { heading: "THE PRICE ANCHOR", body: "Price has no absolute meaning to the brain — only relative meaning. It judges every price against a reference point, and whoever sets that reference controls whether your price feels expensive or cheap.\n\nShow a £1,000 option first and a £400 option looks reasonable. Show the £400 alone and it might feel steep. Nothing changed but the anchor." },
      { heading: "THE MENU TRICK", body: "Restaurants place a wildly expensive dish at the top of the menu. Almost nobody orders it — that's not its job. Its job is to be an anchor that makes the £30 main feel moderate by comparison.\n\nLuxury brands do the same with a flagship product nobody buys. It exists to reframe everything cheaper as 'accessible.' Watch for the decoy anchor everywhere once you know to look." },
      { heading: "DEPLOYING IT", body: "Always present a high anchor before your target price. Show premium first, then the option you actually want them to take. The sequence makes your real offer feel like relief.\n\nThe rule: never present a price in isolation. Surround it with context that makes it feel like the smart, moderate, obvious choice. Price is a story about comparison — so control the comparison." },
    ],
  },
  "cp-2-2": {
    title: "The Decoy Effect & Asymmetric Dominance",
    sections: [
      { heading: "THE THIRD OPTION", body: "Add a third, deliberately inferior option and you can predictably push people toward the choice you want. This is the decoy effect — a decoy that exists only to make your target option look obviously superior by comparison.\n\nThe brain struggles to judge value in the abstract, but it's excellent at spotting which of two similar things is the better deal. The decoy creates that easy comparison." },
      { heading: "THE CLASSIC", body: "The famous magazine pricing: digital for £59. Print for £125. Print AND digital… also £125. The middle option seems pointless — and it is, deliberately. It makes the £125 combo look like a no-brainer, because print alone and print-plus-digital cost the same.\n\nWithout the decoy, most chose digital. With it, most chose the expensive combo. One useless option moved the entire market." },
      { heading: "BUILDING THE DECOY", body: "Structure three options where the middle one is asymmetrically dominated — clearly worse than your target on a key dimension, for a similar price. The target becomes the obvious winner.\n\nThis is why 'good / better / best' pricing works, and why the 'better' tier is often engineered to make 'best' irresistible. You're not offering choices. You're engineering a comparison that funnels toward one answer." },
    ],
  },
  "cp-2-3": {
    title: "Loss Aversion — Why Losing Hits Twice as Hard",
    sections: [
      { heading: "THE ASYMMETRY", body: "The pain of losing something is roughly twice as intense as the pleasure of gaining the equivalent. The brain weighs threats far more heavily than rewards — a survival adaptation that now governs every purchase.\n\nThis means framing matters enormously. The same offer framed as avoiding a loss outperforms the identical offer framed as achieving a gain." },
      { heading: "OWNERSHIP AND TRIALS", body: "This is why free trials convert so well. Once someone is using the product, it's theirs — and giving it up now registers as a loss, not a missed gain. The endowment effect: we overvalue what we already possess.\n\n'Try it free for 30 days' works because after 30 days, cancelling means losing something they now own. The brain resists that far harder than it resisted buying in the first place." },
      { heading: "FRAMING FOR LOSS", body: "Frame around what they stand to lose by not acting — the cost of staying the same, the opportunity slipping away, the problem compounding. Let them experience ownership early through trials, samples, or vivid future-pacing.\n\nUse it ethically — real stakes, not fabricated ones. But understand that 'don't lose this' will almost always move people more than 'come gain this.'" },
    ],
  },
  "cp-2-4": {
    title: "The Pain of Paying & Temporal Discounting",
    sections: [
      { heading: "PAYING HURTS", body: "Spending money activates regions associated with physical pain. Handing over cash literally registers as a small injury to the brain. This 'pain of paying' is a major brake on purchasing — and the structure of the payment changes how much it hurts.\n\nThe more salient and immediate the payment, the more it stings. The more separated and abstract, the less." },
      { heading: "SEPARATION REDUCES PAIN", body: "This is why cards hurt less than cash, why subscriptions feel painless, why all-inclusive resorts are pleasant — the pain is decoupled from the consumption. You enjoy without the repeated sting of each transaction.\n\nTemporal discounting compounds it: the brain massively prefers rewards now and pushes costs to 'later.' 'Pay nothing today' works because future pain barely registers against present gain." },
      { heading: "ENGINEERING THE PAYMENT", body: "Reduce the pain of paying by separating payment from consumption: subscriptions, pre-payment, bundling, financing. Make the spend feel small, distant, or invisible relative to the value received.\n\nThe goal isn't to hide cost dishonestly — it's to stop the pain response from killing a purchase the person genuinely wants. Smooth the sting and the brain stops fighting itself." },
    ],
  },
  "cp-3-1": {
    title: "The Brand Essence Framework — Feelings to Extensions",
    sections: [
      { heading: "BUILD FROM THE CORE OUT", body: "Strong brands aren't built from the logo inward. They're built from a feeling outward. At the center sits a single core emotion or identity. Everything else — values, personality, visuals, products — radiates from that core and must stay consistent with it.\n\nGet the emotional core right and every outer layer reinforces it. Get it wrong and no amount of design saves you." },
      { heading: "NIKE SELLS IDENTITY", body: "Nike doesn't sell shoes. At its core it sells an identity — the athlete, the fighter, the one who shows up. 'Just Do It' isn't about footwear. Every ad, athlete, and product extends that core feeling outward.\n\nThat's why they can put their logo on almost anything and it works — because people aren't buying the object, they're buying a piece of the identity at the center. The product is just the delivery vehicle for the feeling." },
      { heading: "BUILDING YOURS", body: "Define the single feeling or identity at your core first. Not your features — the emotion. Then build every layer outward from it: your values express it, your personality embodies it, your visuals signal it, your products deliver it.\n\nConsistency across layers is what makes a brand feel real rather than assembled. People bond to the core feeling. Everything else exists to make that feeling tangible." },
    ],
  },
  "cp-3-2": {
    title: "The Consideration Set — Win Before They Research",
    sections: [
      { heading: "THE SHORTLIST IN THE MIND", body: "When people decide to buy in a category, they don't research the whole market. They pull from a tiny mental shortlist — the consideration set, usually just a handful of brands already living in their head before any research begins.\n\nIf you're not on that list, you're not even in the running. The real competition happens before the customer starts comparing." },
      { heading: "WHY IT'S DECIDED EARLY", body: "Think about buying trainers. A few brands surface instantly, automatically. Those are the ones that built mental presence long before you needed them. The brand that wins is often just the one that was already top-of-mind, not the one with the best spec sheet.\n\nThis is why awareness isn't vanity — it's the entry ticket. Mere familiarity makes a brand feel safer and more likeable, and that's frequently enough to make the shortlist." },
      { heading: "GETTING ON THE LIST", body: "Build presence before the moment of need. Show up repeatedly, consistently, in front of your market — so when buying time comes, you're already in their head. Repeated exposure breeds familiarity, familiarity breeds preference.\n\nThe operator plays a long game: be the obvious name they think of first, so the decision is half-won before they ever start 'choosing.'" },
    ],
  },
  "cp-3-3": {
    title: "Trust = Margin — Why People Pay More for Known Brands",
    sections: [
      { heading: "TRUST IS PRICING POWER", body: "A large share of buyers will pay meaningfully more for a brand they trust over an unknown one offering the same thing. Trust isn't a soft virtue — it converts directly into margin. The trusted brand competes on confidence; the unknown one is forced to compete on price.\n\nEvery point of trust you build is a point of pricing power you earn." },
      { heading: "WHY THE PREMIUM EXISTS", body: "Going back to the risk detector: an unknown brand carries perceived risk — 'will this work, will I regret it?' A trusted brand removes that risk, and people pay a premium specifically to avoid the fear of a bad decision.\n\nYou're not just charging for the product. You're charging for certainty. The price gap between a trusted brand and a generic one is the price of peace of mind." },
      { heading: "BUILDING THE PREMIUM", body: "Build trust deliberately — consistency over time, social proof, transparency, reliability, strategic vulnerability. Every trust signal lets you charge more and discount less.\n\nThe trap is competing on price, which signals low trust and starts a race to the bottom. The operator builds trust instead, then prices on the feeling of safety the brand provides. Trust is the asset; margin is the dividend." },
    ],
  },
  "cp-3-4": {
    title: "High vs Low Involvement Decisions",
    sections: [
      { heading: "TWO MODES OF BUYING", body: "Not all purchases run the same way. Low-involvement decisions — cheap, low-risk, frequent — happen fast, on autopilot, driven by habit and instant recognition. High-involvement decisions — expensive, risky, identity-relevant — trigger deliberation, research, and emotional weight.\n\nThe mode determines the strategy. Sell a high-involvement product like a low-involvement one and you misfire." },
      { heading: "HABIT VS RESEARCH", body: "Buying chewing gum is low-involvement: you grab the familiar one without thinking. Buying a car is high-involvement: you agonize, research, and tie it to your identity.\n\nBut here's the key — even high-involvement buyers still filter through their consideration set first. They research, but mostly to justify a shortlist they already had. The emotional core still drives it; the research just gives the rational brain its cover story." },
      { heading: "MATCHING YOUR STRATEGY", body: "For low-involvement: win on familiarity, availability, and instant recognition — be the automatic grab. For high-involvement: win on trust, emotional identity, and risk-reduction — be the safe, aspirational choice they can justify.\n\nKnow which mode your offer lives in and build accordingly. The mechanisms are the same across this whole course; the emphasis shifts with the stakes." },
    ],
  },

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
  { min: 1, label: "—", color: "#999" },
  { min: 3, label: "1.5x XP", color: "#d4a017" },
  { min: 7, label: "2x XP", color: "#dc2626" },
  { min: 14, label: "2.5x XP", color: "#8b5cf6" },
  { min: 30, label: "3x XP", color: "#16a34a" },
];

// ═══════════════════════════════════════════════════════════════
// SYSTEM PROMPT
// ═══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `You are The Operator Echelon Intelligence System. You are not a chatbot. You are a classified intelligence teacher operating on the complete knowledge architecture of The Operator Echelon network.

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
- Flip The Floor identity reprogramming protocol
- Transactional analysis (Berne), ego states, games people play
- The Exploitation Code — 7 neural hijack mechanisms (Korteling NATO paper)

Protocol:
- Reference specific frameworks, studies, and principles by name
- Use operator terminology: "protocol", "framework", "vector", "asset", "leverage", "deploy"
- Deliver in short, dense paragraphs. No wasted words.
- ALWAYS TEACH WITH EXAMPLES. Every concept must come with:
  * A real-world example the operative can picture (a specific conversation, negotiation, date, sales call, social situation)
  * An analogy that locks the concept into memory ("Frame control is like being the DJ at a party — whoever controls the music controls the mood. You don't fight for the aux cord. You just walk over and plug in.")
  * A "watch for this" moment — tell them exactly where they'll see this mechanism in their daily life so they start noticing it everywhere
  * When possible, use examples from dating, business, social media, or street-level interactions — things a 17-30 year old male encounters daily
- Make concepts STICK by connecting them to things they already feel. Don't just explain loss aversion — make them feel it: "Imagine you found £100 on the street. Good feeling. Now imagine you had £100 and someone pickpocketed it. That second feeling is twice as strong. That's the asymmetry you're going to weaponize."
- Use the "show then name" method: describe the phenomenon first so they recognize it, THEN give it the technical name. This creates an "aha" moment instead of a lecture.
- If the operative has a psychological profile, DEEPLY adapt your teaching:
  * Check their weaknesses and blind spots — push harder on these areas
  * If they score low on a dimension, don't let them avoid it — confront it directly
  * If they score high, challenge them to go deeper — don't let them coast
  * Reference their specific patterns: "Your profile flags dopamine dysregulation — so when I teach you about consumer psychology, understand you're vulnerable to the same mechanisms you're learning to deploy"
- REMEMBER everything the operative tells you across the conversation. Track:
  * What concepts they've understood vs what they're still confused about
  * What personal challenges they've shared
  * What commitments they've made
  * Where they've shown resistance or avoidance
- Push the operative. If they give surface-level answers, call it out. If they claim to understand but can't explain it back, call it out. If they're avoiding a topic because it's uncomfortable, go HARDER on that topic.
- Structure complex answers as numbered tactical protocols
- End with a single actionable directive when appropriate
- After teaching a concept, TEST them on it before moving on. Don't let them passively consume. Ask them to explain it back, apply it to a scenario, or predict what happens next.`;

// Build dynamic profile context for AI
const buildProfileContext = (profile) => {
  if (!profile) return "";
  let ctx = "\\n\\n[OPERATIVE PSYCHOLOGICAL PROFILE]\\n";
  ctx += "Psychology: " + (profile.psychology || "?") + "%\\n";
  ctx += "Health: " + (profile.health || "?") + "%\\n";
  ctx += "Seduction: " + (profile.seduction || "?") + "%\\n";
  ctx += "Money: " + (profile.money || "?") + "%\\n";

  if (profile._insights) {
    ctx += "\\n[SUB-DIMENSIONS]\\n";
    Object.entries(profile._insights).forEach(([pillar, subs]) => {
      ctx += pillar.toUpperCase() + ": " + Object.entries(subs).map(([k,v]) => k + "=" + v + "%").join(", ") + "\\n";
    });
  }

  if (profile._flags) {
    const f = profile._flags;
    if (f.strengths.length) ctx += "\\nSTRENGTHS: " + f.strengths.join(". ") + "\\n";
    if (f.weaknesses.length) ctx += "WEAKNESSES: " + f.weaknesses.join(". ") + "\\n";
    if (f.avoidances.length) ctx += "AVOIDANCES: " + f.avoidances.join(". ") + "\\n";
    if (f.blindSpots.length) ctx += "BLIND SPOTS: " + f.blindSpots.join(". ") + "\\n";
    ctx += "\\n[INSTRUCTION: Push hardest on weaknesses and blind spots. The operative will try to avoid these — that avoidance IS the problem. Be direct about it.]";
  }
  return ctx;
};

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
          <span style={{ color: "#aaa" }}>{current} / {max} XP</span>
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
      <span style={{ fontSize: 8, letterSpacing: 4, color: "#999" }}>{text}</span>
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
  const [expandedPillar, setExpandedPillar] = useState(null);
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

  // Scenario Lab
  const [scenarioLab, setScenarioLab] = useState(null); // { courseId, scenario, chat, typing, input }
  const scenarioLabRef = useRef(null);

  // Boot
  const [showIntro, setShowIntro] = useState(true);
  const [bootPhase, setBootPhase] = useState(0);

  // Auth & persistence
  const [authState, setAuthState] = useState("checking"); // checking | signup | login | authed
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);

  // Simple hash for password (not cryptographically secure, but gates casual access)
  const hashPassword = (pw) => {
    let hash = 0;
    for (let i = 0; i < pw.length; i++) {
      const char = pw.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return String(hash);
  };

  // Load saved data on mount
  useEffect(() => {
    try {
      const savedPw = localStorage.getItem("oe_password");
      const savedUser = localStorage.getItem("oe_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(prev => ({ ...prev, ...parsed }));
      }
      if (savedPw) {
        setAuthState("login");
      } else {
        setAuthState("signup");
      }
    } catch (e) {
      setAuthState("signup");
    }
    setDataLoaded(true);
  }, []);

  // Save user data whenever it changes (after initial load and auth)
  useEffect(() => {
    if (dataLoaded && authState === "authed") {
      try {
        localStorage.setItem("oe_user", JSON.stringify(user));
      } catch (e) {}
    }
  }, [user, dataLoaded, authState]);

  const handleSignup = () => {
    setAuthError("");
    if (!nameInput.trim()) { setAuthError("Enter your operative name"); return; }
    if (passwordInput.length < 4) { setAuthError("Password must be at least 4 characters"); return; }
    if (passwordInput !== confirmPasswordInput) { setAuthError("Passwords do not match"); return; }
    try {
      localStorage.setItem("oe_password", hashPassword(passwordInput));
      const newUser = { ...user, name: nameInput.trim().toUpperCase() };
      localStorage.setItem("oe_user", JSON.stringify(newUser));
      setUser(newUser);
      setAuthState("authed");
      setPasswordInput(""); setConfirmPasswordInput(""); setAuthError("");
    } catch (e) {
      setAuthError("Storage unavailable. Enable cookies/storage for this site.");
    }
  };

  const handleLogin = () => {
    setAuthError("");
    try {
      const savedPw = localStorage.getItem("oe_password");
      if (hashPassword(passwordInput) === savedPw) {
        setAuthState("authed");
        setPasswordInput(""); setAuthError("");
      } else {
        setAuthError("Incorrect password");
      }
    } catch (e) {
      setAuthError("Storage error");
    }
  };

  const handleResetAccount = () => {
    try {
      localStorage.removeItem("oe_password");
      localStorage.removeItem("oe_user");
    } catch (e) {}
    setUser({
      name: "OPERATIVE", xp: 250, level: 1, tokens: 50, profile: null,
      pillarScores: {}, completedLessons: [], completedQuizzes: {}, courseProgress: {},
      streak: 1, lastActiveDate: new Date().toDateString(), rankChallengesPassed: [],
    });
    setAuthState("signup");
    setPasswordInput(""); setConfirmPasswordInput(""); setNameInput(""); setAuthError("");
  };


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

  // Streak tracking — runs after data loads and auth completes
  useEffect(() => {
    if (!dataLoaded || authState !== "authed") return;
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
  }, [dataLoaded, authState]);

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

  // ── SCENARIO LAB ──
  const startScenarioLab = async (course) => {
    const lab = { courseId: course.id, courseTitle: course.title, scenario: null, chat: [], typing: true, input: "" };
    setScenarioLab(lab);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "user", content: `[SCENARIO LAB] Generate a real-world scenario for the operative to dissect. The scenario must relate to the course "${course.title}" (${course.subtitle}). 

Requirements:
- Write a vivid, specific real-life situation (a conversation, a sales interaction, a negotiation, a social encounter, a dating scenario, or a business situation)
- The scenario should contain 3-5 hidden mechanisms from this course being deployed — some obvious, some subtle
- Write it as a narrative the operative can READ and ANALYZE
- After the scenario, ask them: "Identify every mechanism being used. For each one: name it, explain HOW it's being deployed, and explain WHY it works on a neurological/psychological level."
- Do NOT reveal the answers yet. Wait for their analysis.
- Keep the scenario under 200 words. Make it realistic, not textbook.` },
          ],
          profile: user.profile || null,
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setScenarioLab(prev => ({
        ...prev,
        scenario: data.response,
        chat: [{ role: "assistant", content: data.response }],
        typing: false,
      }));
    } catch (err) {
      setScenarioLab(prev => ({
        ...prev,
        scenario: "Failed to generate scenario. Retry.",
        chat: [{ role: "assistant", content: "Intelligence feed disrupted. Retry." }],
        typing: false,
      }));
    }
  };

  const sendScenarioResponse = async () => {
    if (!scenarioLab || !scenarioLab.input.trim()) return;
    const userMsg = scenarioLab.input.trim();
    const newChat = [...scenarioLab.chat, { role: "user", content: userMsg }];
    setScenarioLab(prev => ({ ...prev, chat: newChat, input: "", typing: true }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "user", content: `[SCENARIO LAB - EVALUATOR MODE] You generated a scenario for the course "${scenarioLab.courseTitle}". Now evaluate the operative's analysis. Be ruthless but fair:
- Did they identify ALL the mechanisms? Name each one they missed.
- Did they explain HOW each mechanism was deployed? If their explanation was vague, push for specifics.
- Did they explain WHY it works neurologically/psychologically? If they just named it without explaining the brain science, call it out.
- Grade their analysis: EXCEPTIONAL (caught everything + explained deeply), SOLID (caught most, decent explanations), DEVELOPING (missed significant mechanisms), or FAILED (surface-level or wrong).
- After grading, explain what they missed in detail so they learn.
- End with: "Want another scenario? Or do you need to review the material first?"` },
            { role: "assistant", content: "Understood. I'll evaluate their dissection ruthlessly." },
            ...newChat.map(m => ({ role: m.role, content: m.content })),
          ],
          profile: user.profile || null,
        }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setScenarioLab(prev => ({
        ...prev,
        chat: [...prev.chat, { role: "assistant", content: data.response }],
        typing: false,
      }));
      addXP(50);
    } catch (err) {
      setScenarioLab(prev => ({
        ...prev,
        chat: [...prev.chat, { role: "assistant", content: "Intelligence feed disrupted. Retry." }],
        typing: false,
      }));
    }
  };

  useEffect(() => { scenarioLabRef.current?.scrollIntoView({ behavior: "smooth" }); }, [scenarioLab?.chat, scenarioLab?.typing]);

  // ── PSYCH COMPLETION ──
  // Reverse-scored questions (where agreement = lower score for the dimension)
  const REVERSE_SCORED = new Set([3, 5, 14, 19, 29, 32, 34, 37, 40, 42, 45, 50, 51, 54, 59, 64, 70, 74, 78, 84, 92, 95, 97, 100, 103, 109, 112, 115]);

  const completePsychAssessment = () => {
    const profile = {};
    const insights = {};

    PSYCH_SECTIONS.forEach(section => {
      const scores = section.questions.map(q => {
        const raw = psychAnswers[q.id] || 3;
        return REVERSE_SCORED.has(q.id) ? (6 - raw) : raw;
      });
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      profile[section.id] = Math.round((avg / 5) * 100);

      // Generate sub-dimension insights
      const chunks = [];
      for (let i = 0; i < scores.length; i += 5) {
        chunks.push(scores.slice(i, i + 5));
      }
      const subDims = section.id === "psychology" ? ["identity", "shadow", "frameControl", "emotionalReg", "cognitive", "scenarios"]
        : section.id === "health" ? ["dopamine", "stress", "sleep", "physical", "addiction", "scenarios"]
        : section.id === "seduction" ? ["socialCalib", "readingPeople", "subcomm", "tension", "rapport", "scenarios"]
        : ["risk", "delayedGrat", "selling", "valueCreation", "scarcity", "scenarios"];

      const subs = {};
      chunks.forEach((chunk, ci) => {
        if (subDims[ci]) {
          const subAvg = chunk.reduce((a, b) => a + b, 0) / chunk.length;
          subs[subDims[ci]] = Math.round((subAvg / 5) * 100);
        }
      });
      insights[section.id] = subs;
    });

    // Build weakness/strength flags
    const flags = { strengths: [], weaknesses: [], avoidances: [], blindSpots: [] };

    // Check for specific patterns
    if (profile.psychology > 75) flags.strengths.push("Strong psychological frame — natural operator wiring");
    if (profile.psychology < 40) flags.weaknesses.push("Identity instability — vulnerable to regression cycles");
    if (insights.psychology?.identity < 40) flags.blindSpots.push("Undefined identity — susceptible to external influence on self-concept");
    if (insights.psychology?.emotionalReg < 35) flags.weaknesses.push("Emotional flooding — decisions compromised under pressure");
    if (insights.psychology?.frameControl < 40) flags.avoidances.push("Conflict avoidance — frame gets taken by stronger personalities");

    if (profile.health > 75) flags.strengths.push("Biological systems optimized — neurochemistry supports execution");
    if (profile.health < 40) flags.weaknesses.push("Biological drag — dopamine dysregulation and poor recovery undermining output");
    if (insights.health?.dopamine < 35) flags.blindSpots.push("Dopamine trap — reward system hijacked by low-value stimulation");
    if (insights.health?.sleep < 40) flags.weaknesses.push("Sleep debt — cognitive performance degraded at baseline");
    if (insights.health?.addiction < 35) flags.avoidances.push("Compulsive patterns active — at least one destructive habit running");

    if (profile.seduction > 75) flags.strengths.push("High social calibration — natural ability to read and influence");
    if (profile.seduction < 40) flags.weaknesses.push("Social blind spots — missing cues and misreading dynamics");
    if (insights.seduction?.subcomm < 40) flags.blindSpots.push("Low presence — body language and energy not commanding attention");
    if (insights.seduction?.tension < 35) flags.avoidances.push("Tension intolerance — collapses frame under social pressure");

    if (profile.money > 75) flags.strengths.push("Builder psychology — wired for value creation and delayed returns");
    if (profile.money < 40) flags.weaknesses.push("Consumer psychology — creating less than consuming");
    if (insights.money?.delayedGrat < 35) flags.blindSpots.push("Pivot addiction — abandoning before compound effects kick in");
    if (insights.money?.selling < 40) flags.avoidances.push("Sales resistance — uncomfortable with the mechanism that creates revenue");

    profile._insights = insights;
    profile._flags = flags;

    setUser(prev => ({ ...prev, profile }));
    addXP(500);
    setView("train");
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
          {bootPhase >= 1 && <div style={{ fontSize: 9, letterSpacing: 5, color: "#777", marginBottom: 12, animation: "fadeIn 0.5s ease", transition: "color 1s" }}>ESTABLISHING SECURE CONNECTION...</div>}
          {bootPhase >= 2 && <div style={{ fontSize: 9, letterSpacing: 4, color: "#888", marginBottom: 12 }}>LOADING INTELLIGENCE DATABASE ████████░░ 84%</div>}
          {bootPhase >= 3 && <div style={{ fontSize: 9, letterSpacing: 4, color: "#999", marginBottom: 12 }}>PSYCHOLOGICAL ENGINE · · · ONLINE</div>}
          {bootPhase >= 4 && <div style={{ fontSize: 9, letterSpacing: 4, color: "#aaa", marginBottom: 28 }}>CLEARANCE: PENDING VERIFICATION</div>}
          {bootPhase >= 5 && (
            <div>
              <div style={{ fontSize: 22, letterSpacing: 12, color: "#e0e0e0", fontWeight: 200, marginBottom: 8 }}>
                THE OPERATOR ECHELON
              </div>
              <div style={{ fontSize: 8, letterSpacing: 6, color: "#999", fontWeight: 300 }}>
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
  // AUTH GATE
  // ═══════════════════════════════════════════════════════════════
  if (authState !== "authed") {
    const isSignup = authState === "signup";
    return (
      <div style={{
        minHeight: "100vh", background: "#050505", display: "flex",
        alignItems: "center", justifyContent: "center", padding: 20,
        fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@200;300;400;500;600;700&display=swap" rel="stylesheet" />
        <div style={{ width: "100%", maxWidth: 360 }}>
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div style={{ fontSize: 18, letterSpacing: 8, color: "#e8e8e8", fontWeight: 200, marginBottom: 8 }}>
              THE OPERATOR ECHELON
            </div>
            <div style={{ fontSize: 8, letterSpacing: 4, color: "#dc2626" }}>
              {isSignup ? "INITIATE NEW OPERATIVE" : "CLEARANCE VERIFICATION"}
            </div>
          </div>

          <div style={{
            border: "1px solid #1e1e1e", borderRadius: 10, padding: 24,
            background: "#0a0a0a",
          }}>
            {isSignup && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 8, letterSpacing: 2, color: "#888", marginBottom: 6 }}>OPERATIVE NAME</div>
                <input
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Choose your codename"
                  style={{
                    width: "100%", padding: "12px 14px", background: "#111",
                    border: "1px solid #222", borderRadius: 6, color: "#e0e0e0",
                    fontSize: 11, fontFamily: "inherit", boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 8, letterSpacing: 2, color: "#888", marginBottom: 6 }}>
                {isSignup ? "CREATE PASSWORD" : "PASSWORD"}
              </div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !isSignup) handleLogin(); }}
                placeholder={isSignup ? "Min 4 characters" : "Enter your password"}
                style={{
                  width: "100%", padding: "12px 14px", background: "#111",
                  border: "1px solid #222", borderRadius: 6, color: "#e0e0e0",
                  fontSize: 11, fontFamily: "inherit", boxSizing: "border-box",
                }}
              />
            </div>

            {isSignup && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 8, letterSpacing: 2, color: "#888", marginBottom: 6 }}>CONFIRM PASSWORD</div>
                <input
                  type="password"
                  value={confirmPasswordInput}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSignup(); }}
                  placeholder="Re-enter password"
                  style={{
                    width: "100%", padding: "12px 14px", background: "#111",
                    border: "1px solid #222", borderRadius: 6, color: "#e0e0e0",
                    fontSize: 11, fontFamily: "inherit", boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            {authError && (
              <div style={{ fontSize: 9, color: "#dc2626", marginBottom: 12, letterSpacing: 1 }}>
                ⚠ {authError}
              </div>
            )}

            <button onClick={isSignup ? handleSignup : handleLogin} style={{
              width: "100%", padding: 13, background: "#dc2626", border: "none",
              borderRadius: 6, color: "#fff", cursor: "pointer",
              fontFamily: "inherit", fontSize: 10, letterSpacing: 3, fontWeight: 600,
            }}>
              {isSignup ? "INITIATE →" : "ENTER →"}
            </button>

            {!isSignup && (
              <button onClick={handleResetAccount} style={{
                width: "100%", padding: 10, marginTop: 10, background: "transparent",
                border: "none", color: "#aaa", cursor: "pointer",
                fontFamily: "inherit", fontSize: 8, letterSpacing: 1,
              }}>
                Forgot password? Reset account (erases progress)
              </button>
            )}
          </div>

          <div style={{ fontSize: 7, color: "#aaa", textAlign: "center", marginTop: 16, lineHeight: 1.6, letterSpacing: 1 }}>
            {isSignup
              ? "Your password and progress are stored on this device."
              : "Welcome back, operative."}
          </div>
        </div>
        <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } input::placeholder { color: #555; }`}</style>
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
            THE OPERATOR ECHELON
          </div>
          <div style={{ fontSize: 7, letterSpacing: 4, color: "#888", marginTop: 3, fontWeight: 300 }}>
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
            <div style={{ fontSize: 7, color: "#999", letterSpacing: 3 }}>CLEARANCE</div>
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
              <div style={{ fontSize: 7, letterSpacing: 4, color: "#888", marginBottom: 10 }}>◇ COMMAND CENTER</div>
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
                  <div style={{ fontSize: 7, letterSpacing: 3, color: "#888", marginBottom: 6 }}>{stat.label}</div>
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
                      <div style={{ fontSize: 9, color: "#999", letterSpacing: 1, fontWeight: 300 }}>
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
                const score = user.profile ? user.profile[pillar.id] : undefined;
                return (
                  <button key={pillar.id} onClick={() => {
                    if (user.profile) {
                      setView("train");
                      setExpandedPillar(pillar.id);
                    } else {
                      setView("psych");
                      setPsychSection(0);
                      setPsychAnswers({});
                    }
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
                    <div style={{ fontSize: 8, color: "#888", lineHeight: 1.6, marginBottom: 10, fontWeight: 300 }}>{pillar.desc}</div>
                    {score !== undefined ? (
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8, marginBottom: 4 }}>
                          <span style={{ color: "#999", letterSpacing: 2 }}>→ ENTER TRAINING</span>
                          <span style={{ color: pillar.color, fontWeight: 500 }}>{score}%</span>
                        </div>
                        <div style={{ height: 2, background: "#111", borderRadius: 1 }}>
                          <div style={{ height: "100%", width: `${score}%`, background: pillar.color, borderRadius: 1, transition: "width 0.8s", opacity: 0.8 }} />
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: 8, color: pillar.color, letterSpacing: 3, opacity: 0.5 }}>
                        → COMPLETE PROFILING
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
              <div style={{ fontSize: 9, color: "#999", fontStyle: "italic", fontWeight: 300 }}>"{currentRank.sigil}"</div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════ */}
        {/* COURSES VIEW */}
        {/* ════════════════════════════════════════════════════ */}
        {/* ── INTEGRATED PILLAR VIEW (Profile + Courses) ── */}
        {view === "train" && !activeCourse && !quizState && !scenarioLab && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            {!user.profile ? (
              /* No profile — start assessment */
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: 36, color: "#777", marginBottom: 16 }}>△</div>
                <div style={{ fontSize: 11, color: "#999", letterSpacing: 2, marginBottom: 8 }}>NO PROFILE DETECTED</div>
                <div style={{ fontSize: 9, color: "#888", marginBottom: 20, fontWeight: 300 }}>
                  Complete the psychological assessment to map your architecture and unlock personalized training.
                </div>
                <button onClick={() => { setView("psych"); setPsychSection(0); setPsychAnswers({}); }} style={{
                  padding: "12px 24px", background: "#dc262611", border: "1px solid #dc262622",
                  borderRadius: 6, color: "#dc2626", cursor: "pointer",
                  fontFamily: "inherit", fontSize: 9, letterSpacing: 2,
                }}>
                  BEGIN PROFILING
                </button>
              </div>
            ) : (
              /* Profile exists — show 4 pillars with embedded courses */
              <div>
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 7, letterSpacing: 4, color: "#dc2626", marginBottom: 4 }}>OPERATOR TRAINING</div>
                  <div style={{ fontSize: 13, color: "#d0d0d0", fontWeight: 200, letterSpacing: 3 }}>
                    YOUR FOUR PILLARS
                  </div>
                </div>

                {PSYCH_SECTIONS.map(section => {
                  const value = user.profile[section.id];
                  const subs = user.profile._insights ? user.profile._insights[section.id] : null;
                  const pillarCourses = COURSES.filter(c => c.pillar === section.id);
                  const isExpanded = expandedPillar === section.id;
                  const pillarColors = { psychology: "#dc2626", health: "#16a34a", seduction: "#8b5cf6", money: "#d4a017" };
                  const pColor = pillarColors[section.id] || "#555";
                  const pillarIcons = { psychology: "◈", health: "◉", seduction: "◐", money: "◧" };

                  return (
                    <div key={section.id} style={{ marginBottom: 8 }}>
                      {/* Pillar Header — clickable */}
                      <button onClick={() => setExpandedPillar(isExpanded ? null : section.id)} style={{
                        width: "100%", textAlign: "left",
                        border: `1px solid ${isExpanded ? pColor + "22" : "#0e0e0e"}`,
                        borderRadius: isExpanded ? "8px 8px 0 0" : 8,
                        padding: "14px 16px", background: isExpanded ? `${pColor}05` : "#070707",
                        cursor: "pointer", fontFamily: "inherit", transition: "all 0.3s",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 16, color: pColor, opacity: 0.5 }}>{pillarIcons[section.id]}</span>
                            <div>
                              <div style={{ fontSize: 10, letterSpacing: 3, color: pColor, fontWeight: 400 }}>
                                {section.name}
                              </div>
                              <div style={{ fontSize: 8, color: "#888", marginTop: 2, fontWeight: 300 }}>
                                {section.desc}
                              </div>
                            </div>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div style={{ fontSize: 18, fontWeight: 200, color: pColor }}>{value}%</div>
                            <div style={{ fontSize: 7, color: "#999", letterSpacing: 1 }}>
                              {pillarCourses.length} course{pillarCourses.length !== 1 ? "s" : ""}
                            </div>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div style={{ height: 2, background: "#111", borderRadius: 1, marginTop: 10 }}>
                          <div style={{
                            height: "100%", width: `${value}%`,
                            background: pColor, borderRadius: 1, opacity: 0.4, transition: "width 0.8s",
                          }} />
                        </div>
                      </button>

                      {/* Expanded Content */}
                      {isExpanded && (
                        <div style={{
                          border: `1px solid ${pColor}22`, borderTop: "none",
                          borderRadius: "0 0 8px 8px", padding: 14,
                          background: "#060606", animation: "fadeIn 0.3s ease",
                        }}>
                          {/* Sub-dimensions */}
                          {subs && (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                              {Object.entries(subs).filter(([k]) => k !== "scenarios").map(([key, val]) => (
                                <span key={key} style={{
                                  fontSize: 7, padding: "2px 6px", borderRadius: 3, letterSpacing: 1,
                                  background: val >= 65 ? "#16a34a10" : val >= 40 ? "#d4a01710" : "#dc262610",
                                  border: `1px solid ${val >= 65 ? "#16a34a22" : val >= 40 ? "#d4a01722" : "#dc262622"}`,
                                  color: val >= 65 ? "#16a34a" : val >= 40 ? "#d4a017" : "#dc2626",
                                }}>
                                  {key}: {val}%
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Flags for this pillar */}
                          {user.profile._flags && (() => {
                            const allFlags = [
                              ...user.profile._flags.weaknesses.filter(f => f.toLowerCase().includes(section.id === "psychology" ? "identity|frame|emotional|flooding|instability".split("|").find(k => f.toLowerCase().includes(k)) || "zzz" : section.id === "health" ? "dopamine|sleep|biological|compulsive".split("|").find(k => f.toLowerCase().includes(k)) || "zzz" : section.id === "seduction" ? "social|presence|tension".split("|").find(k => f.toLowerCase().includes(k)) || "zzz" : "pivot|consumer|sales|selling".split("|").find(k => f.toLowerCase().includes(k)) || "zzz")),
                            ];
                            return allFlags.length > 0 ? (
                              <div style={{ marginBottom: 12, padding: "8px 10px", background: "#dc262608", border: "1px solid #dc262615", borderRadius: 4 }}>
                                <div style={{ fontSize: 7, color: "#dc2626", letterSpacing: 2, marginBottom: 4 }}>⚠ FLAGGED</div>
                                {allFlags.map((f, i) => (
                                  <div key={i} style={{ fontSize: 8, color: "#aaa", fontWeight: 300 }}>• {f}</div>
                                ))}
                              </div>
                            ) : null;
                          })()}

                          {/* Courses in this pillar */}
                          <div style={{ fontSize: 7, letterSpacing: 3, color: "#999", marginBottom: 8 }}>COURSES</div>
                          {pillarCourses.map(course => {
                            const isLocked = course.locked && user.level < (course.requiredRank || 0);
                            const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);
                            const completedInCourse = course.modules.reduce((a, m) =>
                              a + m.lessons.filter(l => user.completedLessons.includes(l.id)).length, 0);
                            const progress = totalLessons > 0 ? Math.round((completedInCourse / totalLessons) * 100) : 0;

                            return (
                              <button key={course.id} onClick={() => !isLocked && setActiveCourse(course)} style={{
                                width: "100%", textAlign: "left", padding: 12, marginBottom: 6,
                                background: isLocked ? "#050505" : "#080808",
                                border: `1px solid ${isLocked ? "#0a0a0a" : "#0e0e0e"}`,
                                borderRadius: 6, cursor: isLocked ? "not-allowed" : "pointer",
                                opacity: isLocked ? 0.35 : 1, fontFamily: "inherit", transition: "all 0.2s",
                              }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                  <div>
                                    <div style={{ fontSize: 10, letterSpacing: 2, color: "#ccc", fontWeight: 400, marginBottom: 2 }}>
                                      {course.title}
                                    </div>
                                    <div style={{ fontSize: 8, color: "#888", fontWeight: 300 }}>
                                      {course.subtitle}
                                    </div>
                                  </div>
                                  <span style={{ fontSize: 10, color: "#777" }}>→</span>
                                </div>
                                <div style={{ height: 2, background: "#111", borderRadius: 1, marginTop: 8 }}>
                                  <div style={{
                                    height: "100%", width: `${progress}%`,
                                    background: pColor, borderRadius: 1, opacity: 0.5, transition: "width 0.5s",
                                  }} />
                                </div>
                                <div style={{ fontSize: 7, color: "#888", marginTop: 4, letterSpacing: 1 }}>
                                  {completedInCourse}/{totalLessons} complete · {course.modules.length} modules
                                  {isLocked && <span style={{ color: "#dc2626", marginLeft: 8 }}>🔒 RANK {course.requiredRank}</span>}
                                </div>
                              </button>
                            );
                          })}

                          {pillarCourses.length === 0 && (
                            <div style={{ fontSize: 9, color: "#888", fontWeight: 300, padding: 10, textAlign: "center" }}>
                              Courses incoming for this pillar.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Field Exercises */}
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: 7, letterSpacing: 4, color: "#8b5cf6", marginBottom: 8 }}>◆ FIELD EXERCISES</div>
                  <div style={{ fontSize: 9, color: "#999", fontWeight: 300, marginBottom: 12 }}>
                    Real-world scenarios. Dissect the mechanisms. Prove you can see the code in the wild.
                  </div>

                  {PSYCH_SECTIONS.map(section => {
                    const pillarCourses = COURSES.filter(c => c.pillar === section.id);
                    if (!pillarCourses.length) return null;
                    const pillarColors = { psychology: "#dc2626", health: "#16a34a", seduction: "#8b5cf6", money: "#d4a017" };
                    const pColor = pillarColors[section.id] || "#555";
                    const scenarioDescs = {
                      psychology: "Manipulation, persuasion, frame control, dark psychology scenarios",
                      health: "Dopamine traps, habit loops, neurochemical hijacking scenarios",
                      seduction: "Social dynamics, attraction, subcommunication, ego state scenarios",
                      money: "Sales interactions, pricing psychology, buyer manipulation scenarios",
                    };

                    return (
                      <button key={section.id} onClick={() => {
                        const course = pillarCourses[Math.floor(Math.random() * pillarCourses.length)];
                        startScenarioLab(course);
                      }} style={{
                        width: "100%", textAlign: "left", padding: 12, marginBottom: 6,
                        background: "#070707", border: `1px solid ${pColor}15`,
                        borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
                        transition: "all 0.2s",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontSize: 9, letterSpacing: 3, color: pColor, fontWeight: 400, marginBottom: 2 }}>
                              {section.name}
                            </div>
                            <div style={{ fontSize: 8, color: "#999", fontWeight: 300 }}>
                              {scenarioDescs[section.id]}
                            </div>
                          </div>
                          <span style={{ fontSize: 10, color: `${pColor}44` }}>→</span>
                        </div>
                      </button>
                    );
                  })}

                  <div style={{ fontSize: 8, color: "#777", textAlign: "center", marginTop: 6, fontWeight: 300 }}>
                    +50 XP per dissection
                  </div>
                </div>

                {/* Retake Assessment */}
                <button onClick={() => { setView("psych"); setPsychSection(0); setPsychAnswers({}); }} style={{
                  width: "100%", marginTop: 12, padding: 10, background: "transparent",
                  border: "1px solid #0e0e0e", borderRadius: 6, color: "#888",
                  cursor: "pointer", fontFamily: "inherit", fontSize: 7, letterSpacing: 2,
                }}>
                  RETAKE ASSESSMENT
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── COURSE DETAIL VIEW ── */}
        {view === "train" && activeCourse && !activeLesson && !quizState && !scenarioLab && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <button onClick={() => setActiveCourse(null)} style={{
              background: "transparent", border: "none", color: "#999",
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
              <div style={{ fontSize: 10, color: "#888", fontWeight: 300, marginBottom: 12 }}>
                {activeCourse.subtitle}
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 8, color: "#999" }}>
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
                  fontSize: 8, letterSpacing: 3, color: "#999",
                  marginBottom: 8, display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ color: "#888" }}>MODULE {mi + 1}</span>
                  <span style={{ color: "#aaa" }}>·</span>
                  <span style={{ color: "#aaa" }}>{mod.title}</span>
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
                          <div style={{ fontSize: 8, color: "#888", marginTop: 2 }}>
                            {isQuiz ? `${lesson.questions} questions` : lesson.duration}
                            {quizScore !== undefined && ` · Score: ${quizScore}%`}
                          </div>
                        </div>
                      </div>
                      <span style={{ fontSize: 10, color: "#777" }}>→</span>
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Field Exercise Button */}
            <SectionDivider text="FIELD EXERCISE" />
            <button onClick={() => startScenarioLab(activeCourse)} style={{
              width: "100%", padding: 16, background: "#8b5cf608",
              border: "1px solid #8b5cf615", borderRadius: 8,
              cursor: "pointer", fontFamily: "inherit", textAlign: "left",
              transition: "all 0.3s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 3, color: "#8b5cf6", marginBottom: 4, fontWeight: 400 }}>
                    ◆ SCENARIO DISSECTION LAB
                  </div>
                  <div style={{ fontSize: 9, color: "#aaa", fontWeight: 300 }}>
                    Receive a real-world scenario. Identify every mechanism being used. Explain how and why it works. The AI evaluates your analysis.
                  </div>
                </div>
                <span style={{ fontSize: 14, color: "#8b5cf644" }}>→</span>
              </div>
            </button>
          </div>
        )}

        {/* ── LESSON VIEW ── */}
        {view === "train" && activeLesson && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <button onClick={() => { setActiveLesson(null); setLessonChat([]); setLessonChatInput(""); }} style={{
              background: "transparent", border: "none", color: "#999",
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
              <div style={{ fontSize: 7, letterSpacing: 3, color: "#999", marginBottom: 6 }}>
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
                      fontSize: 11, color: "#bbb", lineHeight: 1.9, fontWeight: 300,
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
                  <div style={{ fontSize: 8, letterSpacing: 3, color: "#999", marginBottom: 6 }}>FULL INTELLIGENCE FILE</div>
                  <div style={{ fontSize: 9, color: "#aaa", fontWeight: 300 }}>
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
                        <div style={{ fontSize: 9, color: "#888", fontWeight: 300 }}>
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
                      <div style={{ fontSize: 9, color: "#999", padding: "8px 10px", animation: "pulse 1.5s infinite" }}>
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
                <div style={{ fontSize: 9, color: "#999", marginBottom: 8, letterSpacing: 2 }}>CONTENT INCOMING</div>
                <div style={{ fontSize: 10, color: "#aaa", lineHeight: 1.7, fontWeight: 300 }}>
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
              background: "transparent", border: "none", color: "#999",
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
                      <span style={{ color: "#999", marginRight: 10 }}>{String.fromCharCode(65 + oi)}.</span>
                      {opt}
                    </button>
                  ))}

                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                    <button onClick={() => quizState.current > 0 && setQuizState(prev => ({ ...prev, current: prev.current - 1 }))} style={{
                      padding: "8px 16px", background: "transparent", border: "1px solid #111",
                      borderRadius: 4, color: "#999", cursor: quizState.current > 0 ? "pointer" : "default",
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
            <div style={{ fontSize: 7, letterSpacing: 4, color: "#999", marginBottom: 16 }}>
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
                    <div style={{ fontSize: 9, color: "#aaa", fontWeight: 300 }}>
                      +{RANK_CHALLENGES[quizState.rankLevel]?.xpReward || 200} XP · Rank unlocked
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 12, letterSpacing: 4, color: "#dc2626", marginBottom: 4, fontWeight: 400 }}>
                      CLEARANCE DENIED
                    </div>
                    <div style={{ fontSize: 9, color: "#aaa", fontWeight: 300 }}>
                      Required: {quizState.requiredScore}% · Review material and retry
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <div style={{ fontSize: 10, letterSpacing: 3, marginBottom: 4, color: "#aaa", fontWeight: 300 }}>
                  {quizState.score >= 80 ? "KNOWLEDGE VERIFIED" : quizState.score >= 60 ? "PARTIAL COMPREHENSION" : "REVIEW REQUIRED"}
                </div>
                <div style={{ fontSize: 9, color: "#999", marginBottom: 8 }}>
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
                    fontSize: 9, color: "#aaa", fontWeight: 300,
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
              border: "1px solid #111", borderRadius: 6, color: "#aaa",
              cursor: "pointer", fontFamily: "inherit", fontSize: 9, letterSpacing: 2,
            }}>
              {quizState.isRankChallenge ? "RETURN TO ORDER" : "RETURN TO COURSE"}
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════════════ */}
        {/* SCENARIO DISSECTION LAB */}
        {/* ════════════════════════════════════════════════════ */}
        {scenarioLab && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <button onClick={() => setScenarioLab(null)} style={{
              background: "transparent", border: "none", color: "#999",
              cursor: "pointer", fontSize: 9, letterSpacing: 2, marginBottom: 16,
              fontFamily: "inherit", padding: 0,
            }}>
              ← EXIT LAB
            </button>

            <div style={{
              border: "1px solid #8b5cf615", borderRadius: 8, padding: 16,
              background: "#070707", marginBottom: 12,
            }}>
              <div style={{ fontSize: 7, letterSpacing: 4, color: "#8b5cf6", marginBottom: 4 }}>
                ◆ SCENARIO DISSECTION LAB
              </div>
              <div style={{ fontSize: 10, color: "#d0d0d0", fontWeight: 300, letterSpacing: 1 }}>
                {scenarioLab.courseTitle}
              </div>
              <div style={{ fontSize: 8, color: "#999", marginTop: 4, fontWeight: 300 }}>
                Read the scenario. Identify every mechanism. Explain how and why each one works.
              </div>
            </div>

            {/* Chat Area */}
            <div style={{
              border: "1px solid #0e0e0e", borderRadius: 8,
              background: "#050505", overflow: "hidden",
            }}>
              <div style={{ maxHeight: 450, overflowY: "auto", padding: 14 }}>
                {scenarioLab.chat.map((msg, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div style={{
                      fontSize: 7, letterSpacing: 2, marginBottom: 4,
                      color: msg.role === "user" ? "#555" : "#8b5cf6",
                    }}>
                      {msg.role === "user" ? "YOUR ANALYSIS" : "◆ INTELLIGENCE SYSTEM"}
                    </div>
                    <div style={{
                      fontSize: 10, lineHeight: 1.8, fontWeight: 300,
                      color: msg.role === "user" ? "#666" : "#888",
                      padding: "10px 12px",
                      background: msg.role === "user" ? "#080808" : "#060606",
                      border: `1px solid ${msg.role === "user" ? "#0e0e0e" : "#8b5cf610"}`,
                      borderRadius: 6, whiteSpace: "pre-wrap", letterSpacing: 0.2,
                    }}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {scenarioLab.typing && (
                  <div style={{ fontSize: 9, color: "#8b5cf6", padding: "8px 10px", animation: "pulse 1.5s infinite" }}>
                    ▌ Generating scenario...
                  </div>
                )}
                <div ref={scenarioLabRef} />
              </div>

              {/* Input Area */}
              {scenarioLab.scenario && (
                <div style={{ display: "flex", gap: 4, padding: 10, borderTop: "1px solid #0a0a0a" }}>
                  <textarea
                    value={scenarioLab.input || ""}
                    onChange={(e) => setScenarioLab(prev => ({ ...prev, input: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendScenarioResponse(); } }}
                    placeholder="Write your analysis — identify every mechanism, explain how it's deployed and why it works..."
                    rows={3}
                    style={{
                      flex: 1, padding: "10px 12px", background: "#080808",
                      border: "1px solid #0e0e0e", borderRadius: 6,
                      color: "#ccc", fontSize: 9, fontFamily: "inherit",
                      fontWeight: 300, resize: "vertical", lineHeight: 1.7,
                    }}
                  />
                  <button onClick={sendScenarioResponse} disabled={scenarioLab.typing} style={{
                    padding: "10px 14px", background: "#8b5cf6", border: "none",
                    borderRadius: 6, color: "#000", cursor: "pointer",
                    fontFamily: "inherit", fontSize: 8, letterSpacing: 2,
                    fontWeight: 600, alignSelf: "flex-end",
                    opacity: scenarioLab.typing ? 0.3 : 1,
                  }}>
                    SUBMIT
                  </button>
                </div>
              )}
            </div>

            {/* New Scenario Button */}
            {scenarioLab.chat.length > 2 && (
              <button onClick={() => startScenarioLab({ id: scenarioLab.courseId, title: scenarioLab.courseTitle, subtitle: "" })} style={{
                width: "100%", marginTop: 10, padding: 12, background: "#8b5cf608",
                border: "1px solid #8b5cf615", borderRadius: 6,
                color: "#8b5cf6", cursor: "pointer", fontFamily: "inherit",
                fontSize: 8, letterSpacing: 2,
              }}>
                GENERATE NEW SCENARIO · +50 XP
              </button>
            )}
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
              <div style={{ fontSize: 9, color: "#aaa", lineHeight: 1.7, fontWeight: 300 }}>
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
                    <div style={{ fontSize: 9, color: "#888", fontWeight: 300 }}>{section.desc}</div>
                  </div>

                  {section.questions.map((q, qi) => (
                    <div key={q.id} style={{
                      border: "1px solid #1a1a1a", borderRadius: 8, padding: 16,
                      background: "#0c0c0c", marginBottom: 10,
                      animation: `slideIn 0.3s ease ${qi * 0.05}s both`,
                    }}>
                      <div style={{ fontSize: 11, color: "#ccc", marginBottom: 14, lineHeight: 1.6, fontWeight: 300 }}>
                        {q.text}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                        {SCALE_LABELS.map(scale => (
                          <button key={scale.value} onClick={() => setPsychAnswers(prev => ({ ...prev, [q.id]: scale.value }))} style={{
                            width: "100%", padding: "11px 14px", borderRadius: 6, textAlign: "left",
                            background: psychAnswers[q.id] === scale.value ? "#dc262622" : "#111",
                            border: psychAnswers[q.id] === scale.value ? "1px solid #dc2626" : "1px solid #1a1a1a",
                            color: psychAnswers[q.id] === scale.value ? "#ff5555" : "#999",
                            cursor: "pointer", fontFamily: "inherit",
                            fontSize: 10, letterSpacing: 1, transition: "all 0.15s", fontWeight: 400,
                          }}>
                            {scale.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Navigation */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
                    <button onClick={() => psychSection > 0 && setPsychSection(psychSection - 1)} style={{
                      padding: "10px 20px", background: "transparent", border: "1px solid #111",
                      borderRadius: 4, color: "#999", cursor: psychSection > 0 ? "pointer" : "default",
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
        {/* ════════════════════════════════════════════════════ */}
        {/* AI CHAT */}
        {/* ════════════════════════════════════════════════════ */}
        {view === "chat" && (
          <div style={{ animation: "fadeIn 0.5s ease", display: "flex", flexDirection: "column", height: "calc(100vh - 180px)" }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 7, letterSpacing: 4, color: "#dc2626", marginBottom: 3 }}>
                INTELLIGENCE INTERFACE · ENCRYPTED
              </div>
              <div style={{ fontSize: 10, color: "#888", fontWeight: 300 }}>
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
                  <div style={{ fontSize: 9, color: "#888", letterSpacing: 3, marginBottom: 8 }}>SYSTEM ACTIVE · AWAITING QUERY</div>
                  <div style={{ fontSize: 9, color: "#777", lineHeight: 1.8, fontWeight: 300 }}>
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
                    <span style={{ animation: "pulse 1.5s infinite", fontSize: 9, color: "#999", letterSpacing: 2 }}>
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
              <div style={{ fontSize: 7, letterSpacing: 4, color: "#888", marginBottom: 4 }}>THE ORDER</div>
              <div style={{ fontSize: 14, color: "#d0d0d0", fontWeight: 200, letterSpacing: 3, marginBottom: 6 }}>
                CLEARANCE HIERARCHY
              </div>
              <div style={{ fontSize: 9, color: "#888", fontWeight: 300 }}>
                Each rank unlocks deeper intelligence. Pass the clearance exam to advance.
              </div>
            </div>

            {/* Streak Display */}
            <div style={{
              border: "1px solid #0e0e0e", borderRadius: 8, padding: 16,
              background: "#070707", marginBottom: 16, textAlign: "center",
            }}>
              <div style={{ fontSize: 7, letterSpacing: 4, color: "#888", marginBottom: 8 }}>STREAK PROTOCOL</div>
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
                        <div style={{ fontSize: 8, color: "#888", marginTop: 2, fontWeight: 300, fontStyle: "italic" }}>
                          "{rank.sigil}"
                        </div>
                        <div style={{ fontSize: 8, color: "#777", marginTop: 4, letterSpacing: 1 }}>
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
                      {!unlocked && !nextRankIsThis && <span style={{ fontSize: 12, color: "#777" }}>🔒</span>}
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
                      <div style={{ fontSize: 8, color: "#999", fontWeight: 300 }}>
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
                        <div style={{ fontSize: 9, color: "#888", fontWeight: 300 }}>Rate yourself honestly. The system calibrates to truth, not ego.</div>
                      </div>
                      <button onClick={() => { setPillarAssessing(null); setPillarAnswers({}); }} style={{
                        background: "transparent", border: "none", color: "#999",
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
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3, fontSize: 7, color: "#777" }}>
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
        <NavItem icon="◉" label="Hub" active={view === "hub"} onClick={() => { setView("hub"); setSubView(null); setActiveCourse(null); setActiveLesson(null); setQuizState(null); setScenarioLab(null); }} />
        <NavItem icon="◈" label="Train" active={view === "train" || view === "psych"} onClick={() => { setView(user.profile ? "train" : "psych"); setActiveCourse(null); setActiveLesson(null); setQuizState(null); setScenarioLab(null); }}
          notification={!user.profile} />
        <NavItem icon="◐" label="Intel" active={view === "chat"} onClick={() => setView("chat")} />
        <NavItem icon="☗" label="Order" active={view === "ranks"} onClick={() => setView("ranks")} />
      </nav>
    </div>
  );
}
