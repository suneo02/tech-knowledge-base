# CorpPresearch 企业预搜索组件

企业名称预搜索与选择组件，支持单选输入和多选模式，集成历史搜索记录功能。

## 目录结构

```
CorpPresearch/
├── index.tsx                # 主组件，实现企业预搜索功能
├── type.ts                  # 类型定义文件
├── useCorpPresearch.tsx      # 自定义 Hook，管理状态和逻辑
├── item.tsx                 # 搜索结果项展示组件
├── logo.tsx                 # 企业 Logo 处理工具函数
├── historyEnum.ts           # 历史搜索模块枚举
├── index.module.less        # 主组件样式文件
└── item.module.less         # 搜索项样式文件
```

## 关键文件说明

- **index.tsx** - 核心组件实现，支持 `auto`（单选输入）和 `select`（多选）两种搜索模式，集成防抖搜索、历史记录、下拉展示等功能
- **useCorpPresearch.tsx** - 自定义 Hook，封装所有状态管理逻辑，包括搜索请求、历史记录管理、选中状态等
- **type.ts** - 定义组件 Props、Ref 接口和搜索选项类型，提供完整的 TypeScript 类型支持
- **item.tsx** - 搜索结果展示组件，支持中英文名称、Logo 展示、高亮匹配和 AI 翻译标识

## 依赖示意

### 外部依赖
- `@wind/wind-ui` - UI 组件库（AutoComplete、Select、Input 等）
- `@wind/icons` - 图标组件（SearchO、DeleteO）
- `gel-util/intl` - 国际化工具
- `gel-api` - API 类型定义

### 业务依赖
- 企业搜索 API 接口（通过 `requestAction` 传入）
- 搜索历史管理 API（增删查功能）

## 使用场景

- **首页顶部搜索** - 单选输入模式，支持历史搜索记录
- **招聘企业搜索** - 多选模式，用于筛选招聘企业
- **招投标单位搜索** - 多选模式，支持参与单位、招标单位、中标单位等不同场景

## 相关文档

- [React 组件规范](../../../../../docs/rule/code-react-component-rule.md)
- [TypeScript 规范](../../../../../docs/rule/code-typescript-style-rule.md)
- [样式规范](../../../../../docs/rule/code-style-less-bem-rule.md)
