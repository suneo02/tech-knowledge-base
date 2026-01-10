---
title: 企业详情菜单配置重构
resolved_at: 2025-11-24
owner: AI
source: 代码重构
status: ✅ 已完成
domain: 企业详情
version: v1
---

# 企业详情菜单配置重构

## 任务概览

| 项目         | 内容                                              |
| ------------ | ------------------------------------------------- |
| **任务来源** | 代码重构 - 菜单配置逻辑下沉与类型差异集中化       |
| **负责人**   | AI                                                |
| **目标**     | 将企业类型/地区差异集中到配置生成层，简化渲染逻辑 |
| **当前版本** | v1                                                |
| **完成时间** | 2025-11-24                                        |

## 关联文档

- [实施记录 v1](./spec-implementation-v1.md) - 菜单配置重构与数据管理重构（已完成）

## 涉及文件

```
apps/company/src/views/Company/menu/
├── menus.ts                    # 菜单配置生成（createCorpDetailMenus）
├── useCorpMenuByType.ts        # Hook：根据企业信息获取菜单
├── handleCorpDetailMenu.tsx    # 菜单树渲染逻辑
├── type.ts                     # 类型定义
└── index.ts                    # 统一导出
```

## 核心改动

### 1. 配置生成函数化

将静态菜单配置改为 `createCorpDetailMenus(corpBasicInfo, basicNum)`，根据企业类型、地区、统计数据动态生成配置。

### 2. 类型差异下沉

所有企业类型/地区相关的菜单差异（如海外企业改名、个体工商户特殊模块）在配置生成时处理，渲染层只负责展示。

### 3. 废弃参数清理

`handleCorpDetailMenu` 的 `corpArea` 参数已废弃但保留（向后兼容），实际逻辑已移除。

## 当前状态

- [x] 配置生成函数化（createCorpDetailMenus）
- [x] Hook 简化（useCorpMenuByType）
- [x] 渲染逻辑清理（handleCorpDetailMenu）
- [x] 类型定义完善
- [x] 废弃参数移除（已完成）
- [x] 菜单数据管理重构（已完成，三层架构实现）

## 待优化问题

- 无

## 更新记录

| 日期       | 修改人 | 更新内容                           |
| ---------- | ------ | ---------------------------------- |
| 2025-11-21 | AI     | 创建任务文档                       |
| 2025-11-24 | AI     | 合并重复 spec，更新为已完成状态    |
| 2025-11-24 | AI     | 分析菜单数据冗余问题，添加重构建议 |
| 2025-11-26 | AI     | 确认菜单数据重构已完成，合并文档   |
