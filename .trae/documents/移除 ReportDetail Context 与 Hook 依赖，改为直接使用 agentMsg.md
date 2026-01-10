目标

* 移除 apps/report-ai/src/context/ReportDetail.tsx 及其在页面/Hook 中的依赖

* 保留一次性的聊天协调器（useRPContentChat）实例，但不再通过 Context 注入；改为在页面顶层创建并以 props 传递

* 所有依赖消息、副作用的控制器/组件改为使用 agentMsg（以及必要的 send 函数、消息清理函数）

实现步骤

1. 页面顶层改造

* 在 apps/report-ai/src/pages/ReportDetail/index.tsx 的 ReportDetailInner 中调用 useRPContentChat，得到 { agentMessages, parsedMessages, sendMessage, setMessages }

* 在 ReportDetailInner 中 useRef 创建 reportEditorRef、referenceViewRef

* 用 setMessages 在页面顶层实现 clearChapterMessages（逻辑拷贝自 Context：按 chapterId 过滤 AI 流式消息）

* 删除 ReportDetailProvider 包裹（index.tsx:76-87），改为将上述依赖以 props 下发

1. 控制器 Hook 依赖注入

* apps/report-ai/src/store/reportContentStore/controllers/GenerationControllers.tsx 改为接收 props：{ agentMessages, sendRPContentMsg, clearChapterMessages }

* apps/report-ai/src/store/reportContentStore/hooks/useFullDocGenerationController.ts 签名改为接收同名依赖对象；内部将原 useReportDetailContext() 替换为 props

* apps/report-ai/src/store/reportContentStore/hooks/useMultiChapterGeneration.ts 和 hooks/rehydration/useCompletionHandler.ts 同样改为依赖注入，移除 useReportDetailContext()

1. 组件改为 props 传递（移除 Context）

* apps/report-ai/src/pages/ReportDetail/ReportContent/index.tsx 改为从父组件接收 { reportEditorRef, referenceViewRef, rpContentAgentMsgs: agentMessages, parsedRPContentMsgs: parsedMessages }；移除 useReportDetailContext()（42行）

* apps/report-ai/src/pages/ReportDetail/RightPanel/index.tsx 改为接收 { referenceViewRef }；移除 useReportDetailContext()（44行）

* apps/report-ai/src/pages/ReportDetail/LeftPanel/index.tsx 改为接收 { reportEditorRef }；移除 useReportDetailContext()（27行）

* apps/report-ai/src/pages/ReportDetail/Header/index.tsx 改为接收 { reportEditorRef }；移除 useReportDetailContext()（34行）

1. 细节与类型

* 维持现有类型：ReferenceViewHandle、ReportEditorRef、MessageInfo<RPContentAgentMsg>

* 复用 domain 层工具：ChapterHookGenUtils.isChapterFinished() 已支持 agentMsgs 输入，无需改动

* 保持 ChatRoomProvider 位置不变，仅移除 ReportDetailProvider，避免聊天上下文变动影响 xAgent 请求

1. 验证

* 运行类型检查与 lint，修正因签名变化导致的编译错误

* 手动验证：

  * 全文生成：队列推进、完成判定、清理流式消息是否正常（useFullDocGenerationController）

  * 多章节生成：完成判定、合并消息与重注水（useMultiChapterGeneration）

  * 文本改写：预览与完成判断依赖 parsedMessages 的仍可用（保持 parsedMessages 下发）

  * 引用预览：ReportEditor 内点击溯源标记是否能驱动 RightPanel 的 RPReferenceView 预览

变更点引用

* apps/report-ai/src/store/reportContentStore/hooks/useFullDocGenerationController.ts:36, 86, 102, 129（移除 context；使用 props）

* apps/report-ai/src/pages/ReportDetail/ReportContent/index.tsx:42（移除 context，改 props）

* apps/report-ai/src/pages/ReportDetail/RightPanel/index.tsx:44（移除 context，改 props）

* apps/report-ai/src/pages/ReportDetail/LeftPanel/index.tsx:27（移除 context，改 props）

* apps/report-ai/src/pages/ReportDetail/Header/index.tsx:34（移除 context，改 props）

* apps/report-ai/src/context/ReportDetail.tsx（整体删除）

说明

* 你的要求“agentMsg 就已经足够”：上述控制器与页面逻辑均以 agentMessages 为主，parsedMessages 仅保留用于文本改写预览与完成判定；若后续也要移除 parsedMessages，可在 domain 层提供等价的基于 agentMsg 的判定函数，再进行第二阶段清理。

