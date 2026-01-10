# 报告详情自动生成全文

## 概览

从大纲会话/模板跳转到报告详情时，携带 URL 参数标识，报告详情页检测到标识且报告无内容时自动触发生成全文。

## 实现

1. **URL 参数常量**（`constants/urlParams.ts`）

   - `RP_URL_PARAMS.AUTO_GENERATE`: 自动生成标识
   - `RP_URL_PARAMS.SOURCE`: 来源标识
   - `RP_SOURCE_VALUES.OUTLINE`: 大纲会话来源
   - `RP_SOURCE_VALUES.TEMPLATE`: 模板来源

2. **URL 构建工具**（`utils/reportNavigation.ts`）

   - `buildReportDetailUrl()`: 通用 URL 构建函数，使用 URLSearchParams
   - `buildReportDetailUrlFromOutline()`: 大纲会话专用
   - `buildReportDetailUrlFromTemplate()`: 模板专用

3. **自动生成 Hook**（`pages/ReportDetail/hooks/useAutoGenerate.ts`）

   - 独立的自动生成逻辑
   - 检查报告内容状态
   - 自动调用生成并清除参数

4. **大纲会话跳转**（`useOperationActions.ts`）

   - 使用 `buildReportDetailUrlFromOutline()`

5. **模板使用跳转**（`useTemplateUse.ts`）

   - 使用 `buildReportDetailUrlFromTemplate()`
   - 使用 react-router navigate

6. **报告详情集成**（`ReportDetail/hook.tsx`）
   - 调用 `useAutoGenerate()` Hook

## 验收

- ✅ 从大纲会话进入报告详情，自动触发生成全文
- ✅ 从模板选择进入报告详情，自动触发生成全文
- ✅ 报告已有内容时，不触发自动生成
- ✅ 生成后刷新页面，不重复触发
- ✅ URL 参数使用 URLSearchParams 标准方法
- ✅ 逻辑拆分到独立工具函数和 Hook

## 更新记录

| 日期       | 修改人 | 更新内容                                     |
| ---------- | ------ | -------------------------------------------- |
| 2025-01-13 | Kiro   | 创建并实现，统一常量管理，拆分逻辑到工具函数 |
