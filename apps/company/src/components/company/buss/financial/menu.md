<!--
  文档概述：模块目录结构与文件职责说明
  @author yxlu.calvin
  @example 用于快速定位模块内文件职责
-->
# 目录结构与文件职责

```text
apps/company/src/components/company/buss/financial
├── index.ts                                   — 模块入口；创建服务实例并导出组件与服务
├── README.md                                  — 财务报表模块规范与使用文档（汇总）
├── FinancialDataRegionToggle.tsx              — 境内/境外数据切换单选组件（广播事件）
├── types/
│   └── index.ts                               — 共享类型定义（数据、变体、筛选、表格模型）
├── application/
│   ├── contexts/
│   │   └── financialFilters.tsx               — 筛选上下文 Provider + Hook（受控过滤状态）
│   ├── hooks/
│   │   └── useFinancialStatement.ts           — 组合服务的请求 Hook（缓存、依赖刷新）
│   └── services/
│       └── financialStatementService.ts       — 服务编排：获取过滤项、请求数据、校验、缓存
├── config/
│   ├── indicatorMetrics.ts                    — 指标型度量（国内/海外通用指标展示文案）
│   ├── validatedMetrics.ts                    — 预验证指标集合与组头（利润/资产负债/现金流）
│   └── variants.ts                            — 变体配置（domestic/overseas 的指标集合与特性）
├── domain/
│   ├── entities/
│   │   ├── financialMetric.ts                 — 指标实体构造器（键/标签/数值）
│   │   └── financialStatement.ts              — 财务报表领域对象（过滤、增长率、表格模型）
│   ├── services/
│   │   ├── dataValidator.ts                   — 原始数据校验（结构与字段存在性）
│   │   └── financialCalculator.ts             — 常用财务计算（利润率、债务率、流动比率等）
│   └── value-objects/
│       ├── period.ts                          — 期间值对象（年/季度键与比较）
│       └── unitScale.ts                       — 单位缩放值对象（元/千元/万元/亿元等）
├── infrastructure/
│   ├── api/
│   │   ├── financialDataClient.ts             — 数据客户端；拼装参数、请求接口、构造指标
│   │   └── financialFiltersClient.ts          — 过滤项客户端；拉取报告期/类型/默认值
│   ├── cache/
│   │   └── memoryCache.ts                     — 简易内存缓存（TTL 默认 5 分钟）
│   └── mock/
│       ├── mockApiFinancialData.ts            — Mock 原始接口响应数据
│       └── mockFinancialData.ts               — 根据公司代码生成 Mock 财务数据
├── presentation/
│   ├── components/
│   │   ├── ErrorState.tsx                     — 错误占位组件（显示错误并可重试）
│   │   ├── LoadingState.tsx                   — 加载骨架/占位组件
│   │   ├── FinancialTable.tsx                 — 表格渲染组件（列头、多组数据、悬停联动）
│   │   ├── FinancialStatement/
│   │   │   ├── index.module.less              — 容器样式（头部/副头/内容布局）
│   │   │   └── index.tsx                      — 容器组件：拉取过滤项、驱动数据请求与渲染
│   │   └── FilterBar/
│   │       ├── FilterBar.development.md       — FilterBar 开发说明与扩展点
│   │       ├── FilterBar.usage.md             — FilterBar 使用文档与示例
│   │       ├── index.module.less              — FilterBar 样式
│   │       └── index.tsx                      — FilterBar 表单控件（单位/时间/类型/空行）
│   └── hooks/
│       └── useFinancialUI.ts                  — UI 交互状态（悬停/选中指标）
├── utils/
│   ├── formatters.ts                          — 数值格式化（货币/百分比/比率）
│   └── pipeline.ts                            — 表格数据管线处理器（过滤/缩放/年份）
```

## 文件职责说明（逐项）

