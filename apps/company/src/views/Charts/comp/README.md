# 图表组件库

提供企业数据可视化所需的各种图表组件和交互功能。

## 目录结构
```
comp/
├── constants.ts               # 图表常量定义
├── extra.ts                   # 扩展功能
├── index.ts                   # 入口文件
├── ReportExport/              # 报表导出组件
├── chartContent/              # 图表内容组件
├── chartEmpty/                # 空状态图表组件
├── chartFooter/               # 图表底部组件
├── chartHeader/               # 图表头部组件
├── chartLegend/               # 图表图例组件
├── chartLoading/              # 图表加载组件
├── chartNoData/               # 无数据图表组件
├── chartTitle/                # 图表标题组件
├── chartTooltip/              # 图表提示框组件
├── chartWrapper/              # 图表包装器组件
├── customChart/               # 自定义图表组件
├── dataZoom/                  # 数据缩放组件
├── downloadChart/             # 图表下载组件
├── legendFilter/              # 图例过滤组件
└── refreshChart/              # 图表刷新组件
```

## 关键文件说明
- `index.ts` - 组件库入口，导出所有图表组件
- `constants.ts` - 图表相关常量定义
- `chartWrapper/` - 图表包装器，提供统一的图表容器
- `customChart/` - 自定义图表组件，支持多种图表类型
- `ReportExport/` - 报表导出功能组件

## 依赖示意
- 依赖：`echarts` - 图表渲染库、`lodash` - 工具函数
- 上游：企业数据分析模块、报表系统
- 下游：企业详情页面、数据可视化页面

## 相关文档
- [图表组件使用指南](../../../docs/chart-component-guide.md)
- [企业数据可视化设计](../../../docs/data-visualization-design.md)