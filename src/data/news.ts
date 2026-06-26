// ============================================================
// Mock 数据 — 新闻条目
// 后续接入 Supabase 时替换为数据库查询
// ============================================================

import { NewsItem } from "@/types";

export const newsItems: NewsItem[] = [
  {
    id: "news-001",
    sourceName: "Anthropic",
    sourceUrl: "https://www.anthropic.com",
    originalTitle: "Claude 4 Opus: A New Standard in Reasoning and Tool Use",
    titleZh: "Anthropic 发布 Claude 4 Opus：推理与工具使用能力达到新高度",
    summaryZh:
      "Anthropic 正式发布 Claude 4 Opus 模型，在复杂推理、代码生成和多步骤工具调用方面全面超越前代。新模型支持 200K 上下文窗口，在数学竞赛和编程基准测试中刷新多项记录。",
    opportunityZh:
      "Claude 4 的代码能力大幅提升，对程序员来说意味着可以用更少的 prompt 工程完成更复杂的开发任务。建议开发者尽快熟悉其 tool use 新特性，在自动化工作流中替代部分人工环节。",
    category: "llm",
    tags: ["Claude", "Anthropic", "推理", "工具使用"],
    importanceScore: 9,
    publishedAt: "2026-06-25T08:00:00Z",
    originalUrl: "https://www.anthropic.com/research/claude-4-opus",
  },
  {
    id: "news-002",
    sourceName: "OpenAI",
    sourceUrl: "https://openai.com",
    originalTitle: "GPT-5 Turbo Brings 10x Cost Reduction for Enterprise Workloads",
    titleZh: "OpenAI 推出 GPT-5 Turbo：企业级 AI 成本降低 90%",
    summaryZh:
      "OpenAI 发布 GPT-5 Turbo 版本，通过模型蒸馏和推理优化，将企业 API 调用成本降低至 GPT-4o 的十分之一。同时保持了大部分能力水平，特别在文本总结和分类任务上表现持平。",
    opportunityZh:
      "AI 调用成本断崖式下降，意味着更多中小企业可以负担得起大规模 AI 应用。如果你正在做 AI 相关的 SaaS 产品，现在是扩充功能、降低价格、抢占市场的好时机。",
    category: "llm",
    tags: ["GPT-5", "OpenAI", "成本优化", "企业"],
    importanceScore: 9,
    publishedAt: "2026-06-24T14:30:00Z",
    originalUrl: "https://openai.com/blog/gpt-5-turbo",
  },
  {
    id: "news-003",
    sourceName: "Google DeepMind",
    sourceUrl: "https://deepmind.google",
    originalTitle: "Gemini 3 Ultra Achieves Near-Human Performance on Scientific Benchmarks",
    titleZh: "DeepMind Gemini 3 Ultra 在科学基准测试中接近人类专家水平",
    summaryZh:
      "Google DeepMind 的 Gemini 3 Ultra 在物理、化学、生物学等科学推理基准测试中取得突破性成绩。模型在实验设计和假设验证方面表现出接近博士级研究人员的能力。",
    opportunityZh:
      "科研辅助 AI 正在成熟，科研人员和学生可以利用这类工具加速文献综述、实验设计和数据分析。对于做知识付费或教育内容创作的人来说，这是一个帮助受众理解复杂科学概念的好工具。",
    category: "llm",
    tags: ["Gemini", "Google", "科学", "研究"],
    importanceScore: 8,
    publishedAt: "2026-06-23T10:00:00Z",
    originalUrl: "https://deepmind.google/blog/gemini-3-ultra",
  },
  {
    id: "news-004",
    sourceName: "GitHub",
    sourceUrl: "https://github.blog",
    originalTitle: "GitHub Copilot X Now Supports Full-Stack App Generation from Natural Language",
    titleZh: "GitHub Copilot X 支持自然语言生成全栈应用",
    summaryZh:
      "GitHub 推出 Copilot X 重大更新，用户只需用自然语言描述应用需求，Copilot 即可自动生成包含前端、后端、数据库的完整应用代码。支持 Next.js、Python FastAPI、PostgreSQL 等主流技术栈。",
    opportunityZh:
      "全栈应用自动生成能力意味着产品原型开发周期将从几周缩短到几天甚至几小时。对于有想法但缺乏全栈能力的创业者或产品经理来说，这是一个巨大的机会窗口。尽快学习如何用自然语言精准描述产品需求，将成为一项核心技能。",
    category: "tools",
    tags: ["GitHub Copilot", "代码生成", "全栈", "开发工具"],
    importanceScore: 8,
    publishedAt: "2026-06-22T09:00:00Z",
    originalUrl: "https://github.blog/2026-06-22-copilot-x-fullstack",
  },
  {
    id: "news-005",
    sourceName: "欧盟委员会",
    sourceUrl: "https://commission.europa.eu",
    originalTitle: "EU AI Act: New Transparency Requirements for AI-Generated Content Take Effect",
    titleZh: "欧盟 AI 法案新规生效：AI 生成内容必须标注来源",
    summaryZh:
      "欧盟 AI 法案最新实施细则正式生效，要求所有在欧盟境内发布的 AI 生成图文视频内容必须打上可识别的来源标签。违规企业将面临全球年营收 4% 的罚款。大型社交平台需在 3 个月内完成合规改造。",
    opportunityZh:
      "AI 内容标识成为刚需，催生了新的合规 SaaS 市场。如果你熟悉内容水印、元数据追踪或区块链存证技术，可以考虑开发 AI 内容溯源工具。同时，做海外内容运营的人需要尽快了解合规要求。",
    category: "policy",
    tags: ["欧盟", "AI 法案", "监管", "内容标识"],
    importanceScore: 7,
    publishedAt: "2026-06-21T16:00:00Z",
    originalUrl: "https://commission.europa.eu/ai-act-transparency-2026",
  },
  {
    id: "news-006",
    sourceName: "Meta",
    sourceUrl: "https://ai.meta.com",
    originalTitle: "Meta Releases Llama 4 Open-Source Model Family with Vision and Coding Variants",
    titleZh: "Meta 发布 Llama 4 开源模型家族，包含视觉和编程专用版本",
    summaryZh:
      "Meta 推出 Llama 4 系列开源模型，涵盖 8B、70B 和 405B 三个参数规模，并首次推出专门针对视觉理解和代码生成的微调变体。模型采用 Apache 2.0 许可证，允许商业使用。",
    opportunityZh:
      "Llama 4 的开源策略让中小团队也能部署高质量的专用 AI 模型。建议关注视觉和编程两个方向的微调版本，它们可能在特定场景下比通用模型更高效。开源的商业模式也让私有部署变得可行。",
    category: "opensource",
    tags: ["Llama 4", "Meta", "开源", "视觉", "编程"],
    importanceScore: 8,
    publishedAt: "2026-06-20T12:00:00Z",
    originalUrl: "https://ai.meta.com/blog/llama-4",
  },
  {
    id: "news-007",
    sourceName: "NVIDIA",
    sourceUrl: "https://www.nvidia.com",
    originalTitle: "NVIDIA Blackwell Ultra GPU Starts Shipping, Doubles AI Inference Throughput",
    titleZh: "NVIDIA Blackwell Ultra GPU 开始发货，AI 推理吞吐量翻倍",
    summaryZh:
      "NVIDIA 宣布 Blackwell Ultra GPU 正式出货，相比上一代 Hopper 架构，AI 推理吞吐量提升 2 倍，能效比提升 1.5 倍。首批客户包括微软、谷歌和亚马逊等云服务商。",
    opportunityZh:
      "AI 推理成本的持续下降意味着更多实时 AI 应用成为可能。如果你在做需要低延迟响应的 AI 产品（如语音助手、实时翻译），硬件的代际升级将在未来半年内显著改善用户体验和运营成本。",
    category: "hardware",
    tags: ["NVIDIA", "GPU", "Blackwell", "推理"],
    importanceScore: 7,
    publishedAt: "2026-06-19T08:00:00Z",
    originalUrl: "https://www.nvidia.com/en-us/data-center/blackwell-ultra",
  },
  {
    id: "news-008",
    sourceName: "Tesla",
    sourceUrl: "https://www.tesla.com",
    originalTitle: "Tesla Optimus Gen-3 Robots Begin Trials in Logistics Warehouses",
    titleZh: "特斯拉 Optimus 第三代机器人开始在物流仓库试点",
    summaryZh:
      "特斯拉宣布 Optimus Gen-3 人形机器人开始在合作物流企业的仓库中试点运行，主要执行分拣、搬运和包装任务。机器人在重复性体力劳动中的效率已达到人类工人的 80%，但可 24 小时连续工作。",
    opportunityZh:
      "仓储物流的自动化正在加速，这对物流从业者意味着需要向机器人运维和管理方向转型。同时，机器人维修、编程和优化将成为新的技能需求。对于普通人来说，关注机器人无法替代的能力（如异常处理、客户沟通）是长期竞争力所在。",
    category: "hardware",
    tags: ["Tesla", "Optimus", "机器人", "物流", "自动化"],
    importanceScore: 7,
    publishedAt: "2026-06-18T10:00:00Z",
    originalUrl: "https://www.tesla.com/optimus-gen3",
  },
  {
    id: "news-009",
    sourceName: "Microsoft Research",
    sourceUrl: "https://www.microsoft.com/en-us/research",
    originalTitle: "Project Aurora: AI-Driven Drug Discovery Identifies Promising Cancer Treatment in 45 Days",
    titleZh: "微软 AI 药物发现项目在 45 天内找到有前景的癌症治疗方案",
    summaryZh:
      "微软研究院的 Aurora 项目利用 AI 模型在 45 天内完成从靶点识别到先导化合物优化的全过程，而传统方法需要 3-5 年。该候选药物已进入临床前研究阶段，针对一种罕见肺癌。",
    opportunityZh:
      "AI 制药正在从概念验证走向实际产出，这意味着医药行业的研发效率将大幅提升。对于普通人来说，更重要的是关注 AI 对医疗诊断和健康管理的改善——未来几年 AI 辅助看诊和个性化健康建议将成为常态。",
    category: "industry",
    tags: ["AI 制药", "医疗", "药物发现", "微软"],
    importanceScore: 7,
    publishedAt: "2026-06-17T09:00:00Z",
    originalUrl: "https://www.microsoft.com/en-us/research/project-aurora",
  },
  {
    id: "news-010",
    sourceName: "Stanford HAI",
    sourceUrl: "https://hai.stanford.edu",
    originalTitle: "2026 AI Index Report: Open-Source Models Close the Gap with Proprietary Systems",
    titleZh: "斯坦福 2026 AI 指数报告：开源模型与闭源系统差距显著缩小",
    summaryZh:
      "斯坦福 HAI 发布 2026 年度 AI 指数报告，指出开源模型在 MMLU、HumanEval 等基准上的得分已达到闭源模型的 92%，较 2025 年提升 15 个百分点。报告还指出中国在 AI 论文数量和专利申请上保持全球领先。",
    opportunityZh:
      "开源模型的追赶意味着 AI 技术不再是少数巨头的专利。创业者可以利用开源模型构建垂直行业的 AI 应用，而不必担心被上游供应商锁定。关注特定行业的痛点和数据壁垒，比追求通用 AI 能力更有商业价值。",
    category: "research",
    tags: ["AI 指数", "斯坦福", "开源", "报告", "基准测试"],
    importanceScore: 8,
    publishedAt: "2026-06-16T14:00:00Z",
    originalUrl: "https://hai.stanford.edu/ai-index-2026",
  },
  {
    id: "news-011",
    sourceName: "Figma",
    sourceUrl: "https://www.figma.com",
    originalTitle: "Figma AI 2.0: Design-to-Code Now Generates Production-Ready React Components",
    titleZh: "Figma AI 2.0 上线：设计稿直接生成生产级 React 组件代码",
    summaryZh:
      "Figma 发布 AI 2.0 更新，设计转代码功能全面升级，可直接生成符合项目编码规范的生产级 React 组件。支持 Tailwind CSS、CSS Modules 等多种样式方案，并与 GitHub Copilot 深度集成。",
    opportunityZh:
      "设计到代码的鸿沟正在消失，UI 设计师和前端开发者的工作边界将越来越模糊。设计师学习基础编程、开发者学习设计思维，将成为提升个人竞争力的有效路径。",
    category: "tools",
    tags: ["Figma", "设计转代码", "React", "UI"],
    importanceScore: 6,
    publishedAt: "2026-06-15T11:00:00Z",
    originalUrl: "https://www.figma.com/blog/figma-ai-2-0",
  },
  {
    id: "news-012",
    sourceName: "中国信通院",
    sourceUrl: "https://www.caict.ac.cn",
    originalTitle: "中国发布《生成式 AI 服务安全基本要求》修订版",
    titleZh: "中国信通院发布生成式 AI 安全新标准，强化内容审核要求",
    summaryZh:
      "中国信通院发布《生成式 AI 服务安全基本要求》修订版，新增对 AI 生成内容的实时审核要求，并要求服务提供商建立完善的用户投诉和内容追溯机制。新标准将于 2026 年 9 月 1 日起实施。",
    opportunityZh:
      "AI 内容安全审核成为合规刚需。如果你具备 NLP 或内容风控相关背景，可以关注 AI 安全审核工具的开发机会。同时，在国内做 AI 应用的团队需要尽快了解新标准的具体要求。",
    category: "policy",
    tags: ["中国", "安全标准", "内容审核", "合规"],
    importanceScore: 7,
    publishedAt: "2026-06-14T08:00:00Z",
    originalUrl: "https://www.caict.ac.cn/ai-safety-2026",
  },
];

export function getNewsById(id: string): NewsItem | undefined {
  return newsItems.find((n) => n.id === id);
}

export function getNewsByCategory(slug: string): NewsItem[] {
  return newsItems.filter((n) => n.category === slug);
}

export function getTopNews(limit: number = 5): NewsItem[] {
  return [...newsItems]
    .sort((a, b) => b.importanceScore - a.importanceScore)
    .slice(0, limit);
}

export function getRecentNews(limit?: number): NewsItem[] {
  return [...newsItems]
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, limit);
}

export function getNewsCount(): number {
  return newsItems.length;
}
