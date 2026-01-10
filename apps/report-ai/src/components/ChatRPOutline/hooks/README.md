# ChatRPOutline Hooks

## 架构说明

此目录包含 RPOutline 聊天相关的 hooks，移至此处是为了避免循环依赖。

### 依赖关系

```
components/ChatRPOutline/
  ├── hooks/
  │   └── useRPOutlineChat.ts  ← 使用 parser 和 AIFooter
  ├── parsers/
  │   └── messageParser.tsx    ← 使用 AIFooter 组件
  └── AIFooter/
      └── index.tsx            ← 使用 Context

context/RPOutline.tsx           ← 使用 hooks/useRPOutlineChat
```

### 为什么这样设计？

**问题**：之前 hook 在 `src/hooks/RPOutline/` 目录下，导入了 `components/ChatRPOutline/parsers`，而 parser 又导入了 `AIFooter` 组件，`AIFooter` 使用了 `Context`，`Context` 又导入了 hook，形成循环依赖。

**解决方案**：将 hook 移动到 component 目录下，形成单向依赖链：

1. `hooks/useRPOutlineChat` 依赖 `parsers` 和其他工具
2. `parsers` 依赖 `AIFooter` 组件
3. `AIFooter` 依赖 `Context`
4. `Context` 依赖 `hooks/useRPOutlineChat`

这样依赖关系清晰，没有循环。

### 导出

为了保持向后兼容，在 `src/hooks/index.ts` 中重新导出了这个 hook：

```typescript
export { useRPOutlineChat } from '../components/ChatRPOutline/hooks';
```

这样其他地方仍然可以通过 `@/hooks` 导入。
