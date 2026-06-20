"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";

/* ─────────────────────────── Types ─────────────────────────── */
interface Variant {
  content: string;
  viralScore: number;
  style: string;
  tip: string;
}
interface HistoryItem {
  id: string;
  topic: string;
  contentType: string;
  dialect: string;
  variants: Variant[];
  date: string;
}
interface Achievement {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

/* ─────────────────────────── Constants ─────────────────────── */
const CONTENT_TYPES = [
  { id: "instagram", label: "انستقرام", emoji: "📸" },
  { id: "tiktok",    label: "تيك توك",  emoji: "🎵" },
  { id: "youtube",   label: "يوتيوب",   emoji: "▶️" },
  { id: "tweet",     label: "تويتر",    emoji: "𝕏"  },
  { id: "reels",     label: "ريلز",     emoji: "🎬" },
];

const DIALECTS = [
  { id: "gulf",      label: "خليجي", flag: "🇸🇦" },
  { id: "egyptian",  label: "مصري",  flag: "🇪🇬" },
  { id: "levantine", label: "شامي",  flag: "🇱🇧" },
  { id: "msa",       label: "فصحى",  flag: "📖"  },
];

const TONES = [
  { id: "natural",      label: "طبيعي",    emoji: "😊" },
  { id: "funny",        label: "مرح",      emoji: "😂" },
  { id: "professional", label: "احترافي",  emoji: "💼" },
  { id: "emotional",    label: "مؤثر",     emoji: "❤️" },
];

const LEVELS = [
  { min: 0,   title: "مبتدئ",  emoji: "🌱", color: "#6b7280" },
  { min: 10,  title: "منشئ",   emoji: "📝", color: "#3b82f6" },
  { min: 25,  title: "مؤثر",   emoji: "⭐", color: "#8b5cf6" },
  { min: 50,  title: "نجم",    emoji: "💫", color: "#f59e0b" },
  { min: 100, title: "أسطورة", emoji: "👑", color: "#ef4444" },
];

const ACHIEVEMENTS: Achievement[] = [
  { id: "first",   emoji: "🌟", title: "أول خطوة",     desc: "أنشأت أول محتوى لك",   rarity: "common"    },
  { id: "gen10",   emoji: "⚡", title: "منتج محتوى",   desc: "10 قطع محتوى",          rarity: "common"    },
  { id: "gen50",   emoji: "💎", title: "نجم ناشئ",     desc: "50 قطعة محتوى",         rarity: "rare"      },
  { id: "gen100",  emoji: "🏆", title: "ملك المحتوى",  desc: "100 قطعة محتوى",        rarity: "epic"      },
  { id: "streak3", emoji: "🔥", title: "على النار",    desc: "3 أيام متتالية",         rarity: "common"    },
  { id: "streak7", emoji: "⚡", title: "أسبوع كامل",   desc: "7 أيام متتالية",         rarity: "rare"      },
  { id: "viral90", emoji: "🚀", title: "محتوى فايرل",  desc: "نسخة فايرل سكور 90+",   rarity: "epic"      },
  { id: "legend",  emoji: "👑", title: "أسطورة",       desc: "200 قطعة محتوى",        rarity: "legendary" },
];

const LOADING_LINES = ["يفكر...", "يُبدع...", "يكتب...", "يُحلل...", "يُصيغ...", "يُجوّد..."];

const RARITY_COLORS: Record<string, string> = {
  common:    "rgba(107,114,128,0.15)",
  rare:      "rgba(59,130,246,0.15)",
  epic:      "rgba(139,92,246,0.2)",
  legendary: "rgba(234,179,8,0.2)",
};
const RARITY_BORDERS: Record<string, string> = {
  common:    "rgba(107,114,128,0.4)",
  rare:      "rgba(59,130,246,0.4)",
  epic:      "rgba(139,92,246,0.5)",
  legendary: "rgba(234,179,8,0.5)",
};

/* ─────────────────────────── Helpers ───────────────────────── */
function getLevel(total: number) {
  return [...LEVELS].reverse().find(l => total >= l.min) ?? LEVELS[0];
}

function scoreColor(score: number) {
  if (score >= 80) return "#22c55e";
  if (score >= 65) return "#f59e0b";
  return "#ef4444";
}

/* ─────────────────────────── Sub-components ────────────────── */

/* Animated viral score ring */
function ViralRing({ score, size = 80 }: { score: number; size?: number }) {
  const [display, setDisplay] = useState(0);
  const [animating, setAnimating] = useState(false);
  const radius = (size - 10) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);

