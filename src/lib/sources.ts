// ============================================================
// RSS 新闻源配置
// 每个源含 enabled 字段，disabled 的源在采集时跳过
// ============================================================

export interface RssSource {
  name: string;
  url: string;
  category: string;
  language: string;
  country: string;
  enabled: boolean;
}

export const rssSources: RssSource[] = [
  // ========================================
  // ✅ 已验证可用
  // ========================================
  {
    name: "OpenAI Blog",
    url: "https://openai.com/blog/rss.xml",
    category: "llm",
    language: "en",
    country: "US",
    enabled: true,
  },
  {
    name: "NVIDIA Blog",
    url: "https://blogs.nvidia.com/feed/",
    category: "hardware",
    language: "en",
    country: "US",
    enabled: true,
  },

  // ========================================
  // ✅ 新增源
  // ========================================
  {
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    category: "industry",
    language: "en",
    country: "US",
    enabled: true,
  },
  {
    name: "VentureBeat AI",
    url: "https://venturebeat.com/category/ai/feed/",
    category: "industry",
    language: "en",
    country: "US",
    enabled: true,
  },
  {
    name: "GitHub Blog",
    url: "https://github.blog/feed/",
    category: "tools",
    language: "en",
    country: "US",
    enabled: true,
  },
  {
    name: "Ars Technica AI",
    url: "https://feeds.arstechnica.com/arstechnica/ai",
    category: "research",
    language: "en",
    country: "US",
    enabled: false,
  },
  {
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/",
    category: "research",
    language: "en",
    country: "US",
    enabled: true,
  },
  {
    name: "The Verge AI",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    category: "industry",
    language: "en",
    country: "US",
    enabled: true,
  },

  // ========================================
  // ✅ 第二批新增源
  // ========================================
  {
    name: "Microsoft Research Blog",
    url: "https://www.microsoft.com/en-us/research/feed/",
    category: "research",
    language: "en",
    country: "US",
    enabled: true,
  },
  {
    name: "AWS ML Blog",
    url: "https://aws.amazon.com/blogs/machine-learning/feed/",
    category: "industry",
    language: "en",
    country: "US",
    enabled: true,
  },

  // ========================================
  // ✅ 中文源
  // ========================================
  {
    name: "量子位 (QbitAI)",
    url: "https://www.qbitai.com/feed",
    category: "industry",
    language: "zh",
    country: "CN",
    enabled: true,
  },

  // ========================================
  // ❌ 已知不可用（保留配置供后续修复）
  // ========================================
  {
    name: "Anthropic News",
    url: "https://www.anthropic.com/blog/rss.xml",
    category: "llm",
    language: "en",
    country: "US",
    enabled: false,
  },
  {
    name: "Google AI Blog",
    url: "https://blog.google/technology/ai/rss/",
    category: "research",
    language: "en",
    country: "US",
    enabled: false,
  },
  {
    name: "Microsoft AI Blog",
    url: "https://blogs.microsoft.com/ai/feed/",
    category: "industry",
    language: "en",
    country: "US",
    enabled: false,
  },
  {
    name: "Hugging Face Blog",
    url: "https://huggingface.co/blog/feed.xml",
    category: "opensource",
    language: "en",
    country: "US",
    enabled: false,
  },
];

/** 只返回启用的源 */
export function getEnabledSources(): RssSource[] {
  return rssSources.filter((s) => s.enabled !== false);
}
