# Report Stories

Report 相关组件的 Storybook 故事，使用 MSW 模拟 API 请求

## 目录结构

```
stories/Report/
├── ReportDetail.stories.tsx       # ReportDetail 页面 Story
├── OutlineView.stories.tsx        # OutlineView 组件 Story
├── MockData.stories.tsx           # Mock 数据展示 Story
└── README.md                      # 本文档
```

## 关键说明

- **ReportDetail.stories.tsx**: 完整的报告详情页面，包含多种测试场景（Default、Loading、Error、EmptyReport 等）
- **OutlineView.stories.tsx**: 报告大纲组件，展示不同状态（Default、Loading、Empty、Generating 等）
- **MockData.stories.tsx**: Mock 数据查看器，以 JSON 格式展示测试数据
- 使用 MSW 自动拦截 API 请求，无需手动执行脚本

## 依赖关系

Stories → MSW handlers → Mock 数据
