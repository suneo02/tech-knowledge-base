---
title: 英文环境流式请求 Hook 兼容问题
resolved_at: 2025-11-25
owner: -
source: 线上缺陷
status: ✅ 已修复
domain: ai-chat 接口代理
version: v1
---

# 英文环境流式请求 Hook 兼容问题

## 任务概览

| 项目     | 内容                                                                                                                                                                 |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 任务来源 | 英文环境下 AI Chat 流式接口报 `TypeError: e.includes is not a function`，导致请求未发出                                                                              |
| 负责人   | -                                                                                                                                                                    |
| 上线目标 | 修复所有语言环境的流式请求发送与监控日志采集，不影响现有埋点与错误上报                                                                                                |
| 当前版本 | v1                                                                                                                                                                   |
| 关联文档 | [实现说明 v1](/company/specs/xrequest-lang-param-stream-bug/spec-implementation-note-v1.md)                                                                          |

## 文档结构

- [实现说明 v1](/company/specs/xrequest-lang-param-stream-bug/spec-implementation-note-v1.md)

## 更新记录

| 日期       | 修改人 | 更新内容        |
| ---------- | ------ | --------------- |
| 2025-11-25 | -      | 创建文档与记录修复 |
