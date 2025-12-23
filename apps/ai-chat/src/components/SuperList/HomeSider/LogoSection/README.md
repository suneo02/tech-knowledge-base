# SuperLogoSection 组件

`SuperLogoSection` 是一个用于显示带有动画效果的 Logo 和标题的 React 组件。它支持入场、出场动画，并可以自定义大小和图标动画。

## 使用示例

```tsx
import { SuperLogoSection } from '@/components/SuperList/HomeSider/LogoSection'

const App = () => (
  <div>
    <SuperLogoSection size="large" iconAnimation={true} />
    <SuperLogoSection size="small" iconAnimation={false} />
  </div>
)
```

## Props

| 属性名          | 类型                   | 默认值    | 描述                             |
| --------------- | ---------------------- | --------- | -------------------------------- |
| `disabled`      | `boolean`              | `false`   | 是否禁用点击事件                 |
| `size`          | `'small'` \| `'large'` | `'large'` | 组件的大小，控制内边距和字体大小 |
| `iconAnimation` | `boolean`              | `true`    | 是否启用图标的旋转动画           |

## 主要功能

- **入场/出场动画**: 组件在初次渲染时会从左侧滑入，点击后会向左滑出并消失。
- **图标动画**: 图标支持一个旋转动画，可以通过 `iconAnimation` 属性来控制。
- **自定义大小**: 组件支持 `large` 和 `small` 两种尺寸，可以通过 `size` 属性来切换。
- **页面跳转**: 点击 Logo 后，在滑出动画结束后会自动跳转到 `/super` 页面。
