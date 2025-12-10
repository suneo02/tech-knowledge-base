# rpContentAIMessages

AI 消息内容处理模块，负责消息筛选、解析、合并和状态检查

## 目录结构

```
rpContentAIMessages/
├── messageFilter.ts         # 消息筛选
├── messageParser.ts         # 消息解析
├── messageMerger.ts         # 消息合并
├── generationStatus.ts      # 生成状态检查
└── progressUtils.ts         # 进度计算工具
```

## 关键说明

- **messageFilter.ts**: 根据角色、章节 ID 等条件筛选消息，获取最新消息
- **messageParser.ts**: 解析 AI 生成的消息内容（报告内容、子问题、建议等）
- **messageMerger.ts**: 将 AI 生成完成的消息合并到章节的 aigcContent，提取引用数据
- **generationStatus.ts**: 检查章节生成是否完成
- **progressUtils.ts**: 计算报告生成进度

## 依赖关系

messageMerger → messageFilter → messageParser
Redux reducers → messageMerger

## 相关文档

- [内容管理设计](../../../../docs/RPDetail/ContentManagement/README.md) - 消息合并与重注水机制
- [数据模型与状态机](../../../../docs/RPDetail/ContentManagement/data-layer-guide.md) - 消息到章节的数据流
