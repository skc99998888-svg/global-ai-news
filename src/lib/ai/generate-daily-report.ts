// ============================================================
// AI 日报生成 — 输入新闻列表，输出结构化日报 JSON
// ============================================================

import { getAiProvider, getAiModel } from "./provider";

export interface ReportInputNews {
  id: string;
  title_zh: string;
  summary_zh: string;
  opportunity_zh: string;
  category: string;
  tags: string[];
  importance_score: number;
  source_name: string;
}

export interface DailyReportResult {
  title: string;
  summary: string;
  top_news_ids: string[];
  trend_analysis: string;
  opportunity_analysis: string;
  content: string;
}

function buildPrompt(date: string, newsList: ReportInputNews[]): string {
  const newsSummary = newsList
    .map(
      (n, i) =>
        `[${i}] id=${n.id} | 评分${n.importance_score} | ${n.title_zh} | ${n.summary_zh.slice(0, 100)}`
    )
    .join("\n");

  return `你是「全球 AI 快讯」的主编。请基于以下今日 AI 新闻，生成一份面向中文普通用户的日报。

日期：${date}
可用新闻（${newsList.length} 条）：
${newsSummary}

## 任务要求

1. 从新闻中挑选 3-5 条作为 top_news_ids（优先选评分高的）
2. 写 title、summary、trend_analysis、opportunity_analysis、content
3. 面向中文普通用户，不要写成学术报告
4. opportunity_analysis 要具体：分别针对普通人、创业者、内容创作者、开发者
5. top_news_ids 必须来自上面的 [index] id=... 格式，不允许编造

## 输出格式（严格 JSON，不要 markdown 代码块）

{
  "title": "日报标题，简洁有力，20字以内",
  "summary": "今日 AI 大势摘要，150-250字，概述最值得关注的动态",
  "top_news_ids": ["id1", "id2", "id3"],
  "trend_analysis": "趋势分析，300-500字，提炼今日新闻背后的共同趋势、行业信号",
  "opportunity_analysis": "机会解读，300-500字，分角色：普通人/创业者/内容创作者/开发者",
  "content": "完整日报正文（Markdown），含：\\n# 标题\\n\\n## 今日概览\\n\\n## 重点新闻（每条100-200字）\\n\\n## 趋势判断\\n\\n## 机会解读\\n\\n## 明日关注点"
}`;
}

export async function generateDailyReport(params: {
  date: string;
  newsList: ReportInputNews[];
}): Promise<DailyReportResult | null> {
  const client = getAiProvider();
  if (!client) return null;

  const model = getAiModel();
  const prompt = buildPrompt(params.date, params.newsList);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
        max_tokens: 4000,
      });

      const rawText = completion.choices?.[0]?.message?.content || "";

      let parsed: Record<string, unknown>;
      try {
        const match = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
        parsed = JSON.parse(match ? match[1].trim() : rawText);
      } catch {
        if (attempt === 0) continue;
        return null;
      }

      // 校验 top_news_ids：确保都是真实 ID
      const validIds = new Set(params.newsList.map((n) => n.id));
      let topIds: string[] = [];
      if (Array.isArray(parsed.top_news_ids)) {
        topIds = parsed.top_news_ids
          .map(String)
          .filter((id) => validIds.has(id));
      }
      // 如果没有有效 top news，选评分最高的 3 条
      if (topIds.length === 0) {
        topIds = params.newsList
          .sort((a, b) => b.importance_score - a.importance_score)
          .slice(0, 3)
          .map((n) => n.id);
      }

      return {
        title: String(parsed.title || `${params.date} AI 日报`).slice(0, 60),
        summary: String(parsed.summary || "").slice(0, 500),
        top_news_ids: topIds.slice(0, 5),
        trend_analysis: String(parsed.trend_analysis || "").slice(0, 1000),
        opportunity_analysis: String(parsed.opportunity_analysis || "").slice(0, 1000),
        content: String(parsed.content || "").slice(0, 5000),
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[ai] 日报生成异常 (attempt ${attempt + 1}):`, msg);
      if (attempt === 0) await new Promise((r) => setTimeout(r, 3000));
    }
  }

  return null;
}
