# 通用基础组件库

提供可复用的基础 UI 组件，支撑各种业务场景的界面构建，遵循企业级设计规范。

## 目录结构

```
common/
├── AIBox/                          # AI 消息框组件
│   ├── index.tsx                   # AI 消息框主组件
│   └── index.module.less           # 消息框样式
├── Button/                         # 按钮组件
├── EditableLabel/                  # 可编辑标签组件
├── FallBack/                       # 降级展示组件
├── GradientText/                   # 渐变文字组件
├── InnerHtml/                      # 安全 HTML 渲染组件
├── LoadMoreTrigger/                # 加载更多触发器
├── SmartPaginationTable/           # 智能分页表格
├── SmartProgress/                  # 智能进度条
├── SmartTable/                     # 智能表格组件
├── TextExpandable/                 # 可展开文字组件
├── TranslateIndicator/             # 翻译指示器
├── WindHeader/                     # Wind 头部组件
├── cascade/                        # 级联选择组件
├── form/                           # 表单组件集
│   ├── SmartForm                   # 智能表单
│   ├── SmartFormField              # 表单字段
│   └── SmartFormList               # 表单列表
├── message/                        # 消息提示组件
│   ├── SmartMessage                # 智能消息
│   └── SmartNotification           # 通知组件
└── index.ts                        # 通用组件统一导出
```

## 关键文件说明

- **AIBox/**: AI 消息展示组件，支持流式内容、代码高亮、复制等功能
- **SmartTable/**: 智能表格组件，支持分页、排序、筛选、导出等高级功能
- **form/**: 表单组件集，提供智能表单、字段验证、联动等功能
- **message/**: 消息提示组件，支持多种类型的通知和消息展示
- **SmartPaginationTable/**: 企业级分页表格，专用于大数据量展示

## 依赖关系

```
common/
├── 内部依赖
│   ├── styles: 使用共享样式和混入
│   ├── utils: 使用工具函数
│   └── types: 使用类型定义
├── 上游依赖
│   ├── antd: 基础 UI 组件库
│   ├── react: React 框架
│   └── lodash: 工具函数库
├── 协作依赖
│   └── assets: 使用静态资源（图标、图片）
└── 被依赖关系
    ├── biz: 业务组件主要消费方
    ├── layout: 布局组件使用
    └── 其他模块: 通用 UI 需求
```

## 核心功能

### 数据展示组件
- **智能表格**: 支持大数据量、分页、排序、筛选等功能
- **智能进度条**: 多样化进度展示，支持自定义样式
- **可展开文字**: 长文本的展开/收起功能
- **降级展示**: 错误状态的优雅降级处理

### 交互组件
- **AI 消息框**: 专门的 AI 内容展示组件
- **可编辑标签**: 支持内联编辑的标签组件
- **级联选择**: 多层级级联选择器
- **加载更多**: 滚动加载更多触发器

### 表单组件
- **智能表单**: 支持动态字段、联动验证的表单系统
- **表单字段**: 各类输入字段的统一封装
- **表单列表**: 支持增删改的表单数组组件

### 反馈组件
- **消息提示**: 全局消息和通知系统
- **翻译指示器**: 翻译状态的视觉指示
- **渐变文字**: 视觉强调的文字效果

## 设计原则

### 可复用性
- 组件设计支持多种业务场景
- 通过 props 配置实现不同变体
- 保持组件的单一职责

### 可定制性
- 支持主题和样式定制
- 提供丰富的配置选项
- 支持插槽和自定义渲染

### 类型安全
- 完整的 TypeScript 类型定义
- 严格的属性类型检查
- 泛型支持灵活的类型扩展

### 性能优化
- 懒加载和按需渲染
- 防抖和节流优化
- 虚拟滚动大数据量处理

## 相关文档

- [React 组件开发规范](../../../docs/rule/code-react-component-rule.md) - 组件开发指南
- [样式规范](../../../docs/rule/code-style-less-bem-rule.md) - Less Module 样式指南
- [TypeScript 规范](../../../docs/rule/code-typescript-style-rule.md) - 类型定义规范

## 使用示例

```typescript
import { SmartTable, AIBox, SmartForm } from '@/common'

// 智能表格
<SmartTable
  columns={columns}
  dataSource={data}
  pagination={{
    current: 1,
    pageSize: 20,
    total: 100
  }}
  onSort={handleSort}
  onFilter={handleFilter}
/>

// AI 消息框
<AIBox
  content={aiResponse}
  isStreaming={true}
  onCopy={handleCopy}
  onRegenerate={handleRegenerate}
/>

// 智能表单
<SmartForm
  schema={formSchema}
  initialValues={initialData}
  onSubmit={handleSubmit}
  onFieldChange={handleFieldChange}
/>
```
