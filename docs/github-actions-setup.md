# GitHub Actions 定时内容流水线 — 设置说明

## 需要配置的 Secrets

在 GitHub 仓库中添加 6 个 Secrets：

| 变量名 | 说明 | 示例值 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | `https://xxxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务端密钥 | `eyJ...` |
| `AI_PROVIDER` | AI 提供商标识 | `deepseek` |
| `AI_BASE_URL` | AI API 端点 | `https://api.deepseek.com` |
| `AI_MODEL` | AI 模型名称 | `deepseek-v4-flash` |
| `AI_API_KEY` | AI API 密钥 | `sk-...` |

## 添加步骤

1. 打开 GitHub 仓库页面
2. **Settings** → **Secrets and variables** → **Actions**
3. 点击 **New repository secret**
4. 逐个添加以上 6 个 Secret

## 安全提醒

- `SUPABASE_SERVICE_ROLE_KEY` 和 `AI_API_KEY` 是高权限密钥，**不要截图、不要发给任何人**
- 添加后 Secret 值不可查看，只能覆盖更新
- 如需轮换密钥，在 Actions Secrets 页面 **Update** 即可

## 定时规则

| 触发时间 | 说明 |
|---|---|
| `10 0 * * *` (UTC) | 北京时间 **08:10** |
| `30 12 * * *` (UTC) | 北京时间 **20:30** |

每天自动执行两次。

## 手动测试

1. 进入 **Actions** → **Global AI News Daily Pipeline**
2. 点击 **Run workflow**
3. 可选填写 `date`（格式 YYYY-MM-DD），留空则使用北京时间当天
4. 点击 **Run workflow** 按钮

## 如何查看运行日志

1. **Actions** → 点击某次运行
2. 点击 **daily-pipeline** job
3. 展开 **Run daily pipeline** 步骤
4. 日志中不包含任何密钥

## 脚本依赖

流水线步骤：`fetch:rss → process:ai → retry-failed → dedup → generate:daily`

所有脚本通过 `process.env` 读取 Secrets，无需创建 `.env.local` 文件。
