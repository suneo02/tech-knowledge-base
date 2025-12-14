# GlobalOp Selectors

全局操作状态选择器，按操作类型组织。

## 目录结构

```
globalOp/
├── index.ts              # 统一导出所有 selectors
├── base.ts               # 全局操作基础状态（kind、busy、readonly）
├── aigcGeneration.ts     # AIGC 生成操作（全文/多章节/单章节）
└── aigcTextRewrite.ts    # AIGC 文本改写操作
```

## 核心文件

**base.ts** - 全局操作基础状态

- `selectGlobalOp`: 整个操作状态对象
- `selectGlobalOpKind`: 当前操作类型
- `selectIsGlobalBusy`: 是否处于全局忙碌状态
- `selectShouldEditorBeReadonly`: 编辑器是否应该只读

**aigcGeneration.ts** - 生成操作详情

- 全文生成：进度、队列、错误
- 多章节生成：进度、队列、暂停、失败列表
- 单章节生成：章节 ID、状态

**aigcTextRewrite.ts** - 改写操作详情

- 改写数据、快照、关联 ID
- 完成状态、预览内容

## 依赖关系

```
../base.ts (基础状态)
  ↓
base.ts (全局操作基础)
  ↓
├─ aigcGeneration.ts (生成操作详情)
└─ aigcTextRewrite.ts (改写操作详情)
```

## 设计原则

- **分层清晰**：base 提供基础状态，其他文件提供详细信息
- **复用 Domain**：类型守卫放在 `domain/globalOperation`
- **命名规范**：`select[Entity][Property]` / `selectIs[State]`

## 相关文档

- @see [GlobalOperation Domain](../../../../domain/globalOperation/index.ts)
- @see [生成流程](../../../../docs/RPDetail/ContentManagement/full-generation-flow.md)
