# AI 相关场景题

> 本文档整理前端 AI 应用开发相关的面试题，包括 Agent、LLM 等主题。

## 目录

- [Agent 服务搭建](#agent-服务搭建)
- [Agent 通信方式](#agent-通信方式)
- [Agent vs LLM 区别与优缺点](#agent-vs-llm-区别与优缺点)
- [对话上下文传递](#对话上下文传递)
- [相关知识点](#相关知识点)

---

## Agent 服务搭建 {#agent-服务搭建}

### 问题背景

前端如何搭建 Agent 服务？需要考虑哪些方面？

### 解决方案

前端搭建 Agent 服务主要有以下几种架构方案：

#### 1. 纯前端 Agent（Browser-based）

```typescript
// 使用 LangChain.js 在浏览器中构建 Agent
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { pull } from "langchain/hub";

class FrontendAgent {
  private agent: AgentExecutor;

  async initialize() {
    const llm = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
    });

    const tools = [
      // 定义工具函数
      {
        name: "search",
        description: "搜索相关信息",
        func: async (query: string) => {
          // 实现搜索逻辑
          return await this.searchAPI(query);
        },
      },
    ];

    const prompt = await pull("hwchase17/openai-functions-agent");
    const agent = await createOpenAIFunctionsAgent({ llm, tools, prompt });
    this.agent = new AgentExecutor({ agent, tools });
  }

  async run(input: string) {
    return await this.agent.invoke({ input });
  }
}
```

#### 2. BFF（Backend for Frontend）架构

```typescript
// 前端调用层
class AgentService {
  private baseURL = "/api/agent";

  async chat(message: string, sessionId: string) {
    const response = await fetch(`${this.baseURL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId }),
    });

    return response.json();
  }

  // 流式响应
  async *chatStream(message: string, sessionId: string) {
    const response = await fetch(`${this.baseURL}/chat/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sessionId }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          yield JSON.parse(line.slice(6));
        }
      }
    }
  }
}
```

#### 3. 微服务架构

```typescript
// Agent 编排层
class AgentOrchestrator {
  private agents: Map<string, AgentClient>;

  constructor() {
    this.agents = new Map([
      ["search", new AgentClient("http://search-agent:3001")],
      ["analysis", new AgentClient("http://analysis-agent:3002")],
      ["summary", new AgentClient("http://summary-agent:3003")],
    ]);
  }

  async executeWorkflow(task: string) {
    // 1. 搜索相关信息
    const searchResults = await this.agents.get("search")!.execute(task);

    // 2. 分析数据
    const analysis = await this.agents.get("analysis")!.execute(searchResults);

    // 3. 生成摘要
    const summary = await this.agents.get("summary")!.execute(analysis);

    return summary;
  }
}
```

### 技术要点

#### 1. 架构设计考虑

- **安全性**：API Key 不应暴露在前端，需要通过后端代理
- **成本控制**：实现请求限流、缓存机制
- **可扩展性**：模块化设计，便于添加新的工具和能力
- **错误处理**：完善的重试机制和降级策略

#### 2. 核心组件

```typescript
// Agent 核心架构
interface AgentConfig {
  llm: LLMProvider; // LLM 提供商
  tools: Tool[]; // 可用工具集
  memory: Memory; // 记忆系统
  planner: Planner; // 规划器
  executor: Executor; // 执行器
}

class Agent {
  constructor(private config: AgentConfig) {}

  async run(input: string): Promise<string> {
    // 1. 理解用户意图
    const intent = await this.config.llm.analyze(input);

    // 2. 制定执行计划
    const plan = await this.config.planner.createPlan(intent);

    // 3. 执行计划
    const result = await this.config.executor.execute(plan);

    // 4. 保存到记忆
    await this.config.memory.save(input, result);

    return result;
  }
}
```

#### 3. 工具系统设计

```typescript
interface Tool {
  name: string;
  description: string;
  parameters: ParameterSchema;
  execute: (params: any) => Promise<any>;
}

class ToolRegistry {
  private tools = new Map<string, Tool>();

  register(tool: Tool) {
    this.tools.set(tool.name, tool);
  }

  async execute(toolName: string, params: any) {
    const tool = this.tools.get(toolName);
    if (!tool) throw new Error(`Tool ${toolName} not found`);

    return await tool.execute(params);
  }

  getToolDescriptions() {
    return Array.from(this.tools.values()).map((t) => ({
      name: t.name,
      description: t.description,
      parameters: t.parameters,
    }));
  }
}
```

#### 4. 状态管理

```typescript
// 使用 Zustand 管理 Agent 状态
import create from "zustand";

interface AgentState {
  messages: Message[];
  isProcessing: boolean;
  currentTask: string | null;
  addMessage: (message: Message) => void;
  setProcessing: (status: boolean) => void;
}

const useAgentStore = create<AgentState>((set) => ({
  messages: [],
  isProcessing: false,
  currentTask: null,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setProcessing: (status) => set({ isProcessing: status }),
}));
```

### 常见追问

**Q1: 如何处理 Agent 的并发请求？**

使用队列机制和并发控制：

```typescript
class AgentQueue {
  private queue: Task[] = [];
  private processing = 0;
  private maxConcurrent = 3;

  async add(task: Task) {
    this.queue.push(task);
    return this.process();
  }

  private async process() {
    if (this.processing >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    this.processing++;
    const task = this.queue.shift()!;

    try {
      await task.execute();
    } finally {
      this.processing--;
      this.process(); // 处理下一个任务
    }
  }
}
```

**Q2: 如何实现 Agent 的可观测性？**

```typescript
class AgentMonitor {
  trackExecution(agentId: string, task: string) {
    // 记录执行日志
    console.log(`[${agentId}] Starting task: ${task}`);

    // 发送到监控系统
    this.sendMetrics({
      agentId,
      task,
      timestamp: Date.now(),
      type: "execution_start",
    });
  }

  trackError(agentId: string, error: Error) {
    // 错误追踪
    this.sendMetrics({
      agentId,
      error: error.message,
      stack: error.stack,
      type: "error",
    });
  }
}
```

**Q3: 如何优化 Agent 的响应速度？**

- 使用流式响应（SSE/WebSocket）
- 实现智能缓存策略
- 预加载常用工具和模型
- 使用 CDN 加速静态资源
- 实现请求合并和批处理

---

## Agent 通信方式 {#agent-通信方式}

### 问题背景

Agent 之间如何通信？有哪些常见的通信模式？

### 解决方案

#### 1. 直接通信（Direct Communication）

Agent 之间直接调用 API 进行通信：

```typescript
class DirectCommunication {
  async sendMessage(targetAgent: string, message: any) {
    const response = await fetch(`http://${targetAgent}/api/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    return response.json();
  }
}

// 使用示例
class SearchAgent {
  private analysisAgent = new DirectCommunication();

  async processQuery(query: string) {
    const searchResults = await this.search(query);

    // 直接调用分析 Agent
    const analysis = await this.analysisAgent.sendMessage(
      "analysis-agent:3002",
      { data: searchResults }
    );

    return analysis;
  }
}
```

#### 2. 消息队列（Message Queue）

使用消息队列实现异步通信：

```typescript
import { EventEmitter } from "events";

class MessageBus extends EventEmitter {
  private static instance: MessageBus;

  static getInstance() {
    if (!this.instance) {
      this.instance = new MessageBus();
    }
    return this.instance;
  }

  publish(channel: string, message: any) {
    this.emit(channel, message);
  }

  subscribe(channel: string, handler: (message: any) => void) {
    this.on(channel, handler);
  }
}

// Agent 实现
class Agent {
  private bus = MessageBus.getInstance();

  constructor(private name: string) {
    // 订阅自己的消息通道
    this.bus.subscribe(`agent:${this.name}`, this.handleMessage.bind(this));
  }

  sendTo(targetAgent: string, message: any) {
    this.bus.publish(`agent:${targetAgent}`, {
      from: this.name,
      data: message,
      timestamp: Date.now(),
    });
  }

  private handleMessage(message: any) {
    console.log(`${this.name} received message from ${message.from}`);
    // 处理消息
  }
}
```

#### 3. 发布-订阅模式（Pub/Sub）

```typescript
// 使用 Redis 实现 Pub/Sub
import Redis from "ioredis";

class PubSubAgent {
  private publisher: Redis;
  private subscriber: Redis;

  constructor(private agentId: string) {
    this.publisher = new Redis();
    this.subscriber = new Redis();

    // 订阅相关主题
    this.subscriber.subscribe(`agent:${agentId}`, "broadcast");
    this.subscriber.on("message", this.handleMessage.bind(this));
  }

  async broadcast(message: any) {
    await this.publisher.publish(
      "broadcast",
      JSON.stringify({
        from: this.agentId,
        data: message,
        timestamp: Date.now(),
      })
    );
  }

  async sendToAgent(targetId: string, message: any) {
    await this.publisher.publish(
      `agent:${targetId}`,
      JSON.stringify({
        from: this.agentId,
        data: message,
      })
    );
  }

  private handleMessage(channel: string, message: string) {
    const data = JSON.parse(message);
    console.log(`Received on ${channel}:`, data);
  }
}
```

#### 4. 协调者模式（Coordinator Pattern）

通过中央协调器管理 Agent 通信：

```typescript
class AgentCoordinator {
  private agents = new Map<string, Agent>();
  private messageQueue: Message[] = [];

  registerAgent(agent: Agent) {
    this.agents.set(agent.id, agent);
  }

  async routeMessage(message: Message) {
    const targetAgent = this.agents.get(message.to);

    if (!targetAgent) {
      throw new Error(`Agent ${message.to} not found`);
    }

    // 记录消息
    this.messageQueue.push(message);

    // 路由到目标 Agent
    return await targetAgent.receive(message);
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

// 使用示例
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

#### 5. WebSocket 实时通信

```typescript
class WebSocketAgentCommunication {
  private ws: WebSocket;
  private handlers = new Map<string, Function>();

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.ws.onmessage = this.handleMessage.bind(this);
  }

  send(type: string, data: any) {
    this.ws.send(JSON.stringify({ type, data }));
  }

  on(type: string, handler: Function) {
    this.handlers.set(type, handler);
  }

  private handleMessage(event: MessageEvent) {
    const { type, data } = JSON.parse(event.data);
    const handler = this.handlers.get(type);

    if (handler) {
      handler(data);
    }
  }
}

// 多 Agent 协作
class CollaborativeAgents {
  private comm: WebSocketAgentCommunication;

  constructor() {
    this.comm = new WebSocketAgentCommunication("ws://localhost:8080");

    this.comm.on("task_request", this.handleTaskRequest.bind(this));
    this.comm.on("task_result", this.handleTaskResult.bind(this));
  }

  async requestHelp(task: string) {
    this.comm.send("task_request", {
      task,
      requesterId: this.id,
      timestamp: Date.now(),
    });
  }

  private handleTaskRequest(data: any) {
    // 处理其他 Agent 的请求
  }

  private handleTaskResult(data: any) {
    // 处理任务结果
  }
}
```

### 技术要点

#### 1. 通信协议选择

| 协议          | 适用场景      | 优点             | 缺点             |
| ------------- | ------------- | ---------------- | ---------------- |
| HTTP/REST     | 简单请求-响应 | 简单、广泛支持   | 无法推送、开销大 |
| WebSocket     | 实时双向通信  | 低延迟、双向     | 连接管理复杂     |
| gRPC          | 微服务间通信  | 高性能、类型安全 | 学习曲线陡峭     |
| Message Queue | 异步任务处理  | 解耦、可靠       | 增加系统复杂度   |

#### 2. 消息格式设计

```typescript
interface AgentMessage {
  id: string; // 消息唯一标识
  from: string; // 发送者 Agent ID
  to: string; // 接收者 Agent ID
  type: MessageType; // 消息类型
  payload: any; // 消息内容
  timestamp: number; // 时间戳
  priority?: number; // 优先级
  replyTo?: string; // 回复的消息 ID
}

enum MessageType {
  REQUEST = "request",
  RESPONSE = "response",
  NOTIFICATION = "notification",
  ERROR = "error",
}
```

#### 3. 错误处理和重试

```typescript
class ReliableAgentCommunication {
  private maxRetries = 3;
  private retryDelay = 1000;

  async sendWithRetry(message: AgentMessage): Promise<any> {
    let lastError: Error;

    for (let i = 0; i < this.maxRetries; i++) {
      try {
        return await this.send(message);
      } catch (error) {
        lastError = error as Error;
        console.log(`Retry ${i + 1}/${this.maxRetries}`);
        await this.delay(this.retryDelay * Math.pow(2, i)); // 指数退避
      }
    }

    throw new Error(
      `Failed after ${this.maxRetries} retries: ${lastError!.message}`
    );
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

#### 4. 消息追踪和日志

```typescript
class MessageTracer {
  private traces = new Map<string, MessageTrace>();

  trace(message: AgentMessage) {
    const trace: MessageTrace = {
      messageId: message.id,
      from: message.from,
      to: message.to,
      timestamp: Date.now(),
      status: "sent",
    };

    this.traces.set(message.id, trace);
  }

  updateStatus(messageId: string, status: string) {
    const trace = this.traces.get(messageId);
    if (trace) {
      trace.status = status;
      trace.updatedAt = Date.now();
    }
  }

  getTrace(messageId: string) {
    return this.traces.get(messageId);
  }
}
```

### 常见追问

**Q1: 如何保证消息的顺序性？**

```typescript
class OrderedMessageQueue {
  private queue: AgentMessage[] = [];
  private sequenceNumber = 0;

  enqueue(message: AgentMessage) {
    message.sequence = this.sequenceNumber++;
    this.queue.push(message);
    this.queue.sort((a, b) => a.sequence! - b.sequence!);
  }

  dequeue(): AgentMessage | undefined {
    return this.queue.shift();
  }
}
```

**Q2: 如何处理 Agent 通信的超时？**

```typescript
async function sendWithTimeout(
  message: AgentMessage,
  timeout: number = 5000
): Promise<any> {
  return Promise.race([
    sendMessage(message),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), timeout)
    ),
  ]);
}
```

**Q3: 如何实现 Agent 间的负载均衡？**

```typescript
class LoadBalancer {
  private agents: Agent[] = [];
  private currentIndex = 0;

