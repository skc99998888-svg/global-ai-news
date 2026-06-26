// ============================================================
// 分类筛选导航 — 横向滚动
// ============================================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/data/categories";

export default function CategoryNav() {
  const pathname = usePathname();

  return (
    <div className="overflow-x-auto scrollbar-hide -mx-1">
      <div className="flex items-center gap-1.5 px-1 min-w-max">
        <Link
          href="/"
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            pathname === "/"
              ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
              : "text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-800/50"
          }`}
        >
          全部
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              pathname === `/category/${cat.slug}`
                ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200 border border-transparent hover:bg-slate-800/50"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
