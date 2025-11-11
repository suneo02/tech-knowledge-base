# 错误处理规范

## 快速准则
- 工具/服务层统一通过守卫或 `withErrorHandling` 捕获异常，提供默认返回并记录日志。
- API 封装校验 `response.ok`，失败抛 `BusinessError { code, message, context }`。
- 页面或复杂业务容器挂 `ErrorBoundary`；轻量组件内部自行兜底。
- 异步场景默认使用 `useRequest` 的 `onError`、`retry` 配置集中处理。
- 所有错误按网络/权限/资源/通用分类输出用户友好提示。

## 层次策略
- **工具函数**：`try/catch` 后返回安全值，日志走统一埋点；禁止吞并未知异常。
- **API 层**：只处理协议/权限问题；不要直接操作 UI 或 toast，由调用层决定反馈。
- **组件层**：页面级 ErrorBoundary 提供 fallback UI + `onError` 上报；小组件使用局部状态或 `Toast` 告知用户。
- **异步动作**：确保请求幂等，必要时通过 `withRetry`（默认 3 次指数退避）封装。

## 分类与反馈
- **网络**：展示重试入口，可退回上一页面。
- **权限 (403)**：提示无权访问并引导重新登录或联系管理员。
- **资源 (404)**：给出返回入口或创建指引。
- **通用**：统一错误页 + 日志编号，便于排查。

## 检查清单
- [ ] 新增 API 或 Hook 抛出的都是 `BusinessError`，包含关键信息。
- [ ] 组件内错误信息转为用户可理解文案，避免原始堆栈。
- [ ] ErrorBoundary fallback、日志上报及 `@see` 文档已补齐。
- [ ] 关键异步动作配置 retry/节流，并确保幂等。
- [ ] 监控 SDK 已订阅 `window.onerror`、`unhandledrejection`。

## 相关
- [前端开发通用基线](./frontend-baseline.md)
- [TypeScript 开发规范](./typescript-rule.md)
- [React 开发规范](./react-rule.md)
