# CDE 组件库

一个基于 React 和 TypeScript 的企业级数据过滤组件库，提供强大的数据筛选、过滤和订阅功能。

## 概述

CDE (Corporate Data Explorer) 是一个专为企业数据浏览器设计的组件库，提供了完整的数据过滤解决方案。它包含多种过滤组件、上下文管理、订阅功能和实用工具，帮助开发者快速构建复杂的数据筛选界面。

## 目录结构

```
├── src/                           # 组件库源代码
│   ├── components/                # 通用组件
│   ├── FilterCatalog/            # 过滤目录组件
│   ├── FilterConsole/            # 过滤控制台组件
│   ├── FilterItem/               # 过滤项组件
│   ├── FilterList/               # 过滤列表组件
│   ├── FilterRes/                # 过滤结果组件
│   ├── subscribe/                # 订阅功能
│   ├── ctx/                      # 上下文
│   ├── hooks/                    # 自定义 Hooks
│   ├── handle/                   # 处理函数
│   ├── types/                    # 类型定义
│   ├── utils/                    # 工具函数
│   ├── style/                    # 样式文件
│   ├── assets/                   # 资源文件
│   ├── stories/                  # Storybook 故事
│   └── index.ts                  # 主入口文件
├── docs/                         # 文档
├── .storybook/                   # Storybook 配置
├── dist/                         # 构建产物
├── package.json                  # 项目配置
├── tsconfig.json                 # TypeScript 配置
└── vite.config.ts                # Vite 配置
```

## 关键文件说明

| 文件 | 作用 |
|------|------|
| `src/index.ts` | 模块主入口，统一导出所有组件、Hook 和工具函数 |
| `src/components/` | 通用 UI 组件，如表单、菜单、按钮等 |
| `src/FilterCatalog/` | 过滤目录组件，提供分类浏览和选择过滤条件的功能 |
| `src/FilterConsole/` | 过滤控制台组件，提供过滤器的创建、编辑和管理功能 |
| `src/FilterItem/` | 过滤项组件，提供单个过滤条件的设置和配置 |
| `src/FilterList/` | 过滤列表组件，展示和管理多个过滤条件 |
| `src/FilterRes/` | 过滤结果组件，展示过滤后的数据结果 |
| `src/subscribe/` | 订阅功能组件，提供数据订阅的管理和设置 |
| `src/ctx/` | React Context 提供者，管理全局状态和配置 |
| `src/hooks/` | 自定义 React Hooks，封装常用逻辑 |
| `src/types/` | TypeScript 类型定义文件 |

## 模块依赖关系

```mermaid
graph TD
    A[cde] --> B[gel-ui]
    A --> C[gel-api]
    A --> D[gel-util]
    A --> E[React 18]
    A --> F[Ant Design 5]
    A --> G[@wind/wind-ui]
    A --> H[ahooks]
    A --> I[lodash]
    
    J[ai-chat] --> A
    K[company] --> A
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#f3e5f5
    style D fill:#f3e5f5
    style J fill:#e8f5e9
    style K fill:#e8f5e9
```

## 相关文档

- [TypeScript 规范](../../docs/rule/code-typescript-style-rule.md)
- [React 规范](../../docs/rule/code-react-component-rule.md)
- [样式规范](../../docs/rule/code-style-less-bem-rule.md)
- [测试规范](../../docs/rule/code-testing-vitest-storybook-rule.md)
- [API 请求规范](../../docs/rule/code-api-client-rule.md)
- [组件设计文档](./docs/组件设计文档.md)
- [新的组件设计文档](./docs/新的组件设计文档.md)
- [企业数据浏览器差异](./docs/企业数据浏览器差异.md)
