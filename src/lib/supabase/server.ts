// ============================================================
// Supabase 服务端客户端
// 使用 service role key 在服务端读取数据
// 环境变量缺失时返回 null，页面层自动 fallback 到 mock 数据
// 强制 no-store 以避免 Next.js/Netlify 缓存查询结果
// ============================================================

import { createClient } from "@supabase/supabase-js";

/**
 * 自定义 fetch：强制所有 Supabase 请求跳过缓存
 * 使用 new Headers() 保留 Supabase SDK 原始认证头（apikey / Authorization）
 */
type NextFetchInit = RequestInit & { next?: { revalidate?: number } };

const noStoreFetch: typeof fetch = (
  input: RequestInfo | URL,
  init?: RequestInit
) => {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-cache");
  headers.set("Pragma", "no-cache");

  const nextInit = init as NextFetchInit | undefined;

  return fetch(input, {
    ...init,
    headers,
    cache: "no-store",
    next: {
      ...(nextInit?.next ?? {}),
      revalidate: 0,
    },
  } as NextFetchInit);
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
