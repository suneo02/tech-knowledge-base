# AI 聊天模块

## 概述

AI 聊天模块负责报告详情页左侧的对话功能，用户可以通过对话与 AI 协作生成和优化报告内容

## 功能特性

- **对话生成**: 与 AI 对话生成报告内容
- **文件引用**: 在对话中引用上传的文件
- **历史记录**: 查看对话历史
- **消息解析**: 解析 AI 返回的消息内容

## 相关文档

### 设计文档

- [需求文档](./requirements.md) - 功能需求和验收标准
- [AI 对话核心流程](../../../../packages/gel-ui/docs/biz/ai-chat/chat-flow-core-design.md) - AI 对话流程
- [AI 对话技术设计](../../../../packages/gel-ui/docs/biz/ai-chat/chat-flow-technical-design.md) - AI 对话技术方案

### 代码实现

- [ChatRPLeft 组件](../../../src/components/ChatRPLeft/README.md) - 左侧聊天组件
- [ChatCommon 组件](../../../src/components/ChatCommon/README.md) - 通用聊天组件
- [消息解析器](../../../src/components/ChatRPLeft/parsers/README.md) - 消息解析实现
