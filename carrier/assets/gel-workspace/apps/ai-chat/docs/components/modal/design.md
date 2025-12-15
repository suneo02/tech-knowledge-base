# SmartFillModal 组件设计文档

## 概述
AI 生成表格数据的弹窗组件，提供模型选择、工具配置、提示词编辑等功能，帮助用户通过 AI 模型自动填充表格数据。

## 功能架构

```mermaid
graph TB
    A[SmartFillModal] --> B[模板查看]
    A --> C[模型选择]
    A --> D[工具配置]
    A --> E[提示词编辑]
    A --> F[自动更新设置]

    B --> G[Carousel 轮播]
    C --> H[AI 模型列表]
    D --> I[工具开关]
    E --> J[Mentions 引用]
    F --> K[更新控制]

    L[表格列配置] --> E
```

## 核心功能
- ✅ **模板浏览**: Carousel 轮播展示模板
- ✅ **模型选择**: 支持多种 AI 模型
- ✅ **工具配置**: 可选工具开关控制
- ✅ **智能提示词**: 引用表格列生成精准提示
- ✅ **自动更新**: 支持数据自动刷新

## 交互流程

```mermaid
sequenceDiagram
    participant U as 用户
    participant M as SmartFillModal
    participant S as Carousel
    participant P as 提示词编辑器
    participant A as AI 模型

    U->>M: 打开弹窗
    M->>S: 显示第一页
    U->>S: 浏览模板
    U->>M: 切换到配置页
    M->>P: 显示编辑器
    U->>P: 编辑提示词
    P->>A: 引用表格列
    U->>M: 确认生成
    M->>A: 调用 AI API
    A->>M: 返回生成数据
    M->>U: 关闭弹窗
```

## 接口说明

### 主要参数
| 参数 | 类型 | 说明 |
|------|------|------|
| open | boolean | 控制弹窗显示 |
| onCancel | () => void | 关闭回调 |
| onOk | () => void | 确认回调 |
| columns | ExtendedColumnDefine[] | 表格列配置 |

## 关联文件
- @see apps/ai-chat/src/components/modal/SmartFillModal.tsx
- @see [MultiTable design](../MultiTable/design.md)
