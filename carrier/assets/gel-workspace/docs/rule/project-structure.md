# 项目结构规范

## 快速准则
- Monorepo 按“共享 → 应用 → 脚本/文档”分层，禁止业务代码存入共享目录。
- 每个目录提供 `index.ts` 聚合导出，外部只 import 这一层。
- 命名统一：组件 `PascalCase.tsx`，Hook/工具 `camelCase.ts`，样式 `Component.module.less`。
- 测试/Story/Mock 目录固定为 `__tests__/`、`stories/`、`__mocks__/`。

## 目录约定
| 层级 | 说明 |
| --- | --- |
| `packages/shared/` | 跨应用复用的组件、hooks、utils、types。 |
| `packages/<app>/` | 单个应用入口与业务模块。 |
| `packages/libs/` | 第三方库或 SDK 封装。 |
| `scripts/` | 构建、校验、发布脚本。 |
| `docs/` | 文档仓库，按模块再细分 README/require/design/issues。 |

## 文件粒度
- 目录结构遵循“功能聚合”：每个模块包含 `index.ts[x]`、样式、测试、Story、文档。
- 当文件超过 300 行或承担多个职责时拆目录，新增 `index.ts` 聚合导出。
- 常量放 `constants.ts`，类型共享到 `types.ts` 或 `index.ts` 使用 `export type`。
- 样式与组件同目录，命名匹配组件；公共样式放 `packages/gel-ui/src/styles/`。

## 检查清单
- [ ] 新增模块遵循目录表并提供聚合导出。
- [ ] 文件命名、测试/Story/Mock 目录齐全。
- [ ] 业务代码未直接引用共享目录的内部实现。
- [ ] 文档与代码路径一一对应，README 已更新。
- [ ] Monorepo 根目录脚本/配置未混入业务逻辑。

## 相关
- [前端开发通用基线](./frontend-baseline.md)
- [README 文档编写规范](./readme-rule.md)
- [文档编写规范](./documentation-rule.md)
