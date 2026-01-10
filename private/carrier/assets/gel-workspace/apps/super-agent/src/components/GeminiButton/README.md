# GeminiButton 组件

GeminiButton 是一个具有高级视觉效果的按钮组件，模仿了 Google Gemini 风格的液态光泽和跟随效果。它提供了丰富的交互反馈，包括鼠标跟随光效、涟漪点击效果以及触摸设备支持。

## 特性

- **液态跟随效果**：鼠标移动时，光泽会跟随光标位置。
- **光泽闪耀**：独特的渐变光泽背景。
- **点击涟漪**：点击时触发扩散的涟漪动画。
- **高性能**：使用 CSS 变量和 `requestAnimationFrame` 优化动画性能。
- **完全兼容**：支持 `forwardRef` 和所有原生 `<button>` 属性。
- **触摸支持**：适配移动端触摸交互。

## 引入

```tsx
import { GeminiButton } from '@/components/GeminiButton'
```

## 代码演示

### 基础用法

```tsx
import React from 'react'
import { GeminiButton } from '@/components/GeminiButton'

const App = () => {
  return (
    <div style={{ padding: 50 }}>
      <GeminiButton onClick={() => console.log('Clicked!')}>
        立即体验
      </GeminiButton>
    </div>
  )
}

export default App
```

### 配合图标使用

```tsx
import React from 'react'
import { GeminiButton } from '@/components/GeminiButton'
import { StarOutlined } from '@ant-design/icons'

const App = () => {
  return (
    <GeminiButton>
      <StarOutlined />
      <span>AI 生成</span>
    </GeminiButton>
  )
}
```

### 自定义样式

可以通过 `className` 或 `style` 覆盖默认样式。

```tsx
<GeminiButton className="my-custom-btn" style={{ width: 200 }}>
  宽按钮
</GeminiButton>
```

## API

`GeminiButton` 继承自原生 `button` 元素的所有属性（`React.ButtonHTMLAttributes<HTMLButtonElement>`），并支持 `ref` 转发。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| children | 按钮内容 | `React.ReactNode` | - |
| className | 自定义类名 | `string` | - |
| onClick | 点击回调 | `(e: MouseEvent) => void` | - |
| ref | 获取按钮 DOM 节点 | `React.Ref<HTMLButtonElement>` | - |
| ...props | 其他原生 button 属性 | `ButtonHTMLAttributes` | - |

## 注意事项

- 组件内部使用了 CSS 变量 (`--x`, `--y`) 来控制光效位置，请勿覆盖相关变量。
- 组件默认带有 `position: relative` 和 `overflow: hidden`，如需修改布局请注意层叠上下文。
