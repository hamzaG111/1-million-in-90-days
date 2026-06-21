import Link from "next/link";

/* ── Static data ── */
const FEATURES = [
  {
    emoji: "⚡",
    title: "3 نسخ في ثوانٍ",
    desc: "كل توليد يعطيك 3 نسخ مختلفة تماماً مع تقييم فايرل لكل نسخة",
    color: "#a78bfa",
  },
  {
    emoji: "🎯",
    title: "5 منصات × 4 لهجات",
    desc: "انستقرام، تيك توك، يوتيوب، تويتر، ريلز — بالخليجي، المصري، الشامي، والفصحى",
    color: "#60a5fa",
  },
  {
    emoji: "🔥",
    title: "يفهم جمهورك",
    desc: "محتوى يتكلم بلغة جمهورك العربي — مش ترجمة آلية، كتابة ذكية حقيقية",
    color: "#f472b6",
  },
  {
    emoji: "📊",
    title: "تقييم الفايرل",
    desc: "كل نسخة تحصل على نقطة فايرل من 0–100 حتى تعرف أيها يفجّر التفاعل",
    color: "#34d399",
  },
  {
    emoji: "💾",
    title: "سجل كامل",
    desc: "كل ما كتبته محفوظ — ارجع إليه متى أردت وأعد توليده بنقرة واحدة",
    color: "#fbbf24",
  },
  {
    emoji: "🏆",
    title: "نظام المكافآت",
    desc: "إنجازات، مستويات، وسلاسل يومية تجعل إنشاء المحتوى تجربة ممتعة",
    color: "#fb923c",
  },
];

const STEPS = [
  { n: "١", title: "اكتب الموضوع", desc: "جملة أو كلمتان تصف ما تريد نشره" },
  { n: "٢", title: "اختر المنصة واللهجة", desc: "انستقرام خليجي؟ تيك توك مصري؟ أنت تقرر" },
  { n: "٣", title: "احصل على 3 نسخ جاهزة", desc: "انسخ، الصق، انشر — في ثوانٍ" },
];

const PLANS = [
  {
    name: "مجاني",
    price: "$0",
    period: "",
    desc: "ابدأ بدون بطاقة",
    color: "#6b7280",
    features: ["10 توليدات مجانية", "3 منصات", "لهجتان", "نظام المكافآت"],
    cta: "ابدأ مجاناً",
    href: "/create",
    recommended: false,
  },
  {
    name: "برو",
    price: "$19",
    period: "/شهر",
    desc: "للمنشئين الجادين",
    color: "#7c3aed",
    features: ["توليدات غير محدودة", "5 منصات", "4 لهجات", "أولوية السرعة", "سجل غير محدود", "دعم بريدي"],
    cta: "اشترك في برو",
    href: process.env.NEXT_PUBLIC_STRIPE_PRO_LINK ?? "/create",
    recommended: true,
  },
  {
    name: "بيزنس",
    price: "$49",
    period: "/شهر",
    desc: "للفرق والوكالات",
    color: "#f59e0b",
    features: ["كل مزايا برو", "5 حسابات", "API access", "تقارير أسبوعية", "دعم واتساب مباشر"],
    cta: "اشترك في بيزنس",
    href: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_LINK ?? "/create",
    recommended: false,
  },
];

const FAQS = [
  { q: "هل أحتاج بطاقة بنكية للبدء؟", a: "لا. الخطة المجانية تشمل 10 توليدات كاملة بدون أي بطاقة." },
  { q: "هل المحتوى باللهجة العامية حقاً؟", a: "نعم! النموذج يكتب بالخليجي الطبيعي (مو فصحى)، مصري، شامي، أو فصحى مبسطة — أنت تختار." },
  { q: "ما الفرق بين النسخ الثلاث؟", a: "كل نسخة مختلفة تماماً في البناء والأسلوب: عاطفية، مباشرة، إبداعية. اختر الأنسب لجمهورك." },
  { q: "هل يمكن الإلغاء في أي وقت؟", a: "طبعاً. ألغِ اشتراكك في أي لحظة من لوحة التحكم — بدون رسوم إضافية." },
];

