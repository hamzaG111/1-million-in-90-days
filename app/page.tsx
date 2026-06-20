"use client";

import { useState } from "react";

const contentTypes = [
  { id: "instagram", label: "انستقرام", emoji: "📸", desc: "كابشن + هاشتاقات" },
  { id: "tiktok", label: "تيك توك", emoji: "🎵", desc: "سكريبت 60 ثانية" },
  { id: "youtube", label: "يوتيوب", emoji: "▶️", desc: "سكريبت متكامل" },
  { id: "tweet", label: "تويتر X", emoji: "𝕏", desc: "تغريدة قوية" },
  { id: "reels", label: "ريلز", emoji: "🎬", desc: "فكرة + سكريبت" },
];

const dialects = [
  { id: "gulf", label: "خليجي", flag: "🇸🇦" },
  { id: "egyptian", label: "مصري", flag: "🇪🇬" },
  { id: "levantine", label: "شامي", flag: "🇱🇧" },
  { id: "msa", label: "فصحى", flag: "📖" },
];

const tones = [
  { id: "natural", label: "طبيعي", emoji: "😊" },
  { id: "funny", label: "مرح", emoji: "😂" },
  { id: "professional", label: "احترافي", emoji: "💼" },
  { id: "emotional", label: "مؤثر", emoji: "❤️" },
];

