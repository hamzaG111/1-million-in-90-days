import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code?.trim()) {
      return NextResponse.json({ ok: false, error: "الكود مطلوب" });
    }

    const clean = code.trim().toUpperCase();

    const PRO_CODE      = (process.env.ACTIVATION_CODE_PRO      ?? "").toUpperCase();
    const BUSINESS_CODE = (process.env.ACTIVATION_CODE_BUSINESS ?? "").toUpperCase();

    if (PRO_CODE && clean === PRO_CODE) {
      return NextResponse.json({ ok: true, plan: "pro" });
    }

    if (BUSINESS_CODE && clean === BUSINESS_CODE) {
      return NextResponse.json({ ok: true, plan: "business" });
    }

    return NextResponse.json({ ok: false, error: "الكود غير صحيح" });
  } catch {
    return NextResponse.json({ ok: false, error: "خطأ في الخادم" }, { status: 500 });
  }
}
