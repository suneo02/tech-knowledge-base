# SelectWithIcon - 带图标的选择器组件

AI 聊天场景中的带图标选择器组件，用于提供选项选择功能。

## 目录树

```
SelectWithIcon/
├── components/               # 子组件
│   ├── OptionItem/          # 选项项组件
│   └── IconRenderer/        # 图标渲染组件
├── hooks/                    # 自定义钩子
│   └── useSelectOptions.ts   # 选项处理钩子
├── styles/                   # 样式文件
│   └── index.less            # 组件样式
├── SelectWithIcon.tsx        # 主组件
├── index.ts                  # 导出文件
└── README.md                 # 文档说明
```

## 关键文件说明

| 文件/目录 | 作用 |
|-----------|------|
| **SelectWithIcon.tsx** | 主组件，整合选择器功能和 UI |
| **components/OptionItem** | 选项项组件，渲染单个选项 |
| **components/IconRenderer** | 图标渲染组件，处理图标显示 |
| **hooks/useSelectOptions** | 选项处理钩子，管理选项状态 |
| **styles/index.less** | 组件样式文件 |

## 依赖示意

```
SelectWithIcon
├─> @/components/Select (基础选择器)
├─> @/components/Icon (图标组件)
├─> @/utils/iconHelper (图标工具)
└─> @/hooks/useKeyboardNavigation (键盘导航)
```

- **上游依赖**：@/components/Select、@/components/Icon、@/utils/iconHelper、@/hooks/useKeyboardNavigation
- **下游使用**：ChatMessageCore 组件

## 相关文档

- [React 组件开发规范](../../../../../../docs/rule/code-react-component-rule.md)
- [样式规范](../../../../../../docs/rule/code-style-less-bem-rule.md)
- [组件设计规范](../../../../../../docs/rule/component-design.md)

