---
title: 企业库会员权限弹窗优化
version: v1
status: planning
owner: 待定
source: 产品需求
domain: 企业库/会员
resolved_at:
---

# 企业库会员权限弹窗优化 Spec

[← 返回 Specs 目录](/apps/company/docs/specs/README.md)

> 遵循 [Spec 文档编写规范](/docs/rule/doc-spec-rule.md)

## 任务概览

| 项目     | 内容                                     |
| -------- | ---------------------------------------- |
| 任务来源 | 产品需求 - 会员权限弹窗体验优化          |
| 负责人   | 待定                                     |
| 上线目标 | 优化权限弹窗交互，调整产品展示与遮罩策略 |
| 当前版本 | v1                                       |
| 关联组件 | `VipModuleNew.tsx`, `VipForbidden.tsx`   |
| 状态     | 📝 规划中                                |

## 核心文档

- [spec-requirement-v1.md](/apps/company/docs/specs/vip-permission-popup-optimization/spec-requirement-v1.md) - 需求提炼（用户场景与功能点）
- [spec-design-v1.md](/apps/company/docs/specs/vip-permission-popup-optimization/spec-design-v1.md) - 方案设计（流程图与组件设计）
- [spec-verification-v1.md](/apps/company/docs/specs/vip-permission-popup-optimization/spec-verification-v1.md) - 测试策略与验收标准
- [implementation-plan.json](/apps/company/docs/specs/vip-permission-popup-optimization/implementation-plan.json) - 任务追踪源

## 关联资料

- [会员权限与用户交互设计](/apps/company/docs/auth/membership-permissions-interaction.md) - 现有权限交互逻辑参考
- [VipModuleNew 组件](/apps/company/src/components/company/VipModuleNew.tsx)

## 核心变更

1. **产品名称**：企业套餐 → 营销版（百分企业）
2. **遮罩策略**：表格类型保留列头可见
3. **权限展示**：根据模块类型动态展示产品
4. **接口更换**：联系客户经理接口切换至百分模块

## 更新记录

| 日期       | 修改人 | 更新内容                     |
| ---------- | ------ | ---------------------------- |
| 2025-12-02 | AI助手 | 按 Spec 规范重构文档结构     |
| 2025-11-26 | Kiro   | 按规范优化文档结构，精简内容 |
| 2025-06-20 | AI助手 | 创建初始文档结构             |
