// ============================================================
// 日报列表页 /daily
// ============================================================

import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { getRecentDailyReports } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  } catch {
    return dateStr;
  }
}

export default async function DailyListPage() {
  noStore();
  const sortedReports = await getRecentDailyReports();

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-4"
      >
        ← 返回首页
      </Link>

      <section className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
          📰 每日 AI 日报
        </h1>
        <p className="text-sm text-slate-400">
          每日追踪全球 AI 动态，提供趋势分析与机会解读。
        </p>
      </section>

      <div className="flex flex-col gap-4">
        {sortedReports.map((report) => (
          <Link
            key={report.id}
            href={`/daily/${report.date}`}
            className="block group"
          >
            <article className="rounded-lg border border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900 transition-colors p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors mb-1">
                    {report.title}
                  </h2>
                  <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
                    {report.summary}
                  </p>
                </div>
                <time
                  dateTime={report.date}
                  className="text-xs text-slate-500 whitespace-nowrap shrink-0 mt-1"
                >
                  {formatDate(report.date)}
                </time>
              </div>
            </article>
          </Link>
        ))}
        {sortedReports.length === 0 && (
          <p className="text-center text-slate-500 py-12">
            暂无日报，敬请期待。
          </p>
        )}
      </div>
    </div>
  );
}
