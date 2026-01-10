# menu - 企业菜单配置模块

企业详情页的菜单配置模块，负责管理企业详情页的导航菜单配置。

## 目录树

```
menu/
├── components/               # 子组件
│   ├── MenuItem/            # 菜单项组件
│   └── MenuGroup/           # 菜单分组组件
├── hooks/                   # 自定义钩子
│   └── useMenuConfig.ts     # 菜单配置钩子
├── styles/                  # 样式文件
│   └── index.less           # 组件样式
├── config/                  # 配置文件
│   └── menuConfig.ts        # 菜单配置定义
├── index.ts                 # 导出文件
└── README.md                # 文档说明
```

## 关键文件说明

| 文件/目录 | 作用 |
|-----------|------|
| **config/menuConfig.ts** | 菜单配置定义，包含所有菜单项的配置信息 |
| **hooks/useMenuConfig.ts** | 菜单配置钩子，提供菜单配置的获取和处理逻辑 |
| **components/MenuItem** | 菜单项组件，渲染单个菜单项 |
| **components/MenuGroup** | 菜单分组组件，渲染菜单分组 |
| **styles/index.less** | 组件样式文件 |

## 依赖示意

```
menu/
├── config/menuConfig
├── hooks/useMenuConfig
│   └─> @/api/company (企业相关 API)
├── components/MenuItem
│   └─> @/components/Icon (图标组件)
└── components/MenuGroup
    └─> @/components/Collapse (折叠组件)
```

- **上游依赖**：@/api/company、@/components/Icon、@/components/Collapse
- **下游使用**：企业详情页面

## 相关文档

- [React 组件开发规范](../../../../docs/rule/code-react-component-rule.md)
- [样式规范](../../../../docs/rule/code-style-less-bem-rule.md)
- [配置管理规范](../../../../docs/rule/config-management.md)

