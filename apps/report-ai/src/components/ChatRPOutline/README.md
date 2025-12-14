# ChatRPOutline

大纲聊天组件，用于与 AI 对话生成和优化报告大纲

## 目录结构

```
ChatRPOutline/
├── AIFooter/                  # AI 底部工具栏
│   ├── CompanySelector.tsx    # 公司选择器
│   └── index.tsx              # 底部工具栏主组件
├── ChatSync/                  # 聊天同步
│   └── index.tsx              # 同步组件
├── messages/                  # 消息组件
│   └── index.tsx              # 消息列表
├── parsers/                   # 消息解析器
│   ├── messageParser.tsx      # 消息解析
│   ├── outline.ts             # 大纲解析
│   └── index.ts               # 统一导出
├── roles/                     # 角色组件
│   ├── index.tsx              # 角色定义
│   └── user.tsx               # 用户角色
├── OperationArea/             # 操作区域
│   ├── hooks/                 # 操作 Hooks
│   └── index.tsx              # 操作区域主组件
├── ProgressArea/              # 进度区域
│   ├── components/            # 进度子组件
│   ├── hooks/                 # 进度 Hooks
│   ├── utils/                 # 进度工具
│   └── index.tsx              # 进度区域主组件
└── index.ts                   # 统一导出
```

## 核心组件职责

### AIFooter

AI 底部工具栏，提供公司选择、发送消息等功能

### messages

消息列表组件，展示大纲聊天消息

### parsers

消息解析器，解析 AI 返回的大纲数据

### OperationArea

操作区域，提供大纲生成、优化等操作

### ProgressArea

进度区域，展示大纲生成进度

## 模块依赖

```
ChatRPOutline
  ├─> AIFooter (底部工具栏)
  ├─> messages (消息列表)
  ├─> parsers (消息解析)
  ├─> OperationArea (操作区域)
  ├─> ProgressArea (进度区域)
  └─> ChatCommon/* (通用聊天组件)
```
