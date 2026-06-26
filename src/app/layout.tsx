import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "全球 AI 快讯｜每日 AI 新闻、趋势与机会解读",
  description:
    "追踪全球 AI 新闻、模型动态、AI 工具、行业应用与政策变化，用中文摘要和机会解读帮助普通人、创业者和开发者看懂 AI 变化。",
  keywords: [
    "AI新闻",
    "人工智能",
    "AI日报",
    "大模型",
    "AI工具",
    "OpenAI",
    "Claude",
    "DeepSeek",
    "科技趋势",
    "创业机会",
  ],
  openGraph: {
    title: "全球 AI 快讯｜每日 AI 新闻、趋势与机会解读",
    description:
      "追踪全球 AI 新闻、模型动态、AI 工具、行业应用与政策变化，用中文摘要和机会解读帮助普通人、创业者和开发者看懂 AI 变化。",
    siteName: "全球 AI 快讯",
    locale: "zh_CN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#080c14]">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
