# AI Chat 集成指南

## 快速开始

### 安装与集成
```bash
pnpm add @gel/ui gel-util gel-api
```

```typescript
import { AIChatProvider, AIChat } from '@gel/ui';

function App() {
  return (
    <AIChatProvider config={chatConfig}>
      <AIChat sessionId="session-123" />
    </AIChatProvider>
  );
}
```

### 基础配置
```typescript
export const chatConfig = createChatConfig({
  api: { baseURL: process.env.API_BASE_URL },
  features: { enableSuggestions: true },
  theme: { mode: 'light', primaryColor: '#1890ff' },
});
```

## API集成

### 请求处理
```typescript
export const chatHandler = createChatHandler({
  preprocess: async (input) => ({
    content: input.content.trim(),
    attachments: input.attachments || [],
  }),
  streamRequest: async (input) => {
    const response = await fetch('/api/chat/stream', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return response.body;
  },
});
```

### 认证配置
```typescript
export const authProvider = {
  getToken: () => localStorage.getItem('auth_token'),
  refreshToken: async () => {
    const { token } = await fetch('/api/auth/refresh').then(r => r.json());
    localStorage.setItem('auth_token', token);
    return token;
  },
};
```

## 组件定制

### 自定义渲染器
```typescript
export class CustomRenderer extends MessageRenderer {
  canRender(message) { return message.type === 'custom-chart'; }
  render(message) {
    return <div className="custom-chart"><ChartRenderer data={message.data} /></div>;
  }
}
MessageRendererRegistry.register('custom-chart', CustomRenderer);
```

### 自定义输入
```typescript
export const CustomInput = ({ value, onChange, onSend }) => (
  <div className="custom-input">
    <TextArea value={value} onChange={onChange} placeholder="请输入您的问题..." />
    <Button type="primary" onClick={() => onSend(value)} disabled={!value.trim()}>发送</Button>
  </div>
);
```

## 错误处理

```typescript
// 错误边界
<ErrorBoundary fallback={<div>组件错误</div>} onError={reportError}>
  <ChatComponent />
</ErrorBoundary>

// 全局处理
setupGlobalErrorHandling({
  handlers: {
    'NETWORK_ERROR': () => message.error('网络异常'),
    'AUTH_ERROR': () => redirectToLogin(),
  },
});
```

## 性能优化

```typescript
// 懒加载
const ChatSidebar = lazy(() => import('./ChatSidebar'));

// 虚拟滚动
<VirtualList data={messages} height={600} itemHeight={80} itemKey="id" />
```

## 部署配置

```bash
VITE_API_BASE_URL=https://api.example.com
VITE_CHAT_TIMEOUT=30000
VITE_ENABLE_ANALYTICS=true
```

---

*相关实现: `src/examples/`*