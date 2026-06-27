// ============================================================
// 轻量重复检测
// 用法：npm run dedup
// 对最近 7 天已处理的新闻做关键词重合检测
// ============================================================

import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "../src/lib/env";

// ============================================================
// Env
// ============================================================
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase 配置缺失");
  return createClient(url, key, { auth: { persistSession: false } });
}

// ============================================================
// 关键词提取
// ============================================================

const STOP_WORDS = new Set([
  "a","an","the","is","are","was","were","be","been","being",
  "have","has","had","do","does","did","will","would","could","should",
  "may","might","can","shall","to","of","in","for","on","with","at",
  "by","from","as","into","through","during","before","after",
  "above","below","between","and","but","or","nor","not","so","yet",
  "both","either","neither","each","every","all","any","few","more",
  "most","other","some","such","no","only","own","same","than","too",
  "very","just","now","then","here","there","when","where","why","how",
  "it","its","this","that","these","those","he","she","they","we","you",
  "i","me","my","his","her","their","our","your","s","t","m","re","ll","ve",
  // 中文常见停用词
  "的","了","在","是","我","有","和","就","不","人","都","一","一个",
  "上","也","很","到","说","要","去","你","会","着","没有","看","好",
  "自己","这","他","她","它","们","那","些","什么","怎么","如何",
  "为","因为","所以","但是","虽然","如果","可以","已经","还","又",
  "再","才","刚","正","正在","将","要","能","能够","可能","应该",
]);

function isCjk(ch: string): boolean {
  const cp = ch.codePointAt(0) || 0;
  return (
    (cp >= 0x4e00 && cp <= 0x9fff) || // CJK Unified
    (cp >= 0x3400 && cp <= 0x4dbf)    // CJK Ext-A
  );
}

function extractKeywords(text: string): Set<string> {
  if (!text) return new Set();
  const kw = new Set<string>();

  const normalized = text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]"'？。，！、；：…（）【】《》""''\s]+/g, " ")
    .trim();

  // English words
  const words = normalized.split(" ").filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
  for (const w of words) kw.add(w);

  // Chinese character bigrams
  const cjkOnly = text.replace(/[^一-鿿]/g, "");
  for (let i = 0; i < cjkOnly.length - 1; i++) {
    const bigram = cjkOnly.slice(i, i + 2);
    if (!STOP_WORDS.has(bigram)) kw.add(bigram);
  }

  return kw;
}

function overlapScore(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const w of a) { if (b.has(w)) intersection++; }
  return intersection / Math.min(a.size, b.size);
}

const STRONG_KEYWORD_GROUPS: string[][] = [
  ["openai", "gpt", "延迟", "推迟", "trump", "白宫", "政府"],
  ["claude", "opus", "anthropic"],
  ["gemini", "deepmind", "google"],
  ["llama", "meta", "开源"],
  ["nvidia", "blackwell", "gpu"],
];

function hasStrongKeywordMatch(a: Set<string>, b: Set<string>): boolean {
  for (const group of STRONG_KEYWORD_GROUPS) {
    let matchA = 0, matchB = 0;
    for (const kw of group) {
      if (a.has(kw)) matchA++;
      if (b.has(kw)) matchB++;
    }
    if (matchA >= 2 && matchB >= 2) return true;
  }
  return false;
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log("=== 重复检测 ===\n");
  loadEnv();
  const supabase = getSupabase();

  // 查询最近 7 天已处理的 published 新闻
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: rows, error } = await supabase
    .from("news")
    .select("id, original_title, title_zh, importance_score, published_at, source_name")
    .eq("status", "published")
    .gte("published_at", sevenDaysAgo)
    .not("title_zh", "is", null)
    .not("opportunity_zh", "is", null)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("查询失败:", error.message);
    process.exit(1);
  }

  if (!rows || rows.length < 2) {
    console.log("少于 2 条新闻，无需检测");
    process.exit(0);
  }

  console.log(`检查 ${rows.length} 条新闻 (最近 7 天)\n`);

  // 预处理关键词
  const keywords = new Map<string, { zh: Set<string>; en: Set<string> }>();
  for (const r of rows) {
    keywords.set(r.id, {
      zh: extractKeywords(r.title_zh || ""),
      en: extractKeywords(r.original_title || ""),
    });
  }

  // 检测重复
  const duplicateGroups: Array<{ keep: string; mark: string[] }> = [];
  const marked = new Set<string>();

  for (let i = 0; i < rows.length; i++) {
    const a = rows[i];
    if (marked.has(a.id)) continue;

    const groupMark: string[] = [];

    for (let j = i + 1; j < rows.length; j++) {
      const b = rows[j];
      if (marked.has(b.id)) continue;

      const kwA = keywords.get(a.id)!;
      const kwB = keywords.get(b.id)!;

      const zhOverlap = overlapScore(kwA.zh, kwB.zh);
      const enOverlap = overlapScore(kwA.en, kwB.en);
      const strongMatch = hasStrongKeywordMatch(kwA.zh, kwB.zh) ||
                          hasStrongKeywordMatch(kwA.en, kwB.en);

      if (zhOverlap >= 0.6 || enOverlap >= 0.6 || strongMatch) {
        groupMark.push(b.id);
        marked.add(b.id);
      }
    }

    if (groupMark.length > 0) {
      duplicateGroups.push({ keep: a.id, mark: groupMark });
    }
  }

  if (duplicateGroups.length === 0) {
    console.log("✅ 未发现重复");
    process.exit(0);
  }

  // 标记 duplicate
  let totalMarked = 0;
  for (const group of duplicateGroups) {
    console.log(`重复组: keep=${group.keep}`);
    for (const id of group.mark) {
      await supabase
        .from("news")
        .update({ status: "duplicate", updated_at: new Date().toISOString() })
        .eq("id", id);
      console.log(`  → duplicate: ${id}`);
      totalMarked++;
    }
    console.log("");
  }

  console.log(`找到 ${duplicateGroups.length} 组重复，标记 ${totalMarked} 条 duplicate`);

  // fetch_logs
  await supabase.from("fetch_logs").insert({
    task_name: "dedup",
    status: "success",
    message: `去重: ${duplicateGroups.length} 组重复, 标记 ${totalMarked} 条`,
    started_at: new Date().toISOString(),
    finished_at: new Date().toISOString(),
    news_count: totalMarked,
    error_count: 0,
  });
}

main().catch((err) => {
  console.error("异常:", err.message);
  process.exit(1);
});
