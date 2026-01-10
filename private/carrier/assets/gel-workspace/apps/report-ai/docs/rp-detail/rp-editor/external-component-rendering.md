# ReportEditor 外部组件渲染设计

> 📖 本文档遵循 [设计文档编写规范](../../../docs/rule/doc-design-rule.md)  
> ↩️ 回链：[ReportEditor 设计](./design.md)

## 🎯 设计目标

在 TinyMCE iframe 外部渲染 React 组件，提供实时反馈与交互提示，同时保持编辑器内容纯净。

## 🏗 架构概览

### 组件分层

```
useExternalComponentRenderer (协调层)
├── 注册器机制 - 统一调度多个外部组件
├── RAF 调度 - microtask + RAF 两阶段渲染
└── 状态协调 - hover、loading 等共享状态

外部组件 (渲染层)
├── Loading Overlay - 章节生成时的加载指示
├── AIGC Button - 章节悬停时的操作按钮
└── Text Rewrite Preview - 文本改写预览（独立调度）

工具层
├── createExternalComponentRenderer - 统一渲染器
├── 定位工具 - getEditorFrameOffset 等
└── DOM 工具 - isEditorReady 等
```

### 渲染策略

| 组件            | 位置            | 生命周期 | 调度方式     |
| --------------- | --------------- | -------- | ------------ |
| Loading Overlay | `document.body` | 生成期间 | 注册器 + RAF |
| AIGC Button     | `document.body` | 悬停期间 | 注册器 + RAF |
| Text Rewrite    | `document.body` | 改写会话 | 独立 RAF     |

**关键特性：**

- 所有组件渲染在 `document.body`，不污染编辑器 DOM
- 使用绝对定位，基于 iframe 偏移计算位置
- 通过 RAF 批量渲染，减少重排/重绘

## 🎨 设计规范

### 1. 统一渲染器

所有外部组件必须使用 `createExternalComponentRenderer`。

**配置管理：**

- 使用 `EXTERNAL_COMPONENT_CONFIGS` 预定义配置
- 统一管理 z-index 层级和组件 ID

**收益：** 统一的生命周期、实例缓存、清理逻辑

---

### 2. 注册器模式

需要统一调度的组件使用注册器模式。

**适用场景：**

- ✅ 需要与其他组件同步渲染（如 Loading + AIGC Button）
- ❌ 完全独立的生命周期（如 Text Rewrite）

**实现：** 通过 `registerRenderer` 注册，返回 `unregister` 函数清理

---

### 3. Props 驱动

所有外部状态通过 props 传入，避免内部订阅 Redux。

**原则：**

- ✅ 状态由父组件计算并传入
- ✅ 使用 selector 计算派生状态
- ❌ 不在 hook 内部直接订阅 Redux

---

### 4. 统一定位

使用统一的定位工具计算位置。

**核心工具：**

- `getEditorFrameOffset()` - 获取 iframe 偏移
- `getBoundingClientRect()` - 获取元素位置
- `calculateFloatingPosition()` - 计算浮层位置

---

### 5. RAF 调度

所有渲染在 RAF 中执行，避免与 TinyMCE DOM 更新冲突。

**调度流程：**

```
业务触发 → queueMicrotask → RAF → 批量渲染
```

## 📦 核心组件

### useExternalComponentRenderer

**职责：** 协调所有外部组件的渲染

**关键功能：**

- 提供 `registerRenderer` 注册机制
- 提供 `requestRender` 触发渲染
- 通过 microtask + RAF 合并渲染请求
- 错误隔离（单个组件失败不影响其他）

**代码：** `hooks/useExternalComponentRenderer.tsx`

---

### useChapterLoadingOverlay

**职责：** 显示章节生成时的 Loading 指示

**特点：**

- 使用注册器模式
- 完全由 props 驱动（`activeChapters`）
- 定位到标题正下方
- 自动清理实例

**代码：** `hooks/useChapterLoadingOverlay.tsx`  
**Spec：** `specs/chapter-title-loading-indicator/spec-core-v1.md`

---

### useAIGCButton

**职责：** 显示章节悬停时的 AIGC 按钮

**特点：**

- 使用注册器模式
- 基于 hover 状态显示/隐藏
- 复用 React Root
- 定位到标题右侧

**代码：** `hooks/useAIGCButton.tsx`  
**Spec：** `specs/aigc-button-on-hover/spec-design-v1.md`

---

### useTextRewritePreview

**职责：** 显示文本改写预览

**特点：**

- 独立调度（不使用注册器）
- 生命周期与改写会话绑定
- 基于选区位置定位
- 流式更新内容

**代码：** `hooks/useTextRewritePreview/`  
**Spec：** `specs/text-ai-rewrite-preview-floating/spec-preview-floating-v1.md`

## 🛠 工具函数

### 渲染器工具

- `createExternalComponentRenderer()` - 创建渲染器实例
- `createGlobalContainerConfig()` - 创建配置
- `EXTERNAL_COMPONENT_CONFIGS` - 预定义配置

**代码：** `hooks/utils/externalComponentRenderer.ts`

---

### 定位工具

- `getEditorFrameOffset()` - 获取 iframe 偏移
- `calculateFloatingPosition()` - 计算浮层位置
- `getFallbackCenterPosition()` - 降级居中定位

**代码：** `hooks/utils/positionCalculator.ts`

---

### DOM 工具

- `isEditorReady()` - 检查编辑器就绪
- `getEditorBody()` - 获取编辑器 body
- `getEditorDocumentContext()` - 获取 iframe 上下文

**代码：** `hooks/utils/editorDomUtils.ts`

## ⚠️ 错误处理

**原则：** 外部组件渲染失败不影响编辑器核心功能

**策略：**

- 编辑器未就绪 → 静默跳过
- 元素查找失败 → 等待下次渲染
- React 渲染异常 → 捕获错误，清理容器
- 定位计算失败 → 降级到居中布局
- 单个渲染器失败 → 错误隔离，记录日志

## 📚 相关文档

**设计文档：**

- [ReportEditor 设计](./design.md)

**Spec 文档：**

- [Loading 指示器](../../specs/chapter-title-loading-indicator/spec-core-v1.md)
- [AIGC 按钮](../../specs/aigc-button-on-hover/spec-design-v1.md)
- [文本改写预览](../../specs/text-ai-rewrite-preview-floating/spec-preview-floating-v1.md)

**审查报告：**

- [外部组件审查](../../specs/chapter-title-loading-indicator/EXTERNAL_COMPONENTS_REVIEW.md)
- [统一完成报告](../../specs/chapter-title-loading-indicator/UNIFICATION_COMPLETE.md)

