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
  {
    id: "persuasion-code",
    pillar: "power",
    title: "THE PERSUASION CODE",
    subtitle: "Decoding the architecture of human compliance",
    difficulty: "ADVANCED",
    xpReward: 300,
    locked: false,
    modules: [
      {
        id: "pc-1", title: "The Compliance Blueprint",
        lessons: [
          { id: "pc-1-1", title: "Why People Say Yes — The 6 Vectors", type: "lesson", duration: "12 min" },
          { id: "pc-1-2", title: "Anchoring & Priming in Real Conversation", type: "lesson", duration: "15 min" },
          { id: "pc-1-3", title: "Module Assessment", type: "quiz", questions: 8 },
        ]
      },
      {
        id: "pc-2", title: "Frame Control Mastery",
        lessons: [
          { id: "pc-2-1", title: "What Frames Are & Why They Control Everything", type: "lesson", duration: "10 min" },
          { id: "pc-2-2", title: "Frame Battles — How to Win Every Exchange", type: "lesson", duration: "18 min" },
          { id: "pc-2-3", title: "Reframing: The Operator's Secret Weapon", type: "lesson", duration: "14 min" },
          { id: "pc-2-4", title: "Module Assessment", type: "quiz", questions: 10 },
        ]
      },
      {
        id: "pc-3", title: "Covert Influence Protocols",
        lessons: [
          { id: "pc-3-1", title: "Embedded Commands & Conversational Hypnosis", type: "lesson", duration: "20 min" },
          { id: "pc-3-2", title: "Strategic Ambiguity — Saying Everything by Saying Nothing", type: "lesson", duration: "16 min" },
          { id: "pc-3-3", title: "Final Assessment: The Persuasion Code", type: "quiz", questions: 15 },
        ]
      },
    ],
  },
  {
    id: "consumer-psych",
    pillar: "money",
    title: "CONSUMER PSYCHOLOGY",
    subtitle: "The invisible forces that make people buy",
    difficulty: "INTERMEDIATE",
    xpReward: 250,
    locked: false,
    modules: [
      {
        id: "cp-1", title: "Decision Architecture",
        lessons: [
          { id: "cp-1-1", title: "System 1 vs System 2 — Exploiting the Gap", type: "lesson", duration: "14 min" },
          { id: "cp-1-2", title: "Loss Aversion & Scarcity Engineering", type: "lesson", duration: "12 min" },
          { id: "cp-1-3", title: "Module Assessment", type: "quiz", questions: 8 },
        ]
      },
      {
        id: "cp-2", title: "Pricing Psychology",
        lessons: [
          { id: "cp-2-1", title: "Anchoring Prices in the Subconscious", type: "lesson", duration: "11 min" },
          { id: "cp-2-2", title: "The Decoy Effect & Choice Architecture", type: "lesson", duration: "13 min" },
          { id: "cp-2-3", title: "Module Assessment", type: "quiz", questions: 10 },
        ]
      },
    ],
  },
  {
    id: "dark-psychology",
    pillar: "power",
    title: "DARK PSYCHOLOGY",
    subtitle: "Understanding the shadow side of human behavior",
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
          { id: "dp-1-4", title: "Module Assessment", type: "quiz", questions: 12 },
        ]
      },
    ],
  },
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
          { id: "bo-1-3", title: "Module Assessment", type: "quiz", questions: 8 },
        ]
      },
      {
        id: "bo-2", title: "Sleep Architecture",
        lessons: [
          { id: "bo-2-1", title: "Circadian Protocol — Engineering Perfect Sleep", type: "lesson", duration: "18 min" },
          { id: "bo-2-2", title: "Supplement Stack for Deep Recovery", type: "lesson", duration: "12 min" },
          { id: "bo-2-3", title: "Module Assessment", type: "quiz", questions: 8 },
        ]
      },
    ],
  },
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
          { id: "sw-1-3", title: "Module Assessment", type: "quiz", questions: 10 },
        ]
      },
      {
        id: "sw-2", title: "Frame Dominance",
        lessons: [
          { id: "sw-2-1", title: "Status Games — Winning Without Competing", type: "lesson", duration: "14 min" },
          { id: "sw-2-2", title: "Conversational Threading & Emotional Hijacking", type: "lesson", duration: "18 min" },
          { id: "sw-2-3", title: "Module Assessment", type: "quiz", questions: 10 },
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
  "pc-1-3": [
    { q: "Which cognitive bias causes people to rely too heavily on the first piece of information they receive?", opts: ["Confirmation bias", "Anchoring effect", "Availability heuristic", "Framing effect"], correct: 1 },
    { q: "Robert Cialdini's principle of 'Social Proof' is most effective when:", opts: ["The audience is uncertain", "The audience is hostile", "The audience is highly educated", "The audience is familiar with you"], correct: 0 },
    { q: "What is the psychological mechanism behind the 'Door-in-the-Face' technique?", opts: ["Cognitive dissonance", "Reciprocal concession", "Authority bias", "Scarcity principle"], correct: 1 },
    { q: "Which compliance vector is activated when you give someone something before making a request?", opts: ["Authority", "Liking", "Reciprocity", "Commitment"], correct: 2 },
    { q: "Priming works by:", opts: ["Explicitly telling people what to think", "Activating associated neural networks below conscious awareness", "Creating logical arguments", "Using repetition to build familiarity"], correct: 1 },
  ],
  "pc-2-4": [
    { q: "A 'frame' in social dynamics is best defined as:", opts: ["A physical boundary", "The underlying assumptions that define a social interaction", "A debate strategy", "A type of body language"], correct: 1 },
    { q: "When someone 'breaks your frame', the most effective response is:", opts: ["Reacting emotionally to show dominance", "Ignoring them completely", "Absorbing and reframing — pulling them into YOUR reality", "Conceding the point to avoid conflict"], correct: 2 },
    { q: "Frame control is fundamentally about controlling:", opts: ["What people think", "The context through which people interpret reality", "Other people's emotions", "The conversation topic"], correct: 1 },
    { q: "The strongest frame in any interaction belongs to the person who:", opts: ["Talks the most", "Has the most authority", "Has the least emotional reactivity", "Makes the most logical points"], correct: 2 },
    { q: "Preframing is the technique of:", opts: ["Setting expectations before the main interaction", "Reacting after someone challenges you", "Changing the subject", "Using authority to override objections"], correct: 0 },
  ],
};

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
  const colors = { "BEGINNER": "#4a5568", "INTERMEDIATE": "#3b82f6", "ADVANCED": "#8b5cf6", "CLASSIFIED": "#dc2626" };
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

  // Boot
  const [showIntro, setShowIntro] = useState(true);
  const [bootPhase, setBootPhase] = useState(0);

  const currentRank = RANKS.reduce((acc, r) => user.xp >= r.xp ? r : acc, RANKS[0]);
  const nextRank = RANKS.find(r => r.xp > user.xp) || RANKS[RANKS.length - 1];
  const totalQuestions = PSYCH_SECTIONS.reduce((a, s) => a + s.questions.length, 0);
  const answeredQuestions = Object.keys(psychAnswers).length;

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

  const addXP = useCallback((amount) => {
    setUser(prev => {
      const newXP = prev.xp + amount;
      const newLevel = RANKS.reduce((acc, r) => newXP >= r.xp ? r.level : acc, 0);
      return { ...prev, xp: newXP, level: newLevel, tokens: prev.tokens + Math.floor(amount / 10) };
    });
  }, []);

  // ── AI CHAT ──
  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsTyping(true);
    setTimeout(() => {
      const responses = [
        `Operational analysis of your query:\n\nThis connects directly to cognitive bias exploitation — specifically the intersection of anchoring effects and frame control. Most people operate on autopilot, running System 1 heuristics. Your job is to engineer the frame before their conscious mind activates.\n\nProtocol:\n1. Identify the target's primary decision heuristic\n2. Anchor their reference point before presenting your position\n3. Use strategic contrast to make your desired outcome feel inevitable\n4. Deploy social proof as the final compliance trigger\n\nThe CIA's behavioral influence research confirms this sequence works across cultures. The key variable is timing — anchor before they form their own reference point.\n\nDirective: Map this framework to your specific situation and report back with the variables.`,
        `Noted. Deconstructing.\n\nYou're operating at the surface layer. Let me take you deeper.\n\nEvery human interaction is a frame negotiation. The person who controls the frame controls the reality of the exchange. This isn't metaphor — it's neuroscience. The prefrontal cortex constructs reality based on contextual frames, not raw data.\n\nThe operational implication: Stop trying to win arguments with logic. Logic is post-hoc rationalization. Instead, control the emotional frame, and the "logical" conclusion becomes inevitable.\n\nThree vectors for frame installation:\n• Environmental priming — control the context before the conversation\n• Presupposition stacking — embed your desired conclusion in your questions\n• Emotional anchoring — attach your position to the target's identity\n\nThis is Protocol 3 from the Influence Architecture. The technique has a 73% compliance rate in controlled studies.\n\nWhat specific scenario are you deploying this in?`,
        `Clinical assessment:\n\nThe pattern you're describing is a textbook case of cognitive dissonance resolution. The target's brain is experiencing two conflicting inputs and will resolve toward whichever direction requires less psychological energy.\n\nYour leverage point is the path of least resistance.\n\nHere's the framework the intelligence community uses — the OODA Loop applied to social dynamics:\n\n1. OBSERVE — Map their current beliefs and emotional state without revealing yours\n2. ORIENT — Identify the gap between where they are and where you need them\n3. DECIDE — Choose the lowest-friction path to bridge that gap\n4. ACT — Execute with precision. One move. No hesitation.\n\nThe critical error most operatives make: they try to change beliefs directly. That triggers resistance. Instead, change the context around the belief, and the belief updates itself.\n\nYour move: Define the specific belief you're targeting and I'll map the approach vector.`,
      ];
      setChatMessages(prev => [...prev, { role: "assistant", content: responses[Math.floor(Math.random() * responses.length)] }]);
      setIsTyping(false);
      addXP(15);
    }, 2000 + Math.random() * 2000);
  };

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
    const { questions, answers, quizId } = quizState;
    let correct = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correct) correct++; });
    const score = Math.round((correct / questions.length) * 100);
    setQuizState(prev => ({ ...prev, score }));
    setUser(prev => ({
      ...prev,
      completedQuizzes: { ...prev.completedQuizzes, [quizId]: score },
      completedLessons: [...prev.completedLessons, quizId],
    }));
    addXP(score >= 80 ? 100 : score >= 60 ? 50 : 20);
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
                { label: "TOKENS", value: user.tokens, color: "#d4a017" },
                { label: "CLEARANCE", value: `${user.level}`, color: "#dc2626" },
                { label: "COURSES", value: user.completedLessons.length, color: "#3b82f6" },
              ].map((stat, i) => (
                <div key={i} style={{
                  border: "1px solid #0e0e0e", borderRadius: 6, padding: "12px 10px",
                  background: "#070707", textAlign: "center",
                }}>
                  <div style={{ fontSize: 7, letterSpacing: 3, color: "#222", marginBottom: 6 }}>{stat.label}</div>
                  <div style={{ fontSize: 16, fontWeight: 300, color: stat.color, letterSpacing: 1 }}>{stat.value}</div>
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
            <button onClick={() => setActiveLesson(null)} style={{
              background: "transparent", border: "none", color: "#333",
              cursor: "pointer", fontSize: 9, letterSpacing: 2, marginBottom: 16,
              fontFamily: "inherit", padding: 0,
            }}>
              ← BACK TO COURSE
            </button>

            <div style={{
              border: "1px solid #0e0e0e", borderRadius: 8, padding: 24,
              background: "#070707", marginBottom: 16,
            }}>
              <div style={{ fontSize: 7, letterSpacing: 3, color: "#333", marginBottom: 8 }}>
                {activeCourse.title} · {activeLesson.duration}
              </div>
              <div style={{ fontSize: 13, color: "#d0d0d0", fontWeight: 300, letterSpacing: 1, marginBottom: 16 }}>
                {activeLesson.title}
              </div>
              <div style={{ fontSize: 10, color: "#555", lineHeight: 1.9, fontWeight: 300 }}>
                <p style={{ marginBottom: 14 }}>
                  This lesson content would be loaded from your Skool course database. In the production version, each lesson pulls the actual content from your courses, formatted with the operator aesthetic.
                </p>
                <p style={{ marginBottom: 14 }}>
                  The AI teacher is available during each lesson to answer questions, provide examples, and test understanding in real-time. Every interaction is calibrated to the operative's psychological profile.
                </p>
                <p style={{ color: "#333" }}>
                  [Full lesson content renders here — text, embedded videos, diagrams, frameworks, case studies]
                </p>
              </div>
            </div>

            <button onClick={() => {
              setUser(prev => ({ ...prev, completedLessons: [...prev.completedLessons, activeLesson.id] }));
              addXP(30);
              setActiveLesson(null);
            }} style={{
              width: "100%", padding: 14, background: "#16a34a11",
              border: "1px solid #16a34a22", borderRadius: 6,
              color: "#16a34a", cursor: "pointer", fontFamily: "inherit",
              fontSize: 9, letterSpacing: 3, fontWeight: 400,
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
              <div style={{ fontSize: 7, letterSpacing: 4, color: "#dc2626", marginBottom: 4 }}>KNOWLEDGE VERIFICATION</div>
              <div style={{ fontSize: 12, color: "#d0d0d0", fontWeight: 300, letterSpacing: 2, marginBottom: 8 }}>
                Q{quizState.current + 1} of {quizState.questions.length}
              </div>
              <div style={{ height: 2, background: "#111", borderRadius: 1, marginBottom: 20 }}>
                <div style={{
                  height: "100%",
                  width: `${((quizState.current + 1) / quizState.questions.length) * 100}%`,
                  background: "#dc2626", borderRadius: 1, transition: "width 0.3s", opacity: 0.7,
                }} />
              </div>
            </div>

            <div style={{
              border: "1px solid #0e0e0e", borderRadius: 8, padding: 20,
              background: "#070707",
            }}>
              <div style={{ fontSize: 11, color: "#ccc", lineHeight: 1.7, fontWeight: 300, marginBottom: 18 }}>
                {quizState.questions[quizState.current].q}
              </div>

              {quizState.questions[quizState.current].opts.map((opt, oi) => (
                <button key={oi} onClick={() => answerQuiz(quizState.current, oi)} style={{
                  width: "100%", textAlign: "left", padding: "12px 14px",
                  marginBottom: 6, borderRadius: 6, cursor: "pointer",
                  fontFamily: "inherit", fontSize: 10, fontWeight: 300,
                  background: quizState.answers[quizState.current] === oi ? "#dc262611" : "#060606",
                  border: quizState.answers[quizState.current] === oi ? "1px solid #dc262633" : "1px solid #0e0e0e",
                  color: quizState.answers[quizState.current] === oi ? "#dc2626" : "#777",
                  transition: "all 0.2s", letterSpacing: 0.3,
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
          </div>
        )}

        {/* ── QUIZ RESULTS ── */}
        {quizState && quizState.score !== null && (
          <div style={{ animation: "fadeIn 0.5s ease", textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 7, letterSpacing: 4, color: "#333", marginBottom: 16 }}>ASSESSMENT COMPLETE</div>
            <div style={{
              fontSize: 48, fontWeight: 200, marginBottom: 8,
              color: quizState.score >= 80 ? "#16a34a" : quizState.score >= 60 ? "#d4a017" : "#dc2626",
            }}>
              {quizState.score}%
            </div>
            <div style={{ fontSize: 10, letterSpacing: 3, marginBottom: 8, color: "#555", fontWeight: 300 }}>
              {quizState.score >= 80 ? "KNOWLEDGE VERIFIED" : quizState.score >= 60 ? "PARTIAL COMPREHENSION" : "REVIEW REQUIRED"}
            </div>
            <div style={{ fontSize: 9, color: "#333", marginBottom: 24 }}>
              +{quizState.score >= 80 ? 100 : quizState.score >= 60 ? 50 : 20} XP earned
            </div>

            {/* Show correct/incorrect */}
            <div style={{ textAlign: "left", maxWidth: 500, margin: "0 auto" }}>
              {quizState.questions.map((q, i) => {
                const correct = quizState.answers[i] === q.correct;
                return (
                  <div key={i} style={{
                    padding: "10px 14px", marginBottom: 4, borderRadius: 6,
                    background: "#070707", border: `1px solid ${correct ? "#16a34a15" : "#dc262615"}`,
                    fontSize: 9, color: "#555", fontWeight: 300,
                  }}>
                    <span style={{ color: correct ? "#16a34a" : "#dc2626", marginRight: 8 }}>
                      {correct ? "✓" : "✗"}
                    </span>
                    {q.q.substring(0, 60)}...
                    {!correct && (
                      <div style={{ fontSize: 8, color: "#16a34a", marginTop: 4, opacity: 0.7 }}>
                        Correct: {q.opts[q.correct]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button onClick={() => { setQuizState(null); }} style={{
              marginTop: 20, padding: "12px 24px", background: "transparent",
              border: "1px solid #111", borderRadius: 6, color: "#555",
              cursor: "pointer", fontFamily: "inherit", fontSize: 9, letterSpacing: 2,
            }}>
              RETURN TO COURSE
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
        {view === "ranks" && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 7, letterSpacing: 4, color: "#222", marginBottom: 4 }}>THE ORDER</div>
              <div style={{ fontSize: 14, color: "#d0d0d0", fontWeight: 200, letterSpacing: 3, marginBottom: 6 }}>
                CLEARANCE HIERARCHY
              </div>
              <div style={{ fontSize: 9, color: "#222", fontWeight: 300 }}>
                Each rank unlocks deeper intelligence. There are no shortcuts.
              </div>
            </div>

            {RANKS.slice(1).map((rank) => {
              const unlocked = user.xp >= rank.xp;
              const current = rank.level === currentRank.level;
              return (
                <div key={rank.level} style={{
                  border: current ? `1px solid ${rank.color}22` : "1px solid #0e0e0e",
                  borderRadius: 8, padding: 18, marginBottom: 6,
                  background: current ? `${rank.color}05` : "#070707",
                  opacity: unlocked ? 1 : 0.25, transition: "all 0.3s",
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
                    <div>
                      {current && (
                        <span style={{
                          fontSize: 7, letterSpacing: 3, color: rank.color,
                          border: `1px solid ${rank.color}22`, padding: "3px 8px",
                          borderRadius: 2, fontWeight: 400,
                        }}>
                          CURRENT
                        </span>
                      )}
                      {!unlocked && <span style={{ fontSize: 12, color: "#1a1a1a" }}>🔒</span>}
                    </div>
                  </div>
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
