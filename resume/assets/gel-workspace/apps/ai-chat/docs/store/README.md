# AI Chat 状态管理

## 定位
使用 Redux Toolkit 管理应用的全局状态，包括用户信息、积分系统等核心业务数据。

## 目录结构
```
store/
├── points/          # 积分管理 store
├── user/           # 用户信息 store
├── index.ts        # store 配置
└── README.md       # 本文档
```

## 核心 Store 模块
- **user**: 用户信息和 VIP 状态管理
- **points**: 积分余额和使用记录管理

## 技术栈
- **Redux Toolkit**: 现代化 Redux 状态管理
- **createAsyncThunk**: 异步 action 处理
- ** createSelector**: 记忆化选择器

## 状态管理模式
- **集中式管理**: 所有全局状态统一管理
- **异步处理**: 完整的异步操作状态流程
- **类型安全**: 完整的 TypeScript 类型定义
- **性能优化**: 记忆化选择器和状态分割

## 关联文件
- [user store design](./user/design.md)
- [points store design](./points/design.md)
- @see apps/ai-chat/src/store/