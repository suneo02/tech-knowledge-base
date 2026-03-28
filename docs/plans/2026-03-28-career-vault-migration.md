# Career Vault Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Split private career and learning materials out of `tech-knowledge-base` into a dedicated `career-vault` repository while keeping `suneo-toolkit` independent.

**Architecture:** Create a new sibling repository named `career-vault`, migrate the private directories and private planning/meta notes into it, then update `tech-knowledge-base` so it only documents and builds the public knowledge base. Keep `suneo-toolkit` unchanged as the tooling and workflow repository.

**Tech Stack:** Git, Markdown, MkDocs, shell file moves

---

### Task 1: Create the target repository layout

**Files:**
- Create: `/Users/hidetoshidekisugi/Documents/career-vault/README.md`
- Create: `/Users/hidetoshidekisugi/Documents/career-vault/AGENTS.md`
- Create: `/Users/hidetoshidekisugi/Documents/career-vault/.gitignore`

### Task 2: Migrate private content

**Files:**
- Move: `/Users/hidetoshidekisugi/Documents/tech-knowledge-base/private/carrier` -> `/Users/hidetoshidekisugi/Documents/career-vault/career`
- Move: `/Users/hidetoshidekisugi/Documents/tech-knowledge-base/private/foreign-languages` -> `/Users/hidetoshidekisugi/Documents/career-vault/foreign-languages`
- Move: `/Users/hidetoshidekisugi/Documents/tech-knowledge-base/private/immigration` -> `/Users/hidetoshidekisugi/Documents/career-vault/immigration`
- Move: `/Users/hidetoshidekisugi/Documents/tech-knowledge-base/private/resume` -> `/Users/hidetoshidekisugi/Documents/career-vault/resume`
- Move: `/Users/hidetoshidekisugi/Documents/tech-knowledge-base/.obsidian` -> `/Users/hidetoshidekisugi/Documents/career-vault/.obsidian`

### Task 3: Migrate private planning and prompt notes

**Files:**
- Create: `/Users/hidetoshidekisugi/Documents/career-vault/docs/plans/`
- Create: `/Users/hidetoshidekisugi/Documents/career-vault/meta/`
- Move: `/Users/hidetoshidekisugi/Documents/tech-knowledge-base/docs/plans/2026-03-18-interview-master-design.md`
- Move: `/Users/hidetoshidekisugi/Documents/tech-knowledge-base/docs/plans/2026-03-18-interview-master.md`
- Move: `/Users/hidetoshidekisugi/Documents/tech-knowledge-base/meta/prompt.md`
- Move: `/Users/hidetoshidekisugi/Documents/tech-knowledge-base/prompt.md`

### Task 4: Update the public knowledge-base repository

**Files:**
- Modify: `/Users/hidetoshidekisugi/Documents/tech-knowledge-base/README.md`
- Modify: `/Users/hidetoshidekisugi/Documents/tech-knowledge-base/AGENTS.md`
- Modify: `/Users/hidetoshidekisugi/Documents/tech-knowledge-base/meta/development.md`
- Create: `/Users/hidetoshidekisugi/Documents/tech-knowledge-base/meta/career-vault.md`

### Task 5: Verify repository boundaries

**Files:**
- Review: `/Users/hidetoshidekisugi/Documents/tech-knowledge-base`
- Review: `/Users/hidetoshidekisugi/Documents/career-vault`

Run:
- `cd /Users/hidetoshidekisugi/Documents/tech-knowledge-base && git status --short`
- `cd /Users/hidetoshidekisugi/Documents/career-vault && find . -maxdepth 2 | sort`
- `cd /Users/hidetoshidekisugi/Documents/tech-knowledge-base && rg -n "private/|carrier/assets/gel-workspace|docs/" README.md AGENTS.md meta`