  useEffect(() => {
    setDisplay(0);
    setAnimating(false);
    const t = setTimeout(() => {
      setAnimating(true);
      let start = 0;
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1400, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(eased * score));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, 200);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute" style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={animating ? offset : circ}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)", filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="text-center relative">
        <div className="text-lg font-black leading-none" style={{ color }}>{display}</div>
        <div className="text-white/30 text-xs leading-none mt-0.5">فايرل</div>
      </div>
    </div>
  );
}

/* Confetti burst on copy */
function Confetti({ trigger }: { trigger: number }) {
  const particles = useMemo(() => {
    const colors = ["#a78bfa", "#60a5fa", "#f472b6", "#34d399", "#fbbf24", "#fb923c"];
    return Array.from({ length: 14 }, (_, i) => {
      const angle = (i / 14) * Math.PI * 2;
      const dist = 50 + Math.random() * 55;
      return {
        id: i,
        color: colors[i % colors.length],
        tx: `${Math.cos(angle) * dist}px`,
        ty: `${Math.sin(angle) * dist - 20}px`,
        rot: `${Math.random() * 720 - 360}deg`,
        size: `${Math.random() * 5 + 4}px`,
        delay: `${Math.random() * 0.15}s`,
        shape: i % 3 === 0 ? "50%" : i % 3 === 1 ? "0" : "2px",
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  if (trigger === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ overflow: "visible", zIndex: 10 }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: p.size, height: p.size,
          background: p.color,
          borderRadius: p.shape,
          animation: `confetti-burst 0.9s ${p.delay} cubic-bezier(0.16,1,0.3,1) forwards`,
          "--tx": p.tx, "--ty": p.ty, "--rot": p.rot,
        } as React.CSSProperties} />
      ))}
    </div>
  );
}

/* Achievement toast */
function AchievementToast({ item, onDone }: { item: Achievement | null; onDone: () => void }) {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    if (!item) return;
    setPhase("in");
    const t1 = setTimeout(() => setPhase("hold"), 400);
    const t2 = setTimeout(() => setPhase("out"), 3200);
    const t3 = setTimeout(onDone, 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [item, onDone]);

  if (!item) return null;
  const bg = RARITY_COLORS[item.rarity];
  const border = RARITY_BORDERS[item.rarity];

  return (
    <div className="fixed top-5 left-1/2 z-[100] pointer-events-none"
      style={{ transform: "translateX(-50%)" }}>
      <div style={{
        background: bg,
        border: `1px solid ${border}`,
        backdropFilter: "blur(20px)",
        borderRadius: "16px",
        padding: "12px 18px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        minWidth: "240px",
        animation: phase === "out"
          ? "toast-out 0.4s cubic-bezier(0.16,1,0.3,1) forwards"
          : "toast-in 0.4s cubic-bezier(0.16,1,0.3,1) both",
        boxShadow: `0 0 30px ${border}`,
      }}>
        <div style={{ fontSize: "28px", lineHeight: 1 }}>{item.emoji}</div>
        <div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            إنجاز جديد!
          </div>
          <div style={{ color: "white", fontWeight: 800, fontSize: "14px" }}>{item.title}</div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px" }}>{item.desc}</div>
        </div>
      </div>
    </div>
  );
}

