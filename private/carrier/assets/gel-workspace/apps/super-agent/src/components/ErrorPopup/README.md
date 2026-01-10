# ErrorPopup 组件

ErrorPopup 是一个用于显示错误、警告或提示信息的通用弹窗组件。它支持模态框（Modal）和全局提示（Message）两种展示形式。

## 引入

```typescript
import ErrorPopup from '@/components/ErrorPopup'
```

## 代码演示

### 基础用法（模态框）

```tsx
import ErrorPopup from '@/components/ErrorPopup'
import { ErrorActionType } from 'gel-util/config'

const MyComponent = () => {
  const [visible, setVisible] = useState(false)

  const config = {
    title: '操作失败',
    message: '您的账户余额不足，请充值。',
    type: 'error',
    closable: true,
    showIcon: true,
    actions: [
      {
        type: ErrorActionType.CANCEL,
        text: '取消',
      },
      {
        type: ErrorActionType.RECHARGE,
        text: '去充值',
      },
    ],
  }

  return (
    <>
      <Button onClick={() => setVisible(true)}>显示弹窗</Button>
      {visible && <ErrorPopup config={config} onClose={() => setVisible(false)} />}
    </>
  )
}
```

### 自动关闭的消息提示

当配置了 `duration` 属性时，组件将以全局 Message 的形式展示，并且不显示模态框。

```tsx
const config = {
  message: '操作成功',
  type: 'success',
  duration: 3000, // 3秒后自动关闭
}

// 渲染组件时会自动调用 message.success
;<ErrorPopup config={config} />
```

## API

### ErrorPopupProps

组件继承自 Ant Design 的 `ModalProps`，除了以下特有属性外，支持所有 Modal 的属性。

| 参数    | 说明                 | 类型          | 默认值 |
| ------- | -------------------- | ------------- | ------ |
| config  | 弹窗或消息的配置对象 | `ErrorConfig` | -      |
| onClose | 关闭弹窗的回调       | `() => void`  | -      |

### ErrorConfig

配置对象结构如下：

| 属性     | 说明                                                | 类型                                          |
| -------- | --------------------------------------------------- | --------------------------------------------- |
| title    | 弹窗标题                                            | `ReactNode`                                   |
| message  | 提示内容                                            | `ReactNode`                                   |
| type     | 提示类型，决定图标和消息样式                        | `'success' \| 'info' \| 'warning' \| 'error'` |
| duration | 自动关闭时间（毫秒）。若设置，则以 Message 形式展示 | `number`                                      |
| closable | 是否显示右上角关闭按钮                              | `boolean`                                     |
| showIcon | 是否在内容区显示状态图标                            | `boolean`                                     |
| actions  | 底部操作按钮配置列表                                | `ErrorAction[]`                               |

### ErrorAction

操作按钮配置：

| 属性    | 说明                                   | 类型              |
| ------- | -------------------------------------- | ----------------- |
| type    | 动作类型                               | `ErrorActionType` |
| text    | 按钮文案                               | `string`          |
| onClick | 点击回调（可选），若不传则执行默认逻辑 | `() => void`      |

### ErrorActionType

枚举值，定义了按钮的默认行为：

- `RECHARGE`: 触发充值逻辑（控制台打印 'recharge'）
- `RETRY`: 刷新页面 (`window.location.reload()`)
- `CLOSE`: 关闭弹窗
- `CANCEL`: 关闭弹窗
- `CONFIRM`: 关闭弹窗

> 注意：`ErrorConfig` 和 `ErrorActionType` 类型定义通常来源于 `gel-util/config`。
