# indicator - 指标展示组件库

指标展示组件库，提供企业数据分析、指标筛选、批量导入等功能，是企业数据分析和决策支持的核心组件库。

## 目录结构

```
packages/indicator/
├── src/
│   ├── BulkImport/             # 批量导入组件
│   │   ├── ButtonGroup/       # 按钮组组件
│   │   ├── CorpMatchConfirm/   # 企业匹配确认组件
│   │   ├── CorpMatchTable/     # 企业匹配表格组件
│   │   ├── CorpSearchSelect/   # 企业搜索选择组件
│   │   ├── EditableCorpCell/   # 可编辑企业单元格组件
│   │   ├── FileUpload/         # 文件上传组件
│   │   ├── TextInput/          # 文本输入组件
│   │   └── style/              # 样式文件
│   ├── TreePanel/              # 树形面板组件
│   │   ├── ClassificationCard/ # 分类卡片组件
│   │   ├── LeftMenu/           # 左侧菜单组件
│   │   ├── SelectedIndicators/ # 已选指标组件
│   │   ├── TreePanelScroll/    # 树形面板滚动组件
│   │   ├── TreePanelSwitch/    # 树形面板切换组件
│   │   ├── components/         # 子组件
│   │   ├── context/            # 上下文管理
│   │   ├── handle/             # 处理函数
│   │   ├── hooks/              # 自定义Hooks
│   │   └── style/              # 样式文件
│   ├── __mocks__/              # 模拟数据
│   ├── assets/                 # 静态资源
│   ├── ctx/                    # 上下文
│   ├── stories/                # Storybook故事文件
│   ├── types/                  # 类型定义
│   ├── util.ts                 # 工具函数
│   └── index.ts                # 主入口文件
├── public/                     # 公共资源
│   └── templates/              # 模板文件
├── .storybook/                 # Storybook配置
├── docs/                       # 文档目录
├── package.json                # 项目依赖和脚本配置
├── tsconfig.json               # TypeScript配置
├── tsconfig.node.json          # Node TypeScript配置
└── vite.config.ts              # Vite构建配置文件
```

## 关键文件说明

| 文件 | 作用 |
|------|------|
| `src/BulkImport/index.ts` | 批量导入组件统一导出 |
| `src/TreePanel/index.tsx` | 树形面板主组件，提供指标选择和管理功能 |
| `src/ctx/indicatorCfg.tsx` | 指标配置上下文，管理全局指标状态 |
| `src/util.ts` | 通用工具函数，提供数据处理和转换功能 |
| `src/types/types.d.ts` | 类型定义文件，定义组件相关类型 |

## 依赖关系

```mermaid
graph LR
    A[indicator] --> B[gel-ui]
    A --> C[gel-api]
    A --> D[gel-util]
    A --> E[@wind/wind-ui]
    A --> F[@wind/wind-ui-table]
    A --> G[React]
    
    H[ai-chat] --> A
    I[company] --> A
```

## 核心功能

- **指标展示**: 提供多种指标展示组件，支持数据可视化
- **树形面板**: 提供指标分类树形结构，支持指标选择和管理
- **批量导入**: 支持Excel文件批量导入企业数据
- **企业匹配**: 提供企业数据匹配和确认功能
- **数据处理**: 提供数据格式化、转换和验证功能

## 相关文档

- [架构设计](./architecture.md) - 系统架构和设计决策
- [组件文档](./stories/) - 组件详细文档和使用说明
- [开发规范](../../docs/rule/) - TypeScript、React、样式等开发规范

## 技术栈

- **React 18** - UI框架
- **TypeScript** - 类型系统
- **Vite** - 构建工具
- **Storybook** - 组件文档
- **Ant Design** - UI组件库
- **xlsx** - Excel文件处理
- **ahooks** - React Hooks工具集