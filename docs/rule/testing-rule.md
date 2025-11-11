# 测试开发规范

## 快速准则
- 测试目录固定：`__tests__/`（Vitest）、`stories/`（Storybook）、`__mocks__/`（共享假数据）。
- 命名规则：`*.test.ts`、`*.stories.tsx`、`*.mock.ts`，文件内使用描述性 `describe/it`。
- 覆盖率要求：函数 ≥80%，组件 ≥70%，关键路径 100% 并记录到 PR。
- Mock 通过 MSW 或共享 mock 文件，避免在用例中硬编码数据。
- 测试必须独立可运行，不依赖执行顺序或全局状态。

## 常见场景
- **函数逻辑**：覆盖正常、边界、异常；必要时使用 `vi.spyOn` 观察副作用。
- **组件视图**：Storybook 记录默认/加载/空态/错误；Vitest + Testing Library 覆盖交互。
- **异步请求**：使用 MSW 拦截网络，或在 `__mocks__` 定义响应并注入 `useRequest`。
- **快照/视觉**：仅对稳定结构使用快照，避免对频繁变化的节点进行快照断言。

## 检查清单
- [ ] 新增功能对应的函数/组件测试已补齐，覆盖率达标。
- [ ] Mock 数据集中管理且与真实结构一致。
- [ ] Story 中列出了关键状态并开启 autodocs。
- [ ] 测试使用描述性断言，不检查实现细节。
- [ ] `pnpm test`、`pnpm test:coverage` 在本地通过。

## 命令速记
- `pnpm test`：Vitest 全量。
- `pnpm test --runInBand`：排查竞态。
- `pnpm test:coverage`：输出覆盖率报表。
- `pnpm storybook`：启动交互用例。

## 相关
- [前端开发通用基线](./frontend-baseline.md)
- [React 开发规范](./react-rule.md)
- [错误处理规范](./error-handling-rule.md)
