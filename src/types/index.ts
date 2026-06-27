// ============================================================
// 全球 AI 快讯 — 核心类型定义
// 后续对接 Supabase 时，这些类型直接映射到数据库表结构
// ============================================================

/** 新闻条目 */
export interface NewsItem {
  id: string;
  sourceName: string;       // 来源名称，如 "TechCrunch"
  sourceUrl: string;         // 来源主页
  originalTitle: string;     // 原始标题（英文/其他语言）
  titleZh: string;           // 中文标题
  summaryZh: string;         // 中文摘要
  opportunityZh: string;     // 机会解读 — 对普通人的启示
  category: string;          // 分类 slug，如 "llm", "tools", "policy"
  tags: string[];            // 标签列表
  importanceScore: number;   // 重要性评分 1–10
  publishedAt: string;       // ISO 8601 发布时间
  originalUrl: string;       // 原文链接
  createdAt?: string;        // 本站收录时间（Supabase created_at）
  updatedAt?: string;        // 本站更新时间（Supabase updated_at）
}

/** 每日 AI 日报 */
export interface DailyReport {
  id: string;
  date: string;              // YYYY-MM-DD
  title: string;             // 日报标题
  summary: string;           // 日报摘要
  topNewsIds: string[];      // 头条新闻 ID 列表
  trendAnalysis: string;     // AI 趋势分析
  opportunityAnalysis: string; // 机会分析
  content: string;           // 日报正文（Markdown）
}

/** 新闻分类 */
export interface Category {
  name: string;              // 中文名称，如 "大模型"
  slug: string;              // URL slug，如 "llm"
  description: string;       // 分类说明
}

/** 后台统计数据 */
export interface AdminStats {
  totalNews: number;
  totalDailyReports: number;
  lastUpdated: string;       // ISO 8601
  recentNewsCount24h: number;
  countPublished: number;
  countDuplicate: number;
  countLowRelevance: number;
  countAiFailed: number;
}

/** 采集 / 任务日志 */
export interface FetchLog {
  task_name: string;
  status: string;
  message: string;
  started_at: string | null;
  finished_at: string | null;
  news_count: number;
  error_count: number;
  created_at: string;
}
