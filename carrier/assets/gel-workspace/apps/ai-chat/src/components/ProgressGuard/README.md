# ProgressGuard 组件文档

## 1. 概述 (Overview)

`ProgressGuard` 是一个用于管理全局异步操作状态的 React 组件。它旨在通过提供顶部的加载进度条和自动禁用页面上的关键按钮，来优化长耗时操作（如 API 请求）的用户体验。

### 核心功能

- **全局进度条**：在页面顶部显示一个类似 Chrome 的无限循环加载条，为用户提供即时反馈。
- **防御式按钮**：提供一个 `<GuardedButton />` 组件，它能自动感知全局加载状态。在加载进行时，该按钮会自动变为禁用状态，防止用户重复提交。
- **状态管理**：通过 React Context API 实现跨组件的状态共享，无需手动传递 props。
- **易于集成**：只需在应用根部包裹 `ProgressGuardProvider`，即可轻松地为整个应用或特定部分启用此功能。

---

## 2. 组件架构 (Architecture)

组件遵循关注点分离原则，将不同职责的代码拆分到独立的目录中，结构清晰，易于维护。

```
src/components/progress-guard/
├── components/                 # UI 子组件
│   ├── GuardedButton.tsx     # 自动感知加载状态的按钮
│   └── ProgressBar.tsx       # 顶部进度条
├── context/                    # Context 相关
│   ├── ProgressContext.ts      # Context 定义
│   ├── ProgressGuardProvider.tsx # Context 提供者，管理状态
│   └── useProgressGuard.ts     # 用于消费 Context 的 Hook
├── types.ts                    # TypeScript 类型定义
└── index.ts                    # 模块统一出口
```

---

## 3.核心 API

### `<ProgressGuardProvider>`

这是组件的根，必须包裹在所有使用 `useProgressGuard` Hook 的组件的父级。

- **Props**:
  - `children`: `React.ReactNode` - 需要被上下文覆盖的子组件。

### `useProgressGuard()`

一个自定义 Hook，用于在任何子组件中访问和控制进度状态。

- **返回值**: `object`
  - `inProgress`: `boolean` - 当前是否处于加载状态。
  - `startProgress`: `() => void` - 手动开始进度条。
  - `endProgress`: `() => void` - 手动结束进度条。

### `<ProgressBar>`

显示在页面顶部的进度条组件。通常与 `useProgressGuard` 结合使用，根据 `inProgress` 状态来控制其显隐。

- **Props**:
  - `visible`: `boolean` - 是否显示进度条。

### `<GuardedButton>`

一个增强版的 `<button>`。它会自动监听 `inProgress` 状态，在加载时禁用自身。它接受所有原生 `<button>` 的属性。

- **Props**:
  - `toastMessage?`: `string` - 当按钮在加载状态下被点击时，显示的提示信息。默认为 "数据正在处理中，请稍候..."。

---

## 4. 使用示例 (Usage Example)

### a. 在应用中设置 Provider

首先，在你的应用根组件或者需要该功能的布局组件中，使用 `ProgressGuardProvider` 进行包裹。

```tsx
// 在 App.tsx 或 MainLayout.tsx 中
import { ProgressGuardProvider, ProgressBar, useProgressGuard } from '@/components/ProgressGuard'

// 一个辅助组件，用于将 ProgressBar 与 Context 状态关联
const ProgressBarWrapper = () => {
  const { inProgress } = useProgressGuard()
  return <ProgressBar visible={inProgress} />
}

function App() {
  return (
    <ProgressGuardProvider>
      {/* ProgressBarWrapper 必须在 Provider 内部 */}
      <ProgressBarWrapper />

      {/* 你的其他应用内容 */}
      <YourAppContent />
    </ProgressGuardProvider>
  )
}
```

### b. 在页面或组件中使用

在任何子组件中，你都可以使用 `useProgressGuard` Hook 来控制进度，并使用 `GuardedButton` 来代替普通按钮。

```tsx
import { useProgressGuard, GuardedButton } from '@/components/ProgressGuard'

// 模拟一个需要 2 秒的 API 请求
const mockApiCall = () => new Promise((resolve) => setTimeout(resolve, 2000))

const MyFeatureComponent = () => {
  const { startProgress, endProgress } = useProgressGuard()

  const handleSubmit = async () => {
    startProgress() // 开始进度条
    try {
      await mockApiCall()
      // 处理成功逻辑...
    } catch (error) {
      // 处理错误逻辑...
    } finally {
      endProgress() // 确保总是结束进度条
    }
  }

  return (
    <div>
      <GuardedButton onClick={handleSubmit}>提交</GuardedButton>

      {/* 这个按钮在提交时也会被禁用 */}
      <GuardedButton onClick={() => console.log('另一个操作')} toastMessage="请等待上一个操作完成！">
        另一个操作
      </GuardedButton>
    </div>
  )
}
```
