# chat

聊天相关业务逻辑，包括 AI 任务配置、消息处理、大纲管理和引用资料处理。

## 目录结构

```
chat/
├── aiTask.ts                # AI 任务配置（任务类型、预设问题、显示名称）
├── messagePosition.ts       # 消息位置判断
├── userMessage.ts           # 用户消息创建
├── outlineStatus.ts         # 大纲状态检测
├── outline.ts               # 大纲数据提取
├── ref/                     # 引用资料处理
│   ├── chapterRefExtractor.ts
│   ├── referenceProcessor.ts
│   └── referenceUtils.ts
└── rpContentAIMessages/     # AI 消息管理
```

## 关键文件

### aiTask.ts

AI 任务统一配置，管理任务类型与预设问题的映射、显示名称等。

**核心导出**：

- `AI_TASK_TO_PRESET_QUESTION` - 任务类型 → 预设问题映射
- `AI_TASK_DISPLAY_NAMES` - 任务类型 → 显示名称映射
- `getPresetQuestionByTaskType()` - 获取预设问题
- `getTaskDisplayName()` - 获取显示名称

**使用方**：

- `components/ReportEditor/config/menuRegistry.ts` - 菜单配置
- `store/reportContentStore/hooks/useTextRewrite.ts` - 文本改写 Hook

### outline.ts

大纲数据提取与转换，从 AI 消息中解析大纲结构。

**核心导出**：

- `getOutlineChaptersByParsedMessages()` - 提取章节列表
- `getOutlineNameByParsedMessages()` - 提取大纲名称
- `getOutlineTreeByParsedMessages()` - 提取大纲树结构

### ref/

引用资料处理模块，负责章节引用的提取、去重、排序和计数。

**核心能力**：

- 从章节内容提取引用
- 引用去重与排序
- 引用计数统计

## 依赖关系

```
aiTask → @/components/types/ai (AITaskType)
aiTask → gel-api (ChatPresetQuestion)
outline → messagePosition
rpContentAIMessages → ref
```

## 相关文档

- [AI 任务类型设计](../../docs/specs/text-ai-rewrite-implementation/ai-task-types.md)
- [文本 AI 重写方案](../../docs/specs/text-ai-rewrite-implementation/spec-design-v1.md)