  addAgent(agent: Agent) {
    this.agents.push(agent);
  }

  // 轮询策略
  getNextAgent(): Agent {
    const agent = this.agents[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.agents.length;
    return agent;
  }

  // 最少连接策略
  getLeastBusyAgent(): Agent {
    return this.agents.reduce((least, current) =>
      current.activeConnections < least.activeConnections ? current : least
    );
  }
}
```

---

## Agent vs LLM 区别与优缺点 {#agent-vs-llm-区别与优缺点}

### 问题背景

Agent 和 LLM 有什么区别？各自的优缺点是什么？

### 解决方案

#### 核心区别

| 维度         | LLM                        | Agent                      |
| ------------ | -------------------------- | -------------------------- |
| **定义**     | 大语言模型，纯文本生成系统 | 基于 LLM 的自主决策系统    |
| **能力**     | 文本理解和生成             | 规划、决策、执行、使用工具 |
| **交互方式** | 单次问答                   | 多轮对话、主动行动         |
| **工具使用** | 不能直接调用外部工具       | 可以调用 API、数据库等     |
| **记忆**     | 仅限上下文窗口             | 可持久化长期记忆           |
| **自主性**   | 被动响应                   | 主动规划和执行             |

#### 1. LLM（Large Language Model）

```typescript
// 纯 LLM 使用示例
class LLMService {
  async generate(prompt: string): Promise<string> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  }
}

