# 中标次数模块

## 概述
中标次数模块提供企业招投标中标次数的可视化图表组件，支持堆叠柱形图和折线图的组合展示。

## 组件列表
- `WinCountChart`：基础中标次数图表组件
- `WinCountChartWithControls`：带控制器的中标次数图表组件

## 功能特性
- **双Y轴展示**：左侧Y轴显示中标/未中标次数，右侧Y轴显示中标金额
- **堆叠柱形图**：展示中标和未中标的次数对比
- **折线图**：展示中标金额的趋势变化
- **频率切换**：支持月/季/年的数据频率切换
- **导出功能**：支持图表数据导出
- **国际化**：支持中英文切换

## 使用示例
```tsx
import { WinCountChart, WinCountChartWithControls } from '@/bid/win-count';

// 基础图表
<WinCountChart data={chartData} />

// 带控制器的图表
<WinCountChartWithControls 
  data={chartData}
  onFrequencyChange={handleFrequencyChange}
  onExport={handleExport}
/>
```

## 数据结构
```typescript
interface WinCountData {
  date: string;
  winCount: number;
  loseCount: number;
  winAmount: number;
}
```

## 依赖
- ECharts：图表渲染
- Wind UI：控制器组件
- gel-util：国际化支持 