# AI 相关场景题

> 前端 AI 应用开发的核心场景与实践，涵盖 Agent 架构、通信模式、上下文管理等关键技术点。

## Agent 服务搭建

### 核心思路

Agent 不同于简单的 LLM 调用，它需要具备**理解、规划、执行、反馈**的完整能力。前端搭建时需要从架构选型、安全性、成本控制和用户体验四个维度考虑。

### 三种架构方案对比

| 架构类型     | 适用场景             | 核心优势             | 主要限制               |
| ------------ | -------------------- | -------------------- | ---------------------- |
| **纯前端**   | 原型验证、个人项目   | 部署简单、响应快     | API Key 暴露、性能受限 |
| **BFF 架构** | 生产环境、企业应用   | 安全可控、功能完整   | 需维护后端服务         |
| **微服务**   | 大型应用、多团队协作 | 高度解耦、可独立扩展 | 架构复杂、运维成本高   |

**推荐方案**：生产环境优先选择 BFF 架构，使用 LangChain.js 在 Node.js 后端构建 Agent 能力，前端通过 SSE 实现流式交互。

### LangChain.js 快速入门

LangChain.js 是专为 JavaScript/TypeScript 设计的 AI 应用开发框架，提供了 Agent 开发的完整工具链：

- **LLM 集成**：统一接口支持 OpenAI、Anthropic、Google 等多个提供商
- **Agent 框架**：内置 ReAct、Plan-and-Execute 等多种模式
- **工具系统**：预置常用工具（搜索、计算器等），支持自定义扩展
- **记忆管理**：支持对话历史、向量存储、摘要记忆等策略

核心优势是快速搭建原型，避免从零实现基础能力。但生产环境必须通过后端代理保护 API Key。

### 关键设计要点

**安全性**：API Key 必须通过后端代理，绝不暴露在前端。实现用户认证、输入校验、敏感数据加密。

**成本控制**：实现请求限流和缓存机制，根据任务复杂度选择合适模型（简单任务用 GPT-3.5，复杂任务才用 GPT-4），监控 Token 使用量并设置预算告警。

**用户体验**：使用 SSE 实现流式响应（打字机效果），提供清晰的加载状态，支持请求取消和断点续传。

**可扩展性**：采用插件化工具系统，配置化 Prompt 管理，模块化设计便于迭代。

**可观测性**：记录完整对话日志，监控执行步骤和耗时，建立告警机制及时发现异常。

### 实现示例

**前端流式对话**（使用 SSE 实现打字机效果）：

```typescript
class AgentService {
  async *chatStream(message: string, sessionId: string) {
    const response = await fetch("/api/agent/chat/stream", {
      method: "POST",
      body: JSON.stringify({ message, sessionId }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value);
      for (const line of chunk.split("\n")) {
        if (line.startsWith("data: ")) {
          yield JSON.parse(line.slice(6));
        }
      }
    }
  }
}
```

**后端 Agent 核心逻辑**（使用 LangChain.js）：

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { DynamicTool } from "@langchain/core/tools";

// 1. 定义工具
const tools = [
  new DynamicTool({
    name: "search",
    description: "搜索互联网获取最新信息",
    func: async (query) => await searchAPI(query),
  }),
  new DynamicTool({
    name: "calculator",
    description: "执行数学计算",
    func: async (expr) => eval(expr).toString(),
  }),
];

// 2. 创建 Agent
const agent = await createOpenAIFunctionsAgent({
  llm: new ChatOpenAI({ modelName: "gpt-4" }),
  tools,
  prompt: ChatPromptTemplate.fromMessages([
    ["system", "你是一个有用的助手，可以使用工具来帮助用户"],
    ["human", "{input}"],
    ["placeholder", "{agent_scratchpad}"],
  ]),
});

