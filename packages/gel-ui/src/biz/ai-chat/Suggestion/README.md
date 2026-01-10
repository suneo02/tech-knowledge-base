# Suggestion - AI 聊天建议组件

## 概述

Suggestion 是 AI 聊天模块中的建议组件集，提供多种交互式建议展示组件，支持数据点建议、表格建议、引用建议等功能。

## 目录结构

```
Suggestion/
├── ChatDPUItem/             # 数据点建议组件
├── ChatDPUTable/            # 数据表格建议组件
├── ChatDPUTableModal/       # 数据表格模态框组件
├── ChatRAGItem/             # RAG 建议组件
├── ChatRAGTable/            # RAG 表格建议组件
├── ChatRAGTableModal/       # RAG 表格模态框组件
├── ChatReferenceItem/       # 引用建议组件
├── ChatReferenceTable/      # 引用表格建议组件
├── ChatReferenceTableModal/ # 引用表格模态框组件
└── index.ts                 # 导出入口文件
```

## 核心组件

### DPU 相关组件
- **ChatDPUItem**: 数据点建议展示组件
- **ChatDPUTable**: 数据表格建议展示组件
- **ChatDPUTableModal**: 数据表格模态框展示组件

### RAG 相关组件
- **ChatRAGItem**: RAG 建议展示组件
- **ChatRAGTable**: RAG 表格建议展示组件
- **ChatRAGTableModal**: RAG 表格模态框展示组件

### 引用相关组件
- **ChatReferenceItem**: 引用建议展示组件
- **ChatReferenceTable**: 引用表格建议展示组件
- **ChatReferenceTableModal**: 引用表格模态框展示组件

## 使用示例

```tsx
import { ChatDPUItem } from './ChatDPUItem';

<ChatDPUItem
  data={dpuData}
  onSelect={handleSelect}
  style={{ marginBottom: 16 }}
/>
```