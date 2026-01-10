# 企业详情页配置重复维护问题

## 任务概览

| 项目 | 内容 |
| --- | --- |
| **标题** | 左侧菜单与中间内容配置存在重复维护，导致数据不一致风险 |
| **状态** | 🚧 进行中 |
| **优先级** | 🟡 中 |
| **责任人** | 待分配 |
| **发现时间** | 2024-11-07 |

## 文档索引

| 文档 | 说明 | 状态 |
| --- | --- | --- |
| [问题分析](./spec-issue.md) | 问题现象、根因与影响分析 | ✅ 已完成 |
| [方案设计](./spec-design.md) | 统一配置源架构与流程设计 | ✅ 已完成 |
| [数据结构](./spec-design-data.md) | 统一配置与树结构定义 | ✅ 已完成 |
| [实施计划](./spec-plan.md) | 任务拆解与验收标准 | ✅ 已完成 |
| [任务追踪](./implementation-plan.json) | 详细任务状态与代码关联 | 🚧 进行中 |
| [验收记录](./spec-verification.md) | 功能验收用例与结果 | 📝 待补充 |
| [实现说明](./spec-release-note-v1.md) | 最终实现差异与上线记录 | 📝 待补充 |

## 关联文档

| 文档 | 作用 |
| --- | --- |
| [配置体系设计](../../CorpDetail/layout-config.md) | 描述当前配置体系 |
| [左侧区域设计](../../CorpDetail/layout-left.md) | 左侧菜单实现 |
| [中间区域设计](../../CorpDetail/layout-middle.md) | 中间内容实现 |

## 关键代码位置

| 文件路径 | 说明 |
| --- | --- |
| `src/views/Company/menu/useCorpMenuByType.ts` | 菜单配置 Hook |
| `src/components/company/listRowConfig.tsx` | 内容模块配置 |
| `src/config/unified-module-config.ts` | (新) 统一配置源 |
| `src/utils/module-config-converter.ts` | (新) 配置转换工具 |

## 更新记录

| 日期 | 修改人 | 更新内容 |
| --- | --- | --- |
| 2024-11-07 | - | 创建任务 |
| 2024-11-26 | - | 优化实施计划 v2 |
| 2024-11-28 | - | 根据 Spec 规范重构文档结构 |
