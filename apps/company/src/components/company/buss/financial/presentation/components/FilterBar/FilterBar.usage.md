<!--
  文档概述：FilterBar 使用说明与示例
  @author yxlu.calvin
  @example 参见下方“快速开始”示例
-->
# FilterBar 使用文档

## 🚀 快速开始
```tsx
import React, { useState } from 'react'
import { FilterBar } from '@/components/company/buss/financial/copied/presentation/components/FilterBar'
import type { FinancialFilters } from '@/components/company/buss/financial/copied/types'

export default function Demo() {
  const [filters, setFilters] = useState<FinancialFilters>({
    scenarioIdx: 0,
    unitScale: 'TEN_THOUSAND',
    hideEmptyRows: false,
    yearRange: [undefined, undefined],
    region: 'domestic',
    reportPeriod: 'ANNUAL',
    reportForm: 'STANDARD',
  })

  return (
    <FilterBar
      filters={filters}
      onFiltersChange={(updates) => {
        // 组件内部对表单值变更做了 200ms 防抖，这里仅需合并到外部状态
        setFilters((prev) => ({ ...prev, ...updates }))
      }}
    />
  )
}
```

## ✨ 功能特性
- 年份范围选择：通过 `DatePicker.YearRangePicker` 设置 `filters.yearRange`
- 单位选择：支持 `元/千元/万元/百万元/亿元/十亿元`，值为 `unitScale` 的枚举键
- 隐藏空行：勾选 `hideEmptyRows`，配合父组件控制数据渲染
- 内联表单：使用 `antd` 的 `Form` 布局为 `inline`
- 变更防抖：表单值变化后 200ms 防抖触发 `onFiltersChange`
- 报表类型/报表形式：相关选择框在源码中已注释，当前不渲染（代码中未定义为对外接口）

## 🔧 API参考

Props
| 属性名 | 类型 | 默认值 | 必填 | 说明 | 示例 |
|---|---|---|---|---|---|
| `filters` | `FinancialFilters` | 无 | 是 | 当前筛选状态对象；本组件使用到 `unitScale`、`hideEmptyRows`、`yearRange`、`reportPeriod`、`reportForm` | `{ unitScale: 'TEN_THOUSAND', hideEmptyRows: false, yearRange: [undefined, undefined], reportPeriod: 'ANNUAL', reportForm: 'STANDARD', scenarioIdx: 0, region: 'domestic' }` |
| `onFiltersChange` | `(updates: Partial<FinancialFilters>) => void` | 无 | 是 | 表单值变更时触发；内部 200ms 防抖；仅回传变更的字段 | `(updates) => setFilters(prev => ({ ...prev, ...updates }))` |

Callback Props
| 事件名 | 参数 | 触发时机 | 说明 |
|---|---|---|---|
| `onFiltersChange` | `updates: Partial<FinancialFilters>` | 表单值变化后（`Form.onValuesChange`，防抖 200ms） | 将已变更字段以增量形式回传，例如 `{ unitScale: 'BILLION' }` |

Children
| 说明 |
|---|
| （代码中未定义）组件不渲染 `children` |

Ref 方法
| 方法名 | 参数 | 返回值 | 使用场景 |
|---|---|---|---|
| （代码中未定义） | （代码中未定义） | （代码中未定义） | （代码中未定义） |

## 💡 使用示例

- 基础用法：选择单位与隐藏空行
```tsx
import React, { useState } from 'react'
import { FilterBar } from '@/components/company/buss/financial/copied/presentation/components/FilterBar'
import type { FinancialFilters } from '@/components/company/buss/financial/copied/types'

export function BasicUsage() {
  const [filters, setFilters] = useState<FinancialFilters>({
    scenarioIdx: 0,
    unitScale: 'YUAN',
    hideEmptyRows: false,
    yearRange: [undefined, undefined],
    region: 'domestic',
    reportPeriod: 'ANNUAL',
    reportForm: 'STANDARD',
  })

  return (
    <FilterBar
      filters={filters}
      onFiltersChange={(u) => setFilters((p) => ({ ...p, ...u }))}
    />
  )
}
```

