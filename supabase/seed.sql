-- ============================================================
-- 全球 AI 快讯 — Seed 数据
-- 将 Mock 数据填充到数据库中
-- 使用 ON CONFLICT 确保可重复执行
-- ============================================================

-- 分类数据
INSERT INTO categories (name, slug, description) VALUES
  ('大模型', 'llm', 'GPT、Claude、Gemini 等基础大模型的最新进展与能力对比'),
  ('AI 工具', 'tools', 'AI 编程、设计、写作、视频等生产力工具的新品与更新'),
  ('行业应用', 'industry', 'AI 在医疗、教育、金融、制造等行业的落地案例'),
  ('政策治理', 'policy', '全球 AI 监管政策、法律法规、伦理治理动态'),
  ('开源动态', 'opensource', '开源模型、框架、数据集与社区重要动态'),
  ('AI 硬件', 'hardware', 'AI 芯片、服务器、端侧设备与机器人硬件进展'),
  ('研究前沿', 'research', '重要论文、技术突破、新架构与新范式')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description;

-- 新闻数据
INSERT INTO news (id, source_name, source_url, original_title, title_zh, summary_zh, opportunity_zh, category, tags, importance_score, published_at, original_url) VALUES
  ('news-001', 'Anthropic', 'https://www.anthropic.com', 'Claude 4 Opus: A New Standard in Reasoning and Tool Use', 'Anthropic 发布 Claude 4 Opus：推理与工具使用能力达到新高度', 'Anthropic 正式发布 Claude 4 Opus 模型，在复杂推理、代码生成和多步骤工具调用方面全面超越前代。新模型支持 200K 上下文窗口，在数学竞赛和编程基准测试中刷新多项记录。', 'Claude 4 的代码能力大幅提升，对程序员来说意味着可以用更少的 prompt 工程完成更复杂的开发任务。建议开发者尽快熟悉其 tool use 新特性，在自动化工作流中替代部分人工环节。', 'llm', ARRAY['Claude', 'Anthropic', '推理', '工具使用'], 9, '2026-06-25T08:00:00Z', 'https://www.anthropic.com/research/claude-4-opus'),
  ('news-002', 'OpenAI', 'https://openai.com', 'GPT-5 Turbo Brings 10x Cost Reduction for Enterprise Workloads', 'OpenAI 推出 GPT-5 Turbo：企业级 AI 成本降低 90%', 'OpenAI 发布 GPT-5 Turbo 版本，通过模型蒸馏和推理优化，将企业 API 调用成本降低至 GPT-4o 的十分之一。同时保持了大部分能力水平，特别在文本总结和分类任务上表现持平。', 'AI 调用成本断崖式下降，意味着更多中小企业可以负担得起大规模 AI 应用。如果你正在做 AI 相关的 SaaS 产品，现在是扩充功能、降低价格、抢占市场的好时机。', 'llm', ARRAY['GPT-5', 'OpenAI', '成本优化', '企业'], 9, '2026-06-24T14:30:00Z', 'https://openai.com/blog/gpt-5-turbo'),
  ('news-003', 'Google DeepMind', 'https://deepmind.google', 'Gemini 3 Ultra Achieves Near-Human Performance on Scientific Benchmarks', 'DeepMind Gemini 3 Ultra 在科学基准测试中接近人类专家水平', 'Google DeepMind 的 Gemini 3 Ultra 在物理、化学、生物学等科学推理基准测试中取得突破性成绩。模型在实验设计和假设验证方面表现出接近博士级研究人员的能力。', '科研辅助 AI 正在成熟，科研人员和学生可以利用这类工具加速文献综述、实验设计和数据分析。对于做知识付费或教育内容创作的人来说，这是一个帮助受众理解复杂科学概念的好工具。', 'llm', ARRAY['Gemini', 'Google', '科学', '研究'], 8, '2026-06-23T10:00:00Z', 'https://deepmind.google/blog/gemini-3-ultra'),
  ('news-004', 'GitHub', 'https://github.blog', 'GitHub Copilot X Now Supports Full-Stack App Generation from Natural Language', 'GitHub Copilot X 支持自然语言生成全栈应用', 'GitHub 推出 Copilot X 重大更新，用户只需用自然语言描述应用需求，Copilot 即可自动生成包含前端、后端、数据库的完整应用代码。支持 Next.js、Python FastAPI、PostgreSQL 等主流技术栈。', '全栈应用自动生成能力意味着产品原型开发周期将从几周缩短到几天甚至几小时。对于有想法但缺乏全栈能力的创业者或产品经理来说，这是一个巨大的机会窗口。尽快学习如何用自然语言精准描述产品需求，将成为一项核心技能。', 'tools', ARRAY['GitHub Copilot', '代码生成', '全栈', '开发工具'], 8, '2026-06-22T09:00:00Z', 'https://github.blog/2026-06-22-copilot-x-fullstack'),
  ('news-005', '欧盟委员会', 'https://commission.europa.eu', 'EU AI Act: New Transparency Requirements for AI-Generated Content Take Effect', '欧盟 AI 法案新规生效：AI 生成内容必须标注来源', '欧盟 AI 法案最新实施细则正式生效，要求所有在欧盟境内发布的 AI 生成图文视频内容必须打上可识别的来源标签。违规企业将面临全球年营收 4% 的罚款。大型社交平台需在 3 个月内完成合规改造。', 'AI 内容标识成为刚需，催生了新的合规 SaaS 市场。如果你熟悉内容水印、元数据追踪或区块链存证技术，可以考虑开发 AI 内容溯源工具。同时，做海外内容运营的人需要尽快了解合规要求。', 'policy', ARRAY['欧盟', 'AI 法案', '监管', '内容标识'], 7, '2026-06-21T16:00:00Z', 'https://commission.europa.eu/ai-act-transparency-2026'),
  ('news-006', 'Meta', 'https://ai.meta.com', 'Meta Releases Llama 4 Open-Source Model Family with Vision and Coding Variants', 'Meta 发布 Llama 4 开源模型家族，包含视觉和编程专用版本', 'Meta 推出 Llama 4 系列开源模型，涵盖 8B、70B 和 405B 三个参数规模，并首次推出专门针对视觉理解和代码生成的微调变体。模型采用 Apache 2.0 许可证，允许商业使用。', 'Llama 4 的开源策略让中小团队也能部署高质量的专用 AI 模型。建议关注视觉和编程两个方向的微调版本，它们可能在特定场景下比通用模型更高效。开源的商业模式也让私有部署变得可行。', 'opensource', ARRAY['Llama 4', 'Meta', '开源', '视觉', '编程'], 8, '2026-06-20T12:00:00Z', 'https://ai.meta.com/blog/llama-4'),
  ('news-007', 'NVIDIA', 'https://www.nvidia.com', 'NVIDIA Blackwell Ultra GPU Starts Shipping, Doubles AI Inference Throughput', 'NVIDIA Blackwell Ultra GPU 开始发货，AI 推理吞吐量翻倍', 'NVIDIA 宣布 Blackwell Ultra GPU 正式出货，相比上一代 Hopper 架构，AI 推理吞吐量提升 2 倍，能效比提升 1.5 倍。首批客户包括微软、谷歌和亚马逊等云服务商。', 'AI 推理成本的持续下降意味着更多实时 AI 应用成为可能。如果你在做需要低延迟响应的 AI 产品（如语音助手、实时翻译），硬件的代级升级将在未来半年内显著改善用户体验和运营成本。', 'hardware', ARRAY['NVIDIA', 'GPU', 'Blackwell', '推理'], 7, '2026-06-19T08:00:00Z', 'https://www.nvidia.com/en-us/data-center/blackwell-ultra'),
  ('news-008', 'Tesla', 'https://www.tesla.com', 'Tesla Optimus Gen-3 Robots Begin Trials in Logistics Warehouses', '特斯拉 Optimus 第三代机器人开始在物流仓库试点', '特斯拉宣布 Optimus Gen-3 人形机器人开始在合作物流企业的仓库中试点运行，主要执行分拣、搬运和包装任务。机器人在重复性体力劳动中的效率已达到人类工人的 80%，但可 24 小时连续工作。', '仓储物流的自动化正在加速，这对物流从业者意味着需要向机器人运维和管理方向转型。同时，机器人维修、编程和优化将成为新的技能需求。对于普通人来说，关注机器人无法替代的能力（如异常处理、客户沟通）是长期竞争力所在。', 'hardware', ARRAY['Tesla', 'Optimus', '机器人', '物流', '自动化'], 7, '2026-06-18T10:00:00Z', 'https://www.tesla.com/optimus-gen3'),
  ('news-009', 'Microsoft Research', 'https://www.microsoft.com/en-us/research', 'Project Aurora: AI-Driven Drug Discovery Identifies Promising Cancer Treatment in 45 Days', '微软 AI 药物发现项目在 45 天内找到有前景的癌症治疗方案', '微软研究院的 Aurora 项目利用 AI 模型在 45 天内完成从靶点识别到先导化合物优化的全过程，而传统方法需要 3-5 年。该候选药物已进入临床前研究阶段，针对一种罕见肺癌。', 'AI 制药正在从概念验证走向实际产出，这意味着医药行业的研发效率将大幅提升。对于普通人来说，更重要的是关注 AI 对医疗诊断和健康管理的改善——未来几年 AI 辅助看诊和个性化健康建议将成为常态。', 'industry', ARRAY['AI 制药', '医疗', '药物发现', '微软'], 7, '2026-06-17T09:00:00Z', 'https://www.microsoft.com/en-us/research/project-aurora'),
  ('news-010', 'Stanford HAI', 'https://hai.stanford.edu', '2026 AI Index Report: Open-Source Models Close the Gap with Proprietary Systems', '斯坦福 2026 AI 指数报告：开源模型与闭源系统差距显著缩小', '斯坦福 HAI 发布 2026 年度 AI 指数报告，指出开源模型在 MMLU、HumanEval 等基准上的得分已达到闭源模型的 92%，较 2025 年提升 15 个百分点。报告还指出中国在 AI 论文数量和专利申请上保持全球领先。', '开源模型的追赶意味着 AI 技术不再是少数巨头的专利。创业者可以利用开源模型构建垂直行业的 AI 应用，而不必担心被上游供应商锁定。关注特定行业的痛点和数据壁垒，比追求通用 AI 能力更有商业价值。', 'research', ARRAY['AI 指数', '斯坦福', '开源', '报告', '基准测试'], 8, '2026-06-16T14:00:00Z', 'https://hai.stanford.edu/ai-index-2026'),
  ('news-011', 'Figma', 'https://www.figma.com', 'Figma AI 2.0: Design-to-Code Now Generates Production-Ready React Components', 'Figma AI 2.0 上线：设计稿直接生成生产级 React 组件代码', 'Figma 发布 AI 2.0 更新，设计转代码功能全面升级，可直接生成符合项目编码规范的生产级 React 组件。支持 Tailwind CSS、CSS Modules 等多种样式方案，并与 GitHub Copilot 深度集成。', '设计到代码的鸿沟正在消失，UI 设计师和前端开发者的工作边界将越来越模糊。设计师学习基础编程、开发者学习设计思维，将成为提升个人竞争力的有效路径。', 'tools', ARRAY['Figma', '设计转代码', 'React', 'UI'], 6, '2026-06-15T11:00:00Z', 'https://www.figma.com/blog/figma-ai-2-0'),
  ('news-012', '中国信通院', 'https://www.caict.ac.cn', '中国发布《生成式 AI 服务安全基本要求》修订版', '中国信通院发布生成式 AI 安全新标准，强化内容审核要求', '中国信通院发布《生成式 AI 服务安全基本要求》修订版，新增对 AI 生成内容的实时审核要求，并要求服务提供商建立完善的用户投诉和内容追溯机制。新标准将于 2026 年 9 月 1 日起实施。', 'AI 内容安全审核成为合规刚需。如果你具备 NLP 或内容风控相关背景，可以关注 AI 安全审核工具的开发机会。同时，在国内做 AI 应用的团队需要尽快了解新标准的具体要求。', 'policy', ARRAY['中国', '安全标准', '内容审核', '合规'], 7, '2026-06-14T08:00:00Z', 'https://www.caict.ac.cn/ai-safety-2026')
