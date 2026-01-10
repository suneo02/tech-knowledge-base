<!--
  文档概述：财务报表模块规范与使用说明
  @author yxlu.calvin
  @example 参见文档中的“使用指南”章节
-->
# 财务报表模块组件规范文档

## 目录与流程图

- 目录结构与文件职责：`./menu.md`
- 模块流程图（Mermaid）：`./flow.md`

## 1. 组件元信息

- 模块路径：`apps/company/src/components/company/buss/financial`
- 入口：`index.ts`
- 关联组件：`FinancialStatement`、`FinancialTable`、`FilterBar`、`LoadingState`、`ErrorState`
- 关联 Hook/上下文：`createUseFinancialStatement`、`useFinancialFilters`、`useFinancialUI`
- 主要依赖：`ahooks`（数据请求）、`@wind/wind-ui`、`@wind/wind-ui-table`、`antd`（表单）、`Intl`
- 设计资源：暂无（未在仓库中提供）

## 2. 设计规范

- 结构分层：domain（领域对象）、application（编排与状态）、infrastructure（数据访问）、presentation（UI）、config（变体/指标）、utils（格式化与管线）、types（共享类型）
- 分组标题：通过 `groupHeaders` 注入组头行（`copied/config/validatedMetrics.ts:106-116`），展示层特定样式由 `index.module.less` 控制
- 单位与格式：单位缩放值对象 `UNIT_SCALES`（`copied/domain/value-objects/unitScale.ts`），格式化在 `Formatters`（`copied/utils/formatters.ts:3-25`）
- 指标集合：预验证指标集合位于 `validatedMetrics.ts`（`copied/config/validatedMetrics.ts:3-96`）

## 3. API 合约

### 3.1 组件

表：`FinancialStatement`（容器）

| Prop          | 类型                                                 | 必填 | 说明                                                                                |
| ------------- | ---------------------------------------------------- | ---- | ----------------------------------------------------------------------------------- |
| `companyCode` | `string`                                             | 是   | 公司编码（数据查询的主键）                                                          |
| `variant`     | `FinancialVariant`                                   | 是   | 变体（`domestic_listed`/`domestic_nonlisted`/`overseas`）`copied/types/index.ts:38` |
| `service`     | `ReturnType<typeof createFinancialStatementService>` | 是   | 注入的服务实例 `copied/application/services/financialStatementService.ts:8-15`      |

行为：

- 加载态与错误态：分别渲染 `LoadingState`、`ErrorState` `copied/presentation/components/FinancialStatement/index.tsx:36-45`
- 构建行：依据 `validatedMetrics` 计算 `profit/balance/cash` 行 `copied/presentation/components/FinancialStatement/index.tsx:50-81`
- 过滤交互：承接 `FilterBar.onValuesChange` 更新上下文 `copied/presentation/components/FinancialStatement/index.tsx:121-137`

表：`FinancialTable`

| Prop           | 类型                               | 必填           | 默认值            | 说明                                                                          |
| -------------- | ---------------------------------- | -------------- | ----------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `model`        | `TableModel`                       | 是             | —                 | 列与行的视图模型 `copied/types/index.ts:21-30`                                |
| `onRowClick`   | `(row: FinancialTableRow) => void` | 否             | —                 | 行点击回调 `copied/presentation/components/FinancialTable.tsx:7-16`           |
| `title`        | `string`                           | 否             | —                 | 表标题（透传）                                                                |
| `eachTableKey` | `string`                           | 否             | `'FinancialData'` | data 属性标识 `copied/presentation/components/FinancialTable.tsx:19-23,87-90` |
| `hoveredGroup` | `string                            | null`          | 否                | —                                                                             | 当前高亮组名 `copied/presentation/components/FinancialTable.tsx:12-16,95-106` |
| `onGroupHover` | `(group: string                    | null) => void` | 否                | —                                                                             | 组头悬停联动 `copied/presentation/components/FinancialTable.tsx:107-113`      |
| `dataLoaded`   | `boolean`                          | 否             | `true`            | 加载态控制 `copied/presentation/components/FinancialTable.tsx:22-23,91-94`    |
| `className`    | `string`                           | 否             | —                 | 容器样式类名                                                                  |

表：`FilterBar`

