# Project Structure Rules

## Quick Standards

- **Language**: Comments and documentation in Chinese.
- **Layers**: `shared` -> `apps` -> `scripts`. No business code in `shared`.
- **Exports**: Use `index.ts` for directory exports. Import from this level only.
- **Naming**: `PascalCase.tsx` (Components), `camelCase.ts` (Hooks/Utils), `Component.module.less`.
- **Standard Dirs**: `__tests__`, `stories`, `__mocks__`.

## Directory Map

| Path               | Description                                  |
| ------------------ | -------------------------------------------- |
| `packages/shared/` | 跨应用复用的组件、Hook、工具函数、类型定义。 |
| `packages/<app>/`  | 单个应用的入口与业务模块。                   |
| `packages/libs/`   | 第三方库封装或 SDK。                         |
| `scripts/`         | 构建、校验、发布脚本。                       |
| `docs/`            | 文档仓库（README/需求/设计/Spec）。          |

## Checklist

- [ ] `index.ts` used for exports.
- [ ] No business logic in `shared`.
- [ ] Naming conventions followed.
- [ ] Docs match code location.

## Related

- [Frontend Baseline](/docs/rule/frontend-baseline.md)
