// ============================================================
// 新闻卡片组件 — 按来源时区显示原文发布时间
// ============================================================

import Link from "next/link";
import { NewsItem } from "@/types";
import { categories } from "@/data/categories";
import { formatSourceTime } from "@/lib/time-format";

function getCategoryName(slug: string): string {
  const cat = categories.find((c) => c.slug === slug);
  return cat?.name ?? slug;
}

export default function NewsCard({ news }: { news: NewsItem }) {
  const sourceTime = formatSourceTime(news.publishedAt, news.sourceName);

  return (
    <Link
      href={`/news/${news.id}`}
      className="block group"
    >
      <article className="rounded-lg border border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900 transition-colors p-4 sm:p-5">
        {/* Meta row */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 flex-wrap">
          <span className="text-cyan-500 font-medium">
            {getCategoryName(news.category)}
          </span>
          <span className="text-slate-700">·</span>
          <span>{news.sourceName}</span>
          {sourceTime && (
            <>
              <span className="text-slate-700">·</span>
              <span>{sourceTime}</span>
            </>
          )}
          {news.importanceScore >= 8 && (
            <>
              <span className="text-slate-700">·</span>
              <span className="text-amber-500 font-medium">🔥 重要</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg font-semibold text-slate-100 group-hover:text-cyan-400 transition-colors mb-2 leading-snug">
          {news.titleZh}
        </h3>

        {/* Summary */}
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
          {news.summaryZh}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          {news.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </article>
    </Link>
  );
}