| Prop              | 类型                                           | 必填 | 说明                                                                    |
| ----------------- | ---------------------------------------------- | ---- | ----------------------------------------------------------------------- |
| `filters`         | `FinancialFilters`                             | 是   | 当前筛选状态 `copied/presentation/components/FilterBar/index.tsx:10-13` |
| `onFiltersChange` | `(updates: Partial<FinancialFilters>) => void` | 是   | 表单变更回调 `copied/presentation/components/FilterBar/index.tsx:48-49` |

表：`LoadingState` / `ErrorState`

| 组件           | Prop      | 类型         | 必填 | 说明                                                           |
| -------------- | --------- | ------------ | ---- | -------------------------------------------------------------- |
| `LoadingState` | —         | —            | —    | 标准加载占位 `copied/presentation/components/LoadingState.tsx` |
| `ErrorState`   | `error`   | `unknown`    | 是   | 错误对象 `copied/presentation/components/ErrorState.tsx:7-15`  |
|                | `onRetry` | `() => void` | 否   | 重试回调                                                       |

### 3.2 Hook 与上下文

Hook：`createUseFinancialStatement`

| 签名                                                                                            | 返回                                                                                   |
| ----------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `createUseFinancialStatement(service)` `copied/application/hooks/useFinancialStatement.ts:9-26` | `useFinancialStatement(companyCode, variant)` 返回 `{ data, error, loading, refresh }` |

上下文：`FinancialFiltersProvider` / `useFinancialFilters`

| 项       | 说明                                                                                                                                                                                                                         |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 初始值   | `{ scenarioIdx:0, unitScale:'TEN_THOUSAND', hideEmptyRows:false, yearRange:[undefined,undefined], region:'domestic', reportPeriod:'ANNUAL', reportForm:'STANDARD' }` `copied/application/contexts/financialFilters.tsx:4-12` |
| Provider | `FinancialFiltersProvider` 包裹需要使用筛选的区域 `copied/application/contexts/financialFilters.tsx:33-46`                                                                                                                   |
| Hook     | `useFinancialFilters()` 返回 `{ filters, updateFilters, resetFilters }` `copied/application/contexts/financialFilters.tsx:48-67`                                                                                             |

### 3.3 类型与服务

类型：`copied/types/index.ts`

| 名称                | 片段                                     |
| ------------------- | ---------------------------------------- |
| `FinancialData`     | 公司数据载体 `copied/types/index.ts:4-9` |
| `FinancialMetric`   | 指标结构 `copied/types/index.ts:11-14`   |
| `FinancialScenario` | 场景信息 `copied/types/index.ts:16-19`   |
| `FinancialTableRow` | 表格行 `copied/types/index.ts:32-36`     |
| `TableModel`        | 视图模型 `copied/types/index.ts:21-30`   |
| `FinancialVariant`  | 变体联合类型 `copied/types/index.ts:38`  |
| `FinancialFilters`  | 筛选状态 `copied/types/index.ts:40-48`   |

服务：`createFinancialStatementService`

| 方法                                     | 说明                                                                                |
| ---------------------------------------- | ----------------------------------------------------------------------------------- |
| `getStatement(companyCode, variant)`     | 获取并缓存领域对象 `copied/application/services/financialStatementService.ts:12-36` |
| `preloadStatement(companyCode, variant)` | 预加载并写缓存 `copied/application/services/financialStatementService.ts:38-50`     |

领域对象：`createFinancialStatement`

| 能力                                      | 说明                                                              |
| ----------------------------------------- | ----------------------------------------------------------------- |
| `getMetricValue(key, period)`             | 取指标值 `copied/domain/entities/financialStatement.ts:6-9`       |
| `getPeriodsInRange(startYear?, endYear?)` | 期间过滤 `copied/domain/entities/financialStatement.ts:11-19`     |
| `calculateGrowthRate(key, from, to)`      | 增长率计算 `copied/domain/entities/financialStatement.ts:21-27`   |
| `toTableModel(filters)`                   | 生成表格模型 `copied/domain/entities/financialStatement.ts:29-53` |

客户端：`createFinancialDataClient`

