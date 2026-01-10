# ReportEditor 组件文档

## 一句话定位

半受控富文本编辑器，内容通过 ref 命令式注入，行为通过 props 受控，不内置业务逻辑。

## 目录结构

```
ReportEditor/
├── index.tsx                    # 组件主入口
├── types/index.ts               # Props 与状态类型
├── hooks/                       # 核心逻辑 hooks
│   ├── useReportEditorRef.ts    # 命令式 API（ref 方法）
│   ├── useEditorFacade.ts       # EditorFacade 封装
│   ├── useEditorDomSync.ts      # 章节 ID 与编号同步
│   ├── useExternalComponentRenderer.tsx  # 外部浮层统一调度
│   ├── useAIGCButton.tsx        # AIGC 按钮渲染
│   ├── useChapterLoadingOverlay.tsx      # Loading 指示器
│   └── useTextRewritePreview/   # 文本改写预览
├── config/                      # TinyMCE 配置
└── styles/                      # 样式文件
```

## 核心设计

### 半受控模式

- 内容非受控：不通过 props 传递 HTML，避免大对象 diff
- 行为受控：只读/加载/模式通过 props 控制
- 命令式注入：内容写入通过 ref 方法执行

### 职责边界

- 组件：提供编辑能力、内容注入接口、交互回调
- 业务：保存/生成/并发控制由外层（ReportContent）负责
- 不理解：Epoch/Lease/Draft 等业务概念

### 性能优化

- Props 轻量化：仅传递控制状态与回调
- 批量渲染：外部组件通过 RAF 统一调度
- 静默注水：不触发 onChange，不写入撤销栈

## Props 接口

| 属性                  | 类型                                  | 必填 | 说明                          |
| --------------------- | ------------------------------------- | ---- | ----------------------------- |
| initialValue          | string                                | 否   | 初始 HTML（仅首次渲染）       |
| readonly              | boolean                               | 否   | 是否只读                      |
| loading               | boolean                               | 否   | 是否显示加载状态              |
| mode                  | 'edit' \| 'preview'                   | 否   | 编辑器模式，默认 'edit'       |
| placeholder           | string                                | 否   | 空内容占位符                  |
| aigcButtonDisabled    | boolean                               | 否   | AIGC 按钮是否禁用             |
| aigcLoadingChapters   | ChapterLoadingOverlayState[]          | 否   | 需要显示 Loading 的章节列表   |
| textRewriteState      | TextRewriteState                      | 是   | 文本改写状态（外部管理）      |
| className             | string                                | 否   | 自定义样式类名                |
| style                 | React.CSSProperties                   | 否   | 自定义内联样式                |
| onEditorReady         | () => void                            | 否   | 编辑器初始化完成回调          |
| onContentChange       | (fullHtml: string) => void            | 否   | 内容变化回调（返回纯净 HTML） |
| onAIInvoke            | AIInvokeFunction                      | 否   | AI 操作调用回调               |
| onStopGenerating      | (sectionId: string) => void           | 否   | 停止生成回调                  |
| onReferenceClick      | (info) => void                        | 否   | 引用标记点击回调              |
| onAIGCButtonClick     | (chapterId: string) => void           | 否   | AIGC 按钮点击回调             |
| onTextRewriteDecision | (decision, content, snapshot) => void | 否   | 文本改写决策回调              |

## Ref 方法接口

### 基础内容操作

| 方法                   | 参数              | 返回值  | 说明                      |
| ---------------------- | ----------------- | ------- | ------------------------- |
| getContent             | -                 | string  | 获取当前内容              |
| setContent             | content: string   | void    | 设置内容（触发 onChange） |
| insertContent          | content, format?  | void    | 在光标位置插入            |
| getSelectedContent     | -                 | string  | 获取选中内容              |
| replaceSelectedContent | content: string   | void    | 替换选中内容              |
| focus                  | -                 | void    | 聚焦编辑器                |
| isFocused              | -                 | boolean | 检查是否聚焦              |
| scrollToChapter        | chapterId: string | void    | 滚动到指定章节            |
| undo / redo            | -                 | void    | 撤销/重做                 |
| canUndo / canRedo      | -                 | boolean | 检查是否可撤销/重做       |

### 选区级别操作（文本改写）

| 方法                | 参数             | 返回值 | 说明         |
| ------------------- | ---------------- | ------ | ------------ |
| replaceSelectedText | content, format? | void   | 替换选中文本 |
| restoreSelection    | snapshot         | void   | 恢复选区状态 |

