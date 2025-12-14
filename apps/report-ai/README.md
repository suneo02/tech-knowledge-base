# report-ai

AI 报告生成应用，提供报告大纲生成、内容编辑和 AI 辅助写作功能

## 目录结构

```
report-ai/
├── src/
│   ├── pages/                   # 页面组件
│   ├── components/              # UI 组件
│   │   ├── outline/             # 大纲相关组件
│   │   ├── ReportEditor/        # 报告编辑器
│   │   ├── File/                # 文件相关组件
│   │   └── ...
│   ├── domain/                  # 领域层业务逻辑
│   │   ├── chapter/             # 章节操作
│   │   ├── chat/                # 聊天逻辑
│   │   ├── reportEditor/        # 编辑器业务逻辑
│   │   └── shared/              # 共享工具
│   ├── store/                   # 状态管理
│   │   ├── reportContentStore/  # 报告内容状态
│   │   └── rpOutline/           # 大纲状态
│   ├── hooks/                   # 自定义 Hooks
│   ├── utils/                   # 工具函数
│   ├── types/                   # 类型定义
│   └── libs/                    # 第三方库封装
├── docs/                        # 文档
└── package.json
```

## 关键说明

- **pages/**: 页面级组件
- **components/**: 可复用的 UI 组件
- **domain/**: 领域层业务逻辑，封装核心业务规则
- **store/**: Redux 状态管理
- **hooks/**: 自定义 React Hooks
- **utils/**: 通用工具函数
- **types/**: TypeScript 类型定义

## 依赖关系

pages → components → hooks → store → domain → utils
