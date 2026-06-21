import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#050508" }}>
      <div className="fixed inset-0 pointer-events-none grid-bg">
        <div style={{
          position: "absolute", width: 500, height: 500, top: "10%", left: "50%",
          transform: "translateX(-50%)",
          background: "radial-gradient(circle, rgba(34,197,94,0.2) 0%, transparent 65%)",
          filter: "blur(2px)",
        }} />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center float-in">
        <div className="glass rounded-3xl p-10" style={{ border: "1px solid rgba(34,197,94,0.3)", boxShadow: "0 0 60px rgba(34,197,94,0.1)" }}>
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-white font-black text-3xl mb-3">مبروك! تم الاشتراك</h1>
          <p className="text-white/50 mb-8 leading-relaxed">
            شكراً لاشتراكك في كاتب AI. ستصلك رسالة بريد إلكتروني تحتوي على كود التفعيل خلال دقائق.
          </p>

          <div className="glass rounded-2xl p-5 mb-8 text-right"
            style={{ border: "1px solid rgba(34,197,94,0.2)", background: "rgba(34,197,94,0.05)" }}>
            <p className="text-white/60 text-sm font-bold mb-3">خطوات التفعيل:</p>
            <ol className="space-y-2 text-sm">
              {[
                "افتح البريد الإلكتروني المُرسل إليك من Stripe",
                "انسخ كود التفعيل من الرسالة",
                "ارجع للتطبيق واضغط على زر Upgrade",
                "الصق الكود واضغط تفعيل",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-white/60">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: "rgba(34,197,94,0.2)", color: "#4ade80", marginTop: 1 }}>
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <Link href="/create"
            className="block w-full py-4 rounded-2xl font-black text-white text-base transition-all btn-glow">
            افتح التطبيق ←
          </Link>

          <p className="text-white/25 text-xs mt-4">
            لم تصلك الرسالة؟ تحقق من مجلد Spam أو{" "}
            <a href="mailto:support@katibai.com" className="text-purple-400 hover:underline">
              تواصل معنا
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