// 使用场景：简单的文本生成
const llm = new LLMService();
const answer = await llm.generate("什么是 React？");
console.log(answer); // 直接返回答案
```

**LLM 的优点：**

- 简单直接，易于集成
- 响应速度快
- 成本相对较低
- 适合单次问答场景

**LLM 的缺点：**

- 无法执行实际操作
- 不能访问实时数据
- 缺乏规划能力
- 无法使用外部工具
- 受限于训练数据的时效性

#### 2. Agent（智能代理）

```typescript
// Agent 实现示例
class AIAgent {
  private llm: LLMService;
  private tools: Tool[];
  private memory: Memory;
  private planner: Planner;

  constructor() {
    this.llm = new LLMService();
    this.tools = [
      new SearchTool(),
      new CalculatorTool(),
      new DatabaseTool(),
      new APITool(),
    ];
    this.memory = new Memory();
    this.planner = new Planner();
  }

  async execute(task: string): Promise<string> {
    // 1. 分析任务，制定计划
    const plan = await this.planner.createPlan(task, this.tools);

    // 2. 执行计划中的每一步
    for (const step of plan.steps) {
      if (step.type === "tool_use") {
        // 使用工具
        const tool = this.tools.find((t) => t.name === step.toolName);
        const result = await tool!.execute(step.params);

        // 保存到记忆
        await this.memory.save({
          action: step.toolName,
          input: step.params,
          output: result,
        });
      } else if (step.type === "reasoning") {
        // LLM 推理
        const thought = await this.llm.generate(step.prompt);
        await this.memory.save({ thought });
      }
    }

    // 3. 生成最终答案
    const context = await this.memory.getRecentContext();
    return await this.llm.generate(
      `基于以下信息回答问题：\n${context}\n\n问题：${task}`
    );
  }
}

