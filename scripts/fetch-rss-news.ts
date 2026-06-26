// ============================================================
// RSS 新闻采集脚本 v2
// 用法：npm run fetch:rss
// - 只采集 enabled 源
// - 写入 fetch_logs 表
// - 单个源失败不影响其他源
// ============================================================

import { createClient } from "@supabase/supabase-js";
import Parser from "rss-parser";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { getEnabledSources } from "../src/lib/sources";

// ============================================================
// 类型
// ============================================================

interface FetchedItem {
  id: string;
  source_name: string;
  source_url: string;
  original_title: string;
  title_zh: string;
  summary_zh: string;
  opportunity_zh: string;
  category: string;
  tags: string[];
  importance_score: number;
  published_at: string;
  original_url: string;
  status: string;
}

interface SourceResult {
  source: string;
  parsedCount: number;
  writtenCount: number;
  error?: string;
}

// ============================================================
// 工具函数
// ============================================================

function generateStableId(sourceName: string, link: string): string {
  return (
    "rss-" +
    crypto
      .createHash("sha256")
      .update(`${sourceName}:${link}`)
      .digest("hex")
      .slice(0, 16)
  );
}

function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("❌ .env.local 文件不存在，请先创建并配置 Supabase 密钥。");
    process.exit(1);
  }

  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (key && value && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL 未设置");
  return url;
}

function getServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY 未设置");
  return key;
}

// ============================================================
// 主逻辑
// ============================================================

async function main() {
  console.log("=== 全球 AI 快讯 · RSS 新闻采集 v2 ===\n");
  const startTime = Date.now();

  // 加载环境变量
  loadEnv();

  let supabaseUrl: string;
  let serviceKey: string;
  try {
    supabaseUrl = getSupabaseUrl();
    serviceKey = getServiceRoleKey();
  } catch (err) {
    console.error("❌ 环境变量加载失败:", (err as Error).message);
    process.exit(1);
  }

  console.log("✓ Supabase 配置已加载\n");

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  // 获取启用的源
  const sources = getEnabledSources();
  console.log(`📋 共 ${sources.length} 个已启用的 RSS 源\n`);

  // 写入 fetch_logs: started
  const { data: fetchLog } = await supabase
    .from("fetch_logs")
    .insert({
      task_name: "fetch:rss",
      status: "started",
      message: `开始采集 ${sources.length} 个 RSS 源`,
      started_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  const logId: string | null = fetchLog?.id ?? null;

  const parser = new Parser({
    timeout: 15000,
  });

  const results: SourceResult[] = [];
  let totalWritten = 0;
  let totalErrors = 0;

  for (const source of sources) {
    console.log(`📡 [${source.name}]`);
    const result: SourceResult = {
      source: source.name,
      parsedCount: 0,
      writtenCount: 0,
    };

    try {
      const feed = await parser.parseURL(source.url);

      if (!feed || !feed.items || feed.items.length === 0) {
        console.log(`   ⚠ 未解析到任何条目`);
        results.push(result);
        continue;
      }

      result.parsedCount = feed.items.length;
      console.log(`   ✓ 解析到 ${feed.items.length} 条`);

      // 最多取 10 条
      const items = feed.items.slice(0, 10);

      const rows: FetchedItem[] = items.map((item) => {
        const link = item.link || "";
        const title = item.title || "Untitled";
        const pubDate =
          item.isoDate || item.pubDate || new Date().toISOString();

        return {
          id: generateStableId(source.name, link),
          source_name: source.name,
          source_url: source.url,
          original_title: title,
          title_zh: title,
          summary_zh:
            item.contentSnippet?.slice(0, 500) ||
            item.content?.slice(0, 500) ||
            "",
          opportunity_zh: "",
          category: source.category,
          tags: [],
          importance_score: 5,
          published_at: pubDate,
          original_url: link,
          status: "published",
        };
      });

      const { error } = await supabase.from("news").upsert(rows, {
        onConflict: "id",
        ignoreDuplicates: false,
      });

      if (error) {
        console.log(`   ❌ 写入失败: ${error.message}`);
        result.error = error.message;
        totalErrors++;
      } else {
        result.writtenCount = rows.length;
        console.log(`   ✅ 写入 ${rows.length} 条`);
        totalWritten += rows.length;
      }
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      console.log(`   ❌ 采集失败: ${reason}`);
      result.error = reason;
      totalErrors++;
    }

    results.push(result);

    // 源之间短暂间隔
    if (sources.indexOf(source) < sources.length - 1) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  // 汇总
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const successCount = results.filter((r) => !r.error).length;
  const failCount = results.filter((r) => r.error).length;

  let finalStatus: "success" | "partial_success" | "failed";
  if (failCount === 0) {
    finalStatus = "success";
  } else if (successCount > 0) {
    finalStatus = "partial_success";
  } else {
    finalStatus = "failed";
  }

  console.log("\n=== 采集完成 ===");
  console.log(`✓ 成功: ${successCount} 个源`);
  if (failCount > 0) {
    console.log(`⚠ 失败: ${failCount} 个源`);
    for (const r of results.filter((r) => r.error)) {
      console.log(`  - ${r.source}: ${r.error}`);
    }
  }
  console.log(`✓ 总写入: ${totalWritten} 条`);
  console.log(`⏱ 耗时: ${elapsed}s`);

  // 更新 fetch_logs
  if (logId) {
    await supabase
      .from("fetch_logs")
      .update({
        status: finalStatus,
        message: `${successCount}/${sources.length} 源成功, 写入 ${totalWritten} 条`,
        finished_at: new Date().toISOString(),
        news_count: totalWritten,
        error_count: failCount,
      })
      .eq("id", logId);
    console.log("✓ 已写入 fetch_logs");
  }

  // 根据结果设置 exit code
  if (finalStatus === "failed") {
    console.log("\n❌ 所有源均失败");
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("❌ 脚本异常:", err.message);
  process.exit(1);
});
