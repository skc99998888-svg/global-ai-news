// ============================================================
// Mock 数据 — 新闻分类
// 后续接入 Supabase 时替换为数据库查询
// ============================================================

import { Category } from "@/types";

export const categories: Category[] = [
  {
    name: "大模型",
    slug: "llm",
    description: "GPT、Claude、Gemini 等基础大模型的最新进展与能力对比",
  },
  {
    name: "AI 工具",
    slug: "tools",
    description: "AI 编程、设计、写作、视频等生产力工具的新品与更新",
  },
  {
    name: "行业应用",
    slug: "industry",
    description: "AI 在医疗、教育、金融、制造等行业的落地案例",
  },
  {
    name: "政策治理",
    slug: "policy",
    description: "全球 AI 监管政策、法律法规、伦理治理动态",
  },
  {
    name: "开源动态",
    slug: "opensource",
    description: "开源模型、框架、数据集与社区重要动态",
  },
  {
    name: "AI 硬件",
    slug: "hardware",
    description: "AI 芯片、服务器、端侧设备与机器人硬件进展",
  },
  {
    name: "研究前沿",
    slug: "research",
    description: "重要论文、技术突破、新架构与新范式",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
