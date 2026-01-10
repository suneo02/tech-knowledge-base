# TinyMCE 内部属性滥用修复

## 任务概览

| 项目 | 内容 |
| --- | --- |
| 任务来源 | TinyMCE 内部属性滥用问题 |
| 负责人 | 待指派 |
| 上线目标 | 移除对 TinyMCE 内部属性的滥用，改用业务层统一清洗方案 |
| 当前版本 | v1.0 |
| 关联文档 | [原Issue](../issues/tinymce-attribute-misuse.md) |

## 背景与上下文

外部渲染节点（章节编号、溯源标记等）应该在业务层通过 `data-gel-external` 属性标记和清洗，而不是依赖 TinyMCE 的内部属性（如 `data-mce-bogus`、`data-mce-noneditable`）。当前实现中，报告标题使用 `data-mce-noneditable="true"` 属性，溯源标记使用 `contenteditable="false"`，违反了架构设计原则。

## 需求提炼

### 必达能力
1. 移除对 TinyMCE 内部属性的依赖
2. 使用业务层统一清洗方案
3. 保持节点不可编辑的功能
4. 确保保存时正确处理外部渲染节点
5. 遵循架构设计原则

### 约束条件
1. 不影响现有功能
2. 保持用户体验一致
3. 确保修复过程中系统稳定性
4. 与现有状态管理机制兼容

## 方案设计

### 问题根因
1. **滥用 TinyMCE 内部属性**：报告标题使用 `data-mce-noneditable`，溯源标记使用 `contenteditable="false"`
2. **违反架构设计原则**：未遵循业务层统一清洗的设计原则
3. **增加维护成本**：需要额外清理 `data-mce-bogus` 属性，增加理解难度

### 解决方案设计
1. **移除报告标题的 `data-mce-noneditable` 属性**：
   - 改用 CSS 样式控制（如 `pointer-events: none`）
   - 位置：`domain/reportEditor/document/render.ts:21`

2. **确认溯源标记清洗逻辑**：
   - 验证已有的 `data-gel-external` 属性处理
   - 位置：`domain/reportEditor/chapterRef/render.ts:41`

3. **移除 `contentSanitizer` 中清理 `data-mce-bogus` 的逻辑**：
   - 移除不必要的清理步骤
   - 位置：`domain/reportEditor/editor/contentSanitizer.ts:52-56`

4. **从 constants 中移除 `MCE_BOGUS` 相关常量**：
   - 清理不应在业务代码中使用的常量
   - 位置：`domain/reportEditor/foundation/constants.ts:38-73`

## 实施拆解

| 子任务 | 模块 | 方法 | 负责人 | 预计交付时间 |
| ---- | ---- | ---- | ---- | --- |
| 1. 修改报告标题渲染逻辑 | document/render | 移除data-mce-noneditable，添加CSS | 待指派 | TBD |
| 2. 验证溯源标记清洗逻辑 | chapterRef/render | 确认data-gel-external处理 | 待指派 | TBD |
| 3. 移除mce-bogus清理代码 | contentSanitizer | 删除相关清理逻辑 | 待指派 | TBD |
| 4. 移除MCE_BOGUS常量定义 | constants | 删除相关常量 | 待指派 | TBD |
| 5. 更新相关文档 | 文档 | 更新架构说明 | 待指派 | TBD |
| 6. 功能测试 | 测试 | 验证所有功能正常 | 待指派 | TBD |

## 验收记录

### 功能验收用例
1. **报告标题不可编辑验证**：验证报告标题通过 CSS `pointer-events: none` 实现不可编辑效果
2. **保存时节点处理验证**：验证保存时外部渲染节点被正确移除
3. **编辑器setContent验证**：验证编辑器 setContent 时节点不被过滤
4. **溯源标记功能验证**：验证溯源标记功能正常，不可编辑
5. **整体功能验证**：验证所有相关功能正常工作

### 非功能风险
- CSS 样式控制可能不如 TinyMCE 属性稳定
- 需要确保所有外部渲染节点都有 data-gel-external 属性
- 可能存在其他地方使用了 TinyMCE 内部属性

## 实现说明

### 与设计差异
- 暂未实现，待实施后补充

### 关键PR
- 暂无，待实施后补充

### 可复用经验
- 暂无，待实施后补充

## 更新记录

| 日期 | 修改人 | 更新内容 |
| --- | --- | --- |
| 2025-10-22 | - | 初始创建，识别 TinyMCE 属性滥用问题 |
| 2025-01-09 | - | 从Issue文档转换为Spec格式，创建初始版本 |

---
**状态**：🚧 进行中  
**创建时间**：2025-10-22  
**优先级**：🟡 中  
**影响范围**：编辑器外部渲染节点  
**预估工期**：2 人日