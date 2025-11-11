# OperatorHeader - 顶部操作栏组件

企业详情页顶部操作栏，提供企业名称展示和快捷操作入口。

## 目录结构

```
OperatorHeader/
├── index.tsx           # 组件实现
└── index.module.less   # 组件样式
```

## 功能特性

- 企业名称展示（支持国际化）
- 收藏/取消收藏
- 导出企业报告
- AI 助手显隐切换
- 反馈入口
- 回到顶部

## Props

```typescript
interface OperatorHeaderProps {
  entityName: string // 企业名称
  companyCode: string // 企业编码
  collectState: boolean // 收藏状态
  setCollectState: (state: boolean) => void
  backTopWrapClass?: string // 滚动容器类名
  onClickReport?: () => void // 导出报告回调
  onAliceClick?: (show?: boolean) => void // AI 助手切换回调
  showRight: boolean // AI 侧边栏显示状态
  corpNameIntl: string // 国际化企业名称
}
```

## 依赖关系

```
OperatorHeader
  └─> ToolsBar (@/components/toolsBar)
       ├─> 收藏功能
       ├─> 导出报告
       ├─> AI 助手
       ├─> 反馈
       └─> 回到顶部
```

## 使用示例

```tsx
<OperatorHeader
  entityName="小米科技有限责任公司"
  companyCode="123456"
  collectState={false}
  setCollectState={setCollectState}
  backTopWrapClass="scrollContainer"
  onClickReport={handleReport}
  onAliceClick={toggleAiSider}
  showRight={true}
  corpNameIntl="Xiaomi Technology Co., Ltd."
/>
```

## 相关文档

- [ToolsBar 组件](../../../../../components/toolsBar/README.md)
- [企业收藏功能](../../../../../components/searchListComponents/collect/README.md)
