<!--
  文档概述：模块流程图与分层关系
  @author yxlu.calvin
  @example 参考时序图与分层图进行开发与排查
-->
# 模块流程图（简化版）

```mermaid
sequenceDiagram
  participant UI as FinancialStatement
  participant FB as FilterBar
  participant Ctx as FinancialFiltersProvider/useFinancialFilters
  participant Svc as financialStatementService
  participant FFC as financialFiltersClient
  participant FDC as financialDataClient
  participant DV as DataValidator
  participant Dom as createFinancialStatement
  participant FT as FinancialTable

  UI->>Svc: getFilters(companyCode, variant)
  Svc->>FFC: fetchFilters
  FFC-->>Svc: options (template/type/date)
  Svc-->>UI: options
  UI->>Ctx: updateFilters(options)

  UI->>Svc: getStatement(companyCode, variant, filters)
  Svc->>FDC: fetchFinancialData(params)
  FDC-->>Svc: raw data
  Svc->>DV: validate
  DV-->>Svc: ok/error
  Svc->>Dom: createFinancialStatement
  Dom-->>UI: statement
  UI->>FT: render(model from statement + variant metricSets)
```

## 分层总览（最小节点）

```mermaid
flowchart LR
  subgraph Presentation
    FS[FinancialStatement]
    FB[FilterBar]
    FT[FinancialTable]
  end
  subgraph Application
    Ctx[FinancialFiltersProvider/useFinancialFilters]
    Hook[createUseFinancialStatement]
    Svc[financialStatementService]
  end
  subgraph Infrastructure
    FFC[financialFiltersClient]
    FDC[financialDataClient]
    Cache[memoryCache]
  end
  subgraph Domain
    Val[DataValidator]
    Stmt[createFinancialStatement]
  end

  FS --> FB
  FS --> Hook
  Hook --> Svc
  Svc --> FFC
  Svc --> FDC
  FDC --> Val
  Val --> Stmt
  Stmt --> FS
  FS --> FT
  FS --> Ctx
```

## 维护建议
- 将“过滤项拉取”与“数据拉取”两个阶段明确分离，避免交叉刷新导致复杂依赖。
- 保持 `financialStatementService` 作为唯一数据入口，组件层不直接触达客户端。
- 仅在 `FinancialStatement` 维护组装逻辑（变体指标集合与组头），格式化与管线处理保持在工具层可选使用。
- `memoryCache` 作为内部优化，不暴露到 UI；缓存策略统一在服务层控制。