# ErrorBoundary 组件

`ErrorBoundary` 是一个 React 错误边界组件，用于捕获其子组件树中的 JavaScript 错误，记录这些错误，并显示备用 UI 而不是崩溃的组件树。

## 引入方式

```tsx
import ErrorBoundary from '@/components/ErrorBoundary'
```

## Props

| 属性名            | 类型                                          | 默认值 | 说明                                                                     |
| ----------------- | --------------------------------------------- | ------ | ------------------------------------------------------------------------ |
| children          | React.ReactNode                               | -      | 需要被错误边界包裹的子组件                                               |
| fallback          | React.ReactNode                               | -      | (可选) 自定义发生错误时显示的 UI。优先级最高。                           |
| FallbackComponent | React.ComponentType\<FallbackProps\>          | -      | (可选) 自定义错误组件，接收 `error` 和 `resetErrorBoundary` 作为 props。 |
| fallbackRender    | (props: FallbackProps) => React.ReactNode     | -      | (可选) 渲染函数，接收 `error` 和 `resetErrorBoundary`。                  |
| onError           | (error: Error, info: React.ErrorInfo) => void | -      | (可选) 错误捕获时的回调函数。                                            |
| onReset           | () => void                                    | -      | (可选) 重置错误状态时的回调函数。                                        |

### FallbackProps 定义

```tsx
type FallbackProps = {
  error: Error
  resetErrorBoundary: () => void
}
```

## 功能说明

1.  **错误捕获**：通过 `componentDidCatch` 捕获子组件抛出的错误。
2.  **错误上报**：
    - 内置调用 `reportEagleSMock` 上报错误信息。
    - 支持通过 `onError` prop 传入自定义上报逻辑。
3.  **恢复机制**：
    - **刷新页面**：默认 UI 提供刷新页面按钮。
    - **重试（Reset）**：默认 UI 提供重试按钮，调用 `resetErrorBoundary` 方法清除错误状态，尝试重新渲染子组件。支持通过 `onReset` 回调清理外部状态。
4.  **UI 渲染优先级**：
    `fallback` > `fallbackRender` > `FallbackComponent` > 默认 Ant Design `Result` 组件。

## 使用示例

### 1. 基本使用（使用默认错误页）

```tsx
import ErrorBoundary from '@/components/ErrorBoundary'

const App = () => (
  <ErrorBoundary>
    <MyComponent />
  </ErrorBoundary>
)
```

### 2. 使用 FallbackComponent 自定义 UI 并支持重试

```tsx
import ErrorBoundary, { FallbackProps } from '@/components/ErrorBoundary'
import { Button } from 'antd'

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div role="alert">
    <p>出错啦：</p>
    <pre>{error.message}</pre>
    <Button onClick={resetErrorBoundary}>重试</Button>
  </div>
)

const App = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <MyComponent />
  </ErrorBoundary>
)
```

### 3. 监听错误和重置

```tsx
const handleOnError = (error: Error, info: React.ErrorInfo) => {
  // 发送日志到服务器
  logErrorToMyService(error, info)
}

const handleOnReset = () => {
  // 重置一些应用状态
  resetMyReduxState()
}

const App = () => (
  <ErrorBoundary onError={handleOnError} onReset={handleOnReset}>
    <MyComponent />
  </ErrorBoundary>
)
```
