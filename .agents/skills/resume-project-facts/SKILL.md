---
name: resume-project-facts
description: Calibrate the real scope of a resume project before writing interview questions or resume bullets. Use whenever the user wants to discuss their真实情况, role boundary, what they actually did, which claims are unsafe, whether a project should stay on the resume, or create/update a `*-facts.md` file under `private/carrier/resume/projects/`. This should be the default entry skill for project truth calibration.
---

# Resume Project Facts

## Purpose

Use this skill to answer the first question in the user's resume workflow:

What can the user truthfully, confidently, and repeatedly defend in an interview?

This skill is the upstream truth source for downstream resume and interview materials.

## Output

- Write or update exactly one facts file per project under `private/carrier/resume/projects/`.
- File naming rule: `project-name-facts.md`.
- If the matching facts file already exists, update it instead of creating a duplicate.

## Hard Rules

- Read existing local materials first before asking the user to restate obvious facts.
- Prefer local evidence over memory when both are available.
- Ask one question at a time.
- Calibrate role boundary before polishing language.
- Separate confirmed facts from risky or blocked claims.
- Do not write resume bullets, long whitepapers, oral scripts, or interview answer packs inside this skill.
- If the project was not launched or was stopped mid-implementation, mark that explicitly and default it out of the formal resume unless the user later decides otherwise.

## Default Workflow

1. Locate the project materials:
   - existing `*-facts.md` if any
   - old project notes under `private/carrier/resume/projects/`
   - code/docs/assets that can serve as evidence
2. Read enough local context to identify the highest-risk gaps first.
3. Ask one targeted question at a time, in this order unless evidence already answers it:
   - role boundary
   - key decisions
   - concrete implementation actions
   - defendable outcomes
   - blocked wording / unsafe metrics / unsafe titles
4. Write or update the facts file using the fixed template below.
5. End by routing the user to the next correct downstream step:
   - `interview-question-library` if they are preparing interview material
   - `interview-project-resume` if they are compressing into resume bullets

## Highest-Risk Gaps To Resolve

- What was the user's real role?
- What did the user personally implement or decide?
- Which outcomes are safe to claim?
- Which labels, metrics, role titles, and results should be blocked?
- Is this project formally resumable, interview-only, or should it be removed from the main resume?

## Facts Template

Use this exact section structure:

```markdown
# [项目名] 事实校准稿

> 用途：作为简历与面试表述的事实底稿。
> 原则：只记录已确认的真实情况；如果与包装稿冲突，以本稿为准。

## 项目背景

## 我的角色边界

## 关键决策

## 落地动作

## 拆解判断标准

## 取舍与非目标

## 可承担结果

## 暂不写入简历的内容

## 后续使用规则
```

## Writing Rules

- Use Chinese.
- Prefer short declarative bullets.
- Keep role, ownership, and non-goals explicit.
- If a metric is not confirmed, do not soften it into a fake number.
- If something is unsafe, block it explicitly instead of hinting around it.
- Facts files should stay compact enough for direct downstream reuse.

## Quality Gates

- Can the user defend every major claim in an interview?
- Does the file clearly separate ownership from participation?
- Are unpublished or stopped projects explicitly marked as such?
- Are risky titles, metrics, and outcomes clearly blocked from reuse?
- Could `interview-question-library` and `interview-project-resume` use this file directly without guessing?