// 使用场景：复杂任务执行
const agent = new AIAgent();
const result = await agent.execute("查询今天的天气，并推荐适合的户外活动");
// Agent 会：
// 1. 调用天气 API 获取实时数据
// 2. 分析天气情况
// 3. 基于天气推荐活动
```

**Agent 的优点：**

- 可以执行实际操作（调用 API、查询数据库等）
- 具备规划和决策能力
- 可以使用多种工具
- 支持长期记忆
- 能处理复杂的多步骤任务
- 可以自主学习和改进

**Agent 的缺点：**

- 实现复杂度高
- 成本较高（多次 LLM 调用）
- 响应时间较长
- 需要更多的错误处理
- 可能产生不可预测的行为

#### 3. 架构对比

```typescript
// LLM 架构（简单）
class SimpleLLM {
  async chat(message: string): Promise<string> {
    return await this.callLLM(message);
  }
}

// Agent 架构（复杂）
class ComplexAgent {
  private components = {
    perception: new PerceptionModule(), // 感知模块
    planning: new PlanningModule(), // 规划模块
    execution: new ExecutionModule(), // 执行模块
    memory: new MemoryModule(), // 记忆模块
    learning: new LearningModule(), // 学习模块
  };

  async process(input: string): Promise<string> {
    // 1. 感知：理解输入
    const understanding = await this.components.perception.analyze(input);

    // 2. 规划：制定行动计划
    const plan = await this.components.planning.createPlan(understanding);

    // 3. 执行：执行计划
    const results = await this.components.execution.execute(plan);

    // 4. 记忆：保存经验
    await this.components.memory.store(input, results);

    // 5. 学习：优化策略
    await this.components.learning.update(results);

    return results.output;
  }
}
```

#### 4. 选择建议

**使用 LLM 的场景：**

- 简单的文本生成（写作、翻译、摘要）
- 问答系统
- 内容分类和标注
- 情感分析
- 代码补全

```typescript
// 适合 LLM 的场景
const scenarios = {
  translation: async (text: string) => {
    return await llm.generate(`翻译成英文：${text}`);
  },

  summarize: async (article: string) => {
    return await llm.generate(`总结以下文章：\n${article}`);
  },

  classify: async (text: string) => {
    return await llm.generate(`分类以下文本的情感（正面/负面/中性）：${text}`);
  },
};
```

**使用 Agent 的场景：**

- 需要调用外部 API 或工具
- 多步骤复杂任务
- 需要实时数据
- 需要持久化记忆
- 自动化工作流

```typescript
// 适合 Agent 的场景
const agentScenarios = {
  research: async (topic: string) => {
    // 1. 搜索相关信息
    // 2. 分析多个来源
    // 3. 生成综合报告
    return await agent.execute(`研究 ${topic} 并生成报告`);
  },

  dataAnalysis: async (query: string) => {
    // 1. 查询数据库
    // 2. 数据处理和分析
    // 3. 生成可视化
    return await agent.execute(`分析数据：${query}`);
  },

  automation: async (workflow: string) => {
    // 1. 理解工作流
    // 2. 执行多个步骤
    // 3. 处理异常情况
    return await agent.execute(`自动化执行：${workflow}`);
  },
};
```

#### 5. 混合使用

实际应用中，通常结合两者优势：

```typescript
class HybridSystem {
  private llm: LLMService;
  private agent: AIAgent;

