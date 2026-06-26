// ============================================================
// AI 新闻处理 — 单条新闻调用 AI 生成中文内容
// ============================================================

import { getAiProvider, getAiModel } from "./provider";

// 有效分类
const VALID_CATEGORIES = [
  "llm",
  "tools",
  "industry",
  "policy",
  "opensource",
  "hardware",
  "research",
] as const;

export interface AiResult {
  title_zh: string;
  summary_zh: string;
  opportunity_zh: string;
  category: string;
  tags: string[];
  importance_score: number;
}

function buildPrompt(title: string, content: string): string {
  return `请处理以下英文 AI 新闻，输出严格 JSON（不要 markdown 代码块）。

标题：${title}
摘要：${content || "（无内容）"}

输出 JSON：
{
  "title_zh": "中文标题，20字以内",
  "summary_zh": "中文摘要，100-200字，说明核心内容",
  "opportunity_zh": "机会解读，80-150字，对中文用户的个人机会或行业影响",
  "category": "llm|tools|industry|policy|opensource|hardware|research",
  "tags": ["标签1", "标签2", ...最多5个],
  "importance_score": 1到10的整数
}

importance_score 参考：
9-10：重大模型发布、行业格局变化
7-8：新产品/功能、重要研究、大公司动作
5-6：常规更新、小迭代
3-4：边角新闻
1-2：广告/非核心`;
}

export async function processNewsWithAI(raw: {
  id: string;
  original_title: string;
  summary_zh: string;
}): Promise<AiResult | null> {
  const client = getAiProvider();
  if (!client) return null;

  const model = getAiModel();
  const prompt = buildPrompt(raw.original_title, raw.summary_zh);

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const completion = await client.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 1200,
      });

      const rawText = completion.choices?.[0]?.message?.content || "";

      // 解析 JSON（兼容 markdown 代码块）
      let parsed: Record<string, unknown>;
      try {
        const match = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
        parsed = JSON.parse(match ? match[1].trim() : rawText);
      } catch {
        if (attempt === 0) continue; // 重试一次
        return null;
      }

      // 校验 category
      let category = String(parsed.category || "industry").toLowerCase();
      if (!VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
        category = "industry";
      }

      // 校验 tags
      let tags: string[] = [];
      if (Array.isArray(parsed.tags)) {
        tags = parsed.tags.map(String).slice(0, 5);
      }

      // 校验 importance_score
      let score = Number(parsed.importance_score) || 5;
      score = Math.min(10, Math.max(1, Math.round(score)));

      return {
        title_zh: String(parsed.title_zh || raw.original_title).slice(0, 100),
        summary_zh: String(parsed.summary_zh || "").slice(0, 500),
        opportunity_zh: String(parsed.opportunity_zh || "").slice(0, 500),
        category,
        tags,
        importance_score: score,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[ai] 请求异常 (attempt ${attempt + 1}):`, msg);
      if (attempt === 0) await new Promise((r) => setTimeout(r, 2000));
    }
  }

  return null;
}
