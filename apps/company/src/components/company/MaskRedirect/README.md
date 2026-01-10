# MaskRedirect 蒙版引流组件

简单的引流组件，使用 Card 包裹，标题显示在 Card title 上，内容区显示引导文案和可点击的跳转链接。参考 HKCorpInfo 实现。

## 组件结构

```
MaskRedirect/
├── index.tsx              # 组件实现
├── index.module.less      # 样式文件（BEM + 设计 token）
├── MaskRedirect.stories.tsx  # Storybook 示例
└── README.md              # 文档
```

## 使用方式

```tsx
import { MaskRedirect } from '@/components/company/MaskRedirect'

const MyComponent = () => {
  return (
    <MaskRedirect
      title="股权冻结"
      modelNum="equityfreeze"
      basicNum={basicNum}
      maskRedirect={{
        url: (companyCode) => getRiskOutUrl(RiskOutModule.EQUITY_FREEZE, companyCode),
        title: '股权冻结',
        description: '该数据为风控专属数据，查看完整信息请前往风控产品',
      }}
      companyCode="123456"
      moduleKey="equityfreeze"
    />
  )
}
```

## 特性

- **Card 包裹**：参考 HKCorpInfo 实现，使用 Card 组件包裹，标题显示在 Card title 上
- **简洁设计**：背景色内容区 + 文本 + 可点击的"风险监控"链接
- **懒加载**：在 `useRenderTableDom.tsx` 中使用懒加载，仅在需要时加载组件
- **类型安全**：完整的 TypeScript 类型定义
- **符合规范**：使用 BEM 命名 + 设计 token

## 相关文件

- 配置：`apps/company/src/handle/corpModuleCfg/risk/risk.tsx`
- 配置：`apps/company/src/handle/corpModuleCfg/bussRisk/bussRisk.tsx`
- 类型定义：`apps/company/src/types/corpDetail/node/custom.ts`
- 使用示例：`apps/company/src/components/company/useRenderTableDom.tsx`
