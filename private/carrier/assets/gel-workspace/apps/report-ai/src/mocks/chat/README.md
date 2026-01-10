# 聊天模拟数据

提供报告AI聊天功能的模拟数据，包含多种聊天对话轮次列表，用于开发和测试环境。

## 目录结构

```
chat/
├── chatDetailTurnList1.ts         # 聊天对话轮次列表1
├── chatDetailTurnList2.ts         # 聊天对话轮次列表2 (大文件: 124KB)
├── chatDetailTurnList3.ts         # 聊天对话轮次列表3 (大文件: 106KB)
├── chatDetailTurnList4.ts         # 聊天对话轮次列表4
├── chatDetailTurnList5.ts         # 聊天对话轮次列表5
└── chatDetailTurnListSimple.ts    # 简单聊天对话轮次列表
```

## 关键文件说明

- `chatDetailTurnList1.ts` - 基础聊天对话模拟数据
- `chatDetailTurnList2.ts` - 扩展聊天对话模拟数据，包含更多对话轮次
- `chatDetailTurnList3.ts` - 复杂聊天对话模拟数据，包含详细对话内容
- `chatDetailTurnList4.ts` - 特定场景聊天对话模拟数据
- `chatDetailTurnList5.ts` - 高级聊天对话模拟数据
- `chatDetailTurnListSimple.ts` - 简化版聊天对话模拟数据

## 依赖示意

```
聊天模拟数据
├── 依赖: 聊天类型定义
└── 依赖: 报告AI类型定义
```

## 相关文档

- [报告AI文档](../../pages/)
- [聊天API文档](../../../packages/gel-api/src/chat/)