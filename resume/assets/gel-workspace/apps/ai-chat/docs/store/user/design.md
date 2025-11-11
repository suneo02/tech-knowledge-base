# User Store 设计文档

## 概述
管理应用的用户信息和 VIP 状态，通过异步 action 从后端获取用户套餐信息，在 Redux store 中提供全局访问。

## 状态架构

```mermaid
graph TB
    A[User Store] --> B[用户信息]
    A --> C[VIP 状态]
    A --> D[加载状态]
    A --> E[错误处理]

    B --> F[userInfo]
    C --> G[vipStatus]
    D --> H[isLoading]
    D --> I[isUserInfoFetched]
    E --> J[error]

    K[fetchUserInfo] --> L[API 请求]
    L --> M[getuserpackageinfo]
    M --> N[状态更新]
```

## 核心状态

### State 结构
| 属性 | 类型 | 描述 |
|------|------|------|
| `userInfo` | `UserInfo \| null` | 原始用户信息对象 |
| `vipStatus` | `VipStatusEnum` | 用户 VIP 等级 |
| `isUserInfoFetched` | `boolean` | 是否已获取用户信息 |
| `isLoading` | `boolean` | 异步操作是否进行中 |
| `error` | `string \| null` | 错误信息 |

### VIP 状态枚举
- `NORMAL`: 普通用户
- `VIP`: VIP 用户
- `SVIP`: 超级 VIP 用户

## 异步流程

```mermaid
sequenceDiagram
    participant C as 组件
    participant D as dispatch
    participant T as fetchUserInfo
    participant A as API
    participant S as Store

    C->>D: dispatch(fetchUserInfo())
    D->>T: 执行异步 action
    T->>A: 请求用户信息
    A->>T: 返回数据
    T->>S: 更新 userInfo
    S->>S: 计算 vipStatus
    S->>C: 状态更新
```

## Selectors API

| Selector | 返回类型 | 描述 |
|----------|----------|------|
| `selectUserInfo` | `UserInfo` | 完整用户信息 |
| `selectVipStatus` | `VipStatusEnum` | VIP 状态 |
| `selectIsUserVip` | `boolean` | 是否为 VIP |
| `selectIsUserSVip` | `boolean` | 是否为 SVIP |
| `selectUserInfoFetched` | `boolean` | 是否已加载 |
| `selectUserLoading` | `boolean` | 是否加载中 |
| `selectUserError` | `string \| null` | 错误信息 |

## 使用示例
```typescript
const UserProfile = () => {
  const dispatch = useAppDispatch()
  const vipStatus = useAppSelector(selectVipStatus)
  const isLoading = useAppSelector(selectUserLoading)
  const isFetched = useAppSelector(selectUserInfoFetched)

  useEffect(() => {
    if (!isFetched) {
      dispatch(fetchUserInfo())
    }
  }, [dispatch, isFetched])

  if (isLoading) return <div>加载中...</div>

  return (
    <div>
      <h1>会员状态</h1>
      {vipStatus === VipStatusEnum.NORMAL && <p>普通用户</p>}
      {vipStatus === VipStatusEnum.VIP && <p>VIP 用户</p>}
      {vipStatus === VipStatusEnum.SVIP && <p>超级 VIP</p>}
    </div>
  )
}
```

## 设计特点
- **异步处理**: 完整的异步状态管理
- **状态缓存**: 避免重复请求
- **错误处理**: 完善的错误处理机制
- **类型安全**: 完整的 TypeScript 支持

## 关联文件
- @see apps/ai-chat/src/store/user/userSlice.ts
- @see [store README](../README.md)
