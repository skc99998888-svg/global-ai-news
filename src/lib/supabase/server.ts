// ============================================================
// Supabase 服务端客户端
// 使用 service role key 在服务端读取数据
// 环境变量缺失时返回 null，页面层自动 fallback 到 mock 数据
// 强制 no-store 以避免 Next.js/Netlify 缓存查询结果
// ============================================================

import { createClient } from "@supabase/supabase-js";

/**
 * 自定义 fetch：强制所有 Supabase 请求跳过缓存
 * 解决线上页面持续显示旧数据的问题
 */
const noStoreFetch: typeof fetch = (
  input: RequestInfo | URL,
  init?: RequestInit
) => {
  // eslint-disable-next-line
  return fetch(input, {
    ...init,
    cache: "no-store",
    headers: {
      ...(init?.headers || {}),
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
    next: { revalidate: 0 },
  } as RequestInit & { next?: { revalidate?: number }; headers?: Record<string, string> });
};

export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.log(
      "[supabase] 环境变量未配置，将使用 Mock 数据。请配置 .env.local"
    );
    return null;
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
    },
    global: {
      fetch: noStoreFetch,
    },
  });
}
