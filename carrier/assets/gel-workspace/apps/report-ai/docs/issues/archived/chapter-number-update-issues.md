# 章节编号更新机制问题

## 问题概览

| 字段     | 内容                                                   |
| -------- | ------------------------------------------------------ |
| 问题     | 章节编号更新机制存在多个问题，导致编号更新不及时或失败 |
| 状态     | ✅ 已解决                                              |
| 优先级   | 🔴 P0                                                  |
| 责任人   | -                                                      |
| 发现时间 | 2025-02-14                                             |
| 解决时间 | 2025-02-14                                             |

## 背景与预期

章节编号根据章节在大纲树中的位置动态计算。当用户移动章节、添加/删除章节或保存后临时 ID 替换为正式 ID 时，编号应自动更新。

## 问题陈述

### 现象

新增章节无法更新编号、更新时机不明确、pathMap 与 content change 边界模糊、Draft Tree 与编辑器 DOM 同步机制不清晰、保存后 idMap 处理不完整。

### 根因

临时 ID 被跳过、DOM 元素查找失败、Hook 未集成、数据流向不清晰、idMap 处理逻辑缺失。

### 影响

- 所有新增章节在保存前都没有编号
- 编号更新依赖隐式副作用，难以预测和调试
- 保存后新增章节的编号仍不显示

## 关键参考

| 文档/代码路径                                            | 作用                | 备注         |
| -------------------------------------------------------- | ------------------- | ------------ |
| `domain/reportEditor/editor/chapterNumberCoordinator.ts` | 章节编号更新逻辑    | 新实现       |
| `store/hooks/useChapterNumberSync.ts`                    | 编号同步 Hook       | 已移除       |
| `store/reducers/draftTreeReducers.ts`                    | Draft 状态管理      | 需处理 idMap |
| `domain/reportEditor/split/batchProcessor.ts`            | HTML 解析与章节检测 | 生成临时 ID  |

## 解决方案

### 方案要点

1. 引入 `ChapterNumberCoordinator` 在 TinyMCE 内部监听 DOM 变更（已完成）
2. `useReportEditorRef` 在编辑器初始化时自动启动编号协调器（已完成）
3. 新增 `ensureSectionIds`/`applySectionIdMap` 统一维护 DOM ID（已完成）
4. 保存成功后调用 `ReportEditorRef.applyIdMap` 应用 idMap（已完成）

### 待办事项

- [x] 实现 ChapterNumberCoordinator
- [x] 实现 ensureSectionIds
- [x] 实现 applyIdMap
- [x] 修复死循环问题

## 验证与风险

### 验证步骤

1. 创建新章节，验证编号立即显示
2. 保存报告，验证临时 ID 替换为正式 ID
3. 移动章节，验证编号自动更新

### 剩余风险

- MutationObserver 性能影响需持续监控
- 死循环问题已修复但需要函数式重构

## 更新日志

| 日期       | 事件 | 描述                                       |
| ---------- | ---- | ------------------------------------------ |
| 2025-02-14 | 解决 | 实现 ChapterNumberCoordinator 解决所有问题 |
| 2025-02-14 | 发现 | 发现死循环问题并修复                       |

## 附录

后续建议：函数式重构，用单一 Hook + 纯函数替代两个 Class
详见：[sync-loop-analysis.md](./archived/sync-loop-analysis.md)
