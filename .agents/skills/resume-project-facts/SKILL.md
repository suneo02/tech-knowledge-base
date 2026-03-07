---
name: resume-project-facts
description: Calibrate the true scope of a resume project before writing dossier, resume bullets, or interview Q&A. Use whenever the user wants to discuss their real project work, audit inflated project materials, confirm role boundaries, or create/update a `*-facts.md` file under `private/carrier/resume/projects/`.
---

# Resume Project Facts

## Purpose

Create and maintain a project facts file as the single source of truth for resume and interview materials.

This skill exists to answer one question first: what can the user truthfully and confidently claim?

## Output

- Write one facts file per project under `private/carrier/resume/projects/`.
- File naming rule: `project-name-facts.md`.
- If the matching facts file already exists, update it instead of creating a duplicate.

## Required Behavior

- Read existing project materials first.
- Prefer local evidence over user memory when both are available.
- Ask one question at a time.
- Calibrate role boundaries before polishing wording.
- Separate confirmed facts from risky or unconfirmed claims.
- Do not produce dossier, resume bullets, or interview scripts inside this skill.

## Workflow

1. Locate the project materials.
2. Read the current project dossier, any existing facts file, and relevant local source/docs if available.
3. Identify the highest-risk gaps first:
   - real role and ownership
   - what was actually implemented by the user
   - which results are safe to claim
   - which labels, metrics, or titles are unsafe
4. Ask one targeted question at a time until the project is stable enough to write.
5. Write or update the facts file using the template below.
6. Keep the file strict, compact, and reusable by downstream skills.

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
- Keep facts and boundaries explicit.
- Mark risky claims as not yet usable instead of softening them into vague prose.
- If a metric is not confirmed, do not convert it into a fake precise number.

## Quality Gates

- Can the user defend every major claim in an interview?
- Does the file clearly separate ownership from participation?
- Are risky titles, metrics, and outcomes explicitly blocked from reuse?
- Could `interview-project-dossier`, `interview-project-resume`, and `interview-question-library` use this file directly without guessing?
