import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CONTENT_DESCS: Record<string, string> = {
  instagram: "كابشن انستقرام جذاب مع ايموجي مناسبة وهاشتاقات في السطر الأخير",
  tiktok: "سكريبت تيك توك (30-60 ثانية) يبدأ بـ hook صادم ويختم بـ CTA قوي",
  youtube: "سكريبت يوتيوب متكامل: مقدمة hook، محتوى، خاتمة مع اشترك",
  tweet: "تغريدة مؤثرة ومختصرة بأقل من 280 حرف مع هاشتاقات",
  reels: "فكرة ريلز إبداعية مع سكريبت مختصر وكابشن وهاشتاقات",
};

const DIALECT_DESCS: Record<string, string> = {
  gulf: "باللهجة الخليجية السعودية العصرية الطبيعية (مو فصحى)",
  egyptian: "باللهجة المصرية العامية الطبيعية",
  levantine: "باللهجة الشامية اللبنانية/السورية الطبيعية",
  msa: "بالعربية الفصحى المبسطة والحديثة",
};

const TONE_LABELS: Record<string, string> = {
  natural: "طبيعي وعفوي",
  funny: "مرح وخفيف الظل مع فكاهة ذكية",
  professional: "احترافي وموثوق",
  emotional: "عاطفي ومؤثر يلمس القلب",
};

export async function POST(req: NextRequest) {
  try {
    const { topic, contentType, dialect, tone } = await req.json();

    if (!topic?.trim()) {
      return NextResponse.json({ error: "الموضوع مطلوب" }, { status: 400 });
    }

    const contentDesc = CONTENT_DESCS[contentType] ?? CONTENT_DESCS.instagram;
    const dialectDesc = DIALECT_DESCS[dialect] ?? DIALECT_DESCS.gulf;
    const toneLabel = TONE_LABELS[tone] ?? TONE_LABELS.natural;

    const systemPrompt = `أنت خبير محتوى رقمي عربي محترف. تكتب محتوى يُشعل التفاعل ويُجنن الجمهور.
أسلوبك: ${toneLabel}.
اللهجة: ${dialectDesc}.
قاعدة: أعد JSON فقط — بدون أي نص قبله أو بعده، بدون \`\`\`json.`;

    const userPrompt = `أنشئ 3 نسخ مختلفة تماماً من ${contentDesc} عن: "${topic.trim()}"

أعد JSON بالشكل التالي بالضبط:
{
  "variants": [
    {
      "content": "النص الكامل هنا",
      "viralScore": 91,
      "style": "عاطفي وشخصي",
      "tip": "نصيحة واحدة قصيرة لزيادة التفاعل مع هذه النسخة"
    },
    {
      "content": "...",
      "viralScore": 84,
      "style": "مباشر وصادم",
      "tip": "..."
    },
    {
      "content": "...",
      "viralScore": 77,
      "style": "إبداعي وغير متوقع",
      "tip": "..."
    }
  ]
}

القواعد:
- النسخ الثلاث مختلفة تماماً في البناء والأسلوب
- viralScore بين 65–97 بناءً على قوة الهوك والعاطفة والمشاركة المتوقعة
- كل نسخة تبدأ بجملة hook مختلفة
- الهاشتاقات فقط في نهاية المحتوى (للانستقرام والريلز والتيك توك)`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const clean = raw.replace(/```json\s?|\s?```/g, "").trim();
    const data = JSON.parse(clean);

    return NextResponse.json(data);
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json({ error: "فشل الإنشاء. حاول مجدداً." }, { status: 500 });
  }
}