  async handle(request: string): Promise<string> {
    // 先用 LLM 快速判断任务类型
    const taskType = await this.llm.generate(
      `判断以下任务类型（simple/complex）：${request}`
    );

    if (taskType.includes("simple")) {
      // 简单任务直接用 LLM
      return await this.llm.generate(request);
    } else {
      // 复杂任务使用 Agent
      return await this.agent.execute(request);
    }
  }
}
```

### 技术要点

#### 1. 成本对比

```typescript
// LLM 成本计算
class LLMCostCalculator {
  calculate(tokens: number, model: string): number {
    const prices = {
      "gpt-4": 0.03 / 1000, // $0.03 per 1K tokens
      "gpt-3.5": 0.002 / 1000, // $0.002 per 1K tokens
    };
    return tokens * prices[model];
  }
}

// Agent 成本计算（通常是 LLM 的 3-10 倍）
class AgentCostCalculator {
  calculate(task: string): number {
    // Agent 可能需要多次 LLM 调用
    const estimatedCalls = 5; // 规划、执行、总结等
    const avgTokens = 1000;
    return (estimatedCalls * avgTokens * 0.03) / 1000;
  }
}
```

#### 2. 性能对比

```typescript
// 性能监控
class PerformanceMonitor {
  async measureLLM() {
    const start = Date.now();
    await llm.generate("测试问题");
    const duration = Date.now() - start;
    console.log(`LLM 响应时间: ${duration}ms`); // 通常 1-3 秒
  }

  async measureAgent() {
    const start = Date.now();
    await agent.execute("复杂任务");
    const duration = Date.now() - start;
    console.log(`Agent 响应时间: ${duration}ms`); // 通常 5-30 秒
  }
}
```

### 常见追问

**Q1: 什么时候应该从 LLM 升级到 Agent？**

当出现以下需求时考虑使用 Agent：

- 需要调用外部 API 或数据库
- 任务需要多个步骤才能完成
- 需要根据中间结果动态调整策略
- 需要长期记忆和上下文管理
- 需要自动化复杂工作流

**Q2: 如何降低 Agent 的成本？**

```typescript
class CostOptimizedAgent {
  private cache = new Map();

  async execute(task: string): Promise<string> {
    // 1. 检查缓存
    const cached = this.cache.get(task);
    if (cached) return cached;

    // 2. 使用更便宜的模型做初步规划
    const plan = await this.cheapLLM.plan(task);

    // 3. 只在关键步骤使用高级模型
    const result = await this.executePlan(plan);

    // 4. 缓存结果
    this.cache.set(task, result);

    return result;
  }
}
```

**Q3: Agent 的可靠性如何保证？**

```typescript
class ReliableAgent {
  async execute(task: string): Promise<string> {
    try {
      // 1. 验证输入
      this.validateInput(task);

      // 2. 设置超时
      const result = await Promise.race([
        this.agent.execute(task),
        this.timeout(30000),
      ]);

      // 3. 验证输出
      this.validateOutput(result);

      return result;
    } catch (error) {
      // 4. 降级策略
      return await this.fallbackToLLM(task);
    }
  }

  private async fallbackToLLM(task: string): Promise<string> {
    // 如果 Agent 失败，降级到简单的 LLM
    return await this.llm.generate(task);
  }
}
```

---

## 对话上下文传递 {#对话上下文传递}

### 问题背景

在同一个对话内如何传递上下文？

### 解决方案

#### 1. 基础上下文管理

```typescript
interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: number;
}

