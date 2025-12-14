# ChatCommon

聊天通用组件库，提供对话列表、消息发送、Markdown 渲染等基础功能

## 目录结构

```
ChatCommon/
├── Conversation/              # 对话列表组件
│   ├── InfiniteScrollConversations/ # 无限滚动对话列表
│   ├── index.tsx              # 对话列表主组件
│   ├── handle.tsx             # 对话操作处理
│   └── useConversationActions.ts # 对话操作 Hook
├── Sender/                    # 消息发送器
│   ├── hooks/                 # 发送器 Hooks
│   ├── context/               # 发送器上下文
│   ├── index.tsx              # 发送器主组件
│   ├── Header.tsx             # 发送器头部
│   ├── Footer.tsx             # 发送器底部
│   ├── DragUpload.tsx         # 拖拽上传
│   └── type.ts                # 类型定义
├── ChatRoles/                 # 聊天角色组件
│   ├── outlineEditor.tsx      # 大纲编辑器角色
│   ├── outlinePreview.tsx     # 大纲预览角色
│   └── index.ts               # 统一导出
├── markdown/                  # Markdown 渲染
│   └── index.tsx              # Markdown 组件
├── PlaceHolder/               # 占位符组件
│   └── index.tsx              # 占位符
├── UploadMaterial/            # 上传资料组件
│   └── index.tsx              # 上传资料
└── index.ts                   # 统一导出
```

## 核心组件职责

### Conversation

对话列表组件，支持无限滚动、消息展示、操作处理

### Sender

消息发送器，支持文件上传、引用和消息发送

### ChatRoles

聊天角色组件，定义不同角色的消息展示样式

### markdown

Markdown 渲染组件，用于展示格式化的消息内容

## 模块依赖

```
聊天页面
  ├─> Conversation (对话列表)
  │   └─> ChatRoles (角色组件)
  │       └─> markdown (Markdown 渲染)
  └─> Sender (发送器)
      └─> UploadMaterial (上传资料)
```
