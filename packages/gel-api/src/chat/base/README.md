# 聊天基础API

提供聊天功能的基础API接口，包括聊天组管理、聊天项添加、消息流处理、会话管理和用户问题处理等核心功能。

## 目录结构

```
base/
├── QueryReference.ts                  # 查询引用
├── addChatGroup.ts                    # 添加聊天组
├── addChatItem.ts                     # 添加聊天项
├── analysisEngine.ts                  # 分析引擎
├── index.ts                           # 入口文件
├── messageStream.ts                   # 消息流处理
├── session.ts                         # 会话管理
├── summarizeTitle.ts                  # 标题摘要
├── trace.ts                           # 追踪功能
├── userQuestion.ts                    # 用户问题
└── userQuestionGuide.ts               # 用户问题引导
```

## 关键文件说明

- `index.ts` - 聊天基础API的入口文件
- `addChatGroup.ts` - 聊天组管理API，用于创建和管理聊天组
- `addChatItem.ts` - 聊天项管理API，用于添加聊天消息和内容
- `messageStream.ts` - 消息流处理API，处理实时消息流
- `session.ts` - 会话管理API，处理聊天会话生命周期
- `userQuestion.ts` - 用户问题处理API，处理用户提问
- `userQuestionGuide.ts` - 用户问题引导API，提供问题引导功能
- `QueryReference.ts` - 查询引用API，处理查询和引用关系
- `analysisEngine.ts` - 分析引擎API，提供聊天内容分析
- `summarizeTitle.ts` - 标题摘要API，生成聊天标题摘要
- `trace.ts` - 追踪API，提供聊天过程追踪功能

## 依赖示意

```
聊天基础API
├── 依赖: HTTP客户端
├── 依赖: 聊天类型定义
├── 依赖: 认证系统
└── 依赖: 错误处理
```

## 相关文档

- [聊天类型文档](../types/)
- [GEL API文档](../../README.md)
- [聊天API文档](../README.md)