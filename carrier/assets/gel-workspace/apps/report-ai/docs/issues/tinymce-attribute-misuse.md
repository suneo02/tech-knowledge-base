# TinyMCE 内部属性滥用问题

## 问题概览

| 字段         | 内容                                                            |
| ------------ | --------------------------------------------------------------- |
| 问题         | 滥用 TinyMCE 内部属性（data-mce-noneditable）导致节点被意外过滤 |
| 状态         | 🚧 进行中                                                       |
| 优先级       | 🟡 P1                                                           |
| 责任人       | -                                                               |
| 发现时间     | 2025-10-22                                                      |
| 预期解决时间 | 2025-10-26                                                      |

## 背景与预期

外部渲染节点（章节编号、溯源标记等）应该在业务层通过 `data-gel-external` 属性标记和清洗，而不是依赖 TinyMCE 的内部属性（如 `data-mce-bogus`、`data-mce-noneditable`）。

## 问题陈述

### 现象

报告标题使用 `data-mce-noneditable="true"` 属性，溯源标记使用 `contenteditable="false"`，依赖 TinyMCE 的内部机制。

### 根因

早期实现时为了快速实现不可编辑效果，直接使用了 TinyMCE 的内部属性，未遵循业务层统一清洗的设计原则。

### 影响

- 节点可能被 TinyMCE 意外过滤或修改
- 保存时需要额外清理 `data-mce-bogus` 属性
- 违反架构设计原则（业务层清洗）
- 增加维护成本和理解难度

## 关键参考

| 文档/代码路径                                          | 作用                | 备注                       |
| ------------------------------------------------------ | ------------------- | -------------------------- |
| `domain/reportEditor/document/render.ts:21`            | 报告标题渲染        | 使用 data-mce-noneditable  |
| `domain/reportEditor/chapterRef/render.ts:41`          | 溯源标记渲染        | 使用 contenteditable=false |
| `domain/reportEditor/editor/contentSanitizer.ts:52-56` | 清理 mce-bogus 属性 | 需要额外清理步骤           |
| `domain/reportEditor/foundation/constants.ts:38-73`    | MCE_BOGUS 常量定义  | 不应在业务代码中使用       |

## 解决方案

### 方案要点

1. 移除报告标题的 `data-mce-noneditable` 属性，改用 CSS 样式控制（预计 0.5 天）
2. 溯源标记已有 `data-gel-external` 属性，确认清洗逻辑正确（预计 0.5 天）
3. 移除 `contentSanitizer` 中清理 `data-mce-bogus` 的逻辑（预计 0.5 天）
4. 从 constants 中移除 `MCE_BOGUS` 相关常量（预计 0.5 天）

### 备选方案

保持现状但添加文档说明 - 放弃理由：技术债持续存在，违反设计原则

### 待办事项

- [ ] 修改报告标题渲染逻辑
- [ ] 验证溯源标记清洗逻辑
- [ ] 移除 mce-bogus 清理代码
- [ ] 移除 MCE_BOGUS 常量定义
- [ ] 更新相关文档说明

## 验证与风险

### 验证步骤

1. 验证报告标题不可编辑（通过 CSS pointer-events: none）
2. 验证保存时外部渲染节点被正确移除
3. 验证编辑器 setContent 时节点不被过滤

### 剩余风险

- CSS 样式控制可能不如 TinyMCE 属性稳定
- 需要确保所有外部渲染节点都有 data-gel-external 属性

## 更新日志

| 日期       | 事件 | 描述                                |
| ---------- | ---- | ----------------------------------- |
| 2025-10-22 | 创建 | 初始创建，识别 TinyMCE 属性滥用问题 |

## 附录

关键教训：

- 不要滥用 TinyMCE 的内部属性（如 data-mce-bogus、data-mce-noneditable）
- 外部渲染节点应该在业务层清洗，而不是依赖编辑器自动过滤
- 充分理解工具的行为再使用，避免隐式依赖
