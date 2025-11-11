# 引用资料模块文档

## 📚 文档导航

| 文档                                     | 说明                                    | 适用对象                 |
| ---------------------------------------- | --------------------------------------- | ------------------------ |
| [01-requirement.md](./01-requirement.md) | 需求文档 - 功能说明、页面布局、操作流程 | 产品经理、设计师、开发者 |
| [02-design.md](./02-design.md)           | 设计文档 - 布局与交互设计、组件分解     | 前端开发者、设计师       |
| [presearch.md](./presearch.md)           | 文件预览技术选型 - 技术方案对比         | 技术负责人、前端开发者   |

> 代码实现细节以源代码与注释为准，无需单独实现文档。

## 概述

引用资料模块负责在报告详情页右侧面板统一展示与管理引用资料。

### 资料类型

- 数据表格（DPU）
- 建议资料（RAG）
- 文件（File）

## 进一步阅读

- 功能与用户流程 → 查看 [01-requirement.md](./01-requirement.md)
- 布局、组件与数据流 → 查看 [02-design.md](./02-design.md)
- 预览技术方案对比 → 查看 [presearch.md](./presearch.md)

## 主题索引

- 置顶文件（Top Files）：概述与需求见 01；设计与计算见 02。

## 更新日志

### 2025-10-14 - 排序逻辑重构与类型简化

#### 引用资料排序逻辑优化

- **重构排序算法**：改为逐章节处理，直接从章节数据中提取和排序
- **简化函数签名**：`buildSortedReferencesFromChapters` 只接收 `chapters` 参数
- **排序规则**：
  1. 按章节顺序处理（第一个章节的所有引用在最前面）
  2. 章节内按类型排序：表格（DPU）> 建议资料（RAG）> 文件（File）
  3. 同类型内保持原有顺序（文件按上传时间降序）
  4. 全局去重，同一资料只显示一次
- **简化配置**：移除排序配置项，使用固定排序规则
- **性能优化**：逐章节处理，边处理边去重，避免重复遍历
- **命名优化**：`processAndSortReferences` → `buildSortedReferencesFromChapters`

#### 类型简化

- **简化 `RPReferenceItem`**：移除未使用的衍生字段
  - ❌ `referenceCount`: UI 中未显示
  - ❌ `priority`: 仅用于排序，不需要存储
  - ❌ `chapter`: 章节信息已在 `data.chapterId` 中
- **移除冗余函数**：`calculateReferenceCount` 不再需要
- **减少内存占用**：每个引用项减少 3 个字段的存储

### 2025-10-14 - 重大重构

#### 统一数据源到 Redux

- 创建 `selectSortedReferences` 作为唯一数据源
- 所有组件使用 Redux selector 而非 Hook
- 避免重复计算，提升性能

#### 移除不必要的 API 调用

- 移除 `useReportRelatedFiles` Hook 调用
- 所有文件从章节数据中提取
- 减少网络请求，简化状态管理

#### 新增全局引用序号

- 创建 `selectReferenceIndexMap` 选择器
- 章节内容中的引用标记显示全局序号
- 与右侧引用资料面板序号保持一致

#### 废弃旧 Hook

- `useReferenceData` 标记为 deprecated
- `useSimpleReferenceData` 标记为 deprecated
- 推荐使用 Redux selector 替代

#### 文档重构

- 按照 `docs/rule` 规范组织文档，减少跨文档重复
- 保留需求与设计文档的职责边界，避免实现细节重复
- 代码实现细节通过源代码与注释体现
- 提供清晰的文档导航
