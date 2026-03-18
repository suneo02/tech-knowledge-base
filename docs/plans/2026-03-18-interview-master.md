# Interview Master Document Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a single Chinese frontend interview master document that turns the existing resume/project materials into a semi-scripted practice guide.

**Architecture:** Keep the existing `background.md` and `projects/*-facts.md` files as the source-of-truth layer, then build one new `private/carrier/interview-master.md` file as the only practice-facing document. Add a README link so the master document becomes discoverable without changing the role of the existing materials.

**Tech Stack:** Markdown, ripgrep, existing career documents under `private/carrier/`

---

### Task 1: Create the interview master skeleton

**Files:**
- Create: `private/carrier/interview-master.md`
- Reference: `private/carrier/background.md`
- Reference: `private/carrier/projects/company-facts.md`
- Reference: `private/carrier/projects/ai-chat-facts.md`
- Reference: `private/carrier/projects/report-print-facts.md`
- Reference: `private/carrier/projects/gel-workspace-monorepo-facts.md`

**Step 1: Write the section headings**

Create `private/carrier/interview-master.md` with these top-level sections:

```md
# 前端社招面试总稿

## 回答原则
## 面试总叙事
## 自我介绍
## 项目总览
## AI Chat
## 企业详情页
## PDF 打印
## Monorepo
## 高频能力题
## 最大错误 / 最大教训
## 跳槽与求职动机
## 风险题与压力题
## 快速复习版
## 个人提醒
```

**Step 2: Verify the skeleton exists**

Run: `rg '^## ' private/carrier/interview-master.md`
Expected: all required section headings are listed once.

**Step 3: Add one-line usage notes under each section**

Write 1 to 2 lines per section explaining what belongs there so later drafting stays focused.

**Step 4: Re-check heading coverage**

Run: `rg '回答原则|面试总叙事|最大错误|快速复习版' private/carrier/interview-master.md`
Expected: all four anchor areas are found.

**Step 5: Commit**

```bash
git add private/carrier/interview-master.md
git commit -m "docs: add interview master skeleton"
```

### Task 2: Draft the global narrative and self-introduction

**Files:**
- Modify: `private/carrier/interview-master.md`
- Reference: `private/carrier/background.md`

**Step 1: Write the global narrative**

Draft the `面试总叙事` section with a stable throughline:
- 毕业以来能力持续提升
- 从需求交付进化到复杂状态、遗留系统、工程化
- 学习能力通过真实项目体现

Each paragraph must include at least one concrete project example.

**Step 2: Draft self-introductions**

Write three versions under `自我介绍`:
- 30 秒版
- 1 分钟版
- 3 分钟版

Each version must mention at least one project example and avoid empty claims.

**Step 3: Verify the narrative anchors**

Run: `rg '毕业以来|学习能力|30 秒版|1 分钟版|3 分钟版' private/carrier/interview-master.md`
Expected: all anchors are present.

**Step 4: Do a spoken-read sanity check**

Read the self-introduction sections aloud once and remove any sentence that sounds written instead of spoken.

**Step 5: Commit**

```bash
git add private/carrier/interview-master.md
git commit -m "docs: draft interview narrative and self-introductions"
```

### Task 3: Convert project facts into semi-scripted answers

**Files:**
- Modify: `private/carrier/interview-master.md`
- Reference: `private/carrier/projects/ai-chat-facts.md`
- Reference: `private/carrier/projects/company-facts.md`
- Reference: `private/carrier/projects/report-print-facts.md`
- Reference: `private/carrier/projects/gel-workspace-monorepo-facts.md`

**Step 1: Write the project overview map**

Under `项目总览`, assign each project a clear role:
- AI Chat: owner 感、状态设计、结构化消息
- 企业详情页: 复杂页面维护、渐进式优化
- PDF 打印: 遗留系统接手、复杂实现
- Monorepo: 工程化、边界和取舍

**Step 2: Draft four project sections**

For each project, use the same spoken template:

```md
### 背景
### 我的角色
### 难点
### 我怎么判断问题
### 我做了什么
### 结果
### 如果重来一次
```

