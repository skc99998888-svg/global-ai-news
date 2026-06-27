// ============================================================
// 时间格式化 — 双时间显示：原文发布时间 + 本站更新时间
// ============================================================

/** 来源时区映射 */
const SOURCE_TZ: Record<string, { tz: string; label: string }> = {
  "OpenAI Blog":          { tz: "America/Los_Angeles", label: "美西" },
  "NVIDIA Blog":          { tz: "America/Los_Angeles", label: "美西" },
  "TechCrunch AI":        { tz: "America/Los_Angeles", label: "美西" },
  "VentureBeat AI":       { tz: "America/Los_Angeles", label: "美西" },
  "GitHub Blog":          { tz: "America/Los_Angeles", label: "美西" },
  "Anthropic News":       { tz: "America/Los_Angeles", label: "美西" },
  "Google AI Blog":       { tz: "America/Los_Angeles", label: "美西" },
  "Microsoft AI Blog":    { tz: "America/Los_Angeles", label: "美西" },
  "MIT Technology Review":{ tz: "America/New_York",    label: "美东" },
  "The Verge AI":         { tz: "America/New_York",    label: "美东" },
  "Ars Technica AI":      { tz: "America/New_York",    label: "美东" },
  "Hugging Face Blog":    { tz: "America/New_York",    label: "美东" },
};

const DEFAULT_TZ = { tz: "UTC", label: "UTC" };

function fmtTz(iso: string, tz: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("zh-CN", {
      timeZone: tz,
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(d);
  } catch {
    return "";
  }
}

function fmtBeijing(iso: string): string {
  return fmtTz(iso, "Asia/Shanghai");
}

export interface NewsTimeMeta {
  originalText: string;
  updatedText: string;
  combinedLines: string;
}

export function getNewsTimeMeta(n: {
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  sourceName?: string;
}): NewsTimeMeta {
  const tz = SOURCE_TZ[n.sourceName || ""] ?? DEFAULT_TZ;

  // 原文时间
  let originalText = "";
  if (n.publishedAt) {
    const s = fmtTz(n.publishedAt, tz.tz);
    if (s) originalText = `${s} ${tz.label}`;
  }

  // 本站更新时间：优先 updatedAt，fallback createdAt
  let updatedText = "";
  const siteTime = n.updatedAt || n.createdAt;
  if (siteTime) {
    const s = fmtBeijing(siteTime);
    if (s) updatedText = `${s} 北京`;
  }

  // 组合显示
  const parts = [originalText, updatedText].filter(Boolean);
  const combinedLines = parts.join(" · ");

  return { originalText, updatedText, combinedLines };
}
