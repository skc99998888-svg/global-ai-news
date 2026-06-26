// ============================================================
// Mock 数据 — 每日 AI 日报
// 后续接入 Supabase 时替换为数据库查询
// ============================================================

import { DailyReport } from "@/types";

export const dailyReports: DailyReport[] = [
  {
    id: "daily-001",
    date: "2026-06-25",
    title: "Claude 4 与 GPT-5 同台竞技，开源生态持续繁荣",
    summary:
      "今日 AI 领域两大旗舰模型相继发布重要更新，Anthropic 推出 Claude 4 Opus，OpenAI 发布 GPT-5 Turbo。与此同时，开源社区也在快速追赶，AI 工具生态日益成熟。",
    topNewsIds: ["news-001", "news-002"],
    trendAnalysis:
      "## 今日趋势\n\n1. **旗舰模型迭代加速**：Claude 4 和 GPT-5 Turbo 的发布标志着基础模型竞争进入新阶段，推理能力和成本控制成为核心竞争维度。\n\n2. **开源与闭源差距缩小**：随着 Llama 4 等开源模型的发布，开源生态正在快速追赶闭源模型的能力水平。\n\n3. **AI 应用层爆发前夜**：底层模型成本下降和能力提升，正在为应用层的创新扫清障碍。\n\n## 值得关注的信号\n\n- 多家创业公司开始基于 Claude 4 构建复杂推理 Agent\n- GPT-5 Turbo 的企业 API 调用量在发布首日即翻倍\n- 开源社区对 Llama 4 的微调项目数量快速增长",
    opportunityAnalysis:
      "## 对普通人的机会\n\n1. **学习成本降低**：更强的模型意味着更少的 prompt 工程技巧就能获得好的结果，非技术背景的人也能高效使用 AI。\n\n2. **创业窗口期**：基础模型能力趋于稳定、成本快速下降，做垂直领域 AI 应用的条件已经成熟。\n\n3. **技能转型信号**：重复性的文本处理、数据整理工作将被 AI 大量替代，建议向创意策划、策略制定、人际沟通等方向提升。",
    content:
      "# 全球 AI 快讯 · 日报\n\n**日期**：2026 年 6 月 25 日\n\n---\n\n## 头条新闻\n\n### Anthropic 发布 Claude 4 Opus\n\nAnthropic 正式发布 Claude 4 Opus 模型，在复杂推理、代码生成和多步骤工具调用方面全面超越前代。新模型支持 200K 上下文窗口。\n\n**关键细节**：\n- 数学竞赛基准刷新多项记录\n- 编程能力大幅提升\n- Tool use 机制全面改进\n\n### OpenAI 推出 GPT-5 Turbo\n\nOpenAI 发布 GPT-5 Turbo，将企业 API 调用成本降低至 GPT-4o 的十分之一。\n\n**关键细节**：\n- 文本总结和分类任务表现持平\n- 适合大规模企业部署\n- 推理速度提升 3 倍\n\n---\n\n## 今日速览\n\n- GitHub Copilot X 支持自然语言生成全栈应用\n- Figma AI 2.0 设计转代码功能升级\n- 欧盟 AI 法案内容标注新规正式生效\n- NVIDIA Blackwell Ultra GPU 开始出货\n\n---\n\n> 以上内容由 全球 AI 快讯 自动采集与生成，仅供参考。",
  },
  {
    id: "daily-002",
    date: "2026-06-24",
    title: "欧盟 AI 法案落地，全球监管格局加速形成",
    summary:
      "欧盟 AI 法案实施细则正式生效，中国也发布 AI 安全新标准。全球 AI 监管框架正在快速成型，这对 AI 产业的发展方向将产生深远影响。",
    topNewsIds: ["news-005", "news-012"],
    trendAnalysis:
      "## 今日趋势\n\n1. **全球 AI 监管趋同**：欧盟和中国几乎同时推出 AI 内容监管新规，美国和日本也在加速相关立法。\n\n2. **合规成为竞争优势**：能够快速适应监管要求的企业将在国际市场上获得先发优势。\n\n3. **AI 标识技术需求激增**：内容溯源和 AI 生成标识技术成为新的创业热点。",
    opportunityAnalysis:
      "## 对普通人的机会\n\n1. **合规咨询需求增长**：企业需要大量 AI 合规方面的人才，相关培训和认证值得关注。\n\n2. **内容创作规范化**：AI 辅助创作需要标注来源，这反而增加了人工策划和原创内容的价值。\n\n3. **技术工具市场**：AI 内容检测、水印、溯源等工具的市场需求快速增长。",
    content:
      "# 全球 AI 快讯 · 日报\n\n**日期**：2026 年 6 月 24 日\n\n---\n\n## 头条新闻\n\n### 欧盟 AI 法案新规生效\n\n欧盟要求所有 AI 生成内容必须标注来源，违规罚款最高达全球年营收 4%。\n\n### 中国发布 AI 安全新标准\n\n中国信通院修订生成式 AI 安全标准，强化内容审核和追溯要求。\n\n---\n\n> 以上内容由 全球 AI 快讯 自动采集与生成，仅供参考。",
  },
  {
    id: "daily-003",
    date: "2026-06-23",
    title: "AI 硬件突破：NVIDIA 新 GPU 与特斯拉机器人同步推进",
    summary:
      "NVIDIA Blackwell Ultra 开始发货，特斯拉 Optimus Gen-3 进入仓库试点。AI 从软件走向物理世界的步伐正在加快。",
    topNewsIds: ["news-007", "news-008"],
    trendAnalysis:
      "## 今日趋势\n\n1. **AI 推理成本持续下降**：新一代 GPU 的部署将显著降低实时 AI 应用的运营成本。\n\n2. **具身智能从实验室走向产业**：人形机器人开始在物流等垂直场景中落地。\n\n3. **边缘 AI 加速发展**：硬件性能提升推动更多 AI 能力部署到终端设备。",
    opportunityAnalysis:
      "## 对普通人的机会\n\n1. **机器人运维新职业**：随着机器人部署规模扩大，运维、编程和优化人才需求将快速增长。\n\n2. **边缘 AI 应用开发**：端侧 AI 能力增强为移动应用开发者带来新的创新空间。\n\n3. **物流行业转型**：物流从业者应关注自动化和机器人技术的发展方向。",
    content:
      "# 全球 AI 快讯 · 日报\n\n**日期**：2026 年 6 月 23 日\n\n---\n\n## 头条新闻\n\n### NVIDIA Blackwell Ultra 出货\n\n新一代 GPU AI 推理吞吐量翻倍，首批客户包括微软、谷歌、亚马逊。\n\n### 特斯拉 Optimus Gen-3 试点\n\n人形机器人在物流仓库中试点运行，可 24 小时连续工作。\n\n---\n\n> 以上内容由 全球 AI 快讯 自动采集与生成，仅供参考。",
  },
];

export function getDailyReportByDate(date: string): DailyReport | undefined {
  return dailyReports.find((d) => d.date === date);
}

export function getRecentDailyReports(limit?: number): DailyReport[] {
  return [...dailyReports]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

export function getDailyReportCount(): number {
  return dailyReports.length;
}
