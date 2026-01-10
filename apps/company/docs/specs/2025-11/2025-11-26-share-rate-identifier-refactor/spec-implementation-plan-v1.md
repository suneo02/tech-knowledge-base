---
title: ShareRateIdentifier 展示逻辑重构 - 实施计划
version: v1
status: 进行中
---

# ShareRateIdentifier 展示逻辑重构 - 实施计划

[返回任务概览](./README.md) | [查看设计方案](./spec-design-v1.md)

## 实施拆解

### 任务 1：修改受益所有人模块（1h）

**文件**：`base/finalBeneficiary.tsx`

**内容**：

- `beneficiaryOwner`：改用 `formatText(row.showShareRate)`
- `beneficiaryPerson`：同上
- `benefciaryOrg`：无需修改

### 任务 2：修改历史受益人模块（0.5h）

**文件**：`history/beneficiary.tsx`

**内容**：

- 改用 `formatText(row.showShareRate)`
- 移除 `ultimateBeneficialShares` 调用

### 任务 3：修改历史实控人模块（0.5h）

**文件**：`history/ultimateController.tsx`

**内容**：

- 保持调用 `showChain`，无需修改

### 任务 5：修改疑似/公告实控人模块（0.5h）

**文件**：

- `base/suspectedActualController.tsx`
- `base/publishActualController.tsx`

**内容**：

- 保持调用 `showChain`，无需修改

### 任务 6：修改股东穿透模块（0.5h）

**文件**：`base/shareSearch.tsx`

**内容**：

- fields 改为 `showShareRate`
- render 中调用 `formatText(txt)`
- 使用 `ShareRateWithRoute` 组件

### 任务 7：修改 showChain 函数（1h）

**文件**：`corpCompMisc.tsx`

**内容**：

- 内部改用 `formatText(showShareRate)`
- 保持函数签名不变

### 任务 8：修改 showRoute 函数（0.5h）

**文件**：`utils/utils.tsx`（约1117行）

**内容**：

- Header 部分改用 `formatText(header.showShareRate)`
- 保持函数签名不变

### 任务 9：类型定义更新（0.5h）

**文件**：`packages/types/src/corp/BaseInfo/*.ts`

**内容**：

- 确认所有类型包含 `showShareRate` 字段

### 任务 10：测试验证（1.5h）

**范围**：

- 8 个列表模块 + 1 个弹窗
- 中英文环境切换
- 股权路径查看功能

## 实施顺序

任务 1（组件）→ 任务 2-6（列表模块）→ 任务 7-8（showChain/showRoute）→ 任务 9（类型）→ 任务 10（测试）

## 预计工时

**总计：7h**

## 交付物

- [ ] 新建 `ShareRateWithRoute.tsx` 组件
- [ ] 修改后的 8 个文件
- [ ] 更新的类型定义
- [ ] 测试报告

## 更新记录

| 日期       | 修改人 | 更新内容                                      |
| ---------- | ------ | --------------------------------------------- |
| 2024-11-25 | Kiro   | 完成 formatShareRate 函数实现，统一添加百分号 |
| 2024-11-24 | Kiro   | 初始化实施计划                                |

## 实施进度

### ✅ 已完成

1. **创建 `formatShareRate` 统一函数**（2024-11-25）

   - 位置：`apps/company/src/utils/format/percentage.ts`
   - 功能：统一处理 `showShareRate` 字段，自动添加百分号 `%`
   - 测试：已添加单元测试

2. **更新所有使用位置**（2024-11-25）

   - ✅ `base/finalBeneficiary.tsx` - 受益所有人/自然人
   - ✅ `base/suspectedActualController.tsx` - 疑似实控人
   - ✅ `base/publishActualController.tsx` - 公告披露实控人
   - ✅ `history/ultimateController.tsx` - 历史实控人
   - ✅ `history/beneficiary.tsx` - 历史受益人
   - ✅ `base/shareSearch.tsx` - 股东穿透
   - ✅ `utils/utils.tsx` - `renderShareRouteModal` 函数

3. **导出配置**
   - ✅ 添加到 `wftCommon.formatShareRate`
   - ✅ 从 `utils/format/index.ts` 导出
