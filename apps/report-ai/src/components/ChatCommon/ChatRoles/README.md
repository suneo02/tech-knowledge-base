# ChatRoles 组件

## 概述

ChatRoles 目录包含聊天消息中使用的各种角色组件配置。

## 组件列表

### Progress 进度消息组件

展示 AIGC 生成过程中的实时进度信息。

#### 功能特性

- 显示当前步骤名称
- 展示进度百分比（0-100）
- 动画效果的进度条
- 轻量级视觉设计

#### 使用示例

```typescript
import { reportProgressRole } from './progress';

// 在聊天消息配置中使用
const roles = {
  progress: reportProgressRole,
  // ... 其他角色
};
```

#### Storybook

查看 `progress.stories.tsx` 了解更多使用示例：

- 默认状态
- 初始状态（0%）
- 进行中状态（50%）
- 即将完成（75%）
- 完成状态（100%）
- 长文本步骤名称
- 典型流程展示
- 聊天上下文中的展示
- 响应式布局测试

#### 类型定义

```typescript
type ProgressMessage = {
  currentStepCode: string; // 当前步骤代码
  currentStepName: string; // 当前步骤名称
  progressPercentage: number; // 进度百分比 (0-100)
};
```

## 开发指南

### 添加新的角色组件

1. 创建组件文件：`{role-name}.tsx`
2. 创建样式文件：`{role-name}.module.less`
3. 创建 Story 文件：`{role-name}.stories.tsx`
4. 导出角色配置：`export const {roleName}Role: AntRoleType<...>`

### Story 编写规范

参考 `progress.stories.tsx`，包含以下内容：

- 组件描述和使用场景
- 基本状态展示
- 边界情况测试
- 实际使用场景模拟
- 响应式布局测试

## 相关文档

- [测试规范](../../../../../docs/rule/code-testing-vitest-storybook-rule.md)
- [React 规范](../../../../../docs/rule/code-react-component-rule.md)
- [样式规范](../../../../../docs/rule/code-style-less-bem-rule.md)

