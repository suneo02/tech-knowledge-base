# OutlineView 章节唯一标识处理问题

## 问题概览

| 项目     | 内容                                           |
| -------- | ---------------------------------------------- |
| 标题     | OutlineView 组件无法正确处理临时章节的唯一标识 |
| 状态     | ✅ 已解决                                      |
| 优先级   | 🟡 中                                          |
| 责任人   | Kiro                                           |
| 发现时间 | 2025-10-27                                     |
| 解决时间 | 2025-10-27                                     |
| 影响范围 | OutlineView 组件及相关章节状态管理工具函数     |

## 背景与预期

报告大纲视图需要支持两种章节类型：

1. **已保存章节**：有 `chapterId`（后端返回）
2. **临时章节**：只有 `tempId`（前端创建，未保存）

`OutlineChapterViewModel` 类型设计支持这两种场景，`chapterId` 为可选字段。但现有工具函数假设 `chapterId` 必须存在，导致类型不兼容。

## 问题陈述

### 现象

在 `OutlineView` 组件中使用 `getAllChapterIds`、`expandStateUtils.expandAll` 等工具函数时，TypeScript 报类型错误：

```
Argument of type 'OutlineChapterViewModel[]' is not assignable to parameter of type
'(RPChapterIdIdentifier & { children?: OutlineChapterViewModel[] | undefined; })[]'.
  Type 'number | undefined' is not assignable to type 'number'.
    Type 'undefined' is not assignable to type 'number'.
```

**位置**：`apps/report-ai/src/components/outline/OutlineView/index.tsx:31,48,49`

### 根因

1. **类型定义不一致**：

   - `OutlineChapterViewModel` 的 `chapterId` 是可选的（`Partial<RPChapterIdIdentifier>`）
   - 工具函数要求 `chapterId` 必须存在（`RPChapterIdIdentifier`）

   来源：`apps/report-ai/src/types/report/outlineView.ts:18-21`

2. **缺少统一的唯一键获取方法**：

   - 各处直接使用 `chapter.chapterId`，未考虑 `tempId` 的情况
   - 展开/选中状态管理依赖 `chapterId`，无法处理临时章节

   来源：`apps/report-ai/src/domain/chapter/query.ts:55`、`apps/report-ai/src/domain/chapter/state.ts:59`

### 影响

- ❌ TypeScript 编译错误，阻塞开发
- ❌ 临时章节无法正确展开/收起
- ❌ 临时章节无法被选中
- ❌ 状态管理工具函数无法复用于 OutlineView

## 参考资料

| 文件/文档                                                     | 作用                       | 备注                    |
| ------------------------------------------------------------- | -------------------------- | ----------------------- |
| `apps/report-ai/src/types/report/outlineView.ts`              | OutlineChapterViewModel    | chapterId 可选          |
| `apps/report-ai/src/components/outline/OutlineView/index.tsx` | 大纲视图组件               | 多处类型错误            |
| `apps/report-ai/src/domain/chapter/query.ts:55`               | getAllChapterIds 函数      | 要求 chapterId 必须存在 |
| `apps/report-ai/src/domain/chapter/state.ts:59`               | expandStateUtils.expandAll | 要求 chapterId 必须存在 |
| `gel-api` 类型定义                                            | RPChapterIdIdentifier      | chapterId 必填          |

## 解决方案

### 最终方案

**抽象统一的章节唯一键获取方法**，支持 `chapterId` 和 `tempId` 两种标识：

1. **新增工具函数** `getChapterKey`（`apps/report-ai/src/domain/chapter/utils.ts`）：

   ```typescript
   /**
    * 获取章节的唯一标识键
    * 优先使用 chapterId，不存在时使用 tempId
    */
   export function getChapterKey(chapter: OutlineChapterViewModel): string {
     return chapter.chapterId?.toString() ?? chapter.tempId;
   }
   ```

2. **重构工具函数**，支持泛型约束：

   - `getAllChapterIds` → `getAllChapterKeys`
   - `expandStateUtils.expandAll` 支持 `OutlineChapterViewModel`
   - `expandStateUtils.isAllExpanded` 支持 `OutlineChapterViewModel`

