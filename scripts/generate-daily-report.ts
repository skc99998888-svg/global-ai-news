// ============================================================
// 每日 AI 日报生成脚本
// 用法：npm run generate:daily [-- --date=2026-06-26] [-- --limit=15]
// ============================================================

import { createClient } from "@supabase/supabase-js";
import { loadEnv } from "../src/lib/env";
import { generateDailyReport } from "../src/lib/ai/generate-daily-report";
import type { ReportInputNews } from "../src/lib/ai/generate-daily-report";

// ============================================================
// 参数
// ============================================================

function parseArgs(): { date: string; limit: number } {
  let date = new Date().toISOString().split("T")[0];
  let limit = 15;

  const dateArg = process.argv.find((a) => a.startsWith("--date="));
  if (dateArg) {
    const v = dateArg.split("=")[1];
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) date = v;
  }

  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  if (limitArg) {
    const v = parseInt(limitArg.split("=")[1], 10);
    if (!isNaN(v) && v > 0) limit = v;
  }

  return { date, limit };
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
  console.log("=== generate:daily ===\n");

  const { date, limit } = parseArgs();
  loadEnv();

  if (!process.env.AI_API_KEY) {
    console.error("AI_API_KEY 未配置");
    process.exit(1);
  }

  console.log(`date: ${date}  limit: ${limit}`);

  const supabase = getSupabase();

  // 查询当天已发布且有 AI 摘要的新闻
  let { data: newsRows, error } = await supabase
    .from("news")
    .select("id, title_zh, summary_zh, opportunity_zh, category, tags, importance_score, source_name")
    .eq("status", "published")
    .not("opportunity_zh", "is", null)
    .gte("published_at", `${date}T00:00:00Z`)
    .lte("published_at", `${date}T23:59:59Z`)
    .order("importance_score", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("查询失败:", error.message);
    process.exit(1);
  }

  let usedDate = date;

  // 当天不足 5 条 → 扩大到 3 天
  if (!newsRows || newsRows.length < 5) {
    const threeDaysAgo = new Date(date);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 2);
    const from = threeDaysAgo.toISOString().split("T")[0];

    console.log(`当天新闻不足 (${newsRows?.length || 0} 条)，已扩大到最近 3 天 (${from} ~ ${date})`);

    const { data: wideRows, error: wideErr } = await supabase
      .from("news")
      .select("id, title_zh, summary_zh, opportunity_zh, category, tags, importance_score, source_name")
      .eq("status", "published")
      .not("opportunity_zh", "is", null)
      .gte("published_at", `${from}T00:00:00Z`)
      .lte("published_at", `${date}T23:59:59Z`)
      .order("importance_score", { ascending: false })
      .limit(limit);

    if (wideErr) {
      console.error("查询失败:", wideErr.message);
      process.exit(1);
    }
    newsRows = wideRows;
    usedDate = date; // 日报日期仍为今天
  }

  if (!newsRows || newsRows.length === 0) {
    console.log("没有可用的新闻生成日报");
    process.exit(0);
  }

  const newsList: ReportInputNews[] = newsRows.map((r: any) => ({
    id: r.id,
    title_zh: r.title_zh,
    summary_zh: r.summary_zh,
    opportunity_zh: r.opportunity_zh || "",
    category: r.category,
    tags: r.tags || [],
    importance_score: r.importance_score,
    source_name: r.source_name,
  }));

  console.log(`使用 ${newsList.length} 条新闻生成日报\n`);

  const startedAt = new Date().toISOString();

  // 调用 AI 生成
  const report = await generateDailyReport({ date: usedDate, newsList });

  if (!report) {
    console.log("❌ 日报生成失败");
    await supabase.from("fetch_logs").insert({
      task_name: "generate:daily",
      status: "failed",
      message: `日报生成失败: ${usedDate}`,
      started_at: startedAt,
      finished_at: new Date().toISOString(),
      news_count: 0,
      error_count: 1,
    });
    process.exit(1);
  }

  console.log(`标题: ${report.title}`);
  console.log(`top_news_ids: [${report.top_news_ids.join(", ")}]`);

  // Upsert
  const reportId = `daily-${usedDate}`;
  const { error: upsertErr } = await supabase.from("daily_reports").upsert(
    {
      id: reportId,
      date: usedDate,
      title: report.title,
      summary: report.summary,
      top_news_ids: report.top_news_ids,
      trend_analysis: report.trend_analysis,
      opportunity_analysis: report.opportunity_analysis,
      content: report.content,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id", ignoreDuplicates: false }
  );

  if (upsertErr) {
    console.log(`❌ 写入失败: ${upsertErr.message}`);
    process.exit(1);
  }

  console.log(`✅ 已写入 daily_reports (${reportId})`);

  // fetch_logs
  await supabase.from("fetch_logs").insert({
    task_name: "generate:daily",
    status: "success",
    message: `日报: ${usedDate} "${report.title}", 基于 ${newsList.length} 条新闻`,
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    news_count: newsList.length,
    error_count: 0,
  });

  console.log("✅ 已写入 fetch_logs");
  process.exit(0);
}

main().catch((err) => {
  console.error("异常:", err.message);
  process.exit(1);
});