// 3. 执行任务
const executor = new AgentExecutor({ agent, tools });
const result = await executor.invoke({
  input: "搜索今天的天气，然后计算华氏度转摄氏度",
});
```

LangChain.js 自动处理工具选择、参数解析、执行流程等复杂逻辑，大幅简化开发。

### 核心组件说明

**工具系统**：Agent 与外部世界交互的桥梁。需要定义清晰的接口（名称、描述、参数），让 LLM 理解何时使用哪个工具。常见类型包括搜索、计算器、数据库查询、API 调用等。

**状态管理**：前端需管理对话历史、执行状态（空闲/思考/执行工具/生成回复）、会话信息、错误重试等。可使用 Zustand、Redux 或 React Context。

**通信协议**：HTTP 适合简单请求-响应，SSE 适合流式响应（打字机效果），WebSocket 适合实时双向交互，轮询作为降级方案。

### 常见追问

**Q: 如何处理并发请求？**

三种策略：队列机制（同一用户串行处理）、并发限制（设置最大并发数如 3 个）、会话隔离（不同用户并发，同一会话串行）。需考虑请求优先级、超时处理、取消机制。

**Q: 如何优化响应速度？**

核心策略：流式响应（SSE 打字机效果）、智能缓存（相似问题复用结果）、并行执行（独立工具调用并行）、模型选择（简单任务用 GPT-3.5）、Prompt 优化（精简减少 Token）。

**Q: 生产环境最佳实践？**

关键点：LangChain.js 部署在 Node.js 后端（不在浏览器）、后端代理保护 API Key、SSE 流式传输执行过程、完善错误处理和降级方案、实现限流和缓存控制成本、根据业务开发自定义工具。

架构示例：前端 React → 后端 Express + LangChain.js → OpenAI API

**Q: 如何保证 API Key 安全？**

绝不在前端硬编码。正确做法：所有 LLM 调用通过后端代理、前端请求携带用户 Token、后端验证权限并限制调用频率、API Key 存储在后端环境变量、定期轮换密钥。开发环境使用 .env 文件并加入 .gitignore。

## Agent 通信方式

### 核心思路

多 Agent 协作需要选择合适的通信模式。根据场景不同，可以选择直接通信（简单快速）、消息队列（异步解耦）、发布订阅（广播通知）或协调者模式（集中管理）。

### 四种通信模式

**1. 直接通信**：Agent 之间直接调用 API，适合简单的点对点交互。

```typescript
class SearchAgent {
  async processQuery(query: string) {
    const searchResults = await this.search(query);

    // 直接调用分析 Agent
    const analysis = await fetch("http://analysis-agent:3002/api/message", {
      method: "POST",
      body: JSON.stringify({ data: searchResults }),
    }).then((r) => r.json());

    return analysis;
  }
}
```

**2. 消息队列**：通过队列实现异步通信，解耦 Agent 之间的依赖。

```typescript
class MessageBus extends EventEmitter {
  publish(channel: string, message: any) {
    this.emit(channel, message);
  }

  subscribe(channel: string, handler: (message: any) => void) {
    this.on(channel, handler);
  }
}

class Agent {
  constructor(private name: string, private bus: MessageBus) {
    this.bus.subscribe(`agent:${this.name}`, this.handleMessage.bind(this));
  }

  sendTo(targetAgent: string, message: any) {
    this.bus.publish(`agent:${targetAgent}`, {
      from: this.name,
      data: message,
      timestamp: Date.now(),
    });
  }
}
```

**3. 发布订阅**：使用 Redis Pub/Sub 实现广播和主题订阅，适合一对多通知场景。

**4. 协调者模式**：通过中央协调器管理所有 Agent 通信和任务编排。

```typescript
class AgentCoordinator {
  private agents = new Map<string, Agent>();

  registerAgent(agent: Agent) {
    this.agents.set(agent.id, agent);
  }

  async orchestrate(workflow: Workflow) {
    const results = [];
    for (const step of workflow.steps) {
      const agent = this.agents.get(step.agentId);
      const result = await agent!.execute(step.task);
      results.push(result);
    }
    return results;
  }
}

// 使用
const coordinator = new AgentCoordinator();
coordinator.registerAgent(new SearchAgent("search-1"));
coordinator.registerAgent(new AnalysisAgent("analysis-1"));

