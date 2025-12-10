# AI Chat 问题排查指南

## 问题分类

| 类型 | 常见问题 | 解决方案 |
|------|----------|----------|
| 环境配置 | 依赖冲突、配置错误 | 检查依赖、验证配置 |
| 网络连接 | API失败、请求超时 | 检查网络、重试机制 |
| 渲染显示 | 消息异常、样式错误 | 验证数据、检查样式 |
| 性能问题 | 加载缓慢、内存过高 | 优化缓存、虚拟滚动 |
| 权限安全 | 访问不足、认证失败 | 检查权限、重新认证 |

## 常见问题

### 组件加载失败
**症状**: `TypeError: Cannot read properties of undefined (reading 'AIChat')`
```bash
pnpm install --force
import { AIChat } from '@gel/ui'; // ✅ 正确
```

### API请求失败
**症状**: `Network Error`, `401 Unauthorized`
```typescript
// 检查配置
console.log('API URL:', config.api.baseURL);
// 验证token
const token = localStorage.getItem('auth_token');
if (!token) redirectToLogin();
```

### 消息渲染异常
**症状**: `Invalid message format`
```typescript
// 验证消息格式
const validateMessage = (msg) => ['id', 'type', 'content', 'timestamp'].every(field => field in msg);
// 错误边界
<ErrorBoundary fallback={<div>渲染失败</div>}>
  <MessageComponent message={message} />
</ErrorBoundary>
```

### 流式响应问题
**症状**: `Stream connection closed`
```typescript
// 流式数据处理
const handleStream = async (response) => {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = JSON.parse(decoder.decode(value));
      if (validateChunk(chunk)) updateMessage(chunk);
    }
  } catch (error) {
    if (error.name !== 'AbortError') handleStreamError(error);
  }
};
```

### 性能问题
**症状**: 页面卡顿、内存过高
```typescript
// 虚拟滚动
<VirtualList data={messages} height={600} itemHeight={80} itemKey="id" />
// 防抖更新
const debouncedMessages = useDebounce(messages, 300);
```

## 调试工具

```typescript
// 开发调试
if (process.env.NODE_ENV === 'development') {
  window.__AI_CHAT_DEBUG__ = {
    getState: () => chatStore.getState(),
    clearState: () => chatStore.clear(),
  };
}

// 错误监控
<ErrorBoundary fallback={<div>组件错误</div>} onError={reportError}>
  <ChatComponent />
</ErrorBoundary>
```

---

*相关实现: `src/utils/errorHandling.ts`*