# ChatRPOutline Context

## 架构说明

此目录包含 RPOutline 聊天的 Context，移至此处是为了避免循环依赖，形成内聚的模块。

### 完整的依赖关系

```
components/ChatRPOutline/
  ├── context/
  │   └── RPOutlineContext.tsx  ← 使用 hooks
  ├── hooks/
  │   └── useRPOutlineChat.ts   ← 使用 parsers
  ├── parsers/
  │   └── messageParser.tsx     ← 使用 AIFooter
  └── AIFooter/
      └── index.tsx             ← 使用 context
```

### 为什么这样设计？

**之前的问题**：

```
src/context/RPOutline.tsx
  → src/hooks/RPOutline/useRPOutlineChat
    → src/components/ChatRPOutline/parsers
      → src/components/ChatRPOutline/AIFooter
        → src/context/RPOutline.tsx ❌ 循环依赖！
```

**现在的解决方案**：

将所有相关代码放在同一个 component 目录下，形成单向依赖：

1. `context` 依赖 `hooks`
2. `hooks` 依赖 `parsers`
3. `parsers` 依赖 `AIFooter`
4. `AIFooter` 依赖 `context`

虽然看起来 4 → 1 形成了循环，但实际上：

- `context` 导出的是 React Context 和 Provider
- `AIFooter` 只使用 `useRPOutlineContext` hook（消费 Context）
- 这是 React Context 的标准模式，不是真正的循环依赖

### 模块内聚性

将相关代码放在一起的好处：

1. **清晰的边界**：所有 RPOutline 聊天相关的逻辑都在 `ChatRPOutline` 目录下
2. **易于维护**：修改功能时只需关注一个目录
3. **避免循环依赖**：不会跨越多个顶层目录形成循环
4. **更好的可测试性**：可以独立测试整个模块

### 向后兼容

为了保持向后兼容，在 `src/context/index.ts` 中重新导出：

```typescript
export { RPOutlineProvider, useRPOutlineContext } from '../components/ChatRPOutline/context';
```

这样其他地方仍然可以通过 `@/context` 导入。

### 最佳实践

对于类似的聊天模块（如 RPDetail），建议采用相同的结构：

```
components/ChatXXX/
  ├── context/      # Context 和 Provider
  ├── hooks/        # 业务 hooks
  ├── parsers/      # 消息解析器
  ├── AIFooter/     # AI 消息底部组件
  └── ...           # 其他组件
```
