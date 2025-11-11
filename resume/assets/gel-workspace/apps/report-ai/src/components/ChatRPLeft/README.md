# ChatRPLeft

报告详情页左侧聊天组件，用于与 AI 对话生成报告内容

## 目录结构

```
ChatRPLeft/
├── messages/                  # 消息组件
│   └── index.tsx              # 消息列表
├── parsers/                   # 消息解析器
│   ├── detailMessageParser.tsx # 详情消息解析
│   └── index.ts               # 统一导出
└── roles.tsx                  # 角色定义
```

## 核心文件职责

### messages/index.tsx

消息列表组件，展示聊天消息

### parsers/detailMessageParser.tsx

详情消息解析器，解析 AI 返回的消息内容

### roles.tsx

角色定义，定义用户和 AI 的消息展示样式

## 模块依赖

```
ChatRPLeft
  ├─> messages (消息列表)
  ├─> parsers (消息解析)
  └─> ChatCommon/* (通用聊天组件)
```
