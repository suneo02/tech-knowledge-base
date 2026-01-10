# 招投标可视化组件（bid）

## 概述
提供企业招投标相关的前端可视化组件，覆盖中标次数、中标金额、标的物词云与地区分布等核心场景，支持频率切换、导出、国际化与响应式。

## 模块结构
```
bid/
├── index.ts                    # 统一导出入口
├── README.md                   # 模块说明文档
├── config/                     # 共享配置
│   └── regionDistribution.ts
├── win-count/                  # 中标次数模块
│   ├── index.ts
│   ├── WinCountChart.tsx
│   ├── WinCountChart.module.less
│   ├── WinCountChartWithControls.tsx
│   └── WinCountChartWithControls.module.less
├── win-amount/                 # 中标金额模块
│   ├── index.ts
│   ├── WinAmountChart.tsx
│   ├── WinAmountChart.module.less
│   ├── WinAmountChartWithControls.tsx
│   └── WinAmountChartWithControls.module.less
├── product-words/              # 标的物词云模块
│   ├── index.ts
│   ├── ProductWordsCloud.tsx
│   └── ProductWordsCloud.module.less
└── region-distribution/        # 地区分布模块
    ├── index.ts
    ├── RegionDistribution.tsx
    └── RegionDistribution.module.less
```

## 导出组件
- **中标次数模块**：`WinCountChart` / `WinCountChartWithControls`
- **中标金额模块**：`WinAmountChart` / `WinAmountChartWithControls`
- **标的物词云模块**：`ProductWordsCloud`
- **地区分布模块**：`RegionDistribution`

## 依赖（peerDependencies）
- ECharts（金额图表、词云插件）：`echarts`
- ECharts 词云插件：`echarts-wordcloud`
- Wind 地图组件：`@wind/Wind.Map.mini`
- Wind 图表构建器：`@wind/chart-builder`
- Wind UI：`@wind/wind-ui`

> 构建配置将上述依赖 external，需由宿主应用安装并统一版本。

## 快速使用

### 中标次数图表
- 结构：堆叠柱形（中标/未中标）+ 折线（中标金额），双 Y 轴
- 交互：频率切换（月/季/年）、导出

### 中标金额图表
- 结构：同一图内叠加 折线（趋势）+ 箱型图（分布）+ 散点（异常值）
- 交互：统一轴触发的 tooltip（同时展示趋势与分布信息）

### 标的物词云（ProductWordsCloud）
- 实现：ECharts + echarts-wordcloud 插件
- 动态展示策略：
  - 覆盖率阈值（默认 85%）
  - 最少 30、最多 120 个词（可按容器面积调节）
  - 总量过大时剔除低频尾部词；并列优先可选：近期出现 > 短词 > 字典序
- 交互：点击词条回调 `onSelectWord(word)`

### 地区分布（RegionDistribution）
- 结构：左侧中国地图（`@wind/Wind.Map.mini`），右侧 TopN 横向柱图（`@wind/chart-builder`）
- 交互：
  - 顶部地区选择器（可选）：`areaOptions / selectedAreaCode / onChangeSelectedArea`
  - 地图点击回调：`onSelectRegion(regionCode, regionName)`
  - 标题行显示"全国/当前地区"，支持下钻批次 `batch`

## 设计要点（摘要）
- 金额图表：折线 + 箱型图 + 异常值同图叠加，提升趋势与分布的对比效率
- 词云：采用动态展示策略保证高信息密度与可读性
- 地区分布：地图负责选区与概览，柱图负责 TopN 排名与对比
- 国际化：`gel-util/intl` 的 `isEn()` 控制中英文

## 性能与可维护性
- 外部库 external，减少重复打包
- 使用 useMemo 缓存计算；组件化拆分静态配置（如 `config/regionDistribution.ts`）
- 建议单次点位不超过 100，保障交互流畅
- 模块化结构便于维护和扩展

## 注意事项
- 宿主需按需安装 peer 依赖（ECharts、echarts-wordcloud、@wind/Wind.Map.mini、@wind/chart-builder、@wind/wind-ui）
- 词云插件无官方类型时可添加最小 d.ts 声明（series.wordCloud、插件注册）
- RegionDistribution 的地图数据结构需包含 `regionName / value / area_code（或 adcode）`
