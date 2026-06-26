import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-slate-600 mb-4">404</h1>
      <p className="text-slate-400 mb-6">你访问的页面不存在。</p>
      <Link
        href="/"
        className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors text-sm"
      >
        ← 返回首页
      </Link>
    </div>
  );
}
