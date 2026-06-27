// ============================================================
// Supabase 服务端客户端
// 使用 service role key 在服务端读取数据
// 环境变量缺失时返回 null，页面层自动 fallback 到 mock 数据
// ============================================================

import { createClient } from "@supabase/supabase-js";

export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.warn("[supabase] Missing Supabase env");
    return null;
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
