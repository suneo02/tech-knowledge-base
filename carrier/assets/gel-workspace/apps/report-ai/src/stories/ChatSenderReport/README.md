# ChatSenderReport Stories

ChatSenderReport 组件及其子组件的 Storybook 故事

## 目录结构

```
stories/ChatSenderReport/
├── ChatSenderReport.stories.tsx       # 主组件 Story
├── Footer.stories.tsx                 # Footer 组件 Story
└── README.md                          # 本文档
```

## 关键说明

- **ChatSenderReport.stories.tsx**: 聊天发送器主组件故事，包含多种状态（Default、Loading、WithDefaultContent、Disabled 等）
- **Footer.stories.tsx**: 底部组件故事，展示不同布局（无文件、有文件、加载状态等）
- 支持文本输入、文件上传和消息发送
- 响应式布局：无文件时水平布局，有文件时垂直布局

## 依赖关系

Stories → ChatSenderReport → ChatSenderReportFooter
