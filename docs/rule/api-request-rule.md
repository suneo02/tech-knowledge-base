# API 请求规范

## 快速准则
- 所有远程请求统一通过 `@/api` 暴露的封装函数（如 `requestToChat`、`requestToWFC`），禁止直接调用 `fetch`。
- 请求/响应类型必须声明；成功分支返回业务数据，失败抛出携带上下文的业务错误。
- 前端调用默认配合 `ahooks/useRequest` 管理生命周期、错误和重试。

## 封装要求
- 基础请求函数接受 `path`、`data`、`options`，内部拼接网关前缀并注入认证信息。
- 在封装层统一处理：
  - `response.ok` 校验与错误转换；
  - 日志埋点与自定义 header；
  - 默认超时与重试策略。
- 返回值统一解析为大写 `Data` 字段（后端约定），调用方只接收结构化数据。

## Hook 使用要点
- `useRequest` 配置 `ready` 控制时机，`refreshDeps` 保持数据同步，`onError` 汇总提示。
- 自定义 Hook 返回 `{ data, loading, error, ...actions }`，并在内部捕获业务异常。
- 依赖其他资源时在 Hook 注释或 README 中标注 `@see`。

## 检查清单
- [ ] 新增 API 已在 `@/api` 聚合导出并附带类型。
- [ ] 错误路径返回 `BusinessError`（含 code、message、context）。
- [ ] Hook 针对条件请求配置 `ready`，不会在无参时发送请求。
- [ ] `refreshDeps`、`pollingInterval` 等高级参数设置与业务场景一致。
- [ ] 示例/Story 中引用的都是封装后的请求函数。

## 相关
- [前端开发通用基线](./frontend-baseline.md)
- [错误处理规范](./error-handling-rule.md)
- [React 开发规范](./react-rule.md)
