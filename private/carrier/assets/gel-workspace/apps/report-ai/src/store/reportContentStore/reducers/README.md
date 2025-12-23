# Reducers

Redux reducers 模块化组织，按数据分层与功能职责分离。

## 目录结构

```
reducers/
├── index.ts                     # 统一导出所有 reducers
├── canonicalReducers.ts         # Canonical 层操作（章节列表、报告信息）
├── draftTreeReducers.ts         # Draft 层操作（文档草稿、树结构）
├── chapterStateReducers.ts      # 章节前端状态（锁定、epoch）
├── chapterOperationReducers.ts  # 章节操作编排（启动、请求管理）
├── hydrationReducers.ts         # 重注水控制（任务调度、操作追踪）
├── fileStatusReducers.ts        # 文件状态管理
├── reportFilesReducers.ts       # 报告级文件列表
├── uiControlReducers.ts         # UI 控制层操作
├── globalOp/                    # GlobalOp 操作（非 AIGC）
│   ├── index.ts                 # GlobalOp reducers 统一导出
│   ├── shared.ts                # 共享工具函数
│   └── serverLoading.ts         # 服务器加载
└── aigc/                        # AIGC 操作（生成与改写）
    ├── index.ts                 # AIGC reducers 统一导出
    ├── shared.ts                # 共享工具函数
    ├── chapterOperation.ts      # 章节操作编排
    ├── generation.ts            # 全文生成 + 多章节生成
    ├── chapterRegeneration.ts   # 单章节重生成
    └── textRewrite.ts           # 文本改写
```

## 核心模块

**canonicalReducers** - Canonical 层

- 管理服务器返回的唯一真相
- 章节列表、报告信息的更新

**draftTreeReducers** - Draft 层

- 管理用户编辑的实时结构
- 文档草稿、树结构、保存状态

**aigc/** - AIGC 操作

- 全文生成、多章节生成、单章节重生成
- 文本改写的生命周期管理
- 共享工具函数避免重复逻辑

**hydrationReducers** - 重注水控制

- 注水任务调度
- 章节操作追踪（correlationId）

**chapterOperationReducers** - 章节操作编排

- 统一的章节操作启动逻辑
- 请求状态管理（幂等控制）

## 依赖关系

```
types (类型定义)
  ↓
各个 reducer 模块
  ↓
index.ts (合并导出)
  ↓
slice.ts (创建 Redux slice)
```

## 相关文档

- @see [数据层指南](../../../docs/RPDetail/ContentManagement/data-layer-guide.md)
- @see [生命周期与控制](../../../docs/RPDetail/ContentManagement/lifecycle-flow.md)
- @see [GlobalOp Reducers](./globalOp/README.md)
- @see [AIGC Reducers](./aigc/README.md)
