// ============================================================
// 时间格式化 — 按新闻来源时区显示原文发布时间
// ============================================================

/** 来源时区映射 */
const SOURCE_TZ: Record<string, { tz: string; label: string }> = {
  "OpenAI Blog":          { tz: "America/Los_Angeles", label: "美国西部时间" },
  "NVIDIA Blog":          { tz: "America/Los_Angeles", label: "美国西部时间" },
  "TechCrunch AI":        { tz: "America/Los_Angeles", label: "美国西部时间" },
  "VentureBeat AI":       { tz: "America/Los_Angeles", label: "美国西部时间" },
  "GitHub Blog":          { tz: "America/Los_Angeles", label: "美国西部时间" },
  "Anthropic News":       { tz: "America/Los_Angeles", label: "美国西部时间" },
  "Google AI Blog":       { tz: "America/Los_Angeles", label: "美国西部时间" },
  "Microsoft AI Blog":    { tz: "America/Los_Angeles", label: "美国西部时间" },
  "MIT Technology Review":{ tz: "America/New_York",    label: "美国东部时间" },
  "The Verge AI":         { tz: "America/New_York",    label: "美国东部时间" },
  "Ars Technica AI":      { tz: "America/New_York",    label: "美国东部时间" },
  "Hugging Face Blog":    { tz: "America/New_York",    label: "美国东部时间" },
};

const DEFAULT_TZ = { tz: "UTC", label: "UTC时间" };

/**
 * 按来源时区格式化原文发布时间
 * 返回如 "美国西部时间：2026/6/26 18:01"，失败返回 ""
 */
export function formatSourceTime(publishedAt: string, sourceName: string): string {
  if (!publishedAt) return "";
  const tz = SOURCE_TZ[sourceName] ?? DEFAULT_TZ;
  try {
    const d = new Date(publishedAt);
    if (isNaN(d.getTime())) return "";
    const formatted = new Intl.DateTimeFormat("zh-CN", {
      timeZone: tz.tz,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
    return `${tz.label}：${formatted}`;
  } catch {
    return "";
  }
}
