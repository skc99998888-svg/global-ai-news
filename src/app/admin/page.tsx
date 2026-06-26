// ============================================================
// 后台管理 /admin — 运营状态面板
// ============================================================

import { getAdminStats, getRecentFetchLogs } from "@/lib/data";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  success: "✅ 成功",
  partial_success: "⚠️ 部分成功",
  failed: "❌ 失败",
  started: "🔄 运行中",
};

function fmtTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleString("zh-CN", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default async function AdminPage() {
  const [stats, logs] = await Promise.all([
    getAdminStats(),
    getRecentFetchLogs(8),
  ]);

  const now = new Date().toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
        ⚙️ 后台管理
      </h1>
      <p className="text-sm text-slate-400 mb-8">
        内容流水线、新闻状态与系统日志概览。
      </p>

      {/* 新闻状态卡片 */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">
          📊 新闻状态
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "总数", value: stats.totalNews, color: "text-slate-100" },
            { label: "已发布", value: stats.countPublished, color: "text-emerald-400" },
            { label: "重复", value: stats.countDuplicate, color: "text-amber-400" },
            { label: "低相关", value: stats.countLowRelevance, color: "text-slate-500" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-slate-800 bg-slate-900/80 p-4"
            >
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          {[
            { label: "AI 失败", value: stats.countAiFailed, color: "text-red-400" },
            { label: "日报", value: stats.totalDailyReports, color: "text-cyan-400" },
            { label: "近24h新增", value: stats.recentNewsCount24h, color: "text-slate-100" },
            { label: "更新", value: now, color: "text-slate-400 text-xs", isTime: true },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-slate-800 bg-slate-900/80 p-4"
            >
              <div className={s.isTime ? `text-xs ${s.color}` : `text-2xl font-bold ${s.color}`}>
                {s.value}
              </div>
              <div className="text-xs text-slate-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 操作入口 */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">🔧 操作入口</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: "🔄", label: "运行流水线", cmd: "npm run pipeline:daily" },
            { icon: "🤖", label: "生成日报", cmd: "npm run generate:daily" },
            { icon: "📡", label: "RSS 采集", cmd: "npm run fetch:rss" },
          ].map((btn) => (
            <button
              key={btn.cmd}
              disabled
              className="px-4 py-2 rounded-lg border border-slate-700 bg-slate-900 text-sm text-slate-400 cursor-not-allowed flex items-center gap-2"
            >
              {btn.icon} {btn.label}
              <span className="text-xs text-slate-600 ml-1">({btn.cmd})</span>
            </button>
          ))}
        </div>
      </section>

      {/* 最近运行日志 */}
      <section>
        <h2 className="text-sm font-semibold text-slate-300 mb-3">
          📋 最近运行日志
        </h2>
        {logs.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center">
            暂无运行日志。
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-400">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-slate-800">
                  <th className="pb-2 pr-3">任务</th>
                  <th className="pb-2 pr-3">状态</th>
                  <th className="pb-2 pr-3">说明</th>
                  <th className="pb-2 pr-3 w-12">📰</th>
                  <th className="pb-2 pr-3 w-12">⚠</th>
                  <th className="pb-2 w-24">时间</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i} className="border-b border-slate-800/50">
                    <td className="py-2 pr-3 text-cyan-400 font-medium">
                      {log.task_name}
                    </td>
                    <td className="py-2 pr-3">
                      {STATUS_LABELS[log.status] || log.status}
                    </td>
                    <td className="py-2 pr-3 text-xs text-slate-500 max-w-xs truncate">
                      {log.message}
                    </td>
                    <td className="py-2 pr-3">{log.news_count || "—"}</td>
                    <td className="py-2 pr-3">{log.error_count || "—"}</td>
                    <td className="py-2 text-xs">{fmtTime(log.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
