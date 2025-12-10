# mocks

Mock 数据和 MSW handlers，用于测试和 Storybook

## 目录结构

```
mocks/
├── chat/                   # 聊天相关 Mock
│   └── selectChatRecord.ts
├── chatShare/              # 聊天分享相关 Mock
├── files/                  # 文件相关 Mock
│   ├── reportFiles.mock.ts # 报告文件 Mock 数据
│   └── index.ts           # 统一导出
├── report/                 # 报告相关 Mock
│   ├── mswReportData.mock.ts
│   ├── reportContent.mock.ts
│   └── streamingReport.mock.ts
├── reportOutline/          # 报告大纲相关 Mock
├── reportShare/            # 报告分享相关 Mock
└── handlers.ts             # MSW handlers 统一管理
```

## 关键说明

- **files/**: 文件相关的 Mock 数据，提供多种测试场景（default、empty、large、withFailedFiles 等）
- **report/**: 报告相关的 Mock 数据，包含章节、内容、流式生成等
- **handlers.ts**: MSW handlers 配置，拦截和模拟 HTTP 请求
- 使用 MSW (Mock Service Worker) 进行 API mock

## 依赖关系

handlers → mock 数据
Storybook → handlers
