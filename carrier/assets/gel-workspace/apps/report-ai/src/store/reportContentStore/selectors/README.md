# Selectors

Redux 状态选择器，按数据分层与职责模块化组织。

## 目录结构

```
selectors/
├── index.ts                  # 统一导出所有 selectors
├── base.ts                   # 基础状态选择器（直接访问 Redux state）
├── chaptersCanonical.ts      # Canonical 层章节选择器
├── draftTreeSelectors.ts     # Draft 层草稿选择器
├── composition.ts            # 章节内容合成选择器
├── documentHash.ts           # 文档哈希选择器（变更检测）
├── outlineView.ts            # 大纲视图模型选择器
├── chapterStats.ts           # 章节统计选择器（锁定、epoch）
└── globalOp/                 # 全局操作相关选择器
    ├── index.ts              # 统一导出
    ├── base.ts               # 全局操作基础状态
    ├── aigcGeneration.ts     # AIGC 生成操作
    └── aigcTextRewrite.ts    # AIGC 文本改写
```

## 核心模块

**base.ts** - 基础层

- 直接访问 Redux state
- 提供最原始的状态数据

**chaptersCanonical.ts** - Canonical 层

- 服务器返回的唯一真相
- 章节映射、路径、引用资料

**draftTreeSelectors.ts** - Draft 层

- 用户编辑的实时结构
- 文档状态、变更检测

**composition.ts** - 派生层

- 合成渲染数据（Canonical + 消息）
- 章节内容映射、完整文档 HTML

**globalOp/** - 操作层

- 全局操作状态查询
- AIGC 生成与改写的详细信息

## 依赖关系

```
base.ts (基础状态)
  ↓
├─ chaptersCanonical.ts
├─ draftTreeSelectors.ts
├─ globalOp/base.ts
│   ↓
│   ├─ globalOp/aigcGeneration.ts
│   └─ globalOp/aigcTextRewrite.ts
├─ chapterStats.ts
  ↓
composition.ts
  ↓
documentHash.ts
  ↓
outlineView.ts
```

## 设计原则

- **单一职责**：每个文件只负责一类数据查询
- **分层清晰**：基础层 → Canonical/Draft 层 → 派生层 → 操作层
- **复用 Domain**：类型守卫和工具函数放在 domain 层
- **命名规范**：`select[Entity][Property]` / `selectIs[State]`

## 相关文档

- @see [数据层指南](../../../docs/RPDetail/ContentManagement/data-layer-guide.md)
- @see [GlobalOp Selectors](./globalOp/README.md)