3. **更新 OutlineView 组件**：
   - 使用 `getChapterKey` 替代直接访问 `chapterId`
   - 状态管理使用统一的 key

**负责人**：待分配  
**计划时间**：1-2 天

### 备选方案（已放弃）

**方案 A**：强制 `OutlineChapterViewModel` 的 `chapterId` 必填

- ❌ 放弃理由：违背设计初衷，临时章节确实没有 `chapterId`

**方案 B**：在组件层面过滤掉临时章节

- ❌ 放弃理由：临时章节需要在大纲中展示

## 验证与风险

### 验证步骤

1. ✅ TypeScript 编译通过，无类型错误
2. ✅ 已保存章节的展开/收起功能正常
3. ✅ 临时章节的展开/收起功能正常
4. ✅ 章节选中状态正确切换
5. ✅ 全部展开/收起按钮功能正常

### 剩余风险

- ⚠️ `tempId` 与 `chapterId` 的命名冲突（概率低，需要 UUID 生成策略保证）
- ⚠️ 其他组件可能也存在类似问题，需要全局搜索 `chapterId` 的使用

### 监控建议

- 在开发环境添加 `getChapterKey` 的断言，确保返回值非空
- 代码审查时检查所有直接访问 `chapterId` 的地方

## 验证结果

✅ 所有验证步骤已通过：

1. ✅ TypeScript 编译通过，无类型错误
2. ✅ 已保存章节的展开/收起功能正常（使用 chapterId）
3. ✅ 临时章节的展开/收起功能正常（使用 tempId）
4. ✅ 章节选中状态正确切换
5. ✅ 全部展开/收起按钮功能正常

## 实施细节

### 修改的文件

1. **apps/report-ai/src/domain/chapter/types.ts**

   - 新增 `ChapterLikeWithOptionalId` 类型，支持可选的 chapterId

2. **apps/report-ai/src/domain/chapter/query.ts**

   - 新增 `getChapterKey` 函数：获取章节唯一键（优先 chapterId，回退 tempId）
   - 新增 `getAllChapterKeys` 函数：获取所有章节的唯一键列表

3. **apps/report-ai/src/domain/chapter/state.ts**

   - 新增 `expandStateUtils.expandAllWithKeys`：支持临时章节的展开所有
   - 新增 `expandStateUtils.isAllExpandedWithKeys`：支持临时章节的全部展开判断

4. **apps/report-ai/src/domain/chapter/index.ts**

   - 导出新增的类型和函数

5. **apps/report-ai/src/components/outline/OutlineView/index.tsx**

   - 使用 `getChapterKey` 替代直接访问 `chapterId`
   - 使用 `getAllChapterKeys` 替代 `getAllChapterIds`
   - 使用 `expandAllWithKeys` 和 `isAllExpandedWithKeys`

6. **apps/report-ai/src/components/outline/OutlineView/ChapterNode.tsx**

   - 使用 `getChapterKey` 处理子节点的 key 和状态判断

7. **apps/report-ai/src/components/outline/OutlineView/ChapterNodeBase.tsx**
   - 使用 `getChapterKey` 处理展开/选中回调

## 更新日志

| 日期       | 事件     | 描述                                      |
| ---------- | -------- | ----------------------------------------- |
| 2025-10-27 | 问题发现 | OutlineView 组件出现 TypeScript 类型错误  |
| 2025-10-27 | 问题解决 | 实现 getChapterKey 工具函数，更新相关组件 |

## 附录

### 相关代码片段

**OutlineChapterViewModel 类型定义**：

```typescript
// apps/report-ai/src/types/report/outlineView.ts:12-22
export interface OutlineChapterViewModel
  extends Partial<WithDPUList>,
    Partial<WithRAGList>,
    Pick<RPChapter, 'title' | 'writingThought'>,
    RPChapterPayloadTempIdIdentifier, // tempId: string
    Partial<RPChapterIdIdentifier> {
  // chapterId?: number
  children?: OutlineChapterViewModel[];
  refFiles?: RPFileTraced[];
}
```

**问题代码示例**：

```typescript
// apps/report-ai/src/components/outline/OutlineView/index.tsx:31
useMemo(() => {
  setExpandedChapters(new Set(getAllChapterIds(treeData))); // ❌ 类型错误
}, [treeData]);
```
