# 企业详情页（AI增强版）设计文档

## 概览

企业详情页AI增强版在传统企业详情展示基础上，集成右侧AI智能对话面板，形成上左右三区域布局。

**功能边界**：企业信息展示 + AI智能问答
**目标人群**：企业尽调人员、投资分析师、风控专员
**关键场景**：企业基础信息查询、财务数据分析、AI智能问答、报告导出

## 信息架构

```mermaid
graph TD
    A[企业详情页] --> B[顶部操作栏]
    A --> C[内容区域]

    C --> D[左侧区域]
    C --> E[右侧AI面板]

    D --> F[企业详情核心]
    F --> G[菜单导航]
    F --> H[数据模块]

    E --> I[AI控制]
    E --> J[对话界面]

    B --> K[企业信息]
    B --> L[操作控制]
```

## 页面蓝图

| 区域 | 展示数据 | 可交互动作 | 可见条件 |
|------|----------|------------|----------|
| **顶部操作栏** | 企业名称、收藏状态 | 收藏/导出/AI切换 | 完整页面模式 |
| **左侧区域** | 企业介绍、菜单导航、数据模块 | 搜索菜单/点击导航/数据交互 | 始终显示 |
| **右侧AI面板** | AI对话界面 | 智能问答/调节宽度/关闭面板 | 可显示/隐藏 |

## 任务流程

### 主要任务流程

```mermaid
flowchart TD
    A[进入企业详情页] --> B[加载企业基本信息]
    B --> C[构建导航菜单]
    C --> D{企业类型判断}

    D -->|普通企业| E[标准模块配置]
    D -->|特殊企业| F[定制化配置]

    E --> G[显示企业数据]
    F --> G
    G --> H[用户交互]

    H --> I{用户操作}
    I -->|浏览数据| J[滚动加载新模块]
    I -->|使用AI| K[开启AI面板问答]
    I -->|导出报告| L[生成企业报告]

    J --> G
    K --> M[AI智能问答]
    L --> N[下载报告]
```

### AI对话流程

```mermaid
stateDiagram-v2
    [*] --> AI面板关闭
    AI面板关闭 --> 用户开启AI: 点击AI按钮
    用户开启AI --> AI面板显示
    AI面板显示 --> 用户提问: 输入问题
    用户提问 --> AI处理: 调用AI服务
    AI处理 --> 显示回答: 展示AI回复
    显示回答 --> 用户提问: 继续对话
    显示回答 --> 用户关闭AI: 点击关闭按钮
    用户关闭AI --> AI面板关闭
```

## 数据与状态

### 核心数据字段

| 字段 | 来源 | 用途 |
|------|------|------|
| `companycode` | URL参数 | 企业标识 |
| `basicNum` | 企业统计API | 控制模块显示 |
| `corpCategory` | 企业类型识别 | 菜单配置 |
| `showRight` | 组件状态 | AI面板显示 |
| `collectState` | 收藏API | 收藏状态 |

### 状态规则

- 企业基本信息：页面级缓存，页面刷新时更新
- 菜单结构：企业类型变化时重新构建
- AI对话历史：会话级保持，页面刷新时清空
- 用户权限：登录状态变化时同步更新

## 组件复用

### 核心组件层级

```
CompanyDetailAIRight @see apps/company/src/views/CompanyDetailAIRight/index.tsx
├── LayoutHeader @see apps/company/src/views/CompanyDetailAIRight/Left.tsx
│   └── OperatorHeader @see apps/company/src/views/CompanyDetailAIRight/comp/OperatorHeader/index.tsx
├── Left @see apps/company/src/views/CompanyDetailAIRight/Left.tsx
│   └── CompanyDetail @see apps/company/src/views/CompanyDetailAIRight/CompanyDetail.tsx
│       ├── CorpDetailMenu @see apps/company/src/views/Company/comp/menu/index.tsx
│       └── CompanyBase @see apps/company/src/components/company/CompanyBase
└── Right @see apps/company/src/views/CompanyDetailAIRight/Right.tsx
    └── ChatMessageCore @see apps/company/src/views/CompanyDetailAIRight/comp/ChatMessageCore/ChatMessageCore.tsx
```

### 组件边界

- **CompanyDetailAIRight**：整体布局协调、状态管理
- **LayoutHeader**：企业信息展示、操作控制
- **CompanyDetail**：菜单导航、数据展示、滚动同步
- **Right**：AI对话界面、面板控制
- **ChatMessageCore**：消息渲染、对话管理

## 相关文档

- [主容器布局设计](./layout-container.md) - 布局管理
- [顶部操作栏设计](./layout-header.md) - 操作控制
- [左侧区域设计](./layout-left.md) - 内容区布局
- [核心业务设计](./layout-middle.md) - 业务逻辑
- [右侧AI面板设计](./layout-right.md) - AI交互