Do not introduce unverified metrics.

**Step 3: Verify all project anchors**

Run: `rg '^## AI Chat|^## 企业详情页|^## PDF 打印|^## Monorepo|如果重来一次' private/carrier/interview-master.md`
Expected: all four project sections and the reflection anchor are present.

**Step 4: Cross-check fact boundaries**

Run: `rg '0 到 1|重构全部|彻底解决|95%|60%|45 分钟' private/carrier/interview-master.md`
Expected: no matches unless they can be explicitly defended from facts files.

**Step 5: Commit**

```bash
git add private/carrier/interview-master.md
git commit -m "docs: draft project interview scripts"
```

### Task 4: Draft behavior and risk questions

**Files:**
- Modify: `private/carrier/interview-master.md`

**Step 1: Draft high-frequency ability questions**

Under `高频能力题`, write semi-scripted answers for:
- 学习能力
- 毕业以来能力提升
- 解决复杂问题
- 技术取舍
- 协作与沟通
- 保证交付稳定性

Use the format `结论 -> 例子 -> 收获`.

**Step 2: Draft the major mistake answer**

Under `最大错误 / 最大教训`, write one answer with this structure:
- 当时错在哪
- 造成了什么问题
- 我如何补救
- 我后面怎么避免再犯

Prefer a mistake that can be embedded into a project narrative instead of a standalone disaster story.

**Step 3: Draft motivation and pressure questions**

Cover:
- 为什么换工作
- 为什么继续做前端
- 为什么想去更高要求的环境
- 需求变化 / 时间紧 / 被 challenge 时怎么处理

**Step 4: Verify answer coverage**

Run: `rg '学习能力|能力提升|最大错误|为什么换工作|时间紧|被 challenge' private/carrier/interview-master.md`
Expected: all major behavior themes are present.

**Step 5: Commit**

```bash
git add private/carrier/interview-master.md
git commit -m "docs: add interview behavior and risk answers"
```

### Task 5: Add quick review mode and index the document

**Files:**
- Modify: `private/carrier/interview-master.md`
- Modify: `private/carrier/README.md`

**Step 1: Add the quick review section**

Under `快速复习版`, compress the major answers into 3-sentence triggers:
- 先说结论
- 再给例子
- 最后讲收获

**Step 2: Add personal answer reminders**

Under `个人提醒`, add concise rules such as:
- 先结论后例子
- 不报未经证实的数据
- 不贬低公司或同事
- 每题尽量落回持续成长

**Step 3: Link the master document from the career README**

Add a new bullet in `private/carrier/README.md` pointing to `interview-master.md`, describing it as the main Chinese frontend interview practice document.

**Step 4: Verify discoverability**

Run: `rg 'interview-master.md|面试' private/carrier/README.md private/carrier/interview-master.md`
Expected: the README links to the master document and the master document includes the quick review section.

**Step 5: Commit**

```bash
git add private/carrier/README.md private/carrier/interview-master.md
git commit -m "docs: add interview master index and review section"
```

### Task 6: Final verification pass

**Files:**
- Review: `private/carrier/interview-master.md`
- Review: `private/carrier/README.md`

**Step 1: Run structural checks**

Run: `rg '^#|^## ' private/carrier/interview-master.md`
Expected: one H1 and the planned H2 sections appear in order.

**Step 2: Run content-safety checks**

Run: `rg '机密|保密数据|同事不行|公司不行' private/carrier/interview-master.md`
Expected: no careless wording that attacks the company or exposes sensitive information.

**Step 3: Run example-density check**

Run: `rg '例如|比如|拿 .* 来说|以 .* 为例' private/carrier/interview-master.md | wc -l`
Expected: enough explicit example markers to prove the draft is not abstract.

**Step 4: Manual rehearsal pass**

Read the full document once in spoken voice and shorten any sentence that cannot be delivered naturally in one breath.

**Step 5: Final commit**

```bash
git add private/carrier/README.md private/carrier/interview-master.md
git commit -m "docs: finalize frontend interview master document"
```
