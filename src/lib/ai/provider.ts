// ============================================================
// AI Provider — OpenAI SDK 封装
// 支持 OpenAI / DeepSeek 等兼容接口
// ============================================================

import OpenAI from "openai";

export function getAiProvider(): OpenAI | null {
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    console.error("[ai] AI_API_KEY 未配置");
    return null;
  }

  const baseURL = process.env.AI_BASE_URL || "https://api.deepseek.com";

  return new OpenAI({
    apiKey,
    baseURL,
  });
}

export function getAiModel(): string {
  return process.env.AI_MODEL || "deepseek-v4-flash";
}