/* Instagram post preview modal */
function InstaPreview({ content, onClose }: { content: string; onClose: () => void }) {
  const lines = content.split("\n");
  const hashLine = lines.find(l => l.trim().startsWith("#")) ?? "";
  const body = lines.filter(l => !l.trim().startsWith("#")).join("\n").trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}>
      <div className="float-in" style={{ maxWidth: 380, width: "100%" }} onClick={e => e.stopPropagation()}>
        {/* Phone frame */}
        <div className="rounded-3xl overflow-hidden" style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
          {/* Status bar */}
          <div style={{ background: "#0a0a0a", padding: "8px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>9:41</span>
            <div style={{ display: "flex", gap: 4 }}>
              {["📶", "🔋"].map(i => <span key={i} style={{ fontSize: 12 }}>{i}</span>)}
            </div>
          </div>

          {/* IG Header */}
          <div style={{ padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%",
                background: "linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 800, fontSize: 14,
              }}>ك</div>
              <div>
                <div style={{ color: "white", fontSize: 13, fontWeight: 700, lineHeight: 1 }}>your_account</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 2 }}>السعودية</div>
              </div>
            </div>
            <span style={{ color: "white", fontSize: 20, cursor: "pointer" }}>···</span>
          </div>

          {/* Image area */}
          <div style={{
            width: "100%", aspectRatio: "1/1",
            background: "linear-gradient(135deg, #1a0533 0%, #0a1628 50%, #05001a 100%)",
            display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column",
          }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🖼️</div>
            <div style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>صورتك هنا</div>
          </div>

          {/* Actions */}
          <div style={{ padding: "10px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ display: "flex", gap: 14 }}>
                {"🤍 💬 ✈️".split(" ").map(e => (
                  <span key={e} style={{ fontSize: 22, cursor: "pointer", transition: "transform 0.1s" }}>{e}</span>
                ))}
              </div>
              <span style={{ fontSize: 22, cursor: "pointer" }}>🔖</span>
            </div>
            <div style={{ color: "white", fontSize: 12, fontWeight: 700, marginBottom: 4 }}>1,247 إعجاب</div>
            <div style={{ fontSize: 12, direction: "rtl", lineHeight: 1.5 }}>
              <span style={{ color: "white", fontWeight: 700 }}>your_account </span>
              <span style={{ color: "rgba(255,255,255,0.75)" }}>
                {body.length > 160 ? body.slice(0, 160) + "..." : body}
              </span>
            </div>
            {hashLine && (
              <div style={{ color: "#60a5fa", fontSize: 11, marginTop: 4, direction: "rtl" }}>
                {hashLine.slice(0, 80)}
              </div>
            )}
            <div style={{ color: "rgba(255,255,255,0.25)", fontSize: 11, marginTop: 6 }}>منذ لحظات</div>
          </div>
        </div>

        <button onClick={onClose} className="w-full mt-3 py-2.5 rounded-xl text-sm transition-all glass"
          style={{ color: "rgba(255,255,255,0.5)" }}>
          إغلاق المعاينة
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────── Main Page ─────────────────────── */
export default function Home() {
  /* form */
  const [topic, setTopic]           = useState("");
  const [contentType, setContentType] = useState("instagram");
  const [dialect, setDialect]       = useState("gulf");
  const [tone, setTone]             = useState("natural");

  /* results */
  const [variants, setVariants]     = useState<Variant[]>([]);
  const [activeVar, setActiveVar]   = useState(0);
  const [loading, setLoading]       = useState(false);
  const [loadLine, setLoadLine]     = useState(LOADING_LINES[0]);
  const [error, setError]           = useState("");

  /* copy */
  const [copiedIdx, setCopiedIdx]   = useState<number | null>(null);
  const [confTrigger, setConfTrigger] = useState(0);

  /* gamification */
  const [streak, setStreak]                   = useState(0);
  const [total, setTotal]                     = useState(0);
  const [unlocked, setUnlocked]               = useState<string[]>([]);
  const [toast, setToast]                     = useState<Achievement | null>(null);
  const [justLeveledUp, setJustLeveledUp]     = useState(false);

  /* ui */
  const [tab, setTab]               = useState<"create" | "history" | "achievements">("create");
  const [history, setHistory]       = useState<HistoryItem[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* Load persisted state */
  useEffect(() => {
    const t = parseInt(localStorage.getItem("total") ?? "0", 10);
    const s = parseInt(localStorage.getItem("streak") ?? "0", 10);
    const u = JSON.parse(localStorage.getItem("unlocked") ?? "[]") as string[];
    const h = JSON.parse(localStorage.getItem("history") ?? "[]") as HistoryItem[];
    const last = localStorage.getItem("lastDate") ?? "";
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    setTotal(t);
    setUnlocked(u);
    setHistory(h);
    setStreak(last === today ? s : last === yesterday ? s : 0);
  }, []);

  /* Loading text rotation */
  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const id = setInterval(() => { i = (i + 1) % LOADING_LINES.length; setLoadLine(LOADING_LINES[i]); }, 800);
    return () => clearInterval(id);
  }, [loading]);

  /* Check & unlock achievements */
  const checkAchievements = useCallback((newTotal: number, newStreak: number, cur: string[], bestScore: number) => {
    const checks = [
      { id: "first",   ok: newTotal >= 1   },
      { id: "gen10",   ok: newTotal >= 10  },
      { id: "gen50",   ok: newTotal >= 50  },
      { id: "gen100",  ok: newTotal >= 100 },
      { id: "legend",  ok: newTotal >= 200 },
      { id: "streak3", ok: newStreak >= 3  },
      { id: "streak7", ok: newStreak >= 7  },
      { id: "viral90", ok: bestScore >= 90  },
    ];
    for (const c of checks) {
      if (c.ok && !cur.includes(c.id)) {
        const found = ACHIEVEMENTS.find(a => a.id === c.id)!;
        setToast(found);
        return [...cur, c.id];
      }
    }
    return cur;
  }, []);

  const generate = async () => {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setVariants([]);
    setError("");
    setActiveVar(0);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, contentType, dialect, tone }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const vList: Variant[] = data.variants ?? [];
      setVariants(vList);

      /* persist gamification */
      const newTotal = total + 1;
      const today = new Date().toISOString().split("T")[0];
      const last  = localStorage.getItem("lastDate") ?? "";
      const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      const newStreak = last === yesterday || last === today ? streak + (last === today ? 0 : 1) : 1;
      const bestScore = Math.max(...vList.map(v => v.viralScore), 0);

      const prevLevel = getLevel(total);
      const newLevel  = getLevel(newTotal);
      if (prevLevel.title !== newLevel.title) setJustLeveledUp(true);

      const newUnlocked = checkAchievements(newTotal, newStreak, unlocked, bestScore);

      setTotal(newTotal);
      setStreak(newStreak);
      setUnlocked(newUnlocked);

      localStorage.setItem("total", String(newTotal));
      localStorage.setItem("streak", String(newStreak));
      localStorage.setItem("lastDate", today);
      localStorage.setItem("unlocked", JSON.stringify(newUnlocked));

      const newHistory: HistoryItem[] = [
        { id: crypto.randomUUID(), topic, contentType, dialect, variants: vList, date: new Date().toISOString() },
        ...history.slice(0, 14),
      ];
      setHistory(newHistory);
      localStorage.setItem("history", JSON.stringify(newHistory));

    } catch (e) {
      console.error(e);
      setError("حدث خطأ. تأكد من ضبط مفتاح ANTHROPIC_API_KEY وحاول مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  const copyContent = async (idx: number) => {
    await navigator.clipboard.writeText(variants[idx].content);
    setCopiedIdx(idx);
    setConfTrigger(t => t + 1);
    setTimeout(() => setCopiedIdx(null), 2200);
  };

  const level = getLevel(total);
  const bestIdx = variants.length
    ? variants.reduce((b, v, i) => v.viralScore > variants[b].viralScore ? i : b, 0)
    : 0;

  return (
    <div className="min-h-screen relative" style={{ background: "#050508" }}>
      {/* ── Animated background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden grid-bg">
        {[
          { color: "#7c3aed", top: "-10%", right: "-10%", size: 500, speed: "9s",  delay: "0s"  },
          { color: "#2563eb", top: "60%",  left:  "-8%",  size: 420, speed: "12s", delay: "2s"  },
          { color: "#ec4899", top: "35%",  right: "30%",  size: 300, speed: "15s", delay: "5s"  },
        ].map((b, i) => (
          <div key={i} style={{
            position: "absolute",
            width: b.size, height: b.size,
            top: b.top, right: b.right, left: b.left,
            background: `radial-gradient(circle, ${b.color}50 0%, transparent 65%)`,
            animation: `blob ${b.speed} ${b.delay} ease-in-out infinite`,
            filter: "blur(1px)",
          }} />
        ))}
      </div>

      {/* ── Achievement toast ── */}
      <AchievementToast item={toast} onDone={() => setToast(null)} />

      {/* ── Instagram preview modal ── */}
      {showPreview && variants[activeVar] && (
        <InstaPreview content={variants[activeVar].content} onClose={() => setShowPreview(false)} />
      )}

      {/* ── Header ── */}
      <header className="relative z-10 border-b border-white/5" style={{ background: "rgba(5,5,8,0.8)", backdropFilter: "blur(20px)" }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              boxShadow: "0 0 20px rgba(124,58,237,0.5)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>✍️</div>
            <div>
              <div className="text-white font-black text-sm tracking-tight leading-none">كاتب AI</div>
              <div className="text-xs leading-none mt-0.5" style={{ color: "#a78bfa" }}>صانع المحتوى الذكي</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {streak > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full glass-sm text-xs"
                style={{ border: "1px solid rgba(251,146,60,0.35)", color: "#fb923c" }}>
                <span className="fire text-sm">🔥</span>
                <span className="font-black">{streak}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full glass-sm text-xs font-bold"
              style={{
                border: `1px solid ${level.color}50`,
                color: level.color,
                animation: justLeveledUp ? "level-up 0.6s ease" : "none",
              }}
              onAnimationEnd={() => setJustLeveledUp(false)}>
              <span>{level.emoji}</span>
              <span>{level.title}</span>
            </div>
            <div className="text-xs px-2.5 py-1.5 rounded-full glass-sm" style={{ color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {total} محتوى
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 pt-10 pb-16">
        {/* ── Hero ── */}
        <div className="text-center mb-10 float-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs mb-5 glass-sm"
            style={{ border: "1px solid rgba(139,92,246,0.4)", color: "#a78bfa" }}>
            <span className="spin" style={{ display: "inline-block" }}>✦</span>
            <span>مدعوم بأحدث نماذج الذكاء الاصطناعي</span>
          </div>

          <h1 className="font-black text-white leading-[1.05] mb-3" style={{ fontSize: "clamp(2.2rem, 6vw, 4.5rem)" }}>
            محتوى يُشعل{" "}
            <span className="gradient-text-live">السوشيال</span>
            <br />في ثوانٍ ✦
          </h1>
          <p className="text-white/40 max-w-md mx-auto" style={{ fontSize: "clamp(0.85rem, 2vw, 1rem)" }}>
            {total > 0
              ? `أنشأت ${total} قطعة محتوى حتى الآن — استمر! 🎯`
              : "اكتب موضوعك، اختر المنصة، وشاهد السحر يحدث"}
          </p>
        </div>

        {/* ── Nav Tabs ── */}
        <div className="flex gap-2 mb-6 float-in-1">
          {[
            { id: "create",       label: "✨ أنشئ"                         },
            { id: "history",      label: `🕐 السجل (${history.length})`    },
            { id: "achievements", label: `🏆 إنجازات (${unlocked.length})` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: tab === t.id ? "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(79,70,229,0.35))" : "rgba(255,255,255,0.04)",
                border: tab === t.id ? "1px solid rgba(139,92,246,0.55)" : "1px solid rgba(255,255,255,0.07)",
                color: tab === t.id ? "white" : "rgba(255,255,255,0.4)",
              }}>{t.label}</button>
          ))}
        </div>

        {/* ══════════ CREATE TAB ══════════ */}
        {tab === "create" && (
          <div className="grid lg:grid-cols-5 gap-5">

            {/* ─── Left: Input Column ─── */}
            <div className="lg:col-span-2 space-y-4 float-in-1">

              {/* Topic textarea */}
              <div className="glass rounded-2xl p-4 card-hover"
                style={{ border: "1px solid rgba(139,92,246,0.25)" }}>
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">💡 الموضوع</label>
                <textarea
                  ref={textareaRef}
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && e.ctrlKey && generate()}
                  placeholder="وصفة، نصيحة مال، تجربة سفر، رياضة..."
                  rows={3}
                  className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-white/20"
                  style={{ lineHeight: 1.7 }}
                />
              </div>

              {/* Platform picker */}
              <div className="glass rounded-2xl p-4">
                <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">📱 المنصة</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {CONTENT_TYPES.map(ct => (
                    <button key={ct.id} onClick={() => setContentType(ct.id)}
                      className="flex flex-col items-center py-2.5 rounded-xl transition-all relative overflow-hidden"
                      style={{
                        background: contentType === ct.id ? "linear-gradient(135deg, rgba(124,58,237,0.45), rgba(79,70,229,0.4))" : "rgba(255,255,255,0.04)",
                        border: contentType === ct.id ? "1px solid rgba(139,92,246,0.65)" : "1px solid rgba(255,255,255,0.06)",
                        transform: contentType === ct.id ? "scale(1.06)" : "scale(1)",
                        boxShadow: contentType === ct.id ? "0 0 16px rgba(124,58,237,0.3)" : "none",
                      }}>
                      <span style={{ fontSize: 20 }}>{ct.emoji}</span>
                      <span className="text-white/70 mt-1" style={{ fontSize: 10 }}>{ct.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dialect & Tone row */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "🗣️ اللهجة", items: DIALECTS, val: dialect, set: setDialect },
                  { label: "🎭 الأسلوب", items: TONES,    val: tone,    set: setTone    },
                ].map(grp => (
                  <div key={grp.label} className="glass rounded-2xl p-3.5">
                    <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-2">{grp.label}</label>
                    <div className="space-y-1.5">
                      {grp.items.map((it: { id: string; label: string; flag?: string; emoji?: string }) => (
                        <button key={it.id} onClick={() => grp.set(it.id)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all"
                          style={{
                            background: grp.val === it.id ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.03)",
                            border: grp.val === it.id ? "1px solid rgba(139,92,246,0.5)" : "1px solid transparent",
                            color: grp.val === it.id ? "white" : "rgba(255,255,255,0.45)",
                            fontWeight: grp.val === it.id ? 700 : 500,
                          }}>
                          <span style={{ fontSize: 14 }}>{it.flag ?? it.emoji}</span>
                          <span>{it.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Generate button */}
              <button onClick={generate} disabled={loading || !topic.trim()}
                className="btn-glow w-full py-4 rounded-2xl font-black text-white relative overflow-hidden"
                style={{ fontSize: "1rem", letterSpacing: "0.02em" }}>
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="flex gap-1">
                      {[0,1,2].map(i => <span key={i} className={`w-1.5 h-1.5 bg-white rounded-full dot-${i+1}`} />)}
                    </span>
                    {loadLine}
                  </span>
                ) : "✨ أنشئ 3 نسخ مختلفة"}
              </button>
              <p className="text-center text-white/20 text-xs">Ctrl + Enter للإنشاء السريع</p>
            </div>

            {/* ─── Right: Results Column ─── */}
            <div className="lg:col-span-3 float-in-2">

              {/* Empty state */}
              {!variants.length && !loading && !error && (
                <div className="glass rounded-3xl flex flex-col items-center justify-center text-center p-10 h-full" style={{ minHeight: 380 }}>
                  <div className="text-7xl mb-4 opacity-20">✍️</div>
                  <p className="text-white/25 font-bold">أدخل موضوعك واضغط أنشئ</p>
                  <p className="text-white/15 text-sm mt-1">ستحصل على 3 نسخ مع تقييم الفايرل</p>
                </div>
              )}

              {/* Loading state */}
              {loading && (
                <div className="glass rounded-3xl flex flex-col items-center justify-center text-center p-10" style={{ minHeight: 380 }}>
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 rounded-full border border-purple-500/25 spin" />
                    <div className="absolute inset-2 rounded-full border border-blue-500/35" style={{ animation: "spin-slow 5s linear infinite reverse" }} />
                    <div className="absolute inset-4 rounded-full border border-pink-500/25 spin" style={{ animationDuration: "3s" }} />
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">✦</div>
                  </div>
                  <p className="font-black text-xl" style={{ color: "#a78bfa" }}>{loadLine}</p>
                  <p className="text-white/30 text-sm mt-1">يُبدع لك 3 نسخ فريدة...</p>
                </div>
              )}

              {/* Error state */}
              {error && !loading && (
                <div className="glass rounded-3xl p-8 text-center" style={{ minHeight: 200 }}>
                  <div className="text-4xl mb-3">⚠️</div>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Results */}
              {variants.length > 0 && !loading && (
                <div className="space-y-4 float-in">

                  {/* Variant tabs */}
                  <div className="grid grid-cols-3 gap-2">
                    {variants.map((v, i) => (
                      <button key={i} onClick={() => setActiveVar(i)}
                        className="relative py-3 rounded-2xl text-sm font-bold transition-all"
                        style={{
                          background: activeVar === i
                            ? "linear-gradient(135deg, rgba(124,58,237,0.5), rgba(79,70,229,0.45))"
                            : "rgba(255,255,255,0.04)",
                          border: activeVar === i
                            ? "1px solid rgba(139,92,246,0.65)"
                            : "1px solid rgba(255,255,255,0.07)",
                          color: activeVar === i ? "white" : "rgba(255,255,255,0.4)",
                          boxShadow: activeVar === i ? "0 0 20px rgba(124,58,237,0.25)" : "none",
                        }}>
                        <div>نسخة {i + 1}</div>
                        <div className="text-lg font-black leading-tight" style={{ color: scoreColor(v.viralScore) }}>
                          {v.viralScore}
                        </div>
                        {i === bestIdx && (
                          <div className="absolute -top-2 right-2 text-xs" title="الأفضل">⭐</div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Active variant card */}
                  {variants[activeVar] && (
                    <div className="glass rounded-3xl p-5 card-hover" style={{ border: "1px solid rgba(255,255,255,0.08)" }}>

                      {/* Card header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex flex-col gap-2">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold"
                            style={{ background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.35)", color: "#a78bfa" }}>
                            {variants[activeVar].style}
                          </span>
                          {activeVar === bestIdx && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                              style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)", color: "#4ade80" }}>
                              ⭐ الأفضل أداءً
                            </span>
                          )}
                        </div>
                        <ViralRing score={variants[activeVar].viralScore} size={76} />
                      </div>

                      {/* Content box */}
                      <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(0,0,0,0.35)", minHeight: 130 }}>
                        <pre className="text-white/90 text-sm leading-loose whitespace-pre-wrap font-sans text-right">
                          {variants[activeVar].content}
                        </pre>
                      </div>

                      {/* Tip */}
                      <div className="flex items-start gap-2.5 rounded-xl p-3 mb-4"
                        style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.18)" }}>
                        <span className="text-base shrink-0">💡</span>
                        <p className="text-yellow-200/75 text-xs leading-relaxed">{variants[activeVar].tip}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button onClick={() => copyContent(activeVar)}
                          className="relative flex-1 py-3 rounded-xl text-sm font-black transition-all overflow-hidden"
                          style={{
                            background: copiedIdx === activeVar
                              ? "linear-gradient(135deg, rgba(34,197,94,0.35), rgba(16,185,129,0.3))"
                              : "linear-gradient(135deg, rgba(124,58,237,0.55), rgba(79,70,229,0.5))",
                            border: copiedIdx === activeVar
                              ? "1px solid rgba(34,197,94,0.5)"
                              : "1px solid rgba(139,92,246,0.55)",
                            color: copiedIdx === activeVar ? "#4ade80" : "white",
                          }}>
                          {copiedIdx === activeVar && <Confetti trigger={confTrigger} />}
                          {copiedIdx === activeVar ? "✓ تم النسخ! 🎉" : "📋 نسخ المحتوى"}
                        </button>

                        {contentType === "instagram" && (
                          <button onClick={() => setShowPreview(true)}
                            className="px-4 py-3 rounded-xl text-sm transition-all glass-sm"
                            style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
                            title="معاينة على انستقرام">
                            👁️
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Regenerate */}
                  <button onClick={generate}
                    className="w-full py-3 rounded-2xl text-sm font-bold transition-all glass-sm"
                    style={{ border: "1px solid rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}>
                    ♻️ أعد الإنشاء بنسخ جديدة
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════ HISTORY TAB ══════════ */}
        {tab === "history" && (
          <div className="space-y-3 float-in">
            {history.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center">
                <div className="text-5xl mb-4 opacity-20">🕐</div>
                <p className="text-white/30">لم تنشئ أي محتوى بعد</p>
              </div>
            ) : history.map(item => (
              <div key={item.id}
                className="glass rounded-2xl p-4 card-hover cursor-pointer"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}
                onClick={() => {
                  setTopic(item.topic);
                  setContentType(item.contentType);
                  setDialect(item.dialect);
                  setVariants(item.variants);
                  setActiveVar(0);
                  setTab("create");
                }}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm truncate">{item.topic}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {CONTENT_TYPES.find(c => c.id === item.contentType)?.emoji}{" "}
                        {DIALECTS.find(d => d.id === item.dialect)?.label}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.15)" }}>•</span>
                      <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
                        {new Date(item.date).toLocaleDateString("ar-SA")}
                      </span>
                    </div>
                  </div>
                  {item.variants[0] && (
                    <div className="mr-2 text-xs px-2 py-1 rounded-full font-bold"
                      style={{
                        background: "rgba(139,92,246,0.15)",
                        border: "1px solid rgba(139,92,246,0.3)",
                        color: "#a78bfa",
                      }}>
                      🔥 {Math.max(...item.variants.map(v => v.viralScore))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══════════ ACHIEVEMENTS TAB ══════════ */}
        {tab === "achievements" && (
          <div className="float-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: "المحتوى",   value: total,              emoji: "📝" },
                { label: "سلسلة",    value: `${streak} يوم`,   emoji: "🔥" },
                { label: "المستوى",  value: level.title,        emoji: level.emoji },
                { label: "إنجازات",  value: `${unlocked.length}/${ACHIEVEMENTS.length}`, emoji: "🏆" },
              ].map(s => (
                <div key={s.label} className="glass rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <div className="text-xl font-black gradient-text">{s.value}</div>
                  <div className="text-xs text-white/35 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {ACHIEVEMENTS.map(a => {
                const done = unlocked.includes(a.id);
                return (
                  <div key={a.id} className="rounded-2xl p-4 transition-all"
                    style={{
                      background: done ? RARITY_COLORS[a.rarity] : "rgba(255,255,255,0.03)",
                      border: done ? `1px solid ${RARITY_BORDERS[a.rarity]}` : "1px solid rgba(255,255,255,0.06)",
                      filter: done ? "none" : "grayscale(1) opacity(0.4)",
                    }}>
                    <div className="text-3xl mb-2">{a.emoji}</div>
                    <div className="text-white font-bold text-sm">{a.title}</div>
                    <div className="text-white/40 text-xs mt-0.5">{a.desc}</div>
                    <div className="mt-2 text-xs font-bold" style={{
                      color: a.rarity === "legendary" ? "#fbbf24"
                           : a.rarity === "epic"      ? "#a78bfa"
                           : a.rarity === "rare"      ? "#60a5fa"
                           : "#6b7280",
                    }}>
                      {a.rarity === "legendary" ? "🌟 أسطوري" : a.rarity === "epic" ? "💎 ملحمي" : a.rarity === "rare" ? "✦ نادر" : "• عادي"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Bottom stats strip ── */}
        {tab === "create" && (
          <div className="mt-8 grid grid-cols-3 gap-3 float-in-3">
            {[
              { n: total,              label: "محتوى أُنشئ",       emoji: "📝" },
              { n: streak,             label: "يوم متتالي",        emoji: "🔥" },
              { n: unlocked.length,    label: "إنجاز مفتوح",      emoji: "🏆" },
            ].map(s => (
              <div key={s.label} className="glass rounded-2xl py-4 text-center">
                <div className="text-lg mb-0.5">{s.emoji}</div>
                <div className="text-2xl font-black gradient-text">{s.n}</div>
                <div className="text-white/30 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="relative z-10 text-center py-6 border-t border-white/5" style={{ color: "rgba(255,255,255,0.12)", fontSize: 12 }}>
        كاتب AI — صُنع بـ ❤️ للعالم العربي
      </footer>
    </div>
  );
}
