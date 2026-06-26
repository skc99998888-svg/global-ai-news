// ============================================================
// 新闻详情页 /news/[id]
// ============================================================

import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsById } from "@/lib/data";
import { categories } from "@/data/categories";

export const dynamic = "force-dynamic";

function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

function getCategoryName(slug: string): string {
  const cat = categories.find((c) => c.slug === slug);
  return cat?.name ?? slug;
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const news = await getNewsById(id);

  if (!news) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-6"
      >
        ← 返回首页
      </Link>

      <article>
        <header className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3 flex-wrap">
            <Link
              href={`/category/${news.category}`}
              className="text-cyan-500 font-medium hover:text-cyan-400"
            >
              {getCategoryName(news.category)}
            </Link>
            <span className="text-slate-700">·</span>
            <span>{news.sourceName}</span>
            <span className="text-slate-700">·</span>
            <time dateTime={news.publishedAt}>
              {formatDateTime(news.publishedAt)}
            </time>
            {news.importanceScore >= 8 && (
              <>
                <span className="text-slate-700">·</span>
                <span className="text-amber-500 font-medium">
                  🔥 重要性 {news.importanceScore}/10
                </span>
              </>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mb-3 leading-snug">
            {news.titleZh}
          </h1>

          <p className="text-sm text-slate-500">
            原标题：{news.originalTitle}
          </p>
        </header>

        <div className="flex items-center gap-1.5 mb-6 flex-wrap">
          {news.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2.5 py-1 rounded-md text-xs bg-slate-800 text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <section className="mb-6">
          <h2 className="text-sm font-semibold text-cyan-400 mb-2 uppercase tracking-wide">
            📝 中文摘要
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {news.summaryZh}
            </p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-sm font-semibold text-emerald-400 mb-2 uppercase tracking-wide">
            💡 机会解读
          </h2>
          <div className="rounded-lg border border-emerald-500/10 bg-emerald-950/20 p-4">
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {news.opportunityZh}
            </p>
          </div>
        </section>

        <section className="mb-6 pt-4 border-t border-slate-800">
          <a
            href={news.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-cyan-500 hover:text-cyan-400 transition-colors"
          >
            🔗 查看原文
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </section>
      </article>
    </div>
  );
}
