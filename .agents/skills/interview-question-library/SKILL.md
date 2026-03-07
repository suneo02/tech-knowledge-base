---
name: interview-question-library
description: Manage, write, update, and organize interview question content in the hidetoshi-tech-knowledge-base. Use when asked to add or revise interview questions, curate interview indexes, adjust question priority or frequency, reorganize interview question structure across domains, or maintain project-specific interview question packs derived from `*-facts.md` and project dossiers.
---

# Interview Question Library

## Overview

Use this skill to maintain interview question content in the knowledge base while keeping structure, index entries, and writing quality consistent.

## Quick Start

1. Read `AGENTS.md` for repository-wide conventions and general writing rules.
2. Locate the target domain under `library/` and review the nearest `README.md` index.
3. If the task is a project-specific interview pack, read the matching `*-facts.md` file first and then the project dossier if it exists.
4. Choose the right reference file based on the task.
5. Apply edits and update local indexes with relative links.

## Task Routing

- **Writing or updating questions**: read `references/interview-question-writing.md`.
- **Organizing, indexing, or prioritizing**: read `references/interview-question-organization.md`.
- **Project-specific question packs**: build questions from `facts + dossier`, not from packaging language alone.

## Output Rules

- Write interview question content in Chinese.
- Keep file and directory names in `kebab-case`.
- Use relative paths for internal links.
- For project interview packs, each question should include:
  - question category: 基础 / 决策 / 深挖 / 风险质疑
  - answer anchor: the fact or dossier section the answer should return to
  - optional risk level: 低 / 中 / 高

## Project Pack Rule

- `facts` is the authority for what can be claimed.
- Dossier may help expand likely follow-up questions, but must not override facts boundaries.
- If the project does not yet have a `*-facts.md` file, route to `resume-project-facts` before building a project question pack.

## Maintenance Checklist

- Ensure a single H1 per document.
- Ensure each directory has `README.md` or `index.md`.
- Ensure internal links are relative and resolvable.
- Split documents only when exceeding ~1000 lines with multiple subtopics.

## Scripts

- Run `python3 .agents/skills/interview-question-library/scripts/audit_interview_library.py --root library [paths...]` to audit naming, indexes, H1 count, relative links, and length.

## References

- `references/interview-question-writing.md`
- `references/interview-question-organization.md`
