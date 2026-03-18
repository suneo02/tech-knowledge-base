# Interview Master Document Design

> Date: 2026-03-18
> Scope: 中文前端社招面试准备材料

## Goal

为现有的职业材料增加一份可直接背诵和反复演练的总面试文档，统一你的项目表达、能力叙事和高频行为题口径。

## Current Context

- 正式简历位于 `private/resume/resume.tex`，适合对外投递，不适合承载大量面试训练内容。
- 职业资料位于 `private/carrier/`，其中：
  - `background.md` 是静态背景底稿。
  - `projects/*-facts.md` 是事实边界层。
  - `projects/*-questions.md` 是按项目拆分的问题素材。
- 当前缺口不是“没有材料”，而是“没有一份适合中文社招临场表达的总稿”。

## Requirements

- 主产物是一份总面试文档，不是多个平行文档。
- 目标场景是中文前端社招面试。
- 文风要偏半逐字稿，很多题可以直接照着练和背。
- 每个观点后面都要挂具体例子。
- 不能贬低公司或同事，不能泄露公司机密。
- 所有内容都要围绕“毕业以来能力持续提升”和“学习能力强”这两条主线。
- 需要提前准备“最大错误 / 最大教训”并尽量嵌入项目叙事中。

## Options Considered

### Option 1: 一份总稿 + 现有 facts/questions 继续做素材库

优点：
- 面试前只需要看一份主文档。
- 不破坏现有材料结构。
- 最适合半逐字稿训练。

缺点：
- 主文档会较长，需要清晰目录和固定模板。

### Option 2: 一份总稿 + 独立例子库

优点：
- 主稿更短。
- 例子管理更灵活。

缺点：
- 面试前要来回切文档。
- 不适合高频重复演练。

### Option 3: 继续按项目分散维护

优点：
- 项目维度清晰。

缺点：
- 缺少统一叙事。
- 临场输出容易散。

## Recommendation

选择 Option 1。

保留 `private/carrier/projects/` 作为事实与素材层，新增一份 `private/carrier/interview-master.md` 作为唯一主稿。这样既能复用已有校准材料，又能把高频回答收束成一套稳定口径。

## Proposed File Placement

- 新增主文档：`private/carrier/interview-master.md`
- 保持不变：`private/carrier/background.md`
- 保持不变：`private/carrier/projects/*-facts.md`
- 保持不变：`private/carrier/projects/*-questions.md`
- 建议补充索引链接：`private/carrier/README.md`

## Proposed Document Structure

1. 回答原则
2. 面试总叙事
3. 自我介绍（30 秒 / 1 分钟 / 3 分钟）
4. 项目总览与项目分工
5. 四个核心项目的半逐字稿
6. 高频能力题
7. 最大错误 / 最大教训
8. 跳槽与求职动机题
9. 风险题与压力题
10. 面试前快速复习版
11. 个人答题提醒

## Content Rules

- 每个答案遵循“结论 -> 例子 -> 收获”。
- 项目回答遵循“背景 -> 角色 -> 难点 -> 判断 -> 动作 -> 结果 -> 反思”。
- 不写未经证实的量化数据。
- 不把渐进式改造说成从 0 到 1。
- 不把局部 owner 夸大成全局 owner。

## Source Mapping

- 总叙事与求职动机：来自 `private/carrier/background.md`
- 企业详情页：来自 `private/carrier/projects/company-facts.md`
- AI Chat：来自 `private/carrier/projects/ai-chat-facts.md`
- Report Print：来自 `private/carrier/projects/report-print-facts.md`
- Monorepo：来自 `private/carrier/projects/gel-workspace-monorepo-facts.md`

## Risks And Mitigations

- 风险：总稿变成资料堆。
  - 应对：每章固定模板，只保留可直接说出口的话。
- 风险：不同题目答案互相冲突。
  - 应对：先写总叙事，再写项目，再写行为题。
- 风险：为了“好听”突破事实边界。
  - 应对：所有内容回指 facts 稿，不新增无法自证的数据。

## Success Criteria

- 面试前只看一份文档就能完成主要复习。
- 自我介绍、项目题、行为题口径一致。
- “学习能力”“持续成长”“最大错误”这三类题都有可直接演练的答案。
- 用户可以从主文档快速跳回现有事实稿补细节。