### 章节级别操作（注水）

| 方法                   | 参数                           | 返回值           | 说明                                  |
| ---------------------- | ------------------------------ | ---------------- | ------------------------------------- |
| updateChapterContent   | chapterId, content, opts?      | OperationResult  | 更新章节内容（静默，不触发 onChange） |
| setFullContent         | content, opts?                 | OperationResult  | 全量替换内容（静默）                  |
| updateStreamingSection | chapterId, html, status, opts? | OperationResult  | 流式更新（AI 生成预览）               |
| applyIdMap             | idMap                          | ApplyIdMapResult | 批量替换章节 ID（保存后同步临时 ID）  |
| isEditorReady          | -                              | boolean          | 检查编辑器是否就绪                    |

**OperationResult**: `{ success: boolean; error?: string; contentLength?: number }`

**ApplyIdMapResult**: `{ replacedCount: number; affectedIds: string[]; unmatchedIds: string[] }`

## 生命周期与使用场景

### 初始化/还原

外层拼接完整 HTML → 通过 `setFullContent` 全量注水 → 重置 Draft 状态

### 用户编辑

编辑行为仅通过 `onContentChange` 回调上报，外层更新 Draft 与保存状态

### 保存成功

成功后仅合并 Canonical，不触发 setContent（避免回环）→ 应用 `applyIdMap` 同步临时 ID

### AI 生成

1. 生成前设置 `readonly={true}`
2. 流式预览使用 `updateStreamingSection`（50-100ms 节流）
3. 完成后通过 `updateChapterContent` 注水
4. 解除只读

### 章节重生成

清空目标章节 → 设为只读 → 流式预览 → 完成后注水并解锁

## 注水策略

### 允许注水

- 页面初始化/还原
- 切换报告版本
- AI 生成完成（全文/章节）
- 外部合并/回到快照

### 禁止注水

- 保存 ACK（避免回环与光标抖动）
- 局部结构微调（折叠/展开）
- 保存状态变化（saving → idle）
- 用户正在编辑

## 外部组件渲染

### 设计理念

- 统一调度：所有外部浮层通过 RAF 批量渲染
- 状态驱动：完全由 props 和内部状态驱动
- 性能优化：microtask + RAF 两阶段调度

### 支持的组件

| 组件           | 触发条件                     | 渲染位置     | 说明               |
| -------------- | ---------------------------- | ------------ | ------------------ |
| AIGC 按钮      | 鼠标悬停章节标题             | 标题右侧     | 点击触发章节生成   |
| Loading 指示器 | 章节状态为 pending/receiving | 章节标题上方 | 显示进度，支持停止 |

### 调度流程

用户操作/状态变化 → requestRender() → queueMicrotask → RAF → 执行所有渲染器

## 错误处理

| 场景                | 处理方式                                      |
| ------------------- | --------------------------------------------- |
| 编辑器未就绪        | 检查 `isEditorReady()`，返回 false 则跳过操作 |
| 注水失败            | 检查 `result.success`，失败时保留现状允许重试 |
| 版本冲突（423/409） | 保留本地草稿，标记冲突，由用户决定合并或覆盖  |
| 生成失败            | 解除只读，保留现有内容，允许重试或手动编辑    |

## 验收清单

- [ ] 不从 props 读取/覆盖 HTML 内容
- [ ] 命令式 API 完整：全量注水、章节替换、流式更新、选区操作
- [ ] 回调粒度清晰：onChange 返回纯净 HTML
- [ ] 只读门控：生成期间可精确锁定目标范围
- [ ] 外部组件渲染：AIGC 按钮与 Loading 正常显示
- [ ] 性能优化：注水不触发 onChange，外部组件批量渲染
- [ ] 错误隔离：单个操作失败不影响整体

## 相关文档

- [数据与状态管理](../../../docs/RPDetail/ContentManagement/data-layer-guide.md) - Canonical/Draft/注水策略
- [全文生成流程](../../../docs/RPDetail/ContentManagement/full-generation-flow.md) - AI 生成场景
- [外部组件渲染](../../../docs/RPDetail/RPEditor/external-component-rendering.md) - 浮层组件架构
- [Hooks 架构](./hooks/README.md) - 各 hook 职责与协作
- [逻辑审查](./logic-review.md) - 设计问题与改进建议
