---
title: 招投标筛选级联值格式错误 - 实现说明
version: v1
status: ✅ 已发布
---

[← 返回任务概览](/apps/company/docs/specs/bid-search-cascade-value-bug-value-bug/README.md)

# 招投标筛选级联值格式错误 - 实现说明 v1

## 1. 背景与问题

- 招投标列表页使用 `WindCascade` 作为地区/行业筛选器，控制台报 `propValueList.map is not a function`，组件渲染失败。
- 触发场景：选择级联后再切换排序或删除筛选，`WindCascade` 接收到字符串而非二维数组。

## 2. 根因分析

- `handleChange` 在更新排序时通过 `setState({ ...filter })` 将 `filter` 展开到顶层 state，覆盖了 `regioninfo` / `industryname` 数组，将其变成拼接字符串。
- 清除单个筛选时多次 `setState` 拆分调用，存在中间态缺失，导致请求与 UI 可能获得混合的旧值/空值。
- WindCascade 依赖二维数组值，字符串输入触发内部 `map` 报错。

## 3. 方案与实现

| 目标                     | 方案要点                                                                                                   | 代码引用                                                          |
| ------------------------ | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 保持级联值类型为二维数组 | `handleChange` 使用独立的 `filter` 字段，避免把 `filter` 展开到顶层 state；复制 allFilter 后再更新         | `/apps/company/src/views/BidSearch/bidSearchList.tsx`             |
| 删除筛选时同步重置值     | `deleteFilter` 构造统一的 `nextState`，同时清空 `regioninfo/industryname` 数组并更新 `filter` 与 `allFilter` | `/apps/company/src/views/BidSearch/bidSearchList.tsx`             |
| 防止竞态/重复调用        | 把搜索调用放入 `setState` 回调，确保使用最新筛选参数                                                       | `/apps/company/src/views/BidSearch/bidSearchList.tsx`             |

## 4. 验收要点

- 选择省份/行业后切换排序，`WindCascade` 不再报错，值保持多选标签显示。
- 删除单个筛选项，地区/行业选择恢复为空，多选组件可再次打开并选择。
- 切换排序、清空筛选后重新搜索，结果列表正常返回，无异常日志。

## 5. 更新记录

| 日期       | 修改人 | 更新内容                     |
| ---------- | ------ | ---------------------------- |
| 2025-11-25 | -      | 记录实现与验收要点 v1        |
