# TS/TSX Component Rules

## Quick Standards

- **Language**: Comments & JSDoc must be in Chinese.
- **Container vs Presentational**: Containers handle logic/data (≤200 lines). Presentational components are pure (props only).
- **Async**: Use `ahooks/useRequest` (ready/refreshDeps/onError). Avoid manual state machines.
- **API**: Must use `@/api` wrappers (`requestToChat`, `requestToWfc`). Import types from `gel-api`.
- **Error Boundary**: `ErrorBoundary` required for page containers and complex zones.
- **Style**: Use `classnames` with Less Modules. BEM for states (e.g., `block__elem--active`).
- **Exports**: Named exports with JSDoc. Link docs via `@see`.

## State Management

- **Local**: `useState` + `useMemo`/`useCallback`.
- **Shared**: `Context` + `useReducer`. Provider encapsulates types/actions.
- **Global**: `Redux` (only for cross-app sharing or complex middleware).
- **Derived**: `useMemo` or selectors. Avoid redundant computations.

## Checklist

- [ ] API calls use `@/api` wrappers (`requestToChat`, `requestToWfc`) & `gel-api` types.
- [ ] Page containers have `ErrorBoundary`.
- [ ] `useRequest` handles loading/error states.
- [ ] Classes use `classnames` & Modules; no string concatenation.
- [ ] Named exports used; JSDoc in Chinese; Docs linked via `@see`.

## Related

- [Frontend Baseline](/docs/rule/frontend-baseline.md)
- [Style Rules](/docs/rule/code-style-less-bem-rule.md)
- [Testing Rules](/docs/rule/code-testing-rule.md)
