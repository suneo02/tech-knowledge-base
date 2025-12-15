# Hooks

项目级别的自定义 React Hooks，封装可复用的状态逻辑和副作用。

## 相关文档

- [API 请求规范](../../../docs/rule/api-request-rule.md) - API 调用最佳实践
- [React 规范](../../../docs/rule/react-rule.md) - React 开发规范

## 目录结构

```
hooks/
├── usePdfLoader.ts              # PDF 加载器（支持 URL/Blob/自定义加载）
├── useFilePreview.ts            # 文件预览加载器（通过 report/preview API）
├── useDebouncedScroll.ts        # 防抖滚动监听
├── useFileUploadService.ts      # 文件上传服务
├── useFileStatusPolling.ts      # 文件状态轮询
├── useReportRelatedFiles.ts     # 报告关联文件管理
├── useRPConversationManager.ts  # 报告对话管理
├── useSaveController.ts         # 保存控制器
├── useLayoutState.ts            # 布局状态管理
├── usePageSidebar.ts            # 页面侧边栏状态
├── useClearInitialMsg.ts        # 清除初始消息
├── ReportContent/               # 报告内容相关 Hooks
├── RPDetailChat/                # 报告详情对话相关 Hooks
├── RPOutline/                   # 报告大纲相关 Hooks
└── index.ts                     # 统一导出
```

## 核心文件职责

### usePdfLoader.ts

PDF 文件加载和状态管理，支持 URL、Blob、自定义加载函数三种方式。

### useFilePreview.ts

通过 `report/preview` 接口加载文件预览，自动将 base64 转换为 Blob URL。

### useDebouncedScroll.ts

防抖滚动监听，使用 ahooks 的 useScroll 和 useDebounceFn 优化性能。

### useFileUploadService.ts

文件上传服务，处理上传逻辑、进度和状态管理。

### useFileStatusPolling.ts

文件状态轮询，监控文件处理进度（上传、解析等状态）。

### useReportRelatedFiles.ts

报告关联文件的增删改查，管理报告中引用的文件列表。

## 模块依赖

```
业务 Hooks
  ├─> useFilePreview (API 调用)
  ├─> usePdfLoader (文件加载)
  ├─> useDebouncedScroll (性能优化)
  └─> ahooks (基础 Hooks)

useFilePreview
  └─> requestToChat (API 请求)

usePdfLoader
  └─> pdfService (PDF 服务)
```

## 设计原则

- **单一职责**：每个 Hook 只负责一个特定功能
- **可组合**：Hooks 可以相互组合使用
- **类型安全**：完整的 TypeScript 类型定义
- **统一 API**：使用 ahooks 的 useRequest 统一异步请求
