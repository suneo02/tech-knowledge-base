# React 组件与 Hooks

## 组件基础 {#组件基础}

### 组件类型对比

| 方面 | 函数组件 | 类组件 |
|---|---|---|
| **语法** | 简单函数 | ES6 类 |
| **状态管理** | Hooks (useState, useReducer) | this.state, this.setState |
| **生命周期** | useEffect 和其他钩子 | 生命周期方法 |
| **性能** | 更好的优化 | 需要手动优化 |
| **包大小** | 更小 | 更大 |
| **学习曲线** | 更容易 | 更陡峭 |
| **未来支持** | ✅ 推荐 | ⚠️ 遗留 |

### 受控与非受控组件

```mermaid
graph TD
    A["表单组件"] --> B["受控组件"]
    A --> C["非受控组件"]
    
    B --> B1["状态控制值"]
    B1 --> B2["onChange 更新状态"]
    B2 --> B3["可预测行为"]
    
    C --> C1["DOM 控制值"]
    C1 --> C2["Ref 读取值"]
    C2 --> C3["较少 React 控制"]
```

### 组件控制对比

| 特性 | 受控 | 非受控 |
|---|---|---|
| **数据源** | React 状态 | DOM 元素 |
| **值访问** | 直接从状态 | 通过 ref |
| **验证** | 实时 | 提交时 |
| **性能** | 更多重新渲染 | 更少重新渲染 |
| **使用场景** | 动态表单 | 简单表单 |

### Props 与 State 对比

| 方面 | Props | State |
|---|---|---|
| **来源** | 父组件 | 组件自身 |
| **可变性** | 不可变 | 可变 |
| **目的** | 配置 | 内部数据 |
| **触发重新渲染** | ✅ 是 | ✅ 是 |
| **访问模式** | `props.propName` | `state.stateName` |
| **更新方法** | 父组件更新 | `setState` / `useState` |

---


## React Hooks {#react-hooks}

### Hooks 概览

| Hook | 用途 | 返回值 | 常见用例 |
|---|---|---|---|
| **`useState`** | 管理组件状态 | `[state, setState]` | 表单输入,切换 |
| **`useEffect`** | 处理副作用 | 清理函数 | API 调用,订阅 |
| **`useContext`** | 访问上下文值 | 上下文值 | 主题,用户数据 |
| **`useReducer`** | 复杂状态逻辑 | `[state, dispatch]` | 状态机 |
| **`useMemo`** | 缓存昂贵计算 | 缓存值 | 性能优化 |
| **`useCallback`** | 缓存回调函数 | 缓存函数 | 防止重新渲染 |
| **`useRef`** | 访问 DOM 或存储可变值 | 引用对象 | DOM 操作 |

### Hooks 分类

```mermaid
graph TD
    A["React Hooks"] --> B["状态管理"]
    A --> C["副作用"]
    A --> D["性能优化"]
    A --> E["上下文和引用"]
    
    B --> B1["useState"]
    B --> B2["useReducer"]
    
    C --> C1["useEffect"]
    C --> C2["useLayoutEffect"]
    
    D --> D1["useMemo"]
    D --> D2["useCallback"]
    
    E --> E1["useContext"]
    E --> E2["useRef"]
```

### useState Hook 详解

#### 不同上下文中的 setState 行为

| 上下文 | 行为 | 批处理 | 示例 |
|---|---|---|---|
| **React 生命周期方法** | 异步 | ✅ 是 | `componentDidMount`, `componentDidUpdate` |
| **React 合成事件** | 异步 | ✅ 是 | `onClick`, `onChange` |
| **setTimeout/setInterval** | 同步 | ❌ 否 | `setTimeout(() => setState(), 0)` |
| **原生 DOM 事件** | 同步 | ❌ 否 | `addEventListener('click', ...)` |
| **Promise 回调** | 同步 | ❌ 否 | `.then(() => setState())` |

#### useState 执行流程

```mermaid
flowchart TD
    A["setState 调用"] --> B{"上下文检查"}
    
    B -->|"React 上下文"| C["异步"]
    B -->|"非 React 上下文"| D["同步"]
    
    C --> C1["批量更新"]
    C1 --> C2["单次重新渲染"]
    
    D --> D1["立即更新"]
    D1 --> D2["多次重新渲染"]
```

### useEffect Hook 详解

#### useEffect 与生命周期方法对比

| 生命周期方法 | useEffect 等价 | 依赖数组 |
|---|---|---|
| `componentDidMount` | `useEffect(() => {}, [])` | 空数组 |
| `componentDidUpdate` | `useEffect(() => {})` | 无依赖数组 |
| `componentWillUnmount` | `useEffect(() => { return () => {} }, [])` | 返回清理函数 |
| `componentDidMount` + `componentDidUpdate` | `useEffect(() => {}, [dependency])` | 特定依赖 |

#### useEffect 依赖模式

```mermaid
graph TD
    A["useEffect Hook"] --> B["依赖数组"]
    
    B --> B1["[] (空数组)"]
    B --> B2["[deps] (有依赖)"]
    B --> B3["无数组"]
    
    B1 --> B1a["运行一次"]
    B1a --> B1b["componentDidMount"]
    
    B2 --> B2a["依赖变化时运行"]
    B2a --> B2b["选择性更新"]
    
    B3 --> B3a["每次渲染都运行"]
    B3a --> B3b["componentDidUpdate"]
    
    A --> C["清理函数"]
    C --> C1["componentWillUnmount"]
```

### useRequest (ahooks) 模式

#### 核心特性

| 特性 | 描述 | 优势 |
|---|---|---|
| **统一状态** | `{ loading, data, error }` | 一致的 API |
| **自动执行** | 挂载时运行 | 更少样板代码 |
| **手动触发** | `run()` 方法 | 按需请求 |
| **依赖刷新** | 依赖变化自动重试 | 响应式更新 |
| **内置优化** | 防抖、节流、轮询 | 更好的用户体验 |

#### 请求流程图

```mermaid
sequenceDiagram
    participant C as Component
    participant U as useRequest
    participant A as API
    participant S as State
    
    Note over C,S: 初始挂载
    C->>U: useRequest(service, options)
    U->>S: loading: true
    U->>A: Execute request
    
    alt 成功
        A-->>U: Response data
        U->>S: { loading: false, data: response }
    else 错误
        A-->>U: Error
        U->>S: { loading: false, error: error }
    end
    
    Note over C,S: 手动触发
    C->>U: run(params)
    U->>S: loading: true
    U->>A: Execute with params
```

---
