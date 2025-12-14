# PageTransition 页面过渡组件

提供页面间平滑过渡动画效果，支持前进和后退两种动画方向。

## 特性

- 支持前进和后退两种动画方向
- 自定义路由配置
- 可自定义过渡动画时间
- 支持样式和类名自定义
- 提供完整的TypeScript类型支持

## 使用示例

```tsx
import { useRef } from 'react'
import { PageTransition, PageTransitionRef } from '@/components/common/PageTransition'

const MyComponent = () => {
  const transitionRef = useRef<PageTransitionRef>(null)

  // 定义路由配置
  const routes = [
    { path: '/', element: <HomePage /> },
    { path: '/detail', element: <DetailPage /> },
    { path: '/settings', element: <SettingsPage /> },
  ]

  // 前进到详情页
  const goToDetail = () => transitionRef.current?.next('/detail')

  // 返回首页
  const goBack = () => transitionRef.current?.back('/')

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <PageTransition
        ref={transitionRef}
        routes={routes}
        initialPath="/"
        onPathChange={(path) => console.log('当前路径:', path)}
      />

      <div className="navigation-buttons">
        <button onClick={goToDetail}>查看详情</button>
        <button onClick={goBack}>返回首页</button>
      </div>
    </div>
  )
}
```

## API

### Props

| 属性名             | 类型                                          | 默认值 | 说明                 |
| ------------------ | --------------------------------------------- | ------ | -------------------- |
| routes             | `Array<{ path: string, element: ReactNode }>` | -      | 路由配置，必填       |
| initialPath        | string                                        | '/'    | 初始路径             |
| onPathChange       | (path: string) => void                        | -      | 路径变化回调         |
| transitionDuration | number                                        | 300    | 动画持续时间（毫秒） |
| style              | React.CSSProperties                           | -      | 自定义样式           |
| className          | string                                        | -      | 自定义类名           |

### Ref方法

| 方法名         | 参数                   | 返回值 | 说明           |
| -------------- | ---------------------- | ------ | -------------- |
| next           | (path: string) => void | -      | 前进到指定路径 |
| back           | (path: string) => void | -      | 回退到指定路径 |
| getCurrentPath | () => string           | string | 获取当前路径   |
