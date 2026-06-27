// ============================================================
// 共享环境变量加载器
// 本地：从 .env.local 补充 process.env
// CI：process.env 已注入，跳过文件读取
// ============================================================

import fs from "fs";
import path from "path";

export function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");

  if (!fs.existsSync(envPath)) {
    // CI 环境：.env.local 不存在是正常的，process.env 已由 GitHub Secrets 注入
    return;
  }

  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    const k = trimmed.slice(0, i).trim();
    const v = trimmed.slice(i + 1).trim();
    // 只在 process.env 中没有时才设置，CI 注入的值优先
    if (k && v && !process.env[k]) {
      process.env[k] = v;
    }
  }
}
