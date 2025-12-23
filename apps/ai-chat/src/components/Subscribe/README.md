# Subscribe 组件

## 概述

Subscribe 组件提供了订阅功能的UI界面，支持两种使用方式：

1. 独立的 `Subscribe` 组件
2. 模态框版本 `SubscribeModal` 和 `useSubscribeModal` Hook

## 组件结构

```
Subscribe/
├── Subscribe.tsx          # 纯 Subscribe 组件
├── SubscribeModal.tsx     # Modal 版本 + Hook
├── index.ts              # 导出文件
├── index.module.less     # 样式文件
└── components/           # 子组件
    ├── List/
    └── Item/
```

## 使用方式

### 1. 独立使用 Subscribe 组件

```tsx
import { Subscribe } from '@/components/Subscribe'

const MyComponent = () => {
  const handleCancel = () => {
    console.log('取消订阅')
  }

  const handleSubmit = (values) => {
    console.log('提交订阅:', values)
  }

  return (
    <div style={{ height: '400px' }}>
      <Subscribe onCancel={handleCancel} onSubmit={handleSubmit} />
    </div>
  )
}
```

### 2. 使用 Modal 版本

```tsx
import { useSubscribeModal } from '@/components/Subscribe'

const MyComponent = () => {
  const [subscribeModal, subscribeModalContextHolder] = useSubscribeModal()

  const handleOpenModal = () => {
    subscribeModal.show({
      tableId: 'table-123',
      sheetId: 'sheet-456',
      onOk: (values) => {
        console.log('订阅成功:', values)
        subscribeModal.hide()
      },
    })
  }

  return (
    <div>
      <button onClick={handleOpenModal}>打开订阅弹窗</button>
      {subscribeModalContextHolder}
    </div>
  )
}
```

## API 参考

### Subscribe Props

| 参数     | 说明     | 类型                                    | 默认值 |
| -------- | -------- | --------------------------------------- | ------ |
| onCancel | 取消回调 | `() => void`                            | -      |
| onSubmit | 提交回调 | `(values: SubscribeFormValues) => void` | -      |

### SubscribeModalOptions

| 参数    | 说明     | 类型                                    | 默认值 |
| ------- | -------- | --------------------------------------- | ------ |
| tableId | 表格ID   | `string`                                | -      |
| sheetId | 工作表ID | `string`                                | -      |
| onOk    | 确认回调 | `(values: SubscribeFormValues) => void` | -      |

### SubscribeFormValues

```typescript
interface SubscribeFormValues {
  email: string
}
```

## 样式特性

- **固定头部**: 表单输入区域固定在顶部
- **可滚动内容**: 中间列表区域支持滚动
- **固定底部**: 操作按钮固定在底部
- **响应式设计**: 适配不同屏幕尺寸
- **自定义滚动条**: 美观的滚动条样式

## 注意事项

1. 组件需要指定具体的高度才能正确显示滚动效果
2. Modal 版本会自动管理状态，无需手动控制显示隐藏
3. 表单验证采用 Ant Design 的验证规则
