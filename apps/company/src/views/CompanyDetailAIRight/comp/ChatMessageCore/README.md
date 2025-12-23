# ChatMessageCore - AI 聊天核心组件

企业详情页 AI 对话的核心组件，提供完整的聊天交互能力。

## 目录结构

```
ChatMessageCore/
├── hooks/                          # 自定义 hooks
│   ├── index.ts                    # hooks 导出
│   └── useVirtualChat.ts           # 虚拟滚动 hook
├── SelectWithIcon/                 # 带图标的选择器组件
│   ├── index.tsx
│   └── index.module.less
├── ChatMessageCore.tsx             # 核心组件实现
├── ChatMessageCore.module.less     # 组件样式
├── chatMessageVariable.less        # 样式变量
└── index.tsx                       # 组件入口（包装层）
```

## 核心文件

- **index.tsx**: 组件入口，集成 `useChatBase` 和 `useChatRestore`，处理聊天状态和历史消息
- **ChatMessageCore.tsx**: 核心 UI 实现，包含消息列表、输入框、虚拟滚动等
- **hooks/useVirtualChat.ts**: 虚拟滚动优化，提升大量消息场景下的性能

## 功能特性

- 流式消息响应
- 历史消息恢复（分页加载）
- 虚拟滚动优化（处理大量消息）
- 消息重发/取消
- Markdown 渲染
- 代码高亮

## 依赖关系

```
index.tsx (ChatMessageBase)
  ├─> useChatBase (ai-ui)          # 聊天基础能力
  ├─> useChatRestore (ai-ui)       # 历史消息恢复
  └─> ChatMessageCore.tsx
       ├─> useVirtualChat           # 虚拟滚动
       └─> SelectWithIcon           # 选择器组件
```

**核心依赖**:

- `ai-ui`: 提供 `useChatBase`、`useChatRestore`、`ChatRoomProvider` 等
- `gel-api`: 聊天接口调用
- `@/components/markdown`: Markdown 渲染

## 使用示例

```tsx
import { ChatMessageBase } from './comp/ChatMessageCore'

;<ChatMessageBase entityType="company" entityName="小米科技有限责任公司" initialMessage="这家公司的主营业务是什么？" />
```

## 性能优化

- 使用 `React.lazy` 延迟加载，优化首屏性能
- 虚拟滚动处理大量消息
- `useMemo` 缓存组件属性
- 消息列表增量更新

## 相关文档

- [AI UI 组件库](../../../../../../packages/ai-ui/README.md)
- [聊天接口文档](../../../../../../docs/api/chat-api.md)
- [React 性能优化规范](../../../../../../docs/rule/react-rule.md#性能优化)