- 进阶用法：与财务报表组合
```tsx
import React from 'react'
import { FinancialStatement } from '@/components/company/buss/financial/copied/presentation/components/FinancialStatement'
import { createFinancialStatementService } from '@/components/company/buss/financial/copied/application/services/financialStatementService'

export default function FinancePage() {
  const service = createFinancialStatementService()

  return (
    <FinancialStatement
      companyCode="000001"
      variant="listedNonBondIssuer"
      service={service}
    />
  )
}
```

- 业务场景：限定年份区间并切换单位
```tsx
import React, { useState } from 'react'
import { FilterBar } from '@/components/company/buss/financial/copied/presentation/components/FilterBar'
import type { FinancialFilters } from '@/components/company/buss/financial/copied/types'

export function YearAndUnitScenario() {
  const [filters, setFilters] = useState<FinancialFilters>({
    scenarioIdx: 0,
    unitScale: 'BILLION',
    hideEmptyRows: true,
    yearRange: [undefined, 2024],
    region: 'domestic',
    reportPeriod: 'ANNUAL',
    reportForm: 'STANDARD',
  })

  return (
    <FilterBar
      filters={filters}
      onFiltersChange={(u) => setFilters((p) => ({ ...p, ...u }))}
    />
  )
}
```

## 交互与数据流
- Props 输入：`filters` 提供初始值；`onFiltersChange` 接收增量更新
- 表单初始化：`Form.initialValues` 从 `filters` 映射至 `unitScale/hideEmptyRows/yearRange/reportPeriod/reportForm`
- 变更机制：`Form.onValuesChange` → `useDebounceFn(200ms)` → 触发 `onFiltersChange(updates)`
- 年份范围：`DatePicker.YearRangePicker` 的返回值形态由组件库定义（代码中未定义）；父组件可将其转换为 `[number|undefined, number|undefined]`
- 父组件响应：在业务中（如财务报表），合并更新后驱动表格渲染与过滤

## 依赖
- 组件库：`@wind/wind-ui`（`Checkbox`、`DatePicker.YearRangePicker`、`Select`）
- 表单：`antd`（`Form`、`useForm`）
- 工具：`ahooks`（`useDebounceFn`）
- 值对象：`UNIT_SCALES`（`/src/components/company/buss/financial/copied/domain/value-objects/unitScale.ts`）
- 类型：`FinancialFilters`（`/src/components/company/buss/financial/copied/types/index.ts`）
- 样式：`/src/components/company/buss/financial/copied/presentation/components/FilterBar/index.module.less`

## 扩展点
- 开启报表选项：源码中已注释的 `reportPeriod` 与 `reportForm` 选择框可取消注释启用，保持 `onFiltersChange` 增量回传
- 扩展筛选字段：在外层 `FinancialFilters` 中新增字段，并在 `Form` 增加对应 `Form.Item`（需父组件消费该字段）
- 样式扩展：修改 `index.module.less` 的 `filter-bar-container` 以自定义布局与间距
- 防抖时长：通过 `useDebounceFn` 配置 `wait` 值以适配交互节奏（当前为 200ms）

## ⚠️ 注意事项
- 保持受控：`filters` 为受控源；父组件必须合并 `updates` 后回传到 `FilterBar`
- 类型约束：`unitScale` 必须为 `UNIT_SCALES` 的键；`yearRange` 为 `[number|undefined, number|undefined]`
- 性能权衡：防抖可减少频繁更新，但会引入 200ms 延迟；如需实时响应可调整
- 未定义能力：不支持 `children` 与 `ref` 方法（代码中未定义）
- 被注释功能：`reportPeriod/reportForm` 选择框当前未渲染，如需启用需修改源码