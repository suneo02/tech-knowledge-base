# Spec & Implementation Rules

## Quick Standards

- **Language**: All content in Chinese.
- **Goal**: Task breakdown & verification.
- **Format**: `README.md` (Index) + `implementation-plan.json` (Tasks).
- **Atomic**: One task status change per commit.

## Writing Guidelines

- **Code**: Minimize code in docs. **DO NOT** paste full implementation. Use small snippets (< 10 lines) only if necessary for context.
- **References**: Use absolute paths or PR links.
  - Doc -> Code: `@see /apps/chat/src/index.tsx`
  - Code -> Doc: `// @see /docs/specs/chat/spec-design.md`
- **Length**: Max 150 lines per document. If larger, split into sub-specs (e.g., `spec-design.md`, `spec-api.md`).

## Directory

- `docs/specs/<task>/` containing:
  - `README.md`: 索引、状态、链接 (Index, Status, Links).
  - `implementation-plan.json`: 任务追踪源 (Source of truth).
  - `spec-*.md`: 子文档 (Sub-docs).

## Implementation Plan (JSON)

File: `implementation-plan.json`

- **Structure**: Array of task objects.
- **Fields**:
  - `id`: Unique string.
  - `title`: 简明任务标题 (Short description).
  - `owner`: Username.
  - `code_paths`: Absolute paths to code.
  - `status`: `failed` (initial) | `success` | `blocked` | `skipped`.
  - `@see`: Absolute paths to specs/issues.
- **Workflow**:
  1. Create all tasks with `status: "failed"`.
  2. Implement & Verify.
  3. Update to `success` one by one.

### Example

```json
[
  {
    "id": "task-chat-open",
    "title": "用户可打开新对话",
    "owner": "alice",
    "code_paths": ["/apps/chat/src/index.tsx"],
    "@see": ["/docs/specs/chat/design.md"],
    "status": "failed",
    "notes": "按 Enter 创建并跳转到会话页"
  }
]
```

## Checklist

- [ ] `implementation-plan.json` exists & valid.
- [ ] All tasks start as `failed`.
- [ ] Atomic commits for status updates.
- [ ] No large code blocks; References used instead.
- [ ] Document length ≤ 150 lines.
- [ ] Bidirectional `@see` links present.
