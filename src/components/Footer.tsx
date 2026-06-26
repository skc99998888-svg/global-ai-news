// ============================================================
// 页脚
// ============================================================

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span>🌐</span>
            <span className="text-slate-400">全球 AI 快讯</span>
            <span>© 2026</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/daily"
              className="hover:text-slate-300 transition-colors"
            >
              日报
            </Link>
            <Link
              href="/admin"
              className="hover:text-slate-300 transition-colors"
            >
              后台
            </Link>
            <span className="text-slate-600">
              看懂全球 AI 变化，发现普通人的新机会
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
