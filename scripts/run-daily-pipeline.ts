// ============================================================
// 每日内容流水线
// 用法：npm run pipeline:daily [-- --skip-fetch] [-- --ai-limit=20] ...
// 按顺序执行：fetch → process → retry → dedup → daily
// ============================================================

import { createClient } from "@supabase/supabase-js";
import { spawn } from "child_process";
import { loadEnv } from "../src/lib/env";

// ============================================================
// 参数
// ============================================================

interface PipelineArgs {
  aiLimit: number;
  dailyLimit: number;
  date: string;
  skipFetch: boolean;
  skipAi: boolean;
  skipDedup: boolean;
  skipDaily: boolean;
}

function parseArgs(): PipelineArgs {
  const has = (flag: string) => process.argv.includes(flag);
  const getVal = (prefix: string, def: number) => {
    const arg = process.argv.find((a) => a.startsWith(prefix));
    if (arg) { const v = parseInt(arg.split("=")[1], 10); if (!isNaN(v) && v > 0) return v; }
    return def;
  };
  let date = new Date().toISOString().split("T")[0];
  const dateArg = process.argv.find((a) => a.startsWith("--date="));
  if (dateArg && /^\d{4}-\d{2}-\d{2}$/.test(dateArg.split("=")[1])) date = dateArg.split("=")[1];

  return {
    aiLimit: getVal("--ai-limit=", 20),
    dailyLimit: getVal("--daily-limit=", 15),
    date,
    skipFetch: has("--skip-fetch"),
    skipAi: has("--skip-ai"),
    skipDedup: has("--skip-dedup"),
    skipDaily: has("--skip-daily"),
  };
}

// ============================================================
// Env
// ============================================================
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase 配置缺失");
  return createClient(url, key, { auth: { persistSession: false } });
}

// ============================================================
// 执行单步
// ============================================================

function runStep(label: string, script: string, args: string[]): Promise<{ ok: boolean; output: string }> {
  return new Promise((resolve) => {
    console.log(`\n━━━ ${label} ━━━`);
    const child = spawn("npx", ["tsx", script, ...args], {
      cwd: process.cwd(),
      env: process.env,
      stdio: ["ignore", "pipe", "pipe"],
      shell: true,
    });

    let out = "";
    child.stdout.on("data", (d: Buffer) => {
      const text = d.toString();
      out += text;
      process.stdout.write(text);
    });
    child.stderr.on("data", (d: Buffer) => {
      const text = d.toString();
      out += text;
      process.stderr.write(text);
    });

    child.on("close", (code) => {
      const ok = code === 0;
      console.log(`${ok ? "✅" : "⚠"} ${label} ${ok ? "完成" : `exit ${code}`}`);
      resolve({ ok, output: out });
    });
  });
}

// ============================================================
// Main
// ============================================================

async function main() {
  console.log("=== pipeline:daily ===\n");
  const args = parseArgs();
  loadEnv();

  console.log(`日期: ${args.date}`);
  console.log(`AI limit: ${args.aiLimit}  Daily limit: ${args.dailyLimit}`);
  if (args.skipFetch) console.log("(skip fetch:rss)");
  if (args.skipAi) console.log("(skip process:ai + retry)");
  if (args.skipDedup) console.log("(skip dedup)");
  if (args.skipDaily) console.log("(skip generate:daily)");

  const startedAt = new Date().toISOString();
  const startTime = Date.now();
  let totalNews = 0;
  let totalErrors = 0;

  const supabase = getSupabase();

  // Step 1: fetch:rss
  if (!args.skipFetch) {
    const { ok } = await runStep("1/5 fetch:rss", "scripts/fetch-rss-news.ts", []);
    // 即使 partial_success 也继续
  }

  // Step 2: process:ai
  if (!args.skipAi) {
    const { ok } = await runStep("2/5 process:ai", "scripts/process-ai-news.ts", [
      `--limit=${args.aiLimit}`,
    ]);

    // Step 3: retry-failed
    const { ok: retryOk } = await runStep("3/5 retry-failed", "scripts/process-ai-news.ts", [
      "--limit=5",
      "--retry-failed",
    ]);
  }

  // Step 4: dedup
  if (!args.skipDedup) {
    const { ok } = await runStep("4/5 dedup", "scripts/mark-duplicates.ts", []);
  }

  // Step 5: generate:daily
  let dailyOk = true;
  if (!args.skipDaily) {
    const { ok } = await runStep("5/5 generate:daily", "scripts/generate-daily-report.ts", [
      `--date=${args.date}`,
      `--limit=${args.dailyLimit}`,
    ]);
    dailyOk = ok;
  }

  // Summary
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const pipelineStatus = dailyOk ? "success" : "partial_success";

  console.log(`\n=== pipeline 完成 ===`);
  console.log(`⏱ 总耗时: ${elapsed}s`);
  console.log(`状态: ${pipelineStatus}`);

  await supabase.from("fetch_logs").insert({
    task_name: "pipeline:daily",
    status: pipelineStatus,
    message: `流水线完成: ${args.date}, 耗时 ${elapsed}s`,
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    news_count: totalNews,
    error_count: totalErrors,
  });

  console.log("✅ pipeline:daily 已写入 fetch_logs");
  process.exit(dailyOk ? 0 : 1);
}

main().catch((err) => {
  console.error("异常:", err.message);
  process.exit(1);
});
