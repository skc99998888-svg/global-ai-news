// ============================================================
// 首页 — 全球 AI 快讯
// ============================================================

import { getRecentNews, getLatestDailyReport } from "@/lib/data";
import NewsCard from "@/components/NewsCard";
import CategoryNav from "@/components/CategoryNav";
import DailyEntry from "@/components/DailyEntry";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function HomePage() {
  const [recentNews, latestDaily] = await Promise.all([
    getRecentNews(),
    getLatestDailyReport(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      {/* Hero */}
      <section className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-3">
          🌐 全球 AI 快讯
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          看懂全球 AI 变化，发现普通人的新机会
        </p>
      </section>

      {/* Daily report entry */}
      {latestDaily && (
        <section className="mb-8">
          <DailyEntry report={latestDaily} />
        </section>
      )}

      {/* Category nav */}
      <section className="mb-6">
        <CategoryNav />
      </section>

      {/* News list */}
      <section>
        <h2 className="text-lg font-semibold text-slate-200 mb-4">
          最新快讯
        </h2>
        <div className="flex flex-col gap-4">
          {recentNews.map((news) => (
            <NewsCard key={news.id} news={news} />
          ))}
        </div>
        {recentNews.length === 0 && (
          <p className="text-center text-slate-500 py-12">
            暂无新闻，请稍后再来。
          </p>
        )}
      </section>
    </div>
  );
}