ON CONFLICT (id) DO UPDATE SET
  source_name = EXCLUDED.source_name,
  source_url = EXCLUDED.source_url,
  original_title = EXCLUDED.original_title,
  title_zh = EXCLUDED.title_zh,
  summary_zh = EXCLUDED.summary_zh,
  opportunity_zh = EXCLUDED.opportunity_zh,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  importance_score = EXCLUDED.importance_score,
  published_at = EXCLUDED.published_at,
  original_url = EXCLUDED.original_url;

-- 日报数据
INSERT INTO daily_reports (id, date, title, summary, top_news_ids, trend_analysis, opportunity_analysis, content) VALUES
  ('daily-001', '2026-06-25', 'Claude 4 与 GPT-5 同台竞技，开源生态持续繁荣', '今日 AI 领域两大旗舰模型相继发布重要更新，Anthropic 推出 Claude 4 Opus，OpenAI 发布 GPT-5 Turbo。与此同时，开源社区也在快速追赶，AI 工具生态日益成熟。', ARRAY['news-001', 'news-002'], E'## 今日趋势\n\n1. **旗舰模型迭代加速**：Claude 4 和 GPT-5 Turbo 的发布标志着基础模型竞争进入新阶段，推理能力和成本控制成为核心竞争维度。\n\n2. **开源与闭源差距缩小**：随着 Llama 4 等开源模型的发布，开源生态正在快速追赶闭源模型的能力水平。\n\n3. **AI 应用层爆发前夜**：底层模型成本下降和能力提升，正在为应用层的创新扫清障碍。\n\n## 值得关注的信号\n\n- 多家创业公司开始基于 Claude 4 构建复杂推理 Agent\n- GPT-5 Turbo 的企业 API 调用量在发布首日即翻倍\n- 开源社区对 Llama 4 的微调项目数量快速增长', E'## 对普通人的机会\n\n1. **学习成本降低**：更强的模型意味着更少的 prompt 工程技巧就能获得好的结果，非技术背景的人也能高效使用 AI。\n\n2. **创业窗口期**：基础模型能力趋于稳定、成本快速下降，做垂直领域 AI 应用的条件已经成熟。\n\n3. **技能转型信号**：重复性的文本处理、数据整理工作将被 AI 大量替代，建议向创意策划、策略制定、人际沟通等方向提升。', E'# 全球 AI 快讯 · 日报\n\n**日期**：2026 年 6 月 25 日\n\n---\n\n## 头条新闻\n\n### Anthropic 发布 Claude 4 Opus\n\nAnthropic 正式发布 Claude 4 Opus 模型，在复杂推理、代码生成和多步骤工具调用方面全面超越前代。新模型支持 200K 上下文窗口。\n\n**关键细节**：\n- 数学竞赛基准刷新多项记录\n- 编程能力大幅提升\n- Tool use 机制全面改进\n\n### OpenAI 推出 GPT-5 Turbo\n\nOpenAI 发布 GPT-5 Turbo，将企业 API 调用成本降低至 GPT-4o 的十分之一。\n\n**关键细节**：\n- 文本总结和分类任务表现持平\n- 适合大规模企业部署\n- 推理速度提升 3 倍\n\n---\n\n## 今日速览\n\n- GitHub Copilot X 支持自然语言生成全栈应用\n- Figma AI 2.0 设计转代码功能升级\n- 欧盟 AI 法案内容标注新规正式生效\n- NVIDIA Blackwell Ultra GPU 开始出货\n\n---\n\n> 以上内容由 全球 AI 快讯 自动采集与生成，仅供参考。'),
  ('daily-002', '2026-06-24', '欧盟 AI 法案落地，全球监管格局加速形成', '欧盟 AI 法案实施细则正式生效，中国也发布 AI 安全新标准。全球 AI 监管框架正在快速成型，这对 AI 产业的发展方向将产生深远影响。', ARRAY['news-005', 'news-012'], E'## 今日趋势\n\n1. **全球 AI 监管趋同**：欧盟和中国几乎同时推出 AI 内容监管新规，美国和日本也在加速相关立法。\n\n2. **合规成为竞争优势**：能够快速适应监管要求的企业将在国际市场上获得先发优势。\n\n3. **AI 标识技术需求激增**：内容溯源和 AI 生成标识技术成为新的创业热点。', E'## 对普通人的机会\n\n1. **合规咨询需求增长**：企业需要大量 AI 合规方面的人才，相关培训和认证值得关注。\n\n2. **内容创作规范化**：AI 辅助创作需要标注来源，这反而增加了人工策划和原创内容的价值。\n\n3. **技术工具市场**：AI 内容检测、水印、溯源等工具的市场需求快速增长。', E'# 全球 AI 快讯 · 日报\n\n**日期**：2026 年 6 月 24 日\n\n---\n\n## 头条新闻\n\n### 欧盟 AI 法案新规生效\n\n欧盟要求所有 AI 生成内容必须标注来源，违规罚款最高达全球年营收 4%。\n\n### 中国发布 AI 安全新标准\n\n中国信通院修订生成式 AI 安全标准，强化内容审核和追溯要求。\n\n---\n\n> 以上内容由 全球 AI 快讯 自动采集与生成，仅供参考。'),
  ('daily-003', '2026-06-23', 'AI 硬件突破：NVIDIA 新 GPU 与特斯拉机器人同步推进', 'NVIDIA Blackwell Ultra 开始发货，特斯拉 Optimus Gen-3 进入仓库试点。AI 从软件走向物理世界的步伐正在加快。', ARRAY['news-007', 'news-008'], E'## 今日趋势\n\n1. **AI 推理成本持续下降**：新一代 GPU 的部署将显著降低实时 AI 应用的运营成本。\n\n2. **具身智能从实验室走向产业**：人形机器人开始在物流等垂直场景中落地。\n\n3. **边缘 AI 加速发展**：硬件性能提升推动更多 AI 能力部署到终端设备。', E'## 对普通人的机会\n\n1. **机器人运维新职业**：随着机器人部署规模扩大，运维、编程和优化人才需求将快速增长。\n\n2. **边缘 AI 应用开发**：端侧 AI 能力增强为移动应用开发者带来新的创新空间。\n\n3. **物流行业转型**：物流从业者应关注自动化和机器人技术的发展方向。', E'# 全球 AI 快讯 · 日报\n\n**日期**：2026 年 6 月 23 日\n\n---\n\n## 头条新闻\n\n### NVIDIA Blackwell Ultra 出货\n\n新一代 GPU AI 推理吞吐量翻倍，首批客户包括微软、谷歌、亚马逊。\n\n### 特斯拉 Optimus Gen-3 试点\n\n人形机器人在物流仓库中试点运行，可 24 小时连续工作。\n\n---\n\n> 以上内容由 全球 AI 快讯 自动采集与生成，仅供参考。')
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date,
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  top_news_ids = EXCLUDED.top_news_ids,
  trend_analysis = EXCLUDED.trend_analysis,
  opportunity_analysis = EXCLUDED.opportunity_analysis,
  content = EXCLUDED.content;
