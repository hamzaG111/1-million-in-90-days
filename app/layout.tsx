import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "كاتب AI | أداة المحتوى العربي الذكية",
  description: "أنشئ محتوى سوشيال ميديا احترافي بالعربية في ثوانٍ باستخدام الذكاء الاصطناعي",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
