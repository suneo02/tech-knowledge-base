# 大纲文件解析状态轮询 - 技术设计 v1

> 回链：[任务概览](./README.md)  
> 状态：🚧 设计中

## 整体架构

```
ChatOutline 页面
  └─ RPOutlineProvider (Context)
      ├─ ChatRPOutlineMessages (消息展示)
      └─ OutlineFilePollingController (新增)
          └─ useOutlineFilePolling (新增 Hook)
              └─ useFileStatusPolling (复用现有)
```

## 核心模块

### 1. 文件提取工具

**位置**: `src/utils/outlineFileExtractor.ts`

**职责**: 从大纲消息中提取待解析的文件

**输入**: 大纲消息列表  
**输出**: 待解析文件 ID 列表

### 2. 大纲文件轮询 Hook

**位置**: `src/hooks/RPOutline/useOutlineFilePolling.ts`

**职责**:

- 调用文件提取工具获取待解析文件
- 使用 `useFileStatusPolling` 进行轮询
- 处理状态更新回调

**依赖**:

- `useFileStatusPolling` (已有)
- `useRPOutlineContext` (已有)
- 文件提取工具 (新增)

### 3. 轮询控制器组件

**位置**: `src/components/ChatRPOutline/OutlineFilePollingController.tsx`

**职责**:

- 无 UI 的纯逻辑组件
- 集成轮询 Hook
- 更新 Context 中的消息状态

### 4. Context 扩展

**位置**: `src/context/RPOutline.tsx`

**改动**:

- 添加 `updateFileStatus` 方法
- 支持批量更新文件状态

## 数据流

```
1. 用户上传文件
   ↓
2. 文件添加到消息中（status: PENDING）
   ↓
3. OutlineFilePollingController 检测到待解析文件
   ↓
4. useOutlineFilePolling 启动轮询
   ↓
5. useFileStatusPolling 调用 API
   ↓
6. 收到状态更新
   ↓
7. updateFileStatus 更新消息中的文件状态
   ↓
8. UI 重新渲染显示最新状态
   ↓
9. 所有文件完成，停止轮询
```

## 状态管理

### 文件状态枚举

使用 `gel-api` 中的 `RPFileStatus`:

- `PENDING`: 待处理
- `PROCESSING`: 处理中
- `FINISHED`: 已完成
- `FAILED`: 失败

### 轮询配置

| 配置项            | 值   | 说明                 |
| ----------------- | ---- | -------------------- |
| pollingInterval   | 3000 | 轮询间隔（毫秒）     |
| pollingWhenHidden | true | 页面隐藏时继续轮询   |
| retryCount        | 3    | 失败重试次数         |
| debounceWait      | 300  | 防抖等待时间（毫秒） |

## 关键决策

1. **复用现有 Hook**

   - 优点：减少重复代码，保持一致性
   - 实现：创建适配层连接大纲 Context

2. **无 UI 控制器组件**

   - 优点：逻辑与 UI 分离，易于测试
   - 实现：纯逻辑组件，挂载在 ChatOutline 页面

3. **批量更新状态**
   - 优点：减少渲染次数，提升性能
   - 实现：一次 API 调用更新多个文件状态

## 错误处理

| 错误场景       | 处理方式                     |
| -------------- | ---------------------------- |
| API 调用失败   | 重试 3 次，失败后停止轮询    |
| 网络异常       | 显示错误提示，允许手动重试   |
| 文件 ID 不存在 | 跳过该文件，继续轮询其他文件 |

## 性能优化

- 只轮询未完成的文件
- 使用防抖避免频繁请求
- 批量更新减少渲染次数
- 文件完成后立即从轮询列表移除

## 相关文档

- [useFileStatusPolling Hook](../../../src/hooks/useFileStatusPolling.ts)
- [RPOutline 类型定义](../../../src/types/chat/RPOutline.ts)

## 更新记录

| 日期       | 修改人 | 更新内容        |
| ---------- | ------ | --------------- |
| 2025-01-13 | Kiro   | 创建技术设计 v1 |
