# 标的物词云模块

## 概述
标的物词云模块提供基于ECharts的词云可视化组件，用于展示招投标中标的物关键词的频次分布。

## 组件列表
- `ProductWordsCloud`：标的物词云组件

## 功能特性
- **动态展示策略**：
  - 覆盖率阈值（默认85%）
  - 最少30、最多120个词（可按容器面积调节）
  - 总量过大时剔除低频尾部词
  - 并列优先：近期出现 > 短词 > 字典序
- **交互功能**：点击词条回调 `onSelectWord(word)`
- **自适应布局**：根据容器大小自动调整词云布局
- **颜色随机**：每个词条使用随机颜色，提升视觉效果
- **响应式设计**：支持窗口大小变化的自适应

## 使用示例
```tsx
import { ProductWordsCloud } from '@/bid/product-words';

<ProductWordsCloud 
  data={wordsData}
  onSelectWord={(word) => console.log('选中词条:', word)}
  targetCoverage={0.85}
  minWords={30}
  maxWords={120}
/>
```

## 数据结构
```typescript
interface ProductWordsCloudData {
  words: ProductWordItem[];
}

interface ProductWordItem {
  word: string;
  count: number;
  weight?: number;
}
```

## 配置参数
| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| targetCoverage | number | 0.85 | 累计覆盖率阈值 |
| minWords | number | 30 | 最小展示词条数 |
| maxWords | number | 120 | 最大展示词条数 |
| height | number | 360 | 图表高度 |

## 设计要点
- **信息密度**：通过动态展示策略保证高信息密度与可读性
- **性能优化**：使用useMemo缓存计算结果
- **插件加载**：动态导入echarts-wordcloud插件，避免构建时依赖
- **错误处理**：插件加载失败时不阻断其他功能

## 依赖
- ECharts：基础图表库
- echarts-wordcloud：词云插件
- gel-util：国际化支持 