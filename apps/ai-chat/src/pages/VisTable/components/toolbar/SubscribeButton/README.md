# SubscribeButton 订阅按钮组件

## 概述

SubscribeButton 是一个功能完整的订阅管理按钮组件，提供订阅设置、动态查看、通知提醒等功能。该组件采用了精细化的 hooks 职责分离架构，每个 hook 只负责一个特定的功能领域。

## 功能特性

- **订阅设置**：支持订阅条件配置和邮箱设置
- **动态查看**：查看订阅筛选下的新增企业动态
- **智能通知**：自动检查并显示订阅通知
- **URL参数支持**：支持通过URL参数自动打开订阅预览
- **状态管理**：实时同步订阅状态
- **响应式设计**：支持加载状态和错误处理

## 使用示例

```tsx
import SubscribeButton from './SubscribeButton'

// 基础用法
;<SubscribeButton tableId="your-table-id" />
```

## Props

| 属性名  | 类型   | 必填 | 默认值 | 说明                     |
| ------- | ------ | ---- | ------ | ------------------------ |
| tableId | string | ✅   | -      | 表格ID，用于标识订阅对象 |

## Hooks 架构

该组件采用了精细化的 hooks 职责分离设计，每个 hook 专注于一个特定功能：

### 1. useSubscribeStatus - 订阅状态管理

**职责**: 专门负责订阅状态的获取、更新和管理

**返回值**:

- `subscribeInfo`: 订阅信息对象（包含 subPush、totalNewCompany、disableToast 等）
- `loading`: 加载状态
- `updateSubscribeStatus`: 更新订阅状态的方法

```typescript
const { subscribeInfo, loading, updateSubscribeStatus } = useSubscribeStatus({ tableId })
```

### 2. useSubscribeModal - 弹窗管理

**职责**: 专门负责订阅弹窗的显示、隐藏和模式切换

**返回值**:

- `subscribeModalContextHolder`: 弹窗容器组件
- `showSubscribeSetting`: 显示订阅设置弹窗
- `showSubscribePreview`: 显示订阅预览弹窗

```typescript
const { subscribeModalContextHolder, showSubscribeSetting, showSubscribePreview } = useSubscribeModal({
  tableId,
  onSubscribeSuccess: () => updateSubscribeStatus(true),
  onSubscribeCancel: () => updateSubscribeStatus(false),
})
```

### 3. useSubscribeNotification - 通知管理

**职责**: 专门负责订阅通知的检查、显示和标记已读

**参数**:

- `tableId`: 表格ID
- `subscribeInfo`: 订阅信息对象
- `onViewNews`: 查看动态的回调函数

```typescript
useSubscribeNotification({
  tableId,
  subscribeInfo,
  onViewNews: showSubscribePreview,
})
```

### 4. useSubscribeUrlParams - URL参数管理

**职责**: 专门负责处理订阅相关的URL参数逻辑

**参数**:

- `onViewNews`: 查看动态的回调函数

```typescript
useSubscribeUrlParams({
  onViewNews: showSubscribePreview,
})
```

## 组件结构

```
SubscribeButton/
├── README.md                 # 组件文档
├── index.tsx                 # 主组件
└── hooks/                    # Hooks 目录
    ├── useSubscribeStatus.ts      # 订阅状态管理
    ├── useSubscribeModal.ts       # 弹窗管理
    ├── useSubscribeNotification.ts # 通知管理
    └── useSubscribeUrlParams.ts   # URL参数管理
```

## 设计优势

### 1. 职责清晰

每个 hook 只负责一个特定功能领域，职责边界明确：

- 看到 `useSubscribeModal` 就知道是管理弹窗的
- 看到 `useSubscribeStatus` 就知道是管理订阅状态的
- 看到 `useSubscribeNotification` 就知道是管理通知的
- 看到 `useSubscribeUrlParams` 就知道是管理URL参数的

### 2. 易于维护

- 每个 hook 独立，修改时不会影响其他功能
- 代码结构清晰，便于理解和调试
- 单一职责原则，降低耦合度

### 3. 可复用性强

- 可以单独使用某个 hook 而无需引入其他功能
- 每个 hook 都可以在其他组件中复用
- 接口设计灵活，支持自定义回调

### 4. 测试友好

- 每个 hook 职责单一，便于编写单元测试
- 功能模块化，可以独立测试各个功能点
- 依赖注入设计，便于 mock 和测试

## 交互流程

1. **组件初始化**: 自动获取订阅状态和检查通知
2. **URL参数处理**: 如果URL包含 `subPush=true`，自动打开订阅预览
3. **用户交互**:
   - 点击"设置"：打开订阅设置弹窗
   - 点击"动态"：打开订阅预览弹窗（需已订阅）
4. **状态同步**: 订阅操作成功后自动更新本地状态
5. **通知提醒**: 有新增企业时自动显示通知消息

## 依赖项

- `@wind/wind-ui`: UI 组件库
- `@wind/rime-icons`: 图标库
- `gel-util/intl`: 国际化工具
- `gel-util/common`: 通用工具函数

## 注意事项

1. **tableId 必传**: 组件依赖 tableId 进行订阅管理，必须传入有效的表格ID
2. **权限控制**: 动态查看功能需要用户已订阅才能使用
3. **错误处理**: 各个 hook 内部都有错误处理机制，确保组件稳定运行
4. **性能优化**: 使用 useCallback 优化回调函数，避免不必要的重新渲染
