// ============================================================
// 顶部导航栏 — 深色科技风
// ============================================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { categories } from "@/data/categories";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
          >
            <span className="text-xl">🌐</span>
            <span className="hidden sm:inline">全球 AI 快讯</span>
            <span className="sm:hidden">AI 快讯</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto">
            <Link
              href="/daily"
              className={`px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${
                isActive("/daily")
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              📰 日报
            </Link>
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${
                  isActive(`/category/${cat.slug}`)
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/admin"
              className={`px-3 py-1.5 rounded-md text-sm transition-colors whitespace-nowrap ${
                isActive("/admin")
                  ? "bg-cyan-500/10 text-cyan-400"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
              }`}
            >
              ⚙️
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-slate-200"
            aria-label="Toggle menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 pb-3 pt-2">
            <Link
              href="/daily"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            >
              📰 每日 AI 日报
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-sm text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
            >
              ⚙️ 后台管理
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
