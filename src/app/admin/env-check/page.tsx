// ============================================================
// 环境变量诊断页 /admin/env-check
// 只显示 present/missing，不输出任何密钥
// ============================================================

import { getSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function checkSupabase() {
  const client = getSupabaseServerClient();
  if (!client) {
    return { clientCreated: false, queryOk: false, count: null, error: null };
  }

  try {
    const { data, count, error } = await client
      .from("categories")
      .select("*", { count: "exact", head: true });

    return {
      clientCreated: true,
      queryOk: !error,
      count: count ?? null,
      error: error?.message ?? null,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return { clientCreated: true, queryOk: false, count: null, error: msg };
  }
}

export default async function EnvCheckPage() {
  const vars = [
    { name: "NEXT_PUBLIC_SUPABASE_URL", present: !!process.env.NEXT_PUBLIC_SUPABASE_URL },
    { name: "SUPABASE_SERVICE_ROLE_KEY", present: !!process.env.SUPABASE_SERVICE_ROLE_KEY },
    { name: "AI_PROVIDER", present: !!process.env.AI_PROVIDER },
    { name: "AI_BASE_URL", present: !!process.env.AI_BASE_URL },
    { name: "AI_MODEL", present: !!process.env.AI_MODEL },
    { name: "AI_API_KEY", present: !!process.env.AI_API_KEY },
  ];

  const supabase = await checkSupabase();

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-100 mb-2">环境变量诊断</h1>
      <p className="text-sm text-slate-500 mb-8">
        只显示是否存在，不显示任何密钥内容。
      </p>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">环境变量</h2>
        <div className="rounded-lg border border-slate-800 bg-slate-900/80 overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {vars.map((v) => (
                <tr key={v.name} className="border-b border-slate-800 last:border-0">
                  <td className="py-3 px-4 text-slate-400 font-mono text-xs">{v.name}</td>
                  <td className="py-3 px-4">
                    {v.present ? (
                      <span className="text-emerald-400">✅ present</span>
                    ) : (
                      <span className="text-red-400">❌ missing</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-slate-300 mb-3">Supabase 连接测试</h2>
        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Client:</span>
            {supabase.clientCreated ? (
              <span className="text-emerald-400">✅ created</span>
            ) : (
              <span className="text-red-400">❌ null（环境变量缺失）</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Query:</span>
            {supabase.queryOk ? (
              <span className="text-emerald-400">✅ success</span>
            ) : supabase.clientCreated ? (
              <span className="text-red-400">❌ failed</span>
            ) : (
              <span className="text-slate-600">—</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">categories count:</span>
            <span className="text-slate-100 font-mono">
              {supabase.count !== null ? supabase.count : "—"}
            </span>
          </div>
          {supabase.error && (
            <div className="text-sm text-red-400 bg-red-400/5 rounded p-2 mt-2 font-mono break-all">
              {supabase.error}
            </div>
          )}
        </div>
      </section>

      <p className="text-xs text-slate-600">
        诊断时间：{new Date().toISOString()}
      </p>
    </div>
  );
}
