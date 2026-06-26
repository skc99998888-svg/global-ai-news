// ============================================================
// 日报详情页 /daily/[date]
// ============================================================

import { notFound } from "next/navigation";
import Link from "next/link";
import { getDailyReportByDate, getNewsById } from "@/lib/data";

export const dynamic = "force-dynamic";
import NewsCard from "@/components/NewsCard";

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

function renderMarkdown(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^---$/gm, '<hr>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hluib])/gm, '<p>')
    .replace(/(?<![>\n])$/gm, '</p>');
}

type Props = {
  params: Promise<{ date: string }>;
};

export default async function DailyDetailPage({ params }: Props) {
  const { date } = await params;
  const report = await getDailyReportByDate(date);

  if (!report) {
    notFound();
  }

  const topNews = (
    await Promise.all(report.topNewsIds.map((id) => getNewsById(id)))
  ).filter(Boolean);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <Link
        href="/daily"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-6"
      >
        ← 返回日报列表
      </Link>

      <article>
        <header className="mb-8">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <span className="text-cyan-500 font-medium">每日 AI 日报</span>
            <span className="text-slate-700">·</span>
            <time dateTime={report.date}>{formatDate(report.date)}</time>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3 leading-snug">
            {report.title}
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            {report.summary}
          </p>
        </header>

        {topNews.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">
              📌 头条新闻
            </h2>
            <div className="flex flex-col gap-3">
              {topNews.map(
                (news) => news && <NewsCard key={news.id} news={news} />
              )}
            </div>
          </section>
        )}

        {/* 日报正文（优先） */}
        {report.content ? (
          <section className="pt-6 border-t border-slate-800">
            <div
              className="prose-daily whitespace-pre-wrap"
              dangerouslySetInnerHTML={{
                __html: renderMarkdown(report.content),
              }}
            />
          </section>
        ) : (
          <>
            {/* 正文为空时 fallback */}
            {report.trendAnalysis && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-cyan-400 mb-3">
                  📊 趋势分析
                </h2>
                <div
                  className="prose-daily rounded-lg border border-slate-800 bg-slate-900/60 p-4 sm:p-5"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(report.trendAnalysis),
                  }}
                />
              </section>
            )}
            {report.opportunityAnalysis && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-emerald-400 mb-3">
                  💡 机会分析
                </h2>
                <div
                  className="prose-daily rounded-lg border border-emerald-500/10 bg-emerald-950/20 p-4 sm:p-5"
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(report.opportunityAnalysis),
                  }}
                />
              </section>
            )}
          </>
        )}
      </article>
    </div>
  );
}