class ConversationContext {
  private messages: Message[] = [];
  private maxMessages: number = 10;

  addMessage(role: Message["role"], content: string) {
    this.messages.push({
      role,
      content,
      timestamp: Date.now(),
    });

    // 限制消息数量，避免超出 token 限制
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages);
    }
  }

  getContext(): Message[] {
    return this.messages;
  }

  clear() {
    this.messages = [];
  }
}

// 使用示例
class ChatService {
  private context = new ConversationContext();

  async chat(userMessage: string): Promise<string> {
    // 添加用户消息
    this.context.addMessage("user", userMessage);

    // 获取完整上下文
    const messages = this.context.getContext();

    // 调用 LLM
    const response = await this.llm.chat(messages);

    // 保存助手回复
    this.context.addMessage("assistant", response);

    return response;
  }
}
```

#### 2. Token 优化策略

```typescript
class TokenOptimizedContext {
  private messages: Message[] = [];
  private maxTokens: number = 4000;

  addMessage(message: Message) {
    this.messages.push(message);
    this.optimizeTokens();
  }

  private optimizeTokens() {
    let totalTokens = this.estimateTokens(this.messages);

    while (totalTokens > this.maxTokens && this.messages.length > 1) {
      // 保留系统消息和最近的消息
      const systemMessages = this.messages.filter((m) => m.role === "system");
      const recentMessages = this.messages.slice(-5);

      // 移除中间的旧消息
      this.messages = [...systemMessages, ...recentMessages];
      totalTokens = this.estimateTokens(this.messages);
    }
  }

  private estimateTokens(messages: Message[]): number {
    // 粗略估算：1 token ≈ 4 字符（英文）或 1.5 字符（中文）
    return messages.reduce((total, msg) => {
      return total + Math.ceil(msg.content.length / 2);
    }, 0);
  }
}
```

#### 3. 智能摘要压缩

```typescript
class SummarizedContext {
  private messages: Message[] = [];
  private summary: string = "";
  private summaryThreshold: number = 10;

  async addMessage(message: Message) {
    this.messages.push(message);

    // 当消息数量超过阈值时，进行摘要
    if (this.messages.length >= this.summaryThreshold) {
      await this.summarizeOldMessages();
    }
  }

  private async summarizeOldMessages() {
    // 保留最近的 3 条消息
    const recentMessages = this.messages.slice(-3);
    const oldMessages = this.messages.slice(0, -3);

    // 对旧消息进行摘要
    const conversationText = oldMessages
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    this.summary = await this.llm.generate(
      `请简要总结以下对话的关键信息：\n${conversationText}`
    );

    // 只保留摘要和最近消息
    this.messages = recentMessages;
  }

  getContext(): string {
    const context = [];

    if (this.summary) {
      context.push(`之前的对话摘要：${this.summary}`);
    }

    context.push(...this.messages.map((m) => `${m.role}: ${m.content}`));

    return context.join("\n\n");
  }
}
```

#### 4. 分层上下文管理

```typescript
interface ContextLayer {
  type: "system" | "session" | "conversation" | "immediate";
  priority: number;
  content: any;
}

class LayeredContext {
  private layers: Map<string, ContextLayer> = new Map();

  // 系统级上下文（始终保留）
  setSystemContext(content: string) {
    this.layers.set("system", {
      type: "system",
      priority: 1,
      content,
    });
  }

  // 会话级上下文（用户信息、偏好等）
  setSessionContext(content: any) {
    this.layers.set("session", {
      type: "session",
      priority: 2,
      content,
    });
  }

  // 对话级上下文（当前对话历史）
  setConversationContext(messages: Message[]) {
    this.layers.set("conversation", {
      type: "conversation",
      priority: 3,
      content: messages,
    });
  }

  // 即时上下文（当前消息）
  setImmediateContext(content: string) {
    this.layers.set("immediate", {
      type: "immediate",
      priority: 4,
      content,
    });
  }

  buildPrompt(): string {
    const sortedLayers = Array.from(this.layers.values()).sort(
      (a, b) => a.priority - b.priority
    );

    return sortedLayers
      .map((layer) => {
        if (layer.type === "conversation") {
          return layer.content
            .map((m: Message) => `${m.role}: ${m.content}`)
            .join("\n");
        }
        return layer.content;
      })
      .join("\n\n");
  }
}

// 使用示例
const context = new LayeredContext();

context.setSystemContext("你是一个专业的 AI 助手");
context.setSessionContext({ userId: "123", preferences: { language: "zh" } });
context.setConversationContext([
  { role: "user", content: "你好", timestamp: Date.now() },
  {
    role: "assistant",
    content: "你好！有什么可以帮助你的？",
    timestamp: Date.now(),
  },
]);
context.setImmediateContext("请介绍一下 React");

