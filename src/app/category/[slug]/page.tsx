// ============================================================
// 分类页 /category/[slug]
// ============================================================

import { notFound } from "next/navigation";
import Link from "next/link";
import { getNewsByCategory, getCategoryBySlug } from "@/lib/data";
import NewsCard from "@/components/NewsCard";
import CategoryNav from "@/components/CategoryNav";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const newsList = await getNewsByCategory(slug);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-4"
      >
        ← 返回首页
      </Link>

      <section className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-2">
          {category.name}
        </h1>
        <p className="text-sm text-slate-400">{category.description}</p>
      </section>

      <section className="mb-6">
        <CategoryNav />
      </section>

      <p className="text-sm text-slate-500 mb-4">
        共 {newsList.length} 篇
      </p>

      <div className="flex flex-col gap-4">
        {newsList.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
        {newsList.length === 0 && (
          <p className="text-center text-slate-500 py-12">
            该分类下暂无新闻。
          </p>
        )}
      </div>
    </div>
  );
}
