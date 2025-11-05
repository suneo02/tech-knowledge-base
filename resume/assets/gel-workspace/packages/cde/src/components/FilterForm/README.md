## FilterForm 组件

**作者:** [Calvin](xyi.calvin@gmail.com)

**创建日期:** 2025年06月01日

**更新日期:** 2025年06月25日

`FilterForm` 是一个高度可配置的动态表单组件，旨在通过一份 JSON 配置 (`FilterConfigItem[]`) 动态渲染出包含各种标准和自定义筛选条件的表单。它支持简单输入控件、下拉选择、以及由多个控件组合而成的"组合筛选器"。该组件的核心思想是"配置驱动 UI"，并提供统一的数据提交和回显格式。

### 核心设计

1.  **配置驱动 (Configuration-Driven)**: 通过一份数据 (`config`) 动态渲染 UI，极大提高了灵活性和可复用性。
2.  **声明式组件注册 (Declarative Registration)**: 在 `registry.ts` 中维护一个声明式的 `componentMap` 对象作为**单一数据源**。`FilterForm` 根据 `itemType` 字符串查找并渲染对应组件，并利用 TypeScript 的 `keyof typeof` 实现了**组件类型的自动推断**，杜绝了注册类型与使用类型不一致的问题。
3.  **配置预处理 (Configuration Pre-processing)**: 在 `utils/preprocess.ts` 中，通过**策略模式**将不同 `itemType` 的复杂处理逻辑解耦。主函数根据 `itemType` 在"策略地图"中查找并执行相应处理函数，使得逻辑清晰、易于扩展。
4.  **组合模式 (Composition Pattern)**: 通过 `getCompositionConfig` 函数动态生成组合配置，或直接读取 `item.composition`，允许将多个基础组件灵活地拼接为一个复杂的筛选单元。
5.  **智能包装 (Smart Wrapper)**: 通过 `hasOwnFormItem` 静态标记，实现对表单项 (`Form.Item`) 的智能包装与渲染放权。
6.  **开发/生产环境分离**: 通过 `React.lazy` 按需加载开发环境下的调试组件，确保了生产环境包体积的纯净。

### 关键特性详解

#### 智能 `Form.Item` 包装与 `hasOwnFormItem`

为了兼顾便利性与灵活性，`FilterForm` 实现了一套智能的 `Form.Item` 包装机制。

- **默认行为**: 默认情况下，`FilterForm` 会自动为每个**基础组件**包裹一个表单项 (`<Form.Item>`)，处理 `label`、`name` 等通用属性。
- **定制化**: 当一个基础组件需要深度定制其 `Form.Item` 时，可以在其组件内部自行包裹 `<Form.Item>`，并为该组件添加一个静态标记：
  ```tsx
  MyCustomComponent.hasOwnFormItem = true
  ```
  当 `FilterForm` 检测到这个标记时，它会"放权"，不再为该组件提供外层的 `Form.Item` 包装，从而将布局控制权完全交给子组件。

#### 动态配置工厂: `getCompositionConfig`

为了支持根据传入数据动态改变组件布局（例如，有的产业筛选带"置信度"而有的不带），我们将原先静态的 `compositionMap` 重构为了一个动态的"配置工厂"函数——`getCompositionConfig`。

- **职责**: 该函数接收一个完整的 `FilterConfigItem`，并根据其 `itemType` 和其他属性（如 `extraOptions`）动态地构建并返回这个组件应有的 `composition` 数组。
- **优势**: 实现了组件布局与输入数据的解耦，让组件配置真正地"活"了起来。

#### 关键的默认值处理

这是一个非常重要且容易被忽略的点：**在许多表单库的实现中，仅在组件上设置 `defaultValue` 属性只会影响 UI 显示，并不会将该值注册到表单的状态中，导致提交时数据丢失！**

为了解决这个"致命 Bug"，我们实现了一个辅助函数 `buildInitialValuesFromConfig`。它会遍历配置，智能地抽取出所有 `initialValue` 和 `defaultValue`，并在 `FilterForm` 挂载时通过 `form.setFieldsValue()` 将这些默认值**真正注入**到表单状态中，确保它们能被正确提交。

#### 友好的开发者体验

`FilterForm` 在开发模式下 (`process.env.NODE_ENV !== 'production'`) 通过懒加载 `dev/DevErrorDisplay.tsx` 组件，提供了丰富的运行时错误提示，同时保证了生产环境的包体积不受影响：

- **组件未注册**: 当 `itemType` 对应的组件在 `registry.ts` 的 `componentMap` 中找不到时。
- **缺少数据源**: 当级联选择器等需要树形数据的组件没有获得有效的 `options` 时。

这些错误会直接以醒目的红色提示框渲染在页面上，极大地提升了开发和调试效率。

### 目录结构与功能说明

```
FilterForm/
├── README.md                           # 组件说明文档
├── index.tsx                           # 核心入口：定义 FilterForm，负责配置解析和组件渲染
├── index.module.less                   # FilterForm 自身的样式文件
├── registry.ts                         # 组件注册中心：声明式地映射所有可用的筛选器组件 (componentMap)
├── components/                         # 结构性/组合性子组件目录
│   └── CompositeFilter.tsx             # 组合筛选器：用于渲染由多个子组件构成的复杂筛选条件
├── config/                             # 配置文件目录
│   ├── compositionMap.ts               # 组合组件动态配置工厂：getCompositionConfig
│   ├── mock.ts                         # 模拟数据：用于 Storybook 或开发调试
│   └── comprehensiveMock.ts            # 另一个更复杂的模拟数据
├── dev/                                # 开发环境下专用代码目录
│   └── DevErrorDisplay.tsx             # 开发模式下的错误提示组件
├── FilterItem/                         # 原子筛选组件目录
│   ├── basic/                          # 基础筛选器目录
│   └── custom/                         # 自定义(业务)筛选器目录
├── types/                              # TypeScript 类型定义目录
│   └── index.ts                        # 核心类型定义文件 (自动从 registry.ts 推断类型)
└── utils/                              # 工具函数目录
    ├── preprocess.ts                   # 配置预处理工具：使用策略模式转换后端配置
    └── date.ts                         # 共享的日期处理工具函数
```

### `FilterForm` 工作流程图

```mermaid
graph TD
    A[开始: 接收 config 和 initialValues] --> B{FilterForm 组件};
    B --> C[1. 预处理配置: preprocessFilterItem];
    C --> D{查找 itemType 对应策略};
    D -- 找到 --> E[执行特定策略函数<br/>(e.g., processCheckboxItems)];
    D -- 未找到 --> F[返回原始配置];
    E --> G[返回处理后的配置];
    F --> G;
    G --> H[2. 构建表单初始值: buildInitialValuesFromConfig];
    H --> I[3. 渲染循环: config.map];
    I --> J{渲染 FilterItem};
    J --> K{是组合组件吗?};
    K -- 是 --> L[渲染 CompositeFilter];
    K -- 否 --> M{查找 Component<br/>from componentMap};
    M -- 找到 --> N[渲染基础组件];
    M -- 未找到/开发环境 --> O[懒加载 DevErrorDisplay];
    L --> P[UI 呈现];
    N --> P;
    O --> P;
    P -- 用户交互 --> Q{触发 onChange};
    Q --> R[更新 Form 状态];
    R -- 提交 --> S[调用 getSubmissionValues];
    S --> T[结束: 返回格式化数据];
```

---

此次重构后，`FilterForm` 组件的内部逻辑更清晰，职责划分更合理，为未来的功能扩展打下了坚实的基础。
