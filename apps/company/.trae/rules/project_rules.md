# React 18 Component Development Standards

## File & Naming Conventions

### File Naming

- Component files use `PascalCase` (e.g., `UserProfile.tsx`)
- Style files use `index.module.less`
- Test files use `ComponentName.test.tsx` format

### Component Naming

- Component names use `PascalCase`
- CSS class prefixes use `kebab-case`
- Constants use `UPPER_SNAKE_CASE`

## Import Standards

### Import Order & Style

```tsx
// 1. React and third-party libraries (named imports)
import { FC, useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// 2. Utility functions and types
import { t } from 'gel-util/locales'
import { useRequest } from 'ahooks'

// 3. UI components (prefer Wind UI)
import { Button, Card, Input } from '@wind/wind-ui'

// 4. Style files
import styles from './index.module.less'

// 5. Type definitions
import type { User, ApiResponse } from '@/types'

// ❌ Avoid default React import
// import React from 'react'
```

## Component Declaration Standards

### Basic Component Structure

```tsx
// Define Props interface
interface UserProfileProps {
  userId: number
  onSuccess?: () => void
  className?: string
}

// Define string constants
const STRINGS = {
  TITLE: t('', 'User Profile'),
  SAVE_BUTTON: t('', 'Save'),
  CANCEL_BUTTON: t('', 'Cancel'),
  LOADING_TEXT: t('', 'Loading...'),
} as const

// Define CSS class prefix
const PREFIX = 'c-card'

// Component declaration
export const UserProfile: FC<UserProfileProps> = (props) => {
  const { userId, onSuccess, className } = props

  return <div className={`${styles[`${PREFIX}-container`]} ${className || ''}`}>{/* Component content */}</div>
}
```

## CSS Modules Standards

### Less File Structure

```less
// index.module.less
@prefix: user-profile;

.@{prefix} {
  &-container {
    padding: 16px;
    background: #fff;
    width: 100%;
  }

  &-field {
    margin-bottom: 16px;
  }

  &-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }

  &-input {
    width: 100%;
  }

  &-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  &-submit {
    min-width: 80px;
  }
}
```

### Usage in Components

```tsx
// Use styles[`${PREFIX}-container`], styles[`${PREFIX}-field`] directly in components
<div className={styles[`${PREFIX}-container`]}>
  <div className={styles[`${PREFIX}-field`]}>{/* Content */}</div>
</div>
```

## Performance Optimization Guide

### Proper useCallback Usage

```tsx
// ✅ Use when needed: callbacks passed to child components
const handleChildEvent = useCallback(
  (data: any) => {
    // Processing logic
  },
  [dependency]
)

// ❌ Not needed: simple internal event handlers
const handleClick = () => {
  setState(value + 1)
}

// ✅ Use when needed: functions in dependency arrays
useEffect(() => {
  // Side effect logic
}, [stableCallback])
```

### Proper useMemo Usage

```tsx
// ✅ Use when needed: expensive computations
const expensiveValue = useMemo(() => {
  return items.filter((item) => item.active).sort(sortFn)
}, [items])

// ❌ Not needed: simple transformations
const simpleValue = items.map((item) => item.name)

// ✅ Use when needed: creating stable object references
const config = useMemo(
  () => ({
    duration: 300,
    easing: 'ease-in-out',
  }),
  []
)
```

## State Management Standards

### Redux Toolkit Usage

```tsx
// Usage in components
import { useSelector, useDispatch } from 'react-redux'

const UserList: FC = () => {
  const dispatch = useDispatch()
  const users = useSelector((state: RootState) => state.user.list)
  const loading = useSelector((state: RootState) => state.user.loading)

  const { run: fetchUsers } = useRequest(
    async () => {
      // Async operation
    },
    {
      manual: true,
      onSuccess: (data) => {
        dispatch(setUsers(data))
      },
    }
  )

  return <div>{/* ... */}</div>
}
```

## Best Practices Requirements

### 1. Type Safety

- Avoid `any` type
- Define interfaces for Props
- Use `as const` assertion for constants

### 2. Performance Optimization Principles

- Use `useCallback` only when necessary (functions passed to child components)
- Use `useMemo` only for expensive computations
- Avoid premature optimization, prioritize code readability

### 3. Code Organization

- Export only one main component per file
- Extract utility functions to separate files
- Use custom Hooks to split complex component logic

### 4. Error Boundaries

```tsx
// Recommended error handling
const { data, error, loading } = useRequest(apiCall, {
  onError: (error) => {
    Message.error(error.message)
  },
})

if (error) {
  // 其实应该写成通用组件直接 <Error message={error.message} />
  return <div className="error-container">Error: {error.message}</div>
}
```

### 5. Accessibility

- Add labels for form elements
- Use semantic HTML tags
- Ensure keyboard navigation support

## Prohibited Practices

❌ No Chinese strings in code
❌ No `React.useState` pattern
❌ No default React imports
❌ No `any` type usage
❌ No mixing multiple UI component libraries
❌ No overuse of useCallback/useMemo

Following these standards ensures code consistency, maintainability, and reasonable performance.
