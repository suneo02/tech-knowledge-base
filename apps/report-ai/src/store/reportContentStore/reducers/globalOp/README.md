# GlobalOp Reducers

全局操作状态管理，处理非 AIGC 的全局操作。

## 目录结构

```
globalOp/
├── index.ts          # 统一导出
├── shared.ts         # 共享工具函数（设置 GlobalOp 状态）
└── serverLoading.ts  # 服务器加载操作（章节加载）
```

## 核心文件

**shared.ts** - 共享工具函数

- `setGlobalOp`: 设置 GlobalOp 为指定状态
- `setGlobalOpToIdle`: 设置为 idle
- `setGlobalOpToError`: 设置为 error
- `setGlobalOpToServerLoading`: 设置为 server_loading

**serverLoading.ts** - 服务器加载

- 章节加载的生命周期管理
- 加载成功后触发全量注水

## 依赖关系

```
shared.ts (工具函数)
  ↓
serverLoading.ts (服务器加载)
  ↓
index.ts (统一导出)
```

## 与 AIGC 的区别

- **globalOp/**: 非 AIGC 的全局操作（如服务器加载）
- **aigc/**: AIGC 相关操作（生成、改写）

## 相关文档

- @see [生命周期与控制](../../../../docs/RPDetail/ContentManagement/lifecycle-flow.md)
