# domain

领域层业务逻辑，封装报告相关的核心业务规则和数据操作

## 目录结构

```
domain/
├── chapter/                 # 章节树操作
│   ├── ChapterManager.ts    # 章节管理器
│   ├── operations.ts        # 章节操作
│   ├── factory.ts           # 章节工厂
│   ├── mutation.ts          # 章节修改
│   ├── query.ts             # 章节查询
│   ├── state.ts             # 章节状态
│   ├── analysis.ts          # 章节分析
│   └── types.ts             # 章节类型
├── chat/                    # 聊天相关业务逻辑
│   ├── ref/                 # 引用资料处理
│   └── rpContentAIMessages/ # AI 消息处理
├── reportEditor/            # 报告编辑器业务逻辑
│   ├── editor/              # 编辑器内容管理
│   ├── rendering/           # 数据渲染
│   ├── split/               # 内容分割
│   ├── domOperations/       # DOM 操作
│   ├── draftTree/           # 草稿树
│   ├── reference/           # 引用管理
│   └── shared/              # 共享工具
├── shared/                  # 跨领域共享工具
└── outlineProgress.ts       # 大纲进度计算
```

## 关键说明

- **chapter/**: 章节树的增删改查和状态管理
- **chat/**: 聊天相关的业务逻辑，包括引用资料和 AI 消息处理
- **reportEditor/**: 报告编辑器的核心业务逻辑，包括内容管理、渲染、分割等
- **shared/**: 跨领域的共享工具和常量

## 依赖关系

reportEditor → chapter
chat → chapter
