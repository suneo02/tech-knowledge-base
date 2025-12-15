    # gel-ui 架构说明

    ## 包职责
    提供跨应用共享的 React 组件、Hooks、服务和样式资源，支持 AI 聊天、企业展示、通用表单表格等业务场景。

    ## 目录结构
    ```
    src/
    ├── assets/                      # 静态资源
    │   ├── alice/                  # Alice AI 相关图片
    │   ├── gif/                    # 动画资源
    │   ├── header/                 # 头部图标（SVG）
    │   ├── icon/                   # 通用图标（SVG）
    │   ├── img/                    # 图片资源（品牌、企业默认图等）
    │   └── index.ts                # 资源统一导出
    ├── biz/                         # 业务组件
    │   ├── ai-chat/                # AI 聊天场景组件
    │   │   ├── AliceLogo/          # AI Logo 展示组件
    │   │   ├── ChatMessage/        # 聊天消息组件
    │   │   ├── ChatRoles/          # 聊天角色管理组件
    │   │   ├── conversation/       # 对话管理组件
    │   │   ├── LogoSection/        # Logo 区域组件
    │   │   ├── Suggestion/         # 建议/提示组件
    │   │   └── Welcome/            # 欢迎页组件
    │   ├── common/                 # 通用业务组件
    │   │   ├── CorpPresearch/      # 企业预搜索组件
    │   │   ├── DebugPanel/         # 调试面板组件
    │   │   └── tag/                # 业务标签组件
    │   ├── corp/                   # 企业相关组件
    │   │   ├── CorpAnotherName/    # 企业别名展示
    │   │   ├── dynamicEvent/       # 动态事件组件
    │   │   └── Esg/                # ESG 相关组件
    │   └── index.ts                # 业务组件统一导出
    ├── common/                      # 通用 UI 组件
    │   ├── AIBox/                  # AI 容器组件
    │   ├── Button/                 # 按钮组件集
    │   ├── cascade/                # 级联选择组件
    │   ├── EditableLabel/          # 可编辑标签组件
    │   ├── FallBack/               # 错误边界与回退组件
    │   ├── form/                   # 表单组件集
    │   ├── GradientText/           # 渐变文字组件
    │   ├── InnerHtml/              # 安全 HTML 渲染组件
    │   ├── IntlEnsure.tsx          # 国际化确保组件
    │   ├── LoadMoreTrigger/        # 加载更多触发器
    │   ├── message/                # 消息提示工具
    │   ├── SmartPaginationTable/   # 智能分页表格
    │   ├── SmartProgress/          # 智能进度条
    │   ├── SmartTable/             # 智能表格
    │   ├── TextExpandable/         # 可展开文本组件
    │   ├── TranslateIndicator/     # 翻译指示器
    │   ├── WindHeader/             # Wind 项目头部组件
    │   └── index.ts                # 通用组件统一导出
    ├── config/                      # 配置文件
    │   ├── ai-chat/                # AI 聊天配置
    │   └── index.ts                # 配置统一导出
    ├── constants/                   # 常量定义
    │   ├── error.ts                # 错误码常量
    │   └── index.ts                # 常量统一导出
    ├── hooks/                       # 自定义 React Hooks
    │   ├── aiChat/                 # AI 聊天相关 Hooks
    │   ├── useConversationsInfiniteScroll.ts  # 对话无限滚动 Hook
    │   ├── usePageInfiniteScroll.ts           # 页面无限滚动 Hook
    │   ├── useScrollToBottom.ts               # 滚动到底部 Hook
    │   ├── useScrollTracking.ts               # 滚动跟踪 Hook
    │   └── index.ts                # Hooks 统一导出
    ├── layout/                      # 布局组件
    │   └── WindHeader/             # Wind 项目头部布局
    ├── service/                     # 服务层
    │   ├── agentRequest/           # 代理请求服务（统一请求处理）
    │   ├── ai-chat/                # AI 聊天服务（流式响应、消息处理）
    │   ├── xRequest.ts             # 请求封装工具
    │   └── index.ts                # 服务统一导出
    ├── stories/                     # Storybook 文档与示例
    │   ├── biz/                    # 业务组件示例
    │   ├── common/                 # 通用组件示例
    │   └── Configure.mdx           # Storybook 配置文档
    ├── styles/                      # 样式资源
    │   ├── mixin/                  # Less Mixin（样式混入）
    │   ├── shared/                 # 共享变量与样式
    │   ├── token.ts                # 主题配置 Token
    │   └── index.ts                # 样式资源导出
    ├── types/                       # TypeScript 类型定义
    │   ├── ai-chat/                # AI 聊天类型
    │   ├── ai-chat-perf/           # AI 聊天性能类型
    │   ├── spl/                    # SPL 特殊类型
    │   ├── global.d.ts             # 全局类型声明
    │   ├── less.d.ts               # Less 模块类型声明
    │   ├── svg.d.ts                # SVG 模块类型声明
    │   └── index.ts                # 类型统一导出
    └── utils/                       # 工具函数
        ├── ai-chat/                # AI 聊天工具
        ├── compatibility/          # 兼容性工具
        ├── intl.ts                 # 国际化工具
        └── index.ts                # 工具函数统一导出
    ```

    ## 文件职责说明
    - **assets/**: 提供 AI Logo、图标、品牌图等静态资源
    - **biz/ai-chat/**: AI 聊天场景的消息展示、角色管理、建议提示等组件
    - **biz/common/**: 企业预搜索、调试面板、标签等跨场景业务组件
    - **biz/corp/**: 企业信息展示、ESG、动态事件等企业相关组件
    - **common/**: 按钮、表格、表单、进度条等可复用基础 UI 组件
    - **hooks/**: AI 聊天状态、无限滚动、滚动跟踪等自定义 React Hooks
    - **service/agentRequest/**: 统一请求处理服务，支持流式响应与错误处理
    - **service/ai-chat/**: AI 聊天专用服务，包括消息创建、流处理、轨迹跟踪
    - **styles/**: Less 变量、Mixin、Token 等样式资源与主题配置
    - **types/**: 完整的 TypeScript 类型定义，涵盖 AI 聊天、消息、角色等

    ## 模块依赖
    - biz 组件 → common 组件（复用基础 UI）
    - biz 组件 → hooks（使用状态管理与交互逻辑）
    - biz 组件 → service（调用 AI 聊天与请求服务）
    - hooks → service（封装服务调用逻辑）
    - 所有模块 → types（使用类型定义）
    - 所有组件 → styles（使用样式资源）
    - 依赖外部包：gel-api、gel-util、gel-types（workspace 内部包）