| 方法                                       | 说明                                                                            |
| ------------------------------------------ | ------------------------------------------------------------------------------- |
| `fetchFinancialData(companyCode, variant)` | 请求数据；失败回退 Mock `copied/infrastructure/api/financialDataClient.ts:3-24` |

配置：`validatedMetrics.ts` / `variants.ts`

| 项                   | 说明                                                         |
| -------------------- | ------------------------------------------------------------ |
| `validatedMetrics.*` | 具体指标集合与组头 `copied/config/validatedMetrics.ts:3-116` |
| `financialVariants`  | 变体注册与默认特性 `copied/config/variants.ts:1-64`          |

工具：`Formatters` / `PipelineProcessors`

| 名称                                                         | 说明                                            |
| ------------------------------------------------------------ | ----------------------------------------------- |
| `Formatters.formatCurrency/formatPercentage/formatRatio`     | 值格式化 `copied/utils/formatters.ts:3-25`      |
| `PipelineProcessors.filterEmptyRows/scaleValues/filterYears` | 表格模型处理器 `copied/utils/pipeline.ts:10-50` |

## 4. 实现细节

- 数据链路：`FinancialStatement` → `createUseFinancialStatement(service)` → `financialStatementService.getStatement` → `financialDataClient.fetchFinancialData`（失败回退 Mock）→ `createFinancialStatement` → `toTableModel(filters)` → `FinancialTable` 渲染
- 组头行：依据 `groupHeaders` 在行列混排生成标题行并支持悬停高亮 `copied/presentation/components/FinancialTable.tsx:95-106`
- 筛选：`FilterBar` 通过 `Form.onValuesChange` 聚合更新 `FinancialFilters`（单位、隐藏空行、年份区间等）`copied/presentation/components/FilterBar/index.tsx:48-65`
- 缓存：内存缓存 TTL 5 分钟 `copied/infrastructure/cache/memoryCache.ts:1-23`

## 5. 质量保证

- Lint：已在本模块修复类型与 `any` 的问题；建议在 CI 执行 ESLint 与 TypeScript 检查
- 测试建议：
  - 适配器契约测试：覆盖缺字段/空数组/类型不符
  - 服务集成测试：缓存命中、失败回退（降级提示）
  - 领域单元测试：`toTableModel` 的隐藏空行、单位缩放、年份过滤
  - UI 测试：`FilterBar` 交互与 `FinancialTable` 组头悬停行为

## 6. 使用指南

```tsx
import React from 'react'
import { FinancialStatement, FinancialFiltersProvider, financialService } from '@/components/company/buss/financial'

export default function CorpFinancial() {
  return (
    <FinancialFiltersProvider>
      <FinancialStatement companyCode="600000" variant="domestic_listed" service={financialService} />
    </FinancialFiltersProvider>
  )
}
```

## 7. 可扩展性

- 新增变体：在 `variants.ts` 注册并（建议）统一指标来源；展示层通过统一入口选择集合渲染
- 指标计算：在 `financialCalculator.ts` 扩展计算方法，由应用层在生成表格前后调用
- 样式解耦：将 `groupHeaders` 的样式元数据迁移到样式文件，配置只保留语义
- 管线扩展：在 `PipelineProcessors` 增加处理器，并通过 `createPipeline` 组合

## 8. 边界处理

- 接口失败：当前客户端失败回退 Mock 数据（不可见错误态）；如需可观察性，返回降级标识并在 UI 提示 `copied/infrastructure/api/financialDataClient.ts:16-18`
- 空行：`hideEmptyRows` 控制是否过滤无值行 `copied/domain/entities/financialStatement.ts:32-38`
- 年份区间：`getPeriodsInRange` 使用 `parseInt` 解析；建议在 adapter 统一 period 形态 `copied/domain/entities/financialStatement.ts:11-19`

## 9. 维护

- 代码所有者：未在仓库中声明（占位）
- 版本策略：未在代码中声明（占位）；建议语义化版本与变更日志
- 依赖管理：建议在 CI 增加 `npm audit` 与定期升级

## 补充：模块修订与指引

### 数据链路（更新）

- `FinancialStatement` → `createUseFinancialStatement(service)` → `service.getStatement` → `financialFiltersClient.fetchFilters` → 参数合并 → `financialDataClient.fetchFinancialData` → `createFinancialStatement` → `toTableModel` → `FinancialTable` 渲染
- 参考实现：`application/services/financialStatementService.ts:19-47`

