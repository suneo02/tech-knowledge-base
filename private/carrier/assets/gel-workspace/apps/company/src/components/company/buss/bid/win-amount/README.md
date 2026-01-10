# 中标金额模块

## 概述
中标金额模块提供企业招投标中标金额的可视化图表组件，支持折线图、箱型图和散点图的组合展示。

## 组件列表
- `WinAmountChart`：基础中标金额图表组件
- `WinAmountChartWithControls`：带控制器的中标金额图表组件

## 功能特性
- **多图表叠加**：同一图内叠加折线（趋势）+ 箱型图（分布）+ 散点（异常值）
- **统一轴触发**：tooltip同时展示趋势与分布信息
- **异常值识别**：通过散点图突出显示异常的中标金额
- **分布分析**：通过箱型图展示金额的分布情况
- **趋势分析**：通过折线图展示金额的变化趋势
- **交互联动**：鼠标悬停时同时显示多个维度的信息

## 使用示例
```tsx
import { WinAmountChart, WinAmountChartWithControls } from '@/bid/win-amount';

// 基础图表
<WinAmountChart data={chartData} />

// 带控制器的图表
<WinAmountChartWithControls 
  data={chartData}
  onDataChange={handleDataChange}
/>
```

## 数据结构
```typescript
interface WinAmountData {
  date: string;
  amount: number;
  category?: string;
  isOutlier?: boolean;
}
```

## 设计要点
- **信息密度**：通过多图表叠加提升信息密度
- **对比效率**：同时展示趋势与分布，提升分析效率
- **异常识别**：自动识别并突出显示异常值
- **交互体验**：统一的交互方式，降低学习成本

## 依赖
- ECharts：图表渲染
- Wind UI：控制器组件
- gel-util：国际化支持 