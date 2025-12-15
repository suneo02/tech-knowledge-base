# CompanyDetailAIRight - 企业详情 AI 右侧栏页面

企业详情页面的 AI 增强版本，采用左右分栏布局，左侧展示企业详细信息，右侧提供 AI 问企业对话功能。

## 目录结构

```
CompanyDetailAIRight/
├── comp/                           # 组件目录
│   ├── AIConversationIframe/       # AI 对话 iframe 组件（已废弃）
│   ├── ChatMessageCore/            # AI 聊天核心组件
│   ├── OperatorHeader/             # 顶部操作栏组件
│   └── ScrollContent/              # 滚动容器组件
├── CompanyDetail.tsx               # 企业详情主体内容
├── Left.tsx                        # 左侧布局容器
├── Right.tsx                       # 右侧 AI 对话容器
├── index.tsx                       # 页面入口
├── corpDetail.less                 # 企业详情样式
└── index.module.less               # 页面布局样式
```

## 核心文件

- **index.tsx**: 页面入口，管理左右分栏布局、宽度调整、显隐控制
- **Left.tsx**: 左侧容器，包含顶部操作栏和企业详情内容
- **Right.tsx**: 右侧容器，提供 AI 对话功能，支持宽度切换（25%/50%）
- **CompanyDetail.tsx**: 企业详情核心逻辑，包含菜单导航、模块加载、数据获取

## 依赖关系

```
index.tsx
  ├─> Left.tsx
  │    ├─> OperatorHeader (顶部操作栏)
  │    └─> CompanyDetail (企业详情)
  └─> Right.tsx
       └─> ChatMessageCore (AI 聊天)
            └─> ai-ui (聊天基础能力)
```

**上游依赖**:

- `ai-ui`: AI 聊天基础组件和 hooks
- `@/components/company/*`: 企业信息展示组件
- `@/api/*`: 企业数据接口

**下游使用**:

- 企业详情页路由入口
- F9 终端嵌入页面

## 相关文档

- [AI 聊天组件设计](./comp/ChatMessageCore/README.md)
- [企业详情菜单配置](../../Company/menu/README.md)
- [React 规范](../../../../../docs/rule/react-rule.md)
- [TypeScript 规范](../../../../../docs/rule/typescript-rule.md)
