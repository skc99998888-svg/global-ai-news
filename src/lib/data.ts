// ============================================================
// 数据读取层
// 优先从 Supabase 读取，失败时回退到本地 Mock 数据
// ============================================================

import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  newsItems as mockNews,
  getNewsById as mockGetNewsById,
  getNewsByCategory as mockGetNewsByCategory,
  getRecentNews as mockGetRecentNews,
  getNewsCount as mockGetNewsCount,
} from "@/data/news";
import {
  dailyReports as mockDailyReports,
  getDailyReportByDate as mockGetDailyReportByDate,
  getRecentDailyReports as mockGetRecentDailyReports,
  getDailyReportCount as mockGetDailyReportCount,
} from "@/data/dailyReports";
import {
  categories as mockCategories,
  getCategoryBySlug as mockGetCategoryBySlug,
} from "@/data/categories";
import type { NewsItem, DailyReport, Category, AdminStats, FetchLog } from "@/types";

// ============================================================
// Categories
// ============================================================

export async function getAllCategories(): Promise<Category[]> {
  const client = getSupabaseServerClient();
  if (!client) return mockCategories;

  const { data, error } = await client
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("[data] categories query failed:", error.message);
    return mockCategories;
  }

  if (!data || data.length === 0) return mockCategories;

  return data.map((c) => ({
    name: c.name,
    slug: c.slug,
    description: c.description ?? "",
  }));
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  const client = getSupabaseServerClient();
  if (!client) return mockGetCategoryBySlug(slug);

  const { data, error } = await client
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    if (error) console.error("[data] category query failed:", error.message);
    return mockGetCategoryBySlug(slug);
  }

  return {
    name: data.name,
    slug: data.slug,
    description: data.description ?? "",
  };
}

// ============================================================
// News
// ============================================================

function mapNewsItem(row: Record<string, unknown>): NewsItem {
  return {
    id: row.id as string,
    sourceName: row.source_name as string,
    sourceUrl: (row.source_url as string) ?? "",
    originalTitle: (row.original_title as string) ?? "",
    titleZh: row.title_zh as string,
    summaryZh: (row.summary_zh as string) ?? "",
    opportunityZh: (row.opportunity_zh as string) ?? "",
    category: row.category as string,
    tags: (row.tags as string[]) ?? [],
    importanceScore: (row.importance_score as number) ?? 5,
    publishedAt: row.published_at as string,
    originalUrl: (row.original_url as string) ?? "",
  };
}

export async function getAllNews(): Promise<NewsItem[]> {
  const client = getSupabaseServerClient();
  if (!client) return mockNews;

  const { data, error } = await client
    .from("news")
    .select("*")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[data] news query failed:", error.message);
    return mockNews;
  }

  if (!data || data.length === 0) return [];
  return data.map(mapNewsItem);
}

export async function getRecentNews(limit?: number): Promise<NewsItem[]> {
  const client = getSupabaseServerClient();
  if (!client) return mockGetRecentNews(limit);

  const query = client
    .from("news")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (limit) query.limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error("[data] recent news query failed:", error.message);
    return mockGetRecentNews(limit);
  }

  if (!data || data.length === 0) return [];
  return data.map(mapNewsItem);
}

export async function getNewsById(
  id: string
): Promise<NewsItem | undefined> {
  const client = getSupabaseServerClient();
  if (!client) return mockGetNewsById(id);

  const { data, error } = await client
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    if (error) console.error("[data] news detail query failed:", error.message);
    return mockGetNewsById(id);
  }

  return mapNewsItem(data);
}

export async function getNewsByCategory(
  slug: string
): Promise<NewsItem[]> {
  const client = getSupabaseServerClient();
  if (!client) return mockGetNewsByCategory(slug);

  const { data, error } = await client
    .from("news")
    .select("*")
    .eq("category", slug)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[data] category news query failed:", error.message);
    return mockGetNewsByCategory(slug);
  }

  if (!data || data.length === 0) return [];
  return data.map(mapNewsItem);
}

export async function getNewsCount(): Promise<number> {
  const client = getSupabaseServerClient();
  if (!client) return mockGetNewsCount();

  const { count, error } = await client
    .from("news")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("[data] news count query failed:", error.message);
    return mockGetNewsCount();
  }

  return count ?? mockGetNewsCount();
}

// ============================================================
// Daily Reports
// ============================================================

function mapDailyReport(row: Record<string, unknown>): DailyReport {
  return {
    id: row.id as string,
    date: row.date as string,
    title: row.title as string,
    summary: (row.summary as string) ?? "",
    topNewsIds: (row.top_news_ids as string[]) ?? [],
    trendAnalysis: (row.trend_analysis as string) ?? "",
    opportunityAnalysis: (row.opportunity_analysis as string) ?? "",
    content: (row.content as string) ?? "",
  };
}

