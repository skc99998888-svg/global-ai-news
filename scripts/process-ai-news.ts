// ============================================================
// AI 新闻处理脚本 v3
// 用法：npm run process:ai -- --limit=3 [--retry-failed]
// 默认 limit=3，不会批量处理全部新闻
// ============================================================

import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "../src/lib/env";
import { processNewsWithAI } from "../src/lib/ai/process-news";

const RSS_SOURCE_NAMES = [
  "OpenAI Blog", "NVIDIA Blog", "TechCrunch AI",
  "VentureBeat AI", "GitHub Blog", "Ars Technica AI",
  "MIT Technology Review", "The Verge AI",
];

// ============================================================
// 参数
// ============================================================

function parseArgs(): { limit: number; retryFailed: boolean } {
  let limit = 3;
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  if (limitArg) {
    const v = parseInt(limitArg.split("=")[1], 10);
    if (!isNaN(v) && v > 0) limit = v;
  }
  const retryFailed = process.argv.includes("--retry-failed");
  return { limit, retryFailed };
}

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
// Main
// ============================================================

async function main() {
  console.log("=== process:ai-news ===\n");

  const { limit, retryFailed } = parseArgs();
  loadEnv();

  if (!process.env.AI_API_KEY) {
    console.error("AI_API_KEY 未配置");
    console.log("请在 .env.local 中设置 AI_PROVIDER / AI_BASE_URL / AI_MODEL / AI_API_KEY");
    process.exit(1);
  }

  console.log(`limit: ${limit}${retryFailed ? "  retry-failed" : ""}`);

  const supabase = getSupabase();

  // 查询待处理新闻
  let query = supabase
    .from("news")
    .select("id, original_title, summary_zh, status")
    .in("source_name", RSS_SOURCE_NAMES)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (retryFailed) {
    // 优先重试 ai_failed
    query = query.eq("status", "ai_failed");
  } else {
    // 正常：published 且未处理
    query = query
      .eq("status", "published")
      .or("opportunity_zh.is.null,opportunity_zh.eq.");
  }

  const { data: candidates, error: queryErr } = await query;

  if (queryErr) {
    console.error("查询失败:", queryErr.message);
    process.exit(1);
  }

  if (!candidates || candidates.length === 0) {
    console.log(retryFailed ? "没有 ai_failed 新闻需要重试" : "没有需要处理的新闻");
    process.exit(0);
  }

  console.log(`待处理: ${candidates.length} 条\n`);

  const startedAt = new Date().toISOString();
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < candidates.length; i++) {
    const row: any = candidates[i];
    const idx = `[${i + 1}/${candidates.length}]`;
    console.log(`${idx} ${row.id} ...`);

    const result = await processNewsWithAI({
      id: row.id,
      original_title: row.original_title || "",
      summary_zh: row.summary_zh || "",
    });

    if (!result) {
      // AI 失败 → 标记 ai_failed
      await supabase
        .from("news")
        .update({ status: "ai_failed", updated_at: new Date().toISOString() })
        .eq("id", row.id);
      console.log("     ❌ ai_failed");
      failCount++;
    } else {
      // 根据评分决定 status
      const status = result.importance_score <= 3 ? "low_relevance" : "published";

      const { error: updateErr } = await supabase
        .from("news")
        .update({
          title_zh: result.title_zh,
          summary_zh: result.summary_zh,
          opportunity_zh: result.opportunity_zh,
          category: result.category,
          tags: result.tags,
          importance_score: result.importance_score,
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id);

      if (updateErr) {
        console.log(`     ❌ 写入失败: ${updateErr.message}`);
        failCount++;
      } else {
        const flag = status === "low_relevance" ? " [low]" : "";
        console.log(`     ✅ ${result.title_zh.slice(0, 30)}${flag}`);
        successCount++;
      }
    }

    if (i < candidates.length - 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // fetch_logs
  let logStatus: "success" | "partial_success" | "failed";
  if (failCount === 0) logStatus = "success";
  else if (successCount > 0) logStatus = "partial_success";
  else logStatus = "failed";

  await supabase.from("fetch_logs").insert({
    task_name: "process:ai-news",
    status: logStatus,
    message: `AI 处理: limit=${limit}${retryFailed ? " retry" : ""}, ${successCount} 成功, ${failCount} 失败`,
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    news_count: successCount,
    error_count: failCount,
  });

  console.log(`\n成功: ${successCount}  失败: ${failCount}`);
  process.exit(failCount === candidates.length ? 1 : 0);
}

main().catch((err) => {
  console.error("异常:", err.message);
  process.exit(1);
});
