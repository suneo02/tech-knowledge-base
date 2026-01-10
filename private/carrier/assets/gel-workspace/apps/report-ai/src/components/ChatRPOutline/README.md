# ChatRPOutline

大纲聊天组件，用于与 AI 对话生成和优化报告大纲

## 目录结构

```
ChatRPOutline/
├── context/                   # Context 和 Provider
│   ├── RPOutlineContext.tsx   # 状态管理
│   ├── index.ts               # 统一导出
│   └── README.md              # 架构说明
├── hooks/                     # 业务 Hooks
│   ├── useRPOutlineChat.ts    # 聊天主协调器
│   ├── index.ts               # 统一导出
│   └── README.md              # 架构说明
├── parsers/                   # 消息解析器
│   ├── messageParser.tsx      # 消息解析
│   ├── outline.ts             # 大纲解析
│   └── index.ts               # 统一导出
├── AIFooter/                  # AI 底部工具栏
│   ├── CompanySelector.tsx    # 公司选择器
│   └── index.tsx              # 底部工具栏主组件
├── ChatSync/                  # 聊天同步
│   └── index.tsx              # 同步组件
├── messages/                  # 消息组件
│   └── index.tsx              # 消息列表
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

## 架构设计

### 模块内聚

所有 RPOutline 聊天相关的代码都在此目录下，形成内聚的模块：

- **context/**: Context 和 Provider，提供状态管理
- **hooks/**: 业务 hooks，封装聊天逻辑
- **parsers/**: 消息解析器，纯函数设计
- **AIFooter/**: AI 消息底部组件

### 依赖关系

```
context → hooks → parsers → AIFooter → context
```

这是 React Context 的标准模式，不是真正的循环依赖：

- context 提供 Provider
- AIFooter 消费 Context（通过 useRPOutlineContext）

### 避免循环依赖

通过将相关代码放在同一个目录下，避免了跨越多个顶层目录的循环依赖。详见各子目录的 README.md。

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
