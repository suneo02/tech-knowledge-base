# OperatorHeader - 顶部操作栏组件

企业详情 AI 右侧栏的顶部操作栏组件，提供收藏、导出报告、AI 助手切换等功能。

## 目录树

```
OperatorHeader/
├── components/               # 子组件
│   ├── CollectButton/        # 收藏按钮组件
│   └── ExportButton/        # 导出按钮组件
├── hooks/                    # 自定义钩子
│   └── useOperatorActions.ts # 操作行为钩子
├── styles/                   # 样式文件
│   └── index.less            # 组件样式
├── OperatorHeader.tsx        # 主组件
├── index.ts                  # 导出文件
└── README.md                 # 文档说明
```

## 关键文件说明

| 文件/目录 | 作用 |
|-----------|------|
| **OperatorHeader.tsx** | 主组件，整合顶部操作栏的功能和 UI |
| **components/CollectButton** | 收藏按钮组件，处理企业收藏状态 |
| **components/ExportButton** | 导出按钮组件，处理报告导出功能 |
| **hooks/useOperatorActions** | 操作行为钩子，管理收藏和导出逻辑 |
| **styles/index.less** | 组件样式文件 |

## 依赖示意

```
OperatorHeader
├─> @/components/toolsBar (ToolsBar 组件)
├─> @/api/company (企业相关 API)
├─> @/hooks/useCollect (收藏钩子)
└─> @/utils/exportHelper (导出工具)
```

- **上游依赖**：@/components/toolsBar、@/api/company、@/hooks/useCollect、@/utils/exportHelper
- **下游使用**：CompanyDetailAIRight 页面

## 相关文档

- [工具栏组件规范](../../../../../../docs/rule/code-react-component-rule.md)
- [样式规范](../../../../../../docs/rule/code-style-less-bem-rule.md)
- [API 请求规范](../../../../../../docs/rule/code-api-client-rule.md)