### 服务与客户端

- 过滤项客户端：`infrastructure/api/financialFiltersClient.ts:5-12,17-24`
- 数据客户端：`infrastructure/api/financialDataClient.ts:28-33,37,46-52,53-57`
- 缓存：`infrastructure/cache/memoryCache.ts:1-4,17-23`

### 使用指南（符合 React 18 规范）

```tsx
import { FC } from 'react'
import { FinancialStatement, FinancialFiltersProvider, financialService } from '@/components/company/buss/financial'
import type { CorpBasicNumFront } from '@/types/corpDetail/basicNum'

interface Props {
  companyCode: string
  variant: 'domestic' | 'overseas'
  basicNum: CorpBasicNumFront
}

export const CorpFinancial: FC<Props> = ({ companyCode, variant, basicNum }) => {
  return (
    <FinancialFiltersProvider>
      <FinancialStatement companyCode={companyCode} variant={variant} service={financialService} basicNum={basicNum} />
    </FinancialFiltersProvider>
  )
}
```

### API 接入策略

- 在 `infrastructure/api` 新增或扩展客户端（如 `financialFiltersClient.ts`、`financialDataClient.ts`），使用 `createRequest` 封装具体接口调用，输入输出类型使用 `types` 中的共享类型。
- 如需对后端数据进行形态转换，新增 `infrastructure/api/adapters/*` 并在客户端中应用。
- 在 `application/services` 中编排新接口，将 UI 层的筛选参数与后端默认过滤项进行合并后再发起数据请求（参考 `application/services/financialStatementService.ts:28-35`）。
- UI 层仅通过 `createUseFinancialStatement` 等 Hook 调用服务方法，使用 `useRequest` 管理请求状态，不直接在组件中使用 `createRequest`。
- 缓存策略统一通过 `memoryCache` 控制，避免在组件层进行 ad-hoc 缓存。

### Q&A：为何不在组件里直接 `useRequest(createRequest(...))`

- 分层与复用：UI Hook（`useRequest`）负责状态，数据访问应在 `infrastructure` 封装，并由 `application/services` 统一编排，避免将接口细节泄漏到展示层，提升复用性与可测试性。
- 类型与适配：后端各变体的字段差异需要统一适配与校验（参考 `application/services/financialStatementService.ts:35-41` 与 `domain/services/dataValidator.ts`），在组件中直接请求难以维持类型与转换一致性。
- 参数合并：需要先获取默认过滤项再与 UI 参数合并（`financialFiltersClient.fetchFilters` → `merged params` → `financialDataClient.fetchFinancialData`），直接在组件请求会重复逻辑并增加耦合。
- 缓存与预加载：服务层集中控制缓存与预加载（`application/services/financialStatementService.ts:49-56`），更利于性能与一致性。
- 表单数组传递：`reportDate` 通过表单传递数组时需序列化为字符串（`[start,end]` → `JSON.stringify([...])`），统一在客户端处理（`infrastructure/api/financialDataClient.ts:46-52`）。

## 10. 参考

- 入口与导出：`copied/index.ts`
- 容器组件：`copied/presentation/components/FinancialStatement/index.tsx:26-42,50-81,121-137`
- 表格组件：`copied/presentation/components/FinancialTable.tsx:7-31,33-69,87-119`
- 筛选组件：`copied/presentation/components/FilterBar/index.tsx:10-13,42-49`
- 上下文：`copied/application/contexts/financialFilters.tsx:4-12,33-46,48-67`
- Hook：`copied/application/hooks/useFinancialStatement.ts:9-26`
- 服务：`copied/application/services/financialStatementService.ts:12-36,38-50,51-69`
- 领域：`copied/domain/entities/financialStatement.ts:6-9,11-19,21-27,29-53`
- 客户端：`copied/infrastructure/api/financialDataClient.ts:3-24`
- 适配器：`copied/infrastructure/api/adapters/*.ts`
- 配置：`copied/config/validatedMetrics.ts:3-116`, `copied/config/variants.ts:1-64`
- 工具：`copied/utils/formatters.ts:3-25`, `copied/utils/pipeline.ts:4-50`
