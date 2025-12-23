# 嵌入式聊天组件

这是一个可通过iframe嵌入到其他应用中的聊天组件。它提供了基本的AI问答功能，但不包含历史会话还原功能。

## 功能特点

- 简洁的聊天界面
- 支持通过URL参数传递初始问题
- 支持开启深度思考模式
- 支持实体关联查询
- 无需登录即可使用
- 无历史会话记录
- 支持通过postMessage监听聊天状态变化

## 使用方法

### 基本嵌入

在你的HTML页面中添加以下代码：

```html
<iframe src="https://您的域名/embed-chat" width="100%" height="600px" frameborder="0"></iframe>
```

### 带初始问题的嵌入

如果你希望在嵌入时自动发送一个初始问题，可以使用initialMsg参数：

```html
<iframe
  src="https://您的域名/embed-chat?initialMsg=请介绍一下你自己"
  width="100%"
  height="600px"
  frameborder="0"
></iframe>
```

### 开启深度思考模式

如果需要开启深度思考模式，可以添加initialDeepthink=1参数：

```html
<iframe
  src="https://您的域名/embed-chat?initialMsg=这个问题比较复杂&initialDeepthink=1"
  width="100%"
  height="600px"
  frameborder="0"
></iframe>
```

### 传递实体类型和名称

如果需要针对特定实体进行提问，可以传递entityType和entityName参数：

```html
<iframe
  src="https://您的域名/embed-chat?initialMsg=分析一下这个公司的竞争优势&entityType=company&entityName=阿里巴巴"
  width="100%"
  height="600px"
  frameborder="0"
></iframe>
```

### 监听聊天状态变化

组件会在聊天状态变化时通过postMessage发送消息，可以通过以下方式监听：

```javascript
window.addEventListener('message', function (event) {
  // 忽略来自React开发者工具的消息
  if (event.data && event.data.source === 'react-devtools-content-script') {
    return
  }

  // 检查是否是聊天状态变化消息
  if (event.data && event.data.type === 'CHAT_STATUS_CHANGE') {
    const isChating = event.data.payload.isChating
    console.log('AI聊天状态:', isChating ? '回答中' : '空闲')

    // 验证消息来源是否是我们的iframe
    const chatIframe = document.getElementById('ai-chat-iframe')
    if (event.source === chatIframe.contentWindow) {
      // 根据状态变化更新UI
      if (isChating) {
        // AI开始回答
        console.log('AI开始回答问题')
      } else {
        // AI回答结束
        console.log('AI回答结束')
      }
    }
  }
})
```

### 处理多个iframe实例

如果页面中有多个嵌入聊天组件的iframe，需要根据消息来源区分：

```javascript
window.addEventListener('message', function (event) {
  // 忽略来自React开发者工具的消息
  if (event.data && event.data.source === 'react-devtools-content-script') {
    return
  }

  if (event.data && event.data.type === 'CHAT_STATUS_CHANGE') {
    const isChating = event.data.payload.isChating

    // 根据消息来源区分不同的iframe
    if (event.source === document.getElementById('iframe1').contentWindow) {
      console.log('iframe1的AI状态:', isChating ? '回答中' : '空闲')
    } else if (event.source === document.getElementById('iframe2').contentWindow) {
      console.log('iframe2的AI状态:', isChating ? '回答中' : '空闲')
    }
  }
})
```

## URL参数说明

| 参数             | 类型   | 说明                             |
| ---------------- | ------ | -------------------------------- |
| initialMsg       | string | 初始问题，将在页面加载后自动发送 |
| initialDeepthink | 0或1   | 是否开启深度思考模式，默认为0    |
| entityType       | string | 实体类型，如company              |
| entityName       | string | 实体名称，如阿里巴巴             |

## 消息格式说明

当聊天状态变化时，组件会向父窗口发送如下格式的消息：

```javascript
{
  type: 'CHAT_STATUS_CHANGE',
  payload: {
    isChating: true | false // true表示AI正在回答，false表示AI空闲
  }
}
```

## 排错指南

### 接收不到消息

如果你在父窗口无法接收到iframe发送的消息，请检查以下几点：

1. 确认没有跨域限制。iframe源域和父窗口需满足同源策略或配置了正确的CORS。
2. 确认事件监听器正确添加，且在iframe加载完成后添加。
3. 过滤掉React开发者工具的消息，其消息格式为 `{source: 'react-devtools-content-script', hello: true}`。
4. 在控制台中添加更详细的日志，检查事件对象的完整信息。

### 消息过滤示例

```javascript
window.addEventListener('message', function (event) {
  // 打印完整的event对象，帮助排查问题
  console.log('收到消息:', {
    origin: event.origin,
    data: event.data,
    source: event.source ? '有来源窗口' : '无来源窗口',
  })

  // 过滤React开发者工具的消息
  if (event.data && event.data.source === 'react-devtools-content-script') {
    return
  }

  // 处理聊天状态消息
  if (event.data && event.data.type === 'CHAT_STATUS_CHANGE') {
    // 处理聊天状态变化
  }
})
```

### 常见问题

1. **消息只包含 `{isTrusted: true}`** - 这可能是因为控制台未完全展开事件对象，尝试展开查看或使用上述方法记录详细信息。
2. **收到多余的开发工具消息** - 使用过滤条件忽略这些消息。
3. **状态变化不触发** - 确认聊天组件中的isChating状态是否正确变化，可以在EmbedChat组件中添加日志。
4. **iframe加载问题** - 确保iframe完全加载后再监听消息，可以在iframe的onload事件中添加监听器。

## 注意事项

1. 嵌入页面需要保证有足够的高度，建议至少600px
2. 如果遇到跨域问题，需要在服务器端配置对应的CORS策略
3. 该组件不会保存聊天历史记录，页面刷新后所有对话将会丢失
4. 接收聊天状态变化的postMessage时，需确保安全检查，验证消息来源
5. 在监听消息时需要过滤掉来自React开发者工具的消息，避免干扰正常的聊天状态监听
6. 在某些浏览器环境中，可能需要添加错误处理，确保消息接收和处理的健壮性
7. 避免在生产环境中使用调试日志，以免泄露敏感信息或影响性能
