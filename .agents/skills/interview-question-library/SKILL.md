---
name: interview-question-library
description: Generate and maintain interview question packs, especially project-specific packs derived from `*-facts.md`. Use whenever the user wants to prepare project interview questions, improve project answers, turn facts into high-frequency questions plus spoken answers, maintain `*-questions.md`, or stress-test what an interviewer is likely to ask. This is the main skill for turning project facts into interview-ready material.
---

# Interview Question Library

## Purpose

Use this skill to turn calibrated project facts into interview-ready question packs.

In this resume system, project question packs are not secondary notes. They are the main interview material.

## Quick Start

1. Read `AGENTS.md` for repository-wide conventions and general writing rules.
2. If the task is a project-specific interview pack, read the matching `*-facts.md` file first.
3. Use other local materials only as supporting evidence. Do not depend on old dossier-style packaging.
4. Read the relevant reference file:
   - `references/interview-question-writing.md`
   - `references/interview-question-organization.md`

## Core Routing

- If the user is still clarifying real ownership, safe claims, or project truth, route to `resume-project-facts`.
- If the user wants resume bullets or a full resume rewrite, route to `interview-project-resume`.
- Stay in this skill when the user wants:
  - project interview questions
  - better answers to likely interviewer follow-ups
  - a `*-questions.md` file
  - spoken answer upgrades for existing questions

## Project Pack Rules

- `facts` is the authority for what can be claimed.
- Supporting docs and code may sharpen follow-up questions, but must not override facts boundaries.
- If no `*-facts.md` exists, do not start the question pack yet; route to `resume-project-facts`.
- If a project is marked as unpublished / not for the formal resume, do not add it to the main project question set unless the user explicitly asks.

## Output Rules

- Write in Chinese.
- Keep file and directory names in `kebab-case`.
- Use relative links for internal links.
- For project interview packs, each question must include:
  - `分类`：基础 / 决策 / 深挖 / 风险质疑
  - `风险等级`：低 / 中 / 高
  - `回答锚点`
  - `参考回答`

## Answer Rules

- Default answer style: spoken Chinese, not whitepaper prose.
- Default answer length: roughly 150-220 Chinese characters unless the user requests a different format.
- Lead with the conclusion, then explain the reasoning.
- Keep answers bounded by facts. Do not repair weak evidence by inventing certainty.
- Prefer high-frequency, high-risk questions over broad coverage.

## Recommended Pack Structure

Use this structure unless the user asks for something else:

```markdown
# [项目名] 面试问题

> 基于 [project-facts.md](./project-facts.md) 的项目问答稿。

## 基础题

## 决策题

## 深挖题

## 风险质疑题
```

## Question Selection Heuristic

Prioritize questions that help the user survive real interviews:

1. What did you actually do?
2. Why this solution instead of another one?
3. How was the key flow or mechanism organized?
4. What result are you willing to claim?
5. Which previous packaging claims should now be blocked?

## When Not To Add More Questions

- Do not generate question sprawl just because source material is long.
- If the current pack already covers the main ownership, decisions, deep dives, and risks, prefer upgrading answer quality instead of adding more questions.
- If a question cannot be answered cleanly from facts, do not pad it with vague language. Fix the facts first or skip the question.

## Maintenance Checklist

- Ensure a single H1 per document.
- Ensure internal links are relative and resolvable.
- Keep question packs readable; do not turn them into giant note dumps.
- If editing an existing pack, preserve the strongest existing questions and improve answer quality first.

## Scripts

- Run `python3 .agents/skills/interview-question-library/scripts/audit_interview_library.py --root library [paths...]` to audit naming, indexes, H1 count, relative links, and length when you are working on library question content.

## References

- `references/interview-question-writing.md`
- `references/interview-question-organization.md`
