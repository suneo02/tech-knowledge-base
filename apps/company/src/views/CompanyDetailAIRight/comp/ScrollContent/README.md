# ScrollContent - 滚动容器组件

提供统一的滚动区域容器，用于企业详情页的内容滚动。

## 目录结构

```
ScrollContent/
├── index.tsx           # 组件实现
└── index.module.less   # 组件样式
```

## 功能特性

- 统一滚动容器
- 滚动事件监听
- 自定义滚动样式

## Props

```typescript
interface ContentProps {
  children: React.ReactNode // 子内容
  className?: string // 自定义类名
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void // 滚动回调
}
```

## 使用示例

```tsx
<Content className="companyDetailScrollContainer" onScroll={handleScroll}>
  <CompanyDetail />
</Content>
```

## 相关文档

- [企业详情滚动处理](../../CompanyDetail.tsx)
