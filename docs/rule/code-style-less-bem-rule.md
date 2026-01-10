# Style Rules (Less + BEM)

## Quick Standards

- **Language**: Comments in Chinese.
- **Modules**: All component styles use `.module.less`.
- **Naming**: BEM (`block__element--modifier`).
- **Tokens**: Use `gel-ui` variables (`variables.less` or `token.ts`).
- **Classnames**: Use `classnames`/`clsx`. NO string concatenation.
- **Scope**: Component-specific styles only. Shared logic goes to common mixins.

## Checklist

- [ ] BEM naming used.
- [ ] Magic values replaced with tokens.
- [ ] `classnames` used for logic.
- [ ] No global pollution (limit `:global` usage).

## Related

- [Frontend Baseline](/docs/rule/frontend-baseline.md)
- [Component Rules](/docs/rule/code-component-tsx-rule.md)
