// 配置: 地区分布组件静态常量
// DEFAULT_HEIGHT: 组件默认高度
// MAP_STYLE: 地图样式常量（与 @index.jsx 对齐）
// WCB_BAR_BASE_CONFIG: WCBChart 柱状图基础配置（横向、无图例）

export const DEFAULT_HEIGHT = 460

export const MAP_STYLE = {
  color: ['#F0F6FA', '#E8F3FA', '#D5EAF7', '#C9E2F2', '#B9D8ED', '#A1CBE6', '#85BCDE', '#62A5CC'],
  outlineColor: '#4f7b7c',
  selectedColor: '#ffe58a',
  tooltipColor: '#ffe58a',
}

export const WCB_BAR_BASE_CONFIG = {
  chart: { categoryAxisDataType: 'category' as const },
  legend: { show: false },
  config: {
    layoutConfig: { transpose: true, type: 'bar' as const },
    yAxis: { '0:0-yAxis-0': { axisLabel: { autoRotate: false }, axisTick: { alignWithLabel: false } } },
    xAxis: { '0:0-xAxis-0': { copy: false } },
  },
  chartConfig: { waterMark: false, copyYaxis: true, animation: true },
} 