/* ── Components ── */
function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5"
      style={{ background: "rgba(5,5,8,0.85)", backdropFilter: "blur(20px)" }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
            boxShadow: "0 0 16px rgba(124,58,237,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
          }}>✍️</div>
          <span className="text-white font-black text-base tracking-tight">كاتب AI</span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/create"
            className="text-white/50 text-sm hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
            تسجيل دخول
          </Link>
          <Link href="/create"
            className="text-white text-sm font-bold px-4 py-2 rounded-xl transition-all"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 16px rgba(124,58,237,0.4)" }}>
            ابدأ مجاناً ←
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ── Page ── */
export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: "#050508" }}>
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden grid-bg">
        {[
          { c: "#7c3aed", t: "-15%", r: "-10%", s: 600, sp: "10s", d: "0s"  },
          { c: "#2563eb", t: "55%",  l: "-8%",  s: 500, sp: "14s", d: "3s"  },
          { c: "#ec4899", t: "25%",  r: "25%",  s: 360, sp: "18s", d: "6s"  },
        ].map((b, i) => (
          <div key={i} style={{
            position: "absolute",
            width: b.s, height: b.s,
            top: b.t, right: b.r, left: b.l,
            background: `radial-gradient(circle, ${b.c}45 0%, transparent 65%)`,
            animation: `blob ${b.sp} ${b.d} ease-in-out infinite`,
            filter: "blur(2px)",
          }} />
        ))}
      </div>

      <Nav />

      {/* ── HERO ── */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs mb-8 glass-sm"
          style={{ border: "1px solid rgba(139,92,246,0.4)", color: "#a78bfa" }}>
          <span className="spin" style={{ display: "inline-block", fontSize: 12 }}>✦</span>
          <span>مدعوم بأحدث نماذج Claude AI</span>
        </div>

        <h1 className="font-black text-white leading-[1.05] mb-6 max-w-4xl mx-auto"
          style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}>
          محتوى عربي يُشعل{" "}
          <span className="gradient-text-live">السوشيال ميديا</span>
          <br />في ثوانٍ
        </h1>

        <p className="text-white/50 max-w-xl mx-auto mb-10 leading-relaxed"
          style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>
          أكتر أداة AI فهماً للجمهور العربي — تكتب بلهجتك، لمنصتك،
          بالأسلوب الذي يُجنّن التفاعل.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-16">
          <Link href="/create"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-white text-base transition-all btn-glow"
            style={{ minWidth: 200 }}>
            ابدأ مجاناً — بدون بطاقة ✦
          </Link>
          <a href="#pricing"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white/60 text-base transition-all glass-sm hover:text-white"
            style={{ border: "1px solid rgba(255,255,255,0.1)", minWidth: 200 }}>
            شاهد الأسعار
          </a>
        </div>

        {/* Stats ticker */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {[
            { n: "10,000+", label: "قطعة محتوى أُنشئت" },
            { n: "4",       label: "لهجات عربية" },
            { n: "5",       label: "منصات مدعومة" },
            { n: "< 5ث",   label: "سرعة التوليد" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black gradient-text">{s.n}</div>
              <div className="text-white/30 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-3">
              لماذا <span className="gradient-text">كاتب AI؟</span>
            </h2>
            <p className="text-white/40">كل ما تحتاجه لتُهيمن على السوشيال ميديا العربية</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="glass rounded-2xl p-6 card-hover"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-4xl mb-4"
                  style={{ filter: `drop-shadow(0 0 12px ${f.color})` }}>
                  {f.emoji}
                </div>
                <h3 className="text-white font-black text-lg mb-2">{f.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-3">
              كيف <span className="gradient-text">يعمل؟</span>
            </h2>
            <p className="text-white/40">ثلاث خطوات وخلاص</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.n} className="text-center">
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute" style={{ /* arrow */ }} />
                )}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-4"
                  style={{
                    background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(79,70,229,0.35))",
                    border: "1px solid rgba(139,92,246,0.45)",
                    color: "#a78bfa",
                    boxShadow: "0 0 20px rgba(124,58,237,0.25)",
                  }}>
                  {s.n}
                </div>
                <h3 className="text-white font-black text-lg mb-2">{s.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-3">
              أسعار <span className="gradient-text">شفافة</span>
            </h2>
            <p className="text-white/40">ابدأ مجاناً — ادفع فقط عندما تحتاج أكثر</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {PLANS.map(plan => (
              <div key={plan.name} className="rounded-3xl p-6 flex flex-col relative overflow-hidden"
                style={{
                  background: plan.recommended
                    ? `linear-gradient(135deg, rgba(124,58,237,0.25), rgba(79,70,229,0.2))`
                    : "rgba(255,255,255,0.04)",
                  border: plan.recommended
                    ? `1px solid rgba(139,92,246,0.6)`
                    : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: plan.recommended ? "0 0 40px rgba(124,58,237,0.2)" : "none",
                }}>

                {plan.recommended && (
                  <div className="absolute top-4 left-4 text-xs px-2.5 py-1 rounded-full font-black"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white" }}>
                    ⭐ الأكثر شيوعاً
                  </div>
                )}

                <div className="mt-2 mb-4">
                  <div className="text-white font-black text-xl mb-1">{plan.name}</div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-black text-white" style={{ fontSize: "2.5rem", lineHeight: 1, color: plan.color }}>{plan.price}</span>
                    {plan.period && <span className="text-white/40 text-sm mb-1">{plan.period}</span>}
                  </div>
                  <div className="text-white/40 text-sm">{plan.desc}</div>
                </div>

                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <span style={{ color: plan.color, flexShrink: 0 }}>✓</span>
                      <span className="text-white/75">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}
                  className="block w-full py-3 rounded-xl text-center font-black text-sm transition-all"
                  style={plan.recommended ? {
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                    color: "white",
                    boxShadow: "0 0 20px rgba(124,58,237,0.4)",
                  } : {
                    background: "rgba(255,255,255,0.06)",
                    border: `1px solid rgba(255,255,255,0.12)`,
                    color: "rgba(255,255,255,0.7)",
                  }}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              أسئلة <span className="gradient-text">شائعة</span>
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map(f => (
              <div key={f.q} className="glass rounded-2xl p-5"
                style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-white font-bold mb-2">{f.q}</div>
                <div className="text-white/50 text-sm leading-relaxed">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-3xl p-12"
            style={{ border: "1px solid rgba(139,92,246,0.3)", boxShadow: "0 0 60px rgba(124,58,237,0.15)" }}>
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
              جاهز تُشعل{" "}
              <span className="gradient-text-live">سوشيال ميديا</span> العرب؟
            </h2>
            <p className="text-white/40 mb-8">10 توليدات مجانية — بدون بطاقة — الآن</p>
            <Link href="/create"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-white text-lg transition-all btn-glow">
              ابدأ مجاناً الآن ✦
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-4 text-center"
        style={{ color: "rgba(255,255,255,0.2)", fontSize: 13 }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>كاتب AI © 2025 — صُنع بـ ❤️ للعالم العربي</span>
          <div className="flex gap-5">
            {["الخصوصية", "الشروط", "التواصل"].map(l => (
              <a key={l} href="#" className="hover:text-white/50 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