const prompt = context.buildPrompt();
```

#### 5. 向量数据库存储

```typescript
import { ChromaClient } from "chromadb";

class VectorContext {
  private client: ChromaClient;
  private collection: any;

  async initialize() {
    this.client = new ChromaClient();
    this.collection = await this.client.createCollection({
      name: "conversation_history",
    });
  }

  async addMessage(sessionId: string, message: Message) {
    // 将消息存储到向量数据库
    await this.collection.add({
      ids: [`${sessionId}_${Date.now()}`],
      documents: [message.content],
      metadatas: [
        {
          sessionId,
          role: message.role,
          timestamp: message.timestamp,
        },
      ],
    });
  }

  async getRelevantContext(
    sessionId: string,
    query: string,
    limit: number = 5
  ) {
    // 基于语义相似度检索相关上下文
    const results = await this.collection.query({
      queryTexts: [query],
      nResults: limit,
      where: { sessionId },
    });

    return results.documents[0];
  }
}

// 使用示例
class SmartChatService {
  private vectorContext = new VectorContext();

  async chat(sessionId: string, userMessage: string): Promise<string> {
    // 1. 保存用户消息
    await this.vectorContext.addMessage(sessionId, {
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
    });

    // 2. 检索相关历史上下文
    const relevantContext = await this.vectorContext.getRelevantContext(
      sessionId,
      userMessage
    );

    // 3. 构建提示词
    const prompt = `
      相关历史对话：
      ${relevantContext.join("\n")}
      
      当前问题：${userMessage}
    `;

    // 4. 生成回复
    const response = await this.llm.generate(prompt);

    // 5. 保存助手回复
    await this.vectorContext.addMessage(sessionId, {
      role: "assistant",
      content: response,
      timestamp: Date.now(),
    });

    return response;
  }
}
```

#### 6. 滑动窗口策略

```typescript
class SlidingWindowContext {
  private messages: Message[] = [];
  private windowSize: number = 5;
  private stride: number = 2;

  addMessage(message: Message) {
    this.messages.push(message);
  }

  getWindows(): Message[][] {
    const windows: Message[][] = [];

    for (let i = 0; i < this.messages.length; i += this.stride) {
      const window = this.messages.slice(i, i + this.windowSize);
      if (window.length > 0) {
        windows.push(window);
      }
    }

    return windows;
  }

  getCurrentWindow(): Message[] {
    return this.messages.slice(-this.windowSize);
  }
}
```

### 技术要点

#### 1. 上下文持久化

```typescript
class PersistentContext {
  private storage: Storage;

  constructor(storage: Storage = localStorage) {
    this.storage = storage;
  }

  save(sessionId: string, context: Message[]) {
    this.storage.setItem(`context_${sessionId}`, JSON.stringify(context));
  }

  load(sessionId: string): Message[] {
    const data = this.storage.getItem(`context_${sessionId}`);
    return data ? JSON.parse(data) : [];
  }

  clear(sessionId: string) {
    this.storage.removeItem(`context_${sessionId}`);
  }
}

// 使用 IndexedDB 存储大量数据
class IndexedDBContext {
  private db: IDBDatabase;

  async initialize() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("ChatContext", 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        db.createObjectStore("messages", {
          keyPath: "id",
          autoIncrement: true,
        });
      };
    });
  }

  async saveMessage(sessionId: string, message: Message) {
    const transaction = this.db.transaction(["messages"], "readwrite");
    const store = transaction.objectStore("messages");

    await store.add({ sessionId, ...message });
  }

  async getMessages(sessionId: string): Promise<Message[]> {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["messages"], "readonly");
      const store = transaction.objectStore("messages");
      const request = store.getAll();

      request.onsuccess = () => {
        const messages = request.result.filter(
          (m) => m.sessionId === sessionId
        );
        resolve(messages);
      };
      request.onerror = () => reject(request.error);
    });
  }
}
```

#### 2. 上下文压缩算法

```typescript
class ContextCompressor {
  // 基于重要性的压缩
  async compressByImportance(messages: Message[]): Promise<Message[]> {
    const scores = await Promise.all(
      messages.map((msg) => this.calculateImportance(msg))
    );

    // 保留重要性分数高的消息
    const threshold = 0.5;
    return messages.filter((_, index) => scores[index] > threshold);
  }

  private async calculateImportance(message: Message): Promise<number> {
    // 使用 LLM 评估消息重要性
    const prompt = `评估以下消息的重要性（0-1）：${message.content}`;
    const score = await this.llm.generate(prompt);
    return parseFloat(score);
  }

  // 基于相似度的去重
  async deduplicateBySimilarity(messages: Message[]): Promise<Message[]> {
    const unique: Message[] = [];

    for (const msg of messages) {
      const isDuplicate = await this.isSimilarToAny(msg, unique);
      if (!isDuplicate) {
        unique.push(msg);
      }
    }

    return unique;
  }