export default function Home() {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState("instagram");
  const [dialect, setDialect] = useState("gulf");
  const [tone, setTone] = useState("natural");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setResult("");
    setError("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, contentType, dialect, tone }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.result);
    } catch (e) {
      setError("حدث خطأ. تأكد من إعداد مفتاح API وحاول مجدداً.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #0a0a0f 0%, #0f0a1a 50%, #0a0f1a 100%)" }}>
      {/* Header */}
      <header className="border-b border-white/10 py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg pulse-glow"
              style={{ background: "linear-gradient(135deg, #a855f7, #6366f1)" }}
            >
              ✍️
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-none">كاتب AI</h1>
              <p className="text-xs text-purple-400">المحتوى العربي الذكي</p>
            </div>
          </div>
          <div className="text-xs text-white/40 hidden sm:block">🚀 أنشئ محتواك في ثوانٍ</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6 glass-card text-purple-300">
            <span>✨</span>
            <span>مدعوم بأحدث تقنيات الذكاء الاصطناعي</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            أنشئ محتوى{" "}
            <span className="gradient-text">سوشيال ميديا</span>
            <br />
            بالعربية في ثوانٍ
          </h2>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            أداة AI تفهم جمهورك العربي وتكتب بأسلوبه — انستقرام، تيك توك، يوتيوب وأكثر
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="space-y-5">
            {/* Topic */}
            <div className="glass-card rounded-2xl p-5">
              <label className="block text-sm font-semibold text-white/80 mb-3">💡 عن ماذا تريد تكتب؟</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="مثال: نصائح للتوفير في المصاريف الشهرية، وصفة شوربة عدس، تجربتي مع الرياضة الصباحية..."
                className="w-full rounded-xl px-4 py-3 text-white text-sm resize-none outline-none"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(168,85,247,0.3)",
                  minHeight: "100px",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) generate();
                }}
              />
            </div>

            {/* Content Type */}
            <div className="glass-card rounded-2xl p-5">
              <label className="block text-sm font-semibold text-white/80 mb-3">📱 نوع المحتوى</label>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {contentTypes.map((ct) => (
                  <button
                    key={ct.id}
                    onClick={() => setContentType(ct.id)}
                    className="rounded-xl p-3 text-center transition-all"
                    style={{
                      background:
                        contentType === ct.id
                          ? "linear-gradient(135deg, rgba(168,85,247,0.4), rgba(99,102,241,0.4))"
                          : "rgba(255,255,255,0.05)",
                      border:
                        contentType === ct.id
                          ? "1px solid rgba(168,85,247,0.7)"
                          : "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <div className="text-xl mb-1">{ct.emoji}</div>
                    <div className="text-xs font-bold text-white">{ct.label}</div>
                    <div className="text-xs text-white/40 mt-0.5 hidden sm:block">{ct.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dialect & Tone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-2xl p-5">
                <label className="block text-sm font-semibold text-white/80 mb-3">🗣️ اللهجة</label>
                <div className="space-y-2">
                  {dialects.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setDialect(d.id)}
                      className="w-full text-right rounded-lg px-3 py-2 text-sm transition-all flex items-center gap-2"
                      style={{
                        background:
                          dialect === d.id
                            ? "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(99,102,241,0.3))"
                            : "rgba(255,255,255,0.04)",
                        border: dialect === d.id ? "1px solid rgba(168,85,247,0.5)" : "1px solid transparent",
                        color: dialect === d.id ? "white" : "rgba(255,255,255,0.6)",
                      }}
                    >
                      <span>{d.flag}</span>
                      <span className="font-medium">{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5">
                <label className="block text-sm font-semibold text-white/80 mb-3">🎭 الأسلوب</label>
                <div className="space-y-2">
                  {tones.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className="w-full text-right rounded-lg px-3 py-2 text-sm transition-all flex items-center gap-2"
                      style={{
                        background:
                          tone === t.id
                            ? "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(99,102,241,0.3))"
                            : "rgba(255,255,255,0.04)",
                        border: tone === t.id ? "1px solid rgba(168,85,247,0.5)" : "1px solid transparent",
                        color: tone === t.id ? "white" : "rgba(255,255,255,0.6)",
                      }}
                    >
                      <span>{t.emoji}</span>
                      <span className="font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generate}
              disabled={loading || !topic.trim()}
              className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background:
                  loading || !topic.trim()
                    ? "rgba(168,85,247,0.3)"
                    : "linear-gradient(135deg, #a855f7, #6366f1, #3b82f6)",
                boxShadow: loading || !topic.trim() ? "none" : "0 0 30px rgba(168,85,247,0.5)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  جاري الكتابة...
                </span>
              ) : (
                "✨ أنشئ المحتوى"
              )}
            </button>
            <p className="text-center text-xs text-white/30">Ctrl + Enter للإنشاء السريع</p>
          </div>

          {/* Result Panel */}
          <div className="glass-card rounded-2xl p-5 flex flex-col" style={{ minHeight: "400px" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">📝 المحتوى الجاهز</h3>
              {result && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: copied ? "rgba(34,197,94,0.2)" : "rgba(168,85,247,0.2)",
                    border: copied ? "1px solid rgba(34,197,94,0.5)" : "1px solid rgba(168,85,247,0.4)",
                    color: copied ? "#4ade80" : "#c084fc",
                  }}
                >
                  {copied ? "✓ تم النسخ!" : "📋 نسخ"}
                </button>
              )}
            </div>

            <div
              className="flex-1 rounded-xl p-4 overflow-auto"
              style={{ background: "rgba(0,0,0,0.3)", minHeight: "300px" }}
            >
              {!result && !loading && !error && (
                <div className="h-full flex flex-col items-center justify-center text-center text-white/30">
                  <div className="text-5xl mb-4">✍️</div>
                  <p className="text-sm">اكتب موضوعك واضغط أنشئ</p>
                  <p className="text-xs mt-1">سيظهر المحتوى هنا</p>
                </div>
              )}
              {loading && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="text-4xl mb-4 animate-bounce">🤖</div>
                  <p className="text-purple-300 font-medium">يكتب لك الآن...</p>
                  <p className="text-white/40 text-sm mt-1">ثوانٍ وينتهي</p>
                </div>
              )}
              {error && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-3">⚠️</div>
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                </div>
              )}
              {result && !loading && (
                <pre className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap font-sans">{result}</pre>
              )}
            </div>

            {result && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setResult("");
                      setTopic("");
                    }}
                    className="flex-1 py-2 rounded-lg text-sm text-white/60 transition-all hover:text-white hover:bg-white/5"
                    style={{ border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    🔄 موضوع جديد
                  </button>
                  <button
                    onClick={generate}
                    className="flex-1 py-2 rounded-lg text-sm font-medium text-purple-300 transition-all"
                    style={{ border: "1px solid rgba(168,85,247,0.4)", background: "rgba(168,85,247,0.1)" }}
                  >
                    ♻️ أعد الكتابة
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-10 grid grid-cols-3 gap-4 text-center">
          {[
            { num: "5", label: "منصات مدعومة" },
            { num: "4", label: "لهجات عربية" },
            { num: "∞", label: "محتوى لا محدود" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-xl py-4">
              <div className="text-2xl font-bold gradient-text">{stat.num}</div>
              <div className="text-xs text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-8 text-white/20 text-sm">كاتب AI — محتوى عربي ذكي لكل منصة</footer>
    </div>
  );
}
