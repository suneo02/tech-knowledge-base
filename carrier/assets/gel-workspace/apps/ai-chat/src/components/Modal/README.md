# Modal 扩展封装

对齐 AntD `Modal.useModal()` 的体验，提供字符串枚举注册的方式打开不同业务弹窗。

## 使用

```tsx
import { Modal, MODALS } from '@/components/Modal'

const Demo = () => {
  const [modal, holder] = Modal.useModal()

  return (
    <>
      <button onClick={() => modal.open(MODALS.ADVICE, { title: '标题', content: '内容' })}>打开建议弹窗</button>
      {holder}
    </>
  )
}
```

## 扩展新弹窗

1. 在对应目录实现业务组件与包装的 `xxxModal`（应接收 `open`、`onCancel`、`onClose`）。
2. 在 `src/components/Modal/index.tsx` 中：
   - 在 `MODALS` 中增加键
   - 在 `ModalPropsMap` 中增加类型映射
   - 在 `MODAL_COMPONENTS` 中注册组件
