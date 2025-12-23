# utils

状态管理工具，提供重注水判定、章节处理等支撑功能

## 目录结构

```
utils/
├── index.ts                     # 统一导出
├── RehydrationGate.ts           # 重注水判定工具
└── chapterProcessing.ts         # 统一章节处理逻辑
```

## 关键说明

- **RehydrationGate.ts**: 事件闸门，判定是否需要重注水
- **chapterProcessing.ts**: 统一的章节处理逻辑，包括关联 ID 工具

## 依赖关系

hooks → utils
reducers → utils