- `index.ts`：创建 `financialService`（整合数据客户端/过滤项客户端/配置提供者），导出 `FinancialStatement` 与 `FinancialFiltersProvider` 等。
- `FinancialDataRegionToggle.tsx`：切换境内/境外视图，向 `window` 广播 `financial:variantChanged` 事件。
- `types/index.ts`：模块共享类型，包括 `FinancialData/FinancialMetric/FinancialVariant/FinancialFilters/TableModel` 等。
- `application/contexts/financialFilters.tsx`：提供筛选上下文，`FinancialFiltersProvider` 包裹范围，`useFinancialFilters` 暴露更新/重置方法。
- `application/hooks/useFinancialStatement.ts`：基于 `ahooks` 的请求 Hook，按公司/变体/过滤项拉取数据，带缓存键与依赖刷新。
- `application/services/financialStatementService.ts`：服务聚合层，`getFilters` 拉过滤项，`getStatement` 请求数据→校验→构造领域对象→写缓存，`preloadStatement` 预加载。
- `config/indicatorMetrics.ts`：指标型度量的文案与键配置（国内/海外展示指标）。
- `config/validatedMetrics.ts`：各报表（利润/资产负债/现金流）指标集合与组头行 `groupHeaders`。
- `config/variants.ts`：变体注册与特性，包含 `domestic/overseas` 的指标集合与默认单位等表格配置。
- `domain/entities/financialMetric.ts`：指标实体构造器（键、标签、数值字典）。
- `domain/entities/financialStatement.ts`：领域对象，封装指标取值、期间过滤、增长率与 `toTableModel` 生成视图模型。
- `domain/services/dataValidator.ts`：原始数据的基本结构校验（periods/metrics 等）。
- `domain/services/financialCalculator.ts`：通用财务计算方法（利润率、债务率、增长率等）。
- `domain/value-objects/period.ts`：期间值对象，生成键/标签并提供前后比较方法。
- `domain/value-objects/unitScale.ts`：单位缩放值对象及转换器（元→万元等）。
- `infrastructure/api/financialDataClient.ts`：数据客户端，拼装查询参数、请求接口、根据变体指标集合构造 `metrics`。
- `infrastructure/api/financialFiltersClient.ts`：过滤项客户端，拉取报告期/类型/默认时间范围并回传选项。
- `infrastructure/cache/memoryCache.ts`：Map 实现的内存缓存，TTL 控制与清理。
- `infrastructure/mock/mockApiFinancialData.ts`：模拟原始接口响应结构。
- `infrastructure/mock/mockFinancialData.ts`：根据公司代码生成 Mock 的 periods/metrics/scenarios。
- `presentation/components/ErrorState.tsx`：渲染错误文案并提供重试按钮。
- `presentation/components/LoadingState.tsx`：加载骨架/占位。
- `presentation/components/FinancialTable.tsx`：根据 `TableModel` 渲染多列表格与组头悬停联动；数值格式化走 `Formatters`。
- `presentation/components/FinancialStatement/index.tsx`：容器组件，获取过滤项→驱动数据请求→组装表格模型→渲染 `FilterBar` 与 `FinancialTable`。
- `presentation/components/FinancialStatement/index.module.less`：容器样式。
- `presentation/components/FilterBar/index.tsx`：筛选表单控件（单位、时间范围、报告期/类型、隐藏空行）。
- `presentation/components/FilterBar/index.module.less`：筛选条样式。
- `presentation/components/FilterBar/FilterBar.development.md`：开发说明与扩展点。
- `presentation/components/FilterBar/FilterBar.usage.md`：使用示例与 API 说明。
- `presentation/hooks/useFinancialUI.ts`：UI 交互状态 Hook。
- `utils/formatters.ts`：格式化工具（货币/百分比/比率）。
- `utils/pipeline.ts`：数据管线处理器（过滤空行、单位缩放、年份过滤）。

## 核心入口与依赖
- 入口与导出：`index.ts:9-16,18-31`
- 服务编排：`application/services/financialStatementService.ts:14-66,67-85`
- 客户端：`infrastructure/api/financialFiltersClient.ts:5-31`, `infrastructure/api/financialDataClient.ts:8-89`
- 容器组件：`presentation/components/FinancialStatement/index.tsx:33-41,57-93,99-171,173-268`