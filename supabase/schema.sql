-- ============================================================
-- 全球 AI 快讯 — 数据库 Schema
-- 执行此文件创建 4 张表和索引
-- ============================================================

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- 新闻表
CREATE TABLE IF NOT EXISTS news (
  id text PRIMARY KEY,
  source_name text NOT NULL,
  source_url text,
  original_title text,
  title_zh text NOT NULL,
  summary_zh text,
  opportunity_zh text,
  category text REFERENCES categories(slug),
  tags text[] DEFAULT '{}',
  importance_score int DEFAULT 5,
  published_at timestamptz,
  original_url text,
  status text DEFAULT 'published',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 每日日报表
CREATE TABLE IF NOT EXISTS daily_reports (
  id text PRIMARY KEY,
  date date UNIQUE NOT NULL,
  title text NOT NULL,
  summary text,
  top_news_ids text[] DEFAULT '{}',
  trend_analysis text,
  opportunity_analysis text,
  content text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 采集日志表
CREATE TABLE IF NOT EXISTS fetch_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_name text,
  status text,
  message text,
  started_at timestamptz,
  finished_at timestamptz,
  news_count int DEFAULT 0,
  error_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_news_category ON news(category);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_importance_score ON news(importance_score DESC);
CREATE INDEX IF NOT EXISTS idx_daily_reports_date ON daily_reports(date DESC);
CREATE INDEX IF NOT EXISTS idx_fetch_logs_created_at ON fetch_logs(created_at DESC);

-- 生产阶段如果开放客户端查询，需要重新设计 RLS 策略。
