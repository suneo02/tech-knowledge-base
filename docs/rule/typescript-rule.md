# TypeScript 开发规范

## 快速准则
- 只在第三方定义缺失时使用 `any`；数据结构使用 `interface`、状态使用联合类型。
- 所有模块用命名导出，目录通过 `index.ts` 聚合并使用 `export type` 区分类型。
- 函数 ≤50 行且职责单一；>5 个参数改为对象；用守卫提前返回异常。
- API 包装器统一校验 `response.ok`，抛出带上下文的业务错误并提供默认值。
- 导出的函数、Hook、类型写 JSDoc，并用 `@see` 链接对应文档或示例。

## 适用场景
- **数据模型**：领域对象用 `interface`，状态枚举用 `type`/`enum`，常量保持大写蛇形。
- **共享类型**：放在 `types.ts` 或 `index.ts`，跨包复用走公共导出，不直接穿透内部文件。
- **工具函数**：使用 `lodash` 处理复杂数据；出现分支/空值时提供兜底返回。
- **异步封装**：默认通过 `ahooks/useRequest` 暴露 `{ data, loading, error }`，并声明返回类型。

## 检查清单
- [ ] 新增类型命名具备语义（如 `ReportStatus`, `FileMeta`）。
- [ ] 调用方只从目录 `index.ts` 导入；类型使用 `import type`.
- [ ] API 返回值、错误类型已声明，异常路径能被捕获。
- [ ] 对外导出均有 JSDoc，包含参数、返回值、异常和 `@see`。
- [ ] 测试和文档示例引用的是命名导出。

## 相关
- [前端开发通用基线](./frontend-baseline.md)
- [React 开发规范](./react-rule.md)
- [错误处理规范](./error-handling-rule.md)
