import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const contentTypePrompts: Record<string, string> = {
  instagram: "كابشن انستقرام جذاب مع ايموجي مناسبة وهاشتاقات",
  tiktok: "سكريبت فيديو تيك توك قصير وجذاب (30-60 ثانية) مع hook قوي في البداية",
  youtube: "سكريبت فيديو يوتيوب متكامل مع مقدمة وعرض وخاتمة وكول تو أكشن",
  tweet: "تغريدة قوية ومختصرة مع هاشتاقات مناسبة",
  reels: "فكرة ريلز إبداعية مع سكريبت قصير وكابشن",
};

const dialectPrompts: Record<string, string> = {
  gulf: "باللهجة الخليجية السعودية/الإماراتية الطبيعية والعصرية",
  egyptian: "باللهجة المصرية العامية الطبيعية",
  levantine: "باللهجة الشامية السورية/اللبنانية",
  msa: "بالعربية الفصحى المبسطة والحديثة",
};

export async function POST(req: NextRequest) {
  try {
    const { topic, contentType, dialect, tone } = await req.json();

    if (!topic || !contentType || !dialect) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const contentPrompt = contentTypePrompts[contentType] || contentTypePrompts.instagram;
    const dialectPrompt = dialectPrompts[dialect] || dialectPrompts.gulf;

    const systemPrompt = `أنت خبير في إنشاء المحتوى الرقمي للسوشيال ميديا العربية.
تفهم جيداً ما يتفاعل معه الجمهور العربي وتكتب بأسلوب ${tone === "funny" ? "مرح وخفيف الظل" : tone === "professional" ? "احترافي وموثوق" : tone === "emotional" ? "عاطفي ومؤثر" : "طبيعي وعفوي"}.
المحتوى الذي تكتبه ${dialectPrompt}.
تركز دائماً على الجودة والتفاعل والأصالة.`;

    const userPrompt = `اكتب ${contentPrompt} عن الموضوع التالي:
"${topic}"

المطلوب:
1. المحتوى الرئيسي
2. الهاشتاقات المناسبة (إذا كانت مناسبة للمنصة)
3. نصيحة سريعة لزيادة التفاعل مع هذا المحتوى

اكتب مباشرة بدون مقدمات أو شرح.`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    return NextResponse.json({ result: content.text });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}
