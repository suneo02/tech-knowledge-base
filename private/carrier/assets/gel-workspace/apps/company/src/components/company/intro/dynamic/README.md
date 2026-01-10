# DynamicTabs - 动态标签页组件

智能标签页组件，包含动态、舆情、商机三个标签页，具备智能初始化功能，自动选择有数据的标签页作为初始活跃标签页。

## 目录树

```
dynamic/
├── components/               # 子组件
│   ├── DynamicTab/          # 动态标签页组件
│   ├── OpinionTab/          # 舆情标签页组件
│   └── BusinessTab/         # 商机标签页组件
├── hooks/                   # 自定义钩子
│   ├── useDynamicEvents.ts  # 动态事件数据钩子
│   ├── useBusinessOpportunity.ts # 商机数据钩子
│   └── usePublicOpinion.ts  # 舆情数据钩子
├── styles/                  # 样式文件
│   └── index.less           # 组件样式
├── DynamicTabs.tsx          # 主组件
├── index.ts                 # 导出文件
└── README.md                # 文档说明
```

## 关键文件说明

| 文件/目录 | 作用 |
|-----------|------|
| **DynamicTabs.tsx** | 主组件，整合标签页功能和智能初始化逻辑 |
| **components/DynamicTab** | 动态标签页组件，展示企业动态信息 |
| **components/OpinionTab** | 舆情标签页组件，展示企业舆情信息 |
| **components/BusinessTab** | 商机标签页组件，展示商业机会信息 |
| **hooks/useDynamicEvents** | 动态事件数据钩子，管理动态数据的加载和状态 |
| **hooks/useBusinessOpportunity** | 商机数据钩子，管理商机数据的加载和状态 |
| **hooks/usePublicOpinion** | 舆情数据钩子，管理舆情数据的加载和状态 |
| **styles/index.less** | 组件样式文件 |

## 依赖示意

```
DynamicTabs
├─> @/api/company (企业相关 API)
├─> @/hooks/useRequest (请求钩子)
├─> @/utils/locale (多语言工具)
└─> antd/Tabs (UI 组件库)
```

- **上游依赖**：@/api/company、@/hooks/useRequest、@/utils/locale、antd/Tabs
- **下游使用**：企业详情页面

## 相关文档

- [React 组件开发规范](../../../../docs/rule/code-react-component-rule.md)
- [样式规范](../../../../docs/rule/code-style-less-bem-rule.md)
- [API 请求规范](../../../../docs/rule/code-api-client-rule.md)

