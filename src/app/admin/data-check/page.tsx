// ============================================================
// 临时诊断页 /admin/data-check — 三组对照
// A. data.ts函数  B. getSupabaseServerClient直接  C. createClient直接
// ============================================================

import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  getLatestDailyReport, getRecentDailyReports, getDailyReportByDate,
  getDailyReportCount, getRecentFetchLogs, getAdminStats, getRecentNews,
} from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function DataCheckPage() {
  noStore();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  let host = "?";
  try { host = new URL(supabaseUrl).hostname; } catch { /* */ }

  // ===== A. data.ts functions =====
  const aLatest = await getLatestDailyReport();
  const aRecent = await getRecentDailyReports(10);
  const a0627 = await getDailyReportByDate("2026-06-27");
  const aDailyCount = await getDailyReportCount();
  const aLogs = await getRecentFetchLogs(10);
  const aStats = await getAdminStats();
  const aNews = await getRecentNews(10);

  // ===== B. getSupabaseServerClient direct =====
  const sc = getSupabaseServerClient();
  let bDailyReports: any[] = []; let bDailyErr = "";
  let bDailyCount: number | null = null; let bDailyCountErr = "";
  let bFetchLogs: any[] = []; let bFetchLogsErr = "";
  let bFetchLogsCount: number | null = null; let bFetchLogsCountErr = "";
  let bNews: any[] = []; let bNewsErr = "";

  if (sc) {
    const { data: d1, error: e1 } = await sc.from("daily_reports").select("id,date,title,created_at").order("date", { ascending: false }).limit(10);
    bDailyReports = d1 || []; bDailyErr = e1?.message || "";
    const { count: c2, error: e2 } = await sc.from("daily_reports").select("*", { count: "exact", head: true });
    bDailyCount = c2; bDailyCountErr = e2?.message || "";
    const { data: d3, error: e3 } = await sc.from("fetch_logs").select("task_name,status,news_count,error_count,message,created_at").order("created_at", { ascending: false }).limit(10);
    bFetchLogs = d3 || []; bFetchLogsErr = e3?.message || "";
    const { count: c4, error: e4 } = await sc.from("fetch_logs").select("*", { count: "exact", head: true });
    bFetchLogsCount = c4; bFetchLogsCountErr = e4?.message || "";
    const { data: d5, error: e5 } = await sc.from("news").select("id,title_zh,published_at,status,created_at").order("created_at", { ascending: false }).limit(10);
    bNews = d5 || []; bNewsErr = e5?.message || "";
  }

  // ===== C. Direct createClient =====
  let cDailyReports: any[] = []; let cDailyErr = "";
  let cDailyCount: number | null = null; let cDailyCountErr = "";
  let cFetchLogs: any[] = []; let cFetchLogsErr = "";
  let cFetchLogsCount: number | null = null; let cFetchLogsCountErr = "";
  let cNews: any[] = []; let cNewsErr = "";

  if (supabaseUrl && serviceKey) {
    const dc = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    const { data: d1, error: e1 } = await dc.from("daily_reports").select("id,date,title,created_at").order("date", { ascending: false }).limit(10);
    cDailyReports = d1 || []; cDailyErr = e1?.message || "";
    const { count: c2, error: e2 } = await dc.from("daily_reports").select("*", { count: "exact", head: true });
    cDailyCount = c2; cDailyCountErr = e2?.message || "";
    const { data: d3, error: e3 } = await dc.from("fetch_logs").select("task_name,status,news_count,error_count,message,created_at").order("created_at", { ascending: false }).limit(10);
    cFetchLogs = d3 || []; cFetchLogsErr = e3?.message || "";
    const { count: c4, error: e4 } = await dc.from("fetch_logs").select("*", { count: "exact", head: true });
    cFetchLogsCount = c4; cFetchLogsCountErr = e4?.message || "";
    const { data: d5, error: e5 } = await dc.from("news").select("id,title_zh,published_at,status,created_at").order("created_at", { ascending: false }).limit(10);
    cNews = d5 || []; cNewsErr = e5?.message || "";
  }

  // ===== judgment =====
  const bDailyOk = bDailyReports.some((r: any) => r.date === "2026-06-27");
  const cDailyOk = cDailyReports.some((r: any) => r.date === "2026-06-27");
  const aDailyOk = aRecent.some((r) => r.date === "2026-06-27");
  let judgment = [];
  if (!aDailyOk && bDailyOk && cDailyOk) judgment.push("A(mock) B(ok) C(ok) → data.ts函数问题");
  if (!bDailyOk && cDailyOk) judgment.push("B(fail) C(ok) → server.ts client问题");
  if (aDailyOk && bDailyOk && cDailyOk) judgment.push("ABC都ok → 页面渲染/缓存问题");

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 font-mono text-xs">
      <h1 className="text-lg font-bold text-slate-100 mb-4">data-check v2</h1>
      <div className="text-slate-400 mb-4">host={host} time={new Date().toISOString()}</div>

      {/* A. data.ts */}
      <details open className="mb-4">
        <summary className="text-slate-200 font-bold cursor-pointer mb-2">A. data.ts 函数</summary>
        <div className="p-3 rounded bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-slate-300">latestDaily: {aLatest ? `${aLatest.date} ${aLatest.title}` : "null"}</div>
          <div className="text-slate-300">dailyByDate(06-27): {a0627 ? `✅ ${a0627.title}` : "❌"}</div>
          <div className="text-slate-300">dailyCount: {aDailyCount}</div>
          <div className="text-slate-300">adminStats.daily: {aStats.totalDailyReports}</div>
          <div className="text-slate-300">adminStats.news: {aStats.totalNews}</div>
          <div className="text-slate-400 mt-1">recentDailyReports({aRecent.length}):</div>
          {aRecent.map((r,i)=><div key={i} className="text-slate-500 ml-2">{r.id}|{r.date}|{r.title?.slice(0,40)}</div>)}
          <div className="text-slate-400 mt-1">fetchLogs({aLogs.length}):</div>
          {aLogs.map((l,i)=><div key={i} className="text-slate-500 ml-2">[{l.created_at?.slice(0,19)}]{l.task_name}|{l.status}</div>)}
          <div className="text-slate-400 mt-1">recentNews({aNews.length}):</div>
          {aNews.map((n,i)=><div key={i} className="text-slate-500 ml-2">{n.id}|{(n.titleZh||"").slice(0,40)}</div>)}
        </div>
      </details>

      {/* B. serverClient */}
      <details open className="mb-4">
        <summary className="text-slate-200 font-bold cursor-pointer mb-2">B. serverClient 直接查询 ({sc?"created":"null"})</summary>
        <div className="p-3 rounded bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-slate-300">dailyCount: {bDailyCount} {bDailyCountErr && <span className="text-red-400">err: {bDailyCountErr}</span>}</div>
          <div className="text-slate-400 mt-1">daily_reports({bDailyReports.length}):</div>
          {bDailyReports.map((r:any,i:number)=><div key={i} className="text-slate-500 ml-2">{r.id}|{r.date}|{(r.title||"").slice(0,40)}</div>)}
          {bDailyErr && <div className="text-red-400">err: {bDailyErr}</div>}
          <div className="text-slate-300 mt-1">fetchLogsCount: {bFetchLogsCount} {bFetchLogsCountErr && <span className="text-red-400">err: {bFetchLogsCountErr}</span>}</div>
          <div className="text-slate-400 mt-1">fetch_logs({bFetchLogs.length}):</div>
          {bFetchLogs.map((l:any,i:number)=><div key={i} className="text-slate-500 ml-2">[{l.created_at?.slice(0,19)}]{l.task_name}|{l.status}</div>)}
          {bFetchLogsErr && <div className="text-red-400">err: {bFetchLogsErr}</div>}
          <div className="text-slate-400 mt-1">news({bNews.length}):</div>
          {bNews.map((n:any,i:number)=><div key={i} className="text-slate-500 ml-2">{n.id}|{(n.title_zh||"").slice(0,40)}|{n.created_at?.slice(0,19)}</div>)}
          {bNewsErr && <div className="text-red-400">err: {bNewsErr}</div>}
        </div>
      </details>

      {/* C. createClient */}
      <details open className="mb-4">
        <summary className="text-slate-200 font-bold cursor-pointer mb-2">C. createClient 直接查询</summary>
        <div className="p-3 rounded bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="text-slate-300">dailyCount: {cDailyCount} {cDailyCountErr && <span className="text-red-400">err: {cDailyCountErr}</span>}</div>
          <div className="text-slate-400 mt-1">daily_reports({cDailyReports.length}):</div>
          {cDailyReports.map((r:any,i:number)=><div key={i} className="text-slate-500 ml-2">{r.id}|{r.date}|{(r.title||"").slice(0,40)}</div>)}
          {cDailyErr && <div className="text-red-400">err: {cDailyErr}</div>}
          <div className="text-slate-300 mt-1">fetchLogsCount: {cFetchLogsCount} {cFetchLogsCountErr && <span className="text-red-400">err: {cFetchLogsCountErr}</span>}</div>
          <div className="text-slate-400 mt-1">fetch_logs({cFetchLogs.length}):</div>
          {cFetchLogs.map((l:any,i:number)=><div key={i} className="text-slate-500 ml-2">[{l.created_at?.slice(0,19)}]{l.task_name}|{l.status}</div>)}
          {cFetchLogsErr && <div className="text-red-400">err: {cFetchLogsErr}</div>}
          <div className="text-slate-400 mt-1">news({cNews.length}):</div>
          {cNews.map((n:any,i:number)=><div key={i} className="text-slate-500 ml-2">{n.id}|{(n.title_zh||"").slice(0,40)}|{n.created_at?.slice(0,19)}</div>)}
          {cNewsErr && <div className="text-red-400">err: {cNewsErr}</div>}
        </div>
      </details>

      {/* Judgment */}
      <div className="p-3 rounded bg-amber-950/20 border border-amber-500/20">
        <div className="text-slate-300">B dailyOk={String(bDailyOk)} C dailyOk={String(cDailyOk)} A dailyOk={String(aDailyOk)}</div>
        <div className="text-slate-300 mt-1">B dailyCount={bDailyCount} C dailyCount={cDailyCount} A dailyCount={aDailyCount}</div>
        {judgment.map((j,i)=><div key={i} className="text-amber-400 mt-1">→ {j}</div>)}
        {judgment.length===0 && <div className="text-slate-500 mt-1">无明确判断 — 参考上方数据</div>}
      </div>
    </div>
  );
}
