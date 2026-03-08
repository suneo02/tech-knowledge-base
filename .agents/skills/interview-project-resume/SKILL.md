---
name: interview-project-resume
description: Convert calibrated project material into truthful, interview-safe resume bullets. Use whenever the user wants to draft or rewrite project experience on a resume, compress `facts` and project questions into concise bullets, audit whether resume claims are too inflated, or fix timeline inconsistencies in resume project entries. Always prioritize `facts > questions > other notes`.
---

# Interview Project Resume

## Purpose

Use this skill to compress project truth into a real, defensible resume.

This skill is not a whitepaper generator. It is a facts/questions compressor.

## Quick Start

- Locate the matching `*-facts.md` file under `private/carrier/resume/projects/` and read it first.
- Then read the matching `*-questions.md` file if it exists.
- Use input priority: `facts > questions > other notes`.
- If the project is still being truth-calibrated, route to `resume-project-facts`.
- Read `references/resume-bullets.md` and `references/baseline.md` before drafting.

## Hard Rules

- Never let older packaging language override `facts`.
- Do not use unpublished projects in the formal resume unless the user explicitly asks for it.
- If a project is blocked in `facts`, keep it out of the resume or label it appropriately.
- Do not copy spoken interview answers directly into resume bullets; compress them into written, high-signal bullets.
- If dates, work duration, or education dates are inconsistent, fix the timeline before polishing wording.

## Inputs Checklist

- Facts file path and its confirmed boundaries
- Questions file path if it exists
- Project name, role, and time range
- Work start date, graduation date, and any other timeline facts needed to keep the resume self-consistent
- Business type, user segment, and scale metrics if confirmed
- Core tech stack
- Key actions the user personally took
- Defendable results
- Evidence anchors if the user asks for stronger validation

## Workflow

1. Extract role, actions, non-goals, and results from `facts`.
2. Use `questions` to identify the strongest spoken project spine and the safest wording.
3. Construct bullets with STAR-L compression:
   - what the user did
   - on what object or system
   - by what method
   - with what defendable result
4. Check timeline consistency across:
   - work experience dates
   - graduation dates
   - claimed years of experience
5. Render the output in resume form and revise until all quality gates pass.

## Output Format

Use this Markdown template unless the user asks for a different target format:

```markdown
[项目名称] | [角色] | [时间]
[一句话背景]。技术栈：[技术1] + [技术2] + ...
- [动词] [对象]，通过 [方法] 实现 [真实结果]
- [动词] [对象]，围绕 [核心问题] 做 [关键决策/实现]
- [动词] [对象]，沉淀 [复用能力/工程能力/稳定性能力]
```

## Writing Rules

- Resume output must be in Chinese.
- Prefer short, dense, action-oriented bullets.
- If a metric is unavailable, use an honest qualitative result instead of a fake precise number.
- Attach technical keywords to real work, not buzzwords.
- Keep punctuation ATS-safe and avoid decorative formatting.

## Quality Gates

- If `facts` and any other source conflict, use `facts`.
- If a claim is blocked or unconfirmed in `facts`, do not write it into the resume.
- Every bullet should be interview-defensible.
- Dates and years of experience must be self-consistent.
- The project should read like real work, not like a marketing whitepaper.

## When Information Is Missing

- Ask targeted questions for missing dates, role boundaries, or safe claims.
- If scale or metrics are missing, prefer qualitative wording.
- If the real scope is still unclear, stop and route to `resume-project-facts`.

## References

- `references/resume-bullets.md`
- `references/baseline.md`
