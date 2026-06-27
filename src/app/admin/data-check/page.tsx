// ============================================================
// 临时只读诊断页 /admin/data-check
// 对比 data.ts 函数 vs direct Supabase 查询结果
// ============================================================

import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import {
  getLatestDailyReport,
  getRecentDailyReports,
  getDailyReportByDate,
  getDailyReportCount,
  getRecentFetchLogs,
  getAdminStats,
  getRecentNews,
} from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function DataCheckPage() {
  noStore();

  // ===== 环境 =====
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  let host = "(missing)";
  try { host = new URL(supabaseUrl).hostname; } catch { /* */ }
  const serverTime = new Date().toISOString();

  // ===== data.ts 函数 =====
  const latestDaily = await getLatestDailyReport();
  const recentDailies = await getRecentDailyReports(10);
  const daily20260627 = await getDailyReportByDate("2026-06-27");
  const dailyCount = await getDailyReportCount();
  const fetchLogs = await getRecentFetchLogs(10);
  const adminStats = await getAdminStats();
  const recentNews = await getRecentNews(10);

  // ===== Direct Supabase =====
  let directDailyReports: any[] = [];
  let directDailyCount: number | null = null;
  let directDaily0627: any = null;
  let directFetchLogs: any[] = [];
  let directFetchLogsCount: number | null = null;
  let directNews: any[] = [];

  if (supabaseUrl && serviceKey) {
    const dc = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    const { data: d1 } = await dc.from("daily_reports").select("id,date,title,created_at,updated_at").order("date", { ascending: false }).limit(10);
    directDailyReports = d1 || [];

    const { count: c2 } = await dc.from("daily_reports").select("*", { count: "exact", head: true });
    directDailyCount = c2;

    const { data: d3 } = await dc.from("daily_reports").select("id,date,title,created_at,updated_at").eq("id", "daily-2026-06-27").single();
    directDaily0627 = d3;

    const { data: d4 } = await dc.from("fetch_logs").select("task_name,status,news_count,error_count,message,created_at").order("created_at", { ascending: false }).limit(10);
    directFetchLogs = d4 || [];

    const { count: c5 } = await dc.from("fetch_logs").select("*", { count: "exact", head: true });
    directFetchLogsCount = c5;

    const { data: d6 } = await dc.from("news").select("id,title_zh,published_at,created_at,status").order("created_at", { ascending: false }).limit(10);
    directNews = d6 || [];
  }

  // ===== 判断 =====
  const directHas0627 = !!directDaily0627;
  const dataHas0627 = !!daily20260627;
  const dataFnCount = adminStats.totalDailyReports;

  let judgment = "";
  if (!directHas0627 && !dataHas0627) {
    judgment = "direct 和 data.ts 都看不到 daily-2026-06-27 → 数据库确实没有这条记录（可能是另一个 Supabase 实例）";
  } else if (directHas0627 && !dataHas0627) {
    judgment = "direct 能看到但 data.ts 看不到 → data.ts 函数逻辑有问题";
  } else if (directHas0627 && dataHas0627) {
    judgment = "direct 和 data.ts 都能看到 daily-2026-06-27 → 首页/列表组件展示逻辑有问题，或 Netlify 缓存了旧页面代码";
  } else {
    judgment = "direct 看不到但 data.ts 能看到 → data.ts 可能有额外过滤";
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 font-mono text-xs">
      <h1 className="text-lg font-bold text-slate-100 mb-4">data-check</h1>

      {/* 环境 */}
      <section className="mb-6 p-3 rounded bg-slate-900/60 border border-slate-800">
        <h2 className="text-slate-400 mb-1">一、环境</h2>
        <div className="text-slate-300">host: {host}</div>
        <div className="text-slate-300">time: {serverTime}</div>
      </section>

      {/* data.ts */}
      <section className="mb-6 p-3 rounded bg-slate-900/60 border border-slate-800">
        <h2 className="text-slate-400 mb-1">二、data.ts 函数</h2>
        <div className="text-slate-300 mb-1">
          latestDailyReport: {latestDaily ? `${latestDaily.id} | ${latestDaily.date} | ${latestDaily.title}` : "null"}
        </div>
        <div className="text-slate-300 mb-1">
          dailyReportByDate(06-27): {daily20260627 ? `✅ ${daily20260627.title}` : "❌ missing"}
        </div>
        <div className="text-slate-300 mb-1">dailyReportCount: {dailyCount}</div>
        <div className="text-slate-300 mb-1">adminStats.totalDailyReports: {dataFnCount}</div>
        <div className="text-slate-400 mt-1">recentDailyReports({recentDailies.length}):</div>
        {recentDailies.map((r, i) => (
          <div key={i} className="text-slate-500 ml-2">{r.id} | {r.date} | {r.title?.slice(0,40)}</div>
        ))}
        <div className="text-slate-400 mt-1">fetchLogs({fetchLogs.length}):</div>
        {fetchLogs.map((l, i) => (
          <div key={i} className="text-slate-500 ml-2">[{l.created_at?.slice(0,19)}] {l.task_name} | {l.status} | {l.message?.slice(0,50)}</div>
        ))}
        <div className="text-slate-400 mt-1">recentNews({recentNews.length}):</div>
        {recentNews.map((n, i) => (
          <div key={i} className="text-slate-500 ml-2">{n.id} | {n.titleZh?.slice(0,40)} | {n.publishedAt?.slice(0,10)}</div>
        ))}
      </section>

      {/* Direct */}
      <section className="mb-6 p-3 rounded bg-slate-900/60 border border-slate-800">
        <h2 className="text-slate-400 mb-1">三、Direct Supabase</h2>
        <div className="text-slate-300 mb-1">
          daily-2026-06-27: {directDaily0627 ? `✅ ${directDaily0627.title}` : "❌ missing"}
        </div>
        <div className="text-slate-300 mb-1">daily_reports count: {directDailyCount ?? "?"}</div>
        <div className="text-slate-400 mt-1">daily_reports list({directDailyReports.length}):</div>
        {directDailyReports.map((r, i) => (
          <div key={i} className="text-slate-500 ml-2">{r.id} | {r.date} | {(r.title||"").slice(0,40)} | created={r.created_at?.slice(0,19)}</div>
        ))}
        <div className="text-slate-300 mb-1 mt-1">fetch_logs count: {directFetchLogsCount ?? "?"}</div>
        <div className="text-slate-400 mt-1">fetch_logs list({directFetchLogs.length}):</div>
        {directFetchLogs.map((l, i) => (
          <div key={i} className="text-slate-500 ml-2">[{l.created_at?.slice(0,19)}] {l.task_name} | {l.status} | {(l.message||"").slice(0,50)}</div>
        ))}
        <div className="text-slate-400 mt-1">news list({directNews.length}):</div>
        {directNews.map((n, i) => (
          <div key={i} className="text-slate-500 ml-2">{n.id} | {(n.title_zh||"").slice(0,40)} | pub={n.published_at?.slice(0,10)} | status={n.status}</div>
        ))}
      </section>

      {/* 判断 */}
      <section className="p-3 rounded bg-amber-950/20 border border-amber-500/20">
        <h2 className="text-amber-400 mb-1">四、判断</h2>
        <div className="text-slate-300 whitespace-pre-wrap">{judgment}</div>
        <div className="text-slate-500 mt-1">directHas0627={String(directHas0627)} dataHas0627={String(dataHas0627)} dataFnCount={dataFnCount} directDailyCount={directDailyCount}</div>
      </section>
    </div>
  );
}
