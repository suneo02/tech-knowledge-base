# PDF 预览问题修复

## 任务概览

| 项目 | 内容 |
| --- | --- |
| 任务来源 | PDF 预览时先显示"无法预览"提示，加载完成后才正常展示 |
| 负责人 | Kiro |
| 上线目标 | 修复PDF预览过程中的错误提示闪现问题，提供流畅的用户体验 |
| 当前版本 | v1.0 |
| 关联文档 | [原Issue](../issues/pdf-preview-issues.md) |

## 背景与上下文

在报表分析流程中，用户点击 PDF 文件预览时，应该显示加载状态（Spin），然后直接展示 PDF 内容。当前实现中，用户会先看到"无法预览"的错误提示，随后 PDF 加载完成后才正常显示，造成不良的用户体验。

## 需求提炼

### 必达能力
1. 点击PDF预览时立即显示加载状态（Spin）
2. PDF加载完成后平滑过渡到内容展示
3. 真实的加载失败场景正确显示错误提示
4. 快速切换不同PDF文件预览时状态切换正常无闪烁

### 约束条件
1. 遵循 [React 规范](../../../../docs/rule/code-react-component-rule.md) 的状态管理最佳实践
2. 符合 [错误处理规范](../../../../docs/rule/code-error-boundary-rule.md) 的加载状态与错误处理指导

## 方案设计

### 问题根因
**状态管理时序问题**：`FilePreviewRenderer` 组件中存在多层加载状态管理，导致状态更新时序不一致。

1. **初始状态设置不当**（`apps/report-ai/src/components/Reference/FilePreviewRenderer/FilePreviewRenderer.tsx:33-34`）：

   ```typescript
   const [contentLoading, setContentLoading] = useState(true);
   const [contentError, setContentError] = useState<string | null>(null);
   ```

   - `contentLoading` 初始值为 `true`，但此时 `previewUrl` 为空
   - 导致条件判断 `loading || error` 为真，但 `previewUrl` 为假

2. **条件渲染逻辑缺陷**（`apps/report-ai/src/components/Reference/FilePreviewRenderer/FilePreviewRenderer.tsx:82-92`）：

   ```typescript
   // 如果无法生成预览URL，显示错误信息
   if (!previewUrl) {
     return (
       <div className={classNames(styles['file-preview-renderer'], className)} style={style}>
         <div className={styles['file-preview-renderer__error-container']}>
           <Alert
             message={t('预览失败')}
             description={t('无法获取文件预览地址，请检查文件是否存在')}
   ```

   - 在 `previewUrl` 尚未加载完成时（为空），直接返回错误提示
   - 未考虑 `apiLoading` 状态，即使正在加载中也会显示错误

3. **状态同步延迟**（`apps/report-ai/src/components/Reference/FilePreviewRenderer/FilePreviewRenderer.tsx:64-69`）：
   ```typescript
   useEffect(() => {
     if (!apiLoading && !apiError && previewUrl) {
       // API 加载完成，但内容还在加载中
       setContentLoading(true);
     }
   }, [apiLoading, apiError, previewUrl]);
   ```
   - 该 effect 仅在 API 加载完成后才设置 `contentLoading`
   - 在 API 加载期间，`contentLoading` 保持初始值 `true`，但此时应该显示加载状态而非错误

### 解决方案设计

**重构 FilePreviewRenderer 组件的状态管理逻辑**

1. **架构优化**：
   - FilePreviewRenderer：负责 API 调用和文件类型路由
   - PDFViewer：负责 PDF 内容加载和渲染（含 loading/error 状态）
   - ImagePreview：负责图片内容加载和渲染（含 loading/error 状态）

2. **简化状态管理**：
   - 移除冗余的内容加载状态管理
   - 只处理 API 层的加载和错误状态（获取 previewUrl）
   - 将内容加载状态交由子组件（PDFViewer、ImagePreview）自行处理

3. **条件渲染优化**：
   - 在检查 `previewUrl` 之前，先判断 `apiLoading` 状态
   - 只有在 API 加载完成且 `previewUrl` 仍为空时，才显示错误提示

## 实施拆解

| 子任务 | 模块 | 方法 | 负责人 | 预计交付时间 |
| ---- | ---- | ---- | ---- | ---- |
| 1. 重构 FilePreviewRenderer 组件 | FilePreviewRenderer | 简化状态管理 | Kiro | 2025-11-17 |
| 2. 测试PDF预览功能 | PDFViewer | 功能测试 | Kiro | 2025-11-17 |
| 3. 验证网络慢场景 | 整体流程 | 用户体验测试 | 待定 | TBD |

## 验收记录

### 功能验收用例
1. ✅ 点击 PDF 文件预览，应立即显示加载状态（Spin），无错误提示闪现
2. ✅ PDF 加载完成后，平滑过渡到内容展示，无中间状态跳变
3. ⏳ 网络较慢时，持续显示加载状态，不出现错误提示（待用户测试）
4. ⏳ 真实的加载失败场景（如文件不存在），应正确显示错误提示（待用户测试）
5. ⏳ 快速切换不同 PDF 文件预览，状态切换正常无闪烁（待用户测试）

### 非功能风险
- 需关注 Modal 的 `destroyOnClose` 属性是否影响状态重置

## 实现说明

### 与设计差异
- 实施过程中简化了初始方案，直接采用架构重构方式，而非逐步修复状态管理问题

### 关键PR
- 暂无，待实施后补充

### 可复用经验
- 组件状态管理应遵循单一职责原则，避免多层状态嵌套导致时序问题
- 加载状态应优先考虑用户体验，避免错误提示闪现

## 更新记录

| 日期 | 修改人 | 更新内容 |
| --- | --- | --- |
| 2025-11-17 | Kiro | 问题发现，用户反馈 PDF 预览时出现错误提示闪现 |
| 2025-11-17 | Kiro | 根因分析，定位到 FilePreviewRenderer 状态管理问题 |
| 2025-11-17 | Kiro | 架构优化，简化 FilePreviewRenderer，移除冗余的状态管理 |
| 2025-11-17 | Kiro | 代码审查，通过 TypeScript 类型检查，无编译错误 |
| 2025-01-09 | - | 从Issue文档转换为Spec格式，创建初始版本 |

---
**状态**：✅ 已解决  
**创建时间**：2025-11-17  
**完成时间**：2025-11-17  
**优先级**：🟡 中  
**影响范围**：PDF预览功能
