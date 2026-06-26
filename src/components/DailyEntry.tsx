// ============================================================
// 日报入口卡片 — 首页日报模块
// ============================================================

import Link from "next/link";
import { DailyReport } from "@/types";

export default function DailyEntry({ report }: { report: DailyReport }) {
  const dateDisplay = new Date(report.date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <Link href={`/daily/${report.date}`} className="block group">
      <div className="rounded-lg border border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 to-slate-900/80 hover:border-cyan-500/40 transition-colors p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">📰</span>
          <span className="text-sm text-cyan-400 font-medium">
            今日 AI 日报
          </span>
          <span className="text-xs text-slate-500">{dateDisplay}</span>
        </div>
        <h3 className="text-base font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors mb-2">
          {report.title}
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
          {report.summary}
        </p>
        <div className="mt-3 text-xs text-cyan-500 group-hover:text-cyan-400 transition-colors">
          查看完整日报 →
        </div>
      </div>
    </Link>
  );
}