await coordinator.orchestrate({
  steps: [
    { agentId: "search-1", task: "search for AI news" },
    { agentId: "analysis-1", task: "analyze results" },
  ],
});
```

### 通信协议对比

| 协议          | 适用场景      | 优点             | 缺点             |
| ------------- | ------------- | ---------------- | ---------------- |
| HTTP/REST     | 简单请求-响应 | 简单、广泛支持   | 无法推送、开销大 |
| WebSocket     | 实时双向通信  | 低延迟、双向     | 连接管理复杂     |
| gRPC          | 微服务间通信  | 高性能、类型安全 | 学习曲线陡峭     |
| Message Queue | 异步任务处理  | 解耦、可靠       | 增加系统复杂度   |

### 关键技术点

**消息格式**：定义统一的消息结构，包含 id、from、to、type、payload、timestamp 等字段，支持优先级和回复链。

**错误处理**：实现重试机制（指数退避），最大重试次数 3 次，记录失败原因便于排查。

**消息追踪**：记录消息的完整生命周期（发送、接收、处理、完成），便于调试和监控。

### 常见追问

**Q: 如何保证消息顺序性？**

使用序列号机制：每条消息分配递增的序列号，接收端按序列号排序后处理。或使用单一消息队列保证 FIFO 顺序。

**Q: 如何处理通信超时？**

使用 `Promise.race` 实现超时控制，默认 5 秒超时。超时后触发重试机制或降级处理。

**Q: 如何实现负载均衡？**

两种策略：轮询（Round Robin，依次分配）或最少连接（选择当前负载最低的 Agent）。根据 Agent 的响应时间和成功率动态调整权重。

## Agent vs LLM 区别与优缺点

### 核心区别

LLM 是纯文本生成系统，被动响应用户输入；Agent 是基于 LLM 的自主决策系统，能主动规划、使用工具、执行多步骤任务。

| 维度     | LLM              | Agent                      |
| -------- | ---------------- | -------------------------- |
| **能力** | 文本理解和生成   | 规划、决策、执行、使用工具 |
| **交互** | 单次问答         | 多轮对话、主动行动         |
| **工具** | 不能调用外部工具 | 可调用 API、数据库等       |
| **记忆** | 仅限上下文窗口   | 可持久化长期记忆           |
| **成本** | 低（单次调用）   | 高（多次调用）             |
| **响应** | 快（1-3 秒）     | 慢（5-30 秒）              |

### 使用场景对比

**LLM 适用场景**：文本生成（写作、翻译、摘要）、问答系统、内容分类、情感分析、代码补全。特点是任务简单、不需要外部数据、单次交互即可完成。

**Agent 适用场景**：需要调用外部 API、多步骤复杂任务、需要实时数据、需要持久化记忆、自动化工作流。特点是任务复杂、需要规划、需要工具支持。

### 混合使用策略

实际应用中通常结合两者优势：先用 LLM 快速判断任务复杂度，简单任务直接用 LLM 响应（快速低成本），复杂任务才调用 Agent（功能完整但成本高）。

### 成本与性能对比

**成本**：LLM 单次调用成本低（GPT-4 约 $0.03/1K tokens），Agent 通常是 LLM 的 3-10 倍（需要多次调用：规划、执行、总结等）。

**性能**：LLM 响应快（1-3 秒），Agent 响应慢（5-30 秒，取决于任务复杂度和工具调用次数）。

### 常见追问

**Q: 什么时候应该从 LLM 升级到 Agent？**

当出现以下需求时：需要调用外部 API 或数据库、任务需要多个步骤、需要根据中间结果动态调整策略、需要长期记忆和上下文管理、需要自动化复杂工作流。

**Q: 如何降低 Agent 成本？**

四个策略：缓存相同任务的结果、使用便宜模型（GPT-3.5）做初步规划、只在关键步骤使用高级模型（GPT-4）、优化 Prompt 减少 Token 消耗。

**Q: 如何保证 Agent 可靠性？**

关键措施：验证输入输出、设置超时（如 30 秒）、实现降级策略（Agent 失败时降级到 LLM）、完善错误处理和重试机制、记录完整日志便于排查问题。

## 对话上下文传递

### 核心思路

对话上下文管理的核心挑战是在 Token 限制内保留最有价值的信息。主要策略包括：限制消息数量、Token 优化、智能摘要、分层管理、向量检索。

### 五种管理策略

**1. 基础管理**：限制消息数量（如最近 10 条），超出后移除最旧的消息。适合简单场景。

```typescript
class ConversationContext {
  private messages: Message[] = [];
  private maxMessages = 10;

  addMessage(role: "user" | "assistant", content: string) {
    this.messages.push({ role, content, timestamp: Date.now() });
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages);
    }
  }
}
```

**2. Token 优化**：估算 Token 数量（中文约 1.5 字符/token），超出限制时保留系统消息和最近消息，移除中间旧消息。

**3. 智能摘要**：当消息超过阈值（如 10 条）时，用 LLM 对旧消息生成摘要，只保留摘要和最近消息。适合长对话场景。

**4. 分层管理**：将上下文分为系统级（始终保留）、会话级（用户信息）、对话级（历史消息）、即时级（当前消息），按优先级组合。

**5. 向量检索**：将所有消息存入向量数据库，基于语义相似度检索相关历史，而非简单保留最近消息。适合需要长期记忆的场景。

### 关键技术点

**持久化存储**：短期上下文用 localStorage，大量数据用 IndexedDB，跨设备同步用云端存储（配合 WebSocket 实时同步）。

**压缩算法**：基于重要性评分保留关键消息（用 LLM 评估重要性 0-1），基于相似度去重（相似度 >0.9 视为重复）。

**多会话管理**：使用 Map 管理多个会话，定期清理过期会话（如 1 小时未活动）。

### 常见追问

**Q: 如何处理超长对话？**

三种策略组合：分段摘要（每 10 条消息生成一个摘要）、保留关键消息（包含问题、决策、结论的消息）、保留最近消息（最近 5 条）。最终组合为：摘要 + 关键消息 + 最近消息。

**Q: 如何实现跨设备同步？**

方案：云端存储上下文，通过 API 同步（POST 上传、GET 下载）。实时同步使用 WebSocket，新消息自动推送到所有设备。需处理冲突（如时间戳优先）。

**Q: 如何优化检索性能？**

建立关键词索引：提取消息中的关键词，建立关键词到消息索引的映射。检索时根据查询关键词快速定位相关消息。对于语义检索，使用向量数据库（如 ChromaDB）更高效。

## 扩展阅读

**相关文档**：网络通信（SSE、WebSocket）、性能优化（并发请求处理）

**推荐资源**：

- [LangChain.js 官方文档](https://js.langchain.com/) - 完整 API 和教程
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling) - 工具调用指南
- [Vercel AI SDK](https://sdk.vercel.ai/) - 前端 AI 开发框架

---

最后更新：2024-10