export async function getRecentDailyReports(
  limit?: number
): Promise<DailyReport[]> {
  const client = getSupabaseServerClient();
  if (!client) return mockGetRecentDailyReports(limit);

  const query = client
    .from("daily_reports")
    .select("*")
    .order("date", { ascending: false });

  if (limit) query.limit(limit);

  const { data, error } = await query;

  if (error) {
    console.error("[data] daily reports query failed:", error.message);
    return mockGetRecentDailyReports(limit);
  }

  if (!data || data.length === 0) return [];
  return data.map(mapDailyReport);
}

export async function getDailyReportByDate(
  date: string
): Promise<DailyReport | undefined> {
  const client = getSupabaseServerClient();
  if (!client) return mockGetDailyReportByDate(date);

  const { data, error } = await client
    .from("daily_reports")
    .select("*")
    .eq("date", date)
    .single();

  if (error || !data) {
    if (error)
      console.error("[data] daily report query failed:", error.message);
    return mockGetDailyReportByDate(date);
  }

  return mapDailyReport(data);
}

export async function getDailyReportCount(): Promise<number> {
  const client = getSupabaseServerClient();
  if (!client) return mockGetDailyReportCount();

  const { count, error } = await client
    .from("daily_reports")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("[data] daily count query failed:", error.message);
    return mockGetDailyReportCount();
  }

  return count ?? mockGetDailyReportCount();
}

// ============================================================
// Admin Stats
// ============================================================

export async function getAdminStats(): Promise<AdminStats> {
  const client = getSupabaseServerClient();
  if (!client) {
    return {
      totalNews: mockGetNewsCount(),
      totalDailyReports: mockGetDailyReportCount(),
      lastUpdated: new Date().toISOString(),
      recentNewsCount24h: 0,
      countPublished: mockGetNewsCount(),
      countDuplicate: 0,
      countLowRelevance: 0,
      countAiFailed: 0,
    };
  }

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const [
    newsCount,
    dailyCount,
    recentNews,
    publishedCount,
    duplicateCount,
    lowRelevanceCount,
    aiFailedCount,
  ] = await Promise.all([
    client.from("news").select("*", { count: "exact", head: true }),
    client.from("daily_reports").select("*", { count: "exact", head: true }),
    client
      .from("news")
      .select("*", { count: "exact", head: true })
      .gte("published_at", twentyFourHoursAgo.toISOString()),
    client.from("news").select("*", { count: "exact", head: true }).eq("status", "published"),
    client.from("news").select("*", { count: "exact", head: true }).eq("status", "duplicate"),
    client.from("news").select("*", { count: "exact", head: true }).eq("status", "low_relevance"),
    client.from("news").select("*", { count: "exact", head: true }).eq("status", "ai_failed"),
  ]);

  return {
    totalNews: newsCount.count ?? mockGetNewsCount(),
    totalDailyReports: dailyCount.count ?? mockGetDailyReportCount(),
    lastUpdated: now.toISOString(),
    recentNewsCount24h: recentNews.count ?? 0,
    countPublished: publishedCount.count ?? 0,
    countDuplicate: duplicateCount.count ?? 0,
    countLowRelevance: lowRelevanceCount.count ?? 0,
    countAiFailed: aiFailedCount.count ?? 0,
  };
}

// ============================================================
// Fetch Logs
// ============================================================

export async function getRecentFetchLogs(
  limit: number = 8
): Promise<FetchLog[]> {
  const client = getSupabaseServerClient();
  if (!client) return [];

  const { data, error } = await client
    .from("fetch_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[data] fetch_logs query failed:", error.message);
    return [];
  }

  if (!data || data.length === 0) return [];
  return data.map((r: any) => ({
    task_name: r.task_name || "",
    status: r.status || "",
    message: r.message || "",
    started_at: r.started_at || null,
    finished_at: r.finished_at || null,
    news_count: r.news_count ?? 0,
    error_count: r.error_count ?? 0,
    created_at: r.created_at || "",
  }));
}

// ============================================================
// Latest Daily Report
// ============================================================

export async function getLatestDailyReport(): Promise<DailyReport | undefined> {
  const client = getSupabaseServerClient();
  if (!client) {
    const sorted = [...mockDailyReports].sort(
      (a, b) => b.date.localeCompare(a.date)
    );
    return sorted[0];
  }

  const { data, error } = await client
    .from("daily_reports")
    .select("*")
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    if (error) console.error("[data] latest daily query failed:", error.message);
    const sorted = [...mockDailyReports].sort(
      (a, b) => b.date.localeCompare(a.date)
    );
    return sorted[0];
  }

  return mapDailyReport(data);
}
