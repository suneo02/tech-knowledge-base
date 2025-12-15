# Sender

聊天发送器组件，支持文件上传、引用和消息发送

## 目录结构

```
Sender/
├── hooks/                          # Hook 逻辑模块
│   ├── useChatFileManager.ts       # 文件管理（Facade 模式）
│   ├── useChatFileCollection.ts    # 文件状态管理
│   ├── useFileReferenceManager.ts  # 文件引用管理
│   ├── useFileReferenceParser.ts   # 文件引用解析（策略模式）
│   ├── useFileSuggestion.ts        # 文件建议逻辑
│   ├── useSendMessage.ts           # 消息发送逻辑
│   └── index.ts                    # 统一导出
├── DragUpload.tsx                  # 拖拽上传组件
├── Footer.tsx                      # 底部工具栏组件
├── index.tsx                       # 主组件
└── type.ts                         # 类型定义
```

## 关键说明

- **useChatFileManager.ts**: 统一管理上传文件和引用文件（Facade 模式）
- **useFileReferenceParser.ts**: 解析文本中的 @文件引用（策略模式）
- **useFileSuggestion.ts**: 处理文件引用的自动补全
- **useSendMessage.ts**: 封装消息发送逻辑
- 采用多种设计模式（策略、Facade、观察者、组合）提升可维护性

## 依赖关系

index.tsx → hooks → 文件管理 API
