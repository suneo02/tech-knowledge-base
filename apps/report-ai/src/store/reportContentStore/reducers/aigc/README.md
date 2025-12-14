# AIGC Reducers

AI 生成与改写操作的状态管理，统一处理全文生成、多章节生成、单章节重生成和文本改写。

## 目录结构

```
aigc/
├── index.ts                  # 统一导出所有 AIGC reducers
├── shared.ts                 # 共享工具函数（解锁、清理、验证）
├── chapterOperation.ts       # 章节操作编排（启动、请求管理）
├── generation.ts             # 全文生成 + 多章节顺序生成
├── chapterRegeneration.ts    # 单章节重生成
└── textRewrite.ts            # 文本改写
```

## 核心文件

**shared.ts** - 共享工具函数

- 章节操作：解锁章节、清理请求记录
- GlobalOp 操作：设置状态、完成/取消/重置
- 验证函数：组合验证（validate）、类型守卫、数据提取（getQueueData）
- 批量生成：队列推进（progressToNext）、完成/取消/重置（resetFromGlobalOp）

**generation.ts** - 队列类生成操作

- 全文生成：自动遍历全部叶子章节
- 多章节生成：用户勾选章节顺序生成

**chapterRegeneration.ts** - 单章节操作

- 单章节重生成、取消、错误处理

**textRewrite.ts** - 文本改写操作

- 文本改写的生命周期管理

## 依赖关系

```
shared.ts (工具函数)
  ↓
├─ chapterOperation.ts → 章节操作编排
├─ generation.ts → 全文生成、多章节生成
├─ chapterRegeneration.ts → 单章节重生成
└─ textRewrite.ts → 文本改写
  ↓
index.ts (统一导出)
  ↓
../index.ts (合并到 allReducers)
```

## 设计要点

- **逻辑复用**：重复逻辑抽象到 shared.ts
  - `progressToNext` 统一处理队列推进
  - `resetFromGlobalOp` 统一处理重置逻辑
  - `validate` 组合验证 kind 和 dataType
  - `getQueueData` 统一提取队列数据
- **类型安全**：使用类型守卫验证 globalOp 状态
- **一致性**：所有操作遵循相同的命名模式（start/complete/cancel/reset）
- **统一队列管理**：全文生成和多章节生成共享批量操作工具

## 相关文档

- @see [全文生成流程](../../../../docs/RPDetail/ContentManagement/full-generation-flow.md)
- @see [多章节顺序生成](../../../../docs/specs/multi-chapter-sequential-aigc/spec-core-v1.md)
- @see [单章节 AIGC](../../../../docs/specs/single-chapter-aigc-implementation/spec-design-v1.md)
- @see [文本改写](../../../../docs/specs/text-ai-rewrite-implementation/spec-design-v1.md)