  private async isSimilarToAny(
    message: Message,
    others: Message[]
  ): Promise<boolean> {
    for (const other of others) {
      const similarity = await this.calculateSimilarity(
        message.content,
        other.content
      );
      if (similarity > 0.9) return true;
    }
    return false;
  }
}
```

#### 3. 多会话管理

```typescript
class MultiSessionManager {
  private sessions = new Map<string, ConversationContext>();

  getOrCreateSession(sessionId: string): ConversationContext {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, new ConversationContext());
    }
    return this.sessions.get(sessionId)!;
  }

  async chat(sessionId: string, message: string): Promise<string> {
    const context = this.getOrCreateSession(sessionId);
    context.addMessage("user", message);

    const response = await this.llm.chat(context.getContext());
    context.addMessage("assistant", response);

    return response;
  }

  clearSession(sessionId: string) {
    this.sessions.delete(sessionId);
  }

  // 清理过期会话
  cleanupExpiredSessions(maxAge: number = 3600000) {
    const now = Date.now();

    for (const [sessionId, context] of this.sessions.entries()) {
      const messages = context.getContext();
      if (messages.length === 0) continue;

      const lastMessage = messages[messages.length - 1];
      if (now - lastMessage.timestamp > maxAge) {
        this.sessions.delete(sessionId);
      }
    }
  }
}
```

### 常见追问

**Q1: 如何处理超长对话？**

```typescript
class LongConversationHandler {
  async handleLongConversation(messages: Message[]): Promise<Message[]> {
    if (messages.length <= 20) {
      return messages;
    }

    // 策略 1: 分段摘要
    const segments = this.splitIntoSegments(messages, 10);
    const summaries = await Promise.all(
      segments.map((seg) => this.summarizeSegment(seg))
    );

    // 策略 2: 保留关键消息
    const keyMessages = this.extractKeyMessages(messages);

    // 策略 3: 保留最近消息
    const recentMessages = messages.slice(-5);

    // 组合结果
    return [
      { role: "system", content: summaries.join("\n"), timestamp: Date.now() },
      ...keyMessages,
      ...recentMessages,
    ];
  }

  private extractKeyMessages(messages: Message[]): Message[] {
    // 提取包含关键信息的消息（问题、决策、结论等）
    return messages.filter(
      (msg) =>
        msg.content.includes("?") ||
        msg.content.includes("决定") ||
        msg.content.includes("总结")
    );
  }
}
```

**Q2: 如何实现跨设备的上下文同步？**

```typescript
class CloudSyncContext {
  private apiUrl = "https://api.example.com/context";

  async syncToCloud(sessionId: string, context: Message[]) {
    await fetch(`${this.apiUrl}/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, context }),
    });
  }

  async syncFromCloud(sessionId: string): Promise<Message[]> {
    const response = await fetch(`${this.apiUrl}/sync/${sessionId}`);
    const data = await response.json();
    return data.context;
  }

  // 实时同步（使用 WebSocket）
  setupRealtimeSync(sessionId: string) {
    const ws = new WebSocket(`wss://api.example.com/sync/${sessionId}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.localContext.addMessage(message.role, message.content);
    };

    return ws;
  }
}
```

**Q3: 如何优化上下文检索性能？**

```typescript
class OptimizedContextRetrieval {
  private cache = new Map<string, Message[]>();
  private index = new Map<string, Set<number>>();

  // 建立关键词索引
  buildIndex(messages: Message[]) {
    messages.forEach((msg, idx) => {
      const keywords = this.extractKeywords(msg.content);
      keywords.forEach((keyword) => {
        if (!this.index.has(keyword)) {
          this.index.set(keyword, new Set());
        }
        this.index.get(keyword)!.add(idx);
      });
    });
  }

  // 快速检索相关消息
  search(query: string, messages: Message[]): Message[] {
    const keywords = this.extractKeywords(query);
    const relevantIndices = new Set<number>();

    keywords.forEach((keyword) => {
      const indices = this.index.get(keyword);
      if (indices) {
        indices.forEach((idx) => relevantIndices.add(idx));
      }
    });

    return Array.from(relevantIndices).map((idx) => messages[idx]);
  }

  private extractKeywords(text: string): string[] {
    // 简单的关键词提取（实际应用中可使用更复杂的 NLP 方法）
    return text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 2);
  }
}
```

---

## 相关知识点 {#相关知识点}

### 延伸阅读

- [网络通信](network-communication.md) - SSE、WebSocket 通信方式
- [性能优化](performance-optimization.md) - 大规模并发请求处理

---

**最后更新**：2024-10  
**维护者**：Hidetoshi Dekisugi  
**说明**：本文档涵盖前端 AI 应用开发的核心场景，包括 Agent 服务搭建、通信方式、与 LLM 的区别以及上下文管理等关键技术点
