# Hooks 工具函数目录

提供 report content store hooks 使用的静态工具类，专注章节生成流程的通用逻辑。

## 目录结构

```
utils/
├── README.md                     # 本文档
└── generationUtils.ts            # 生成流程工具类
    ├── GenerationUtils           # 静态工具类
    ├── shouldSendRequest()       # 幂等控制检查
    ├── sendGenerationRequest()   # 发送生成请求
    ├── isChapterFinished()       # 章节完成检查
    ├── isLastChapter()           # 末章判断
    └── getCurrentChapterId()     # 当前章节ID获取
```

## 关键文件说明

### generationUtils.ts
- **作用**: 封装章节生成流程的通用逻辑，提供静态方法避免命名冲突
- **核心**: GenerationUtils 类，包含 5 个静态方法
- **特点**: 无状态纯函数设计，支持幂等控制和流程管理

## 依赖示意

```
┌─────────────────────────────────┐
│  useFullDocGeneration.ts        │
│  useMultiChapterGeneration.ts  │
└────────────┬────────────────────┘
             ↓ uses
┌─────────────────────────────────┐
│     GenerationUtils             │
│    (generationUtils.ts)         │
└────────────┬────────────────────┘
             ↓ depends on
┌─────────────────────────────────┐
│  rpContentAIMessages.ts         │
│  RPContentSendInput types       │
│  rpContentSlice actions         │
└─────────────────────────────────┘
```

## 相关文档

- [全文生成流程](../../../../docs/RPDetail/ContentManagement/full-generation-flow.md)
- [多章节顺序生成流程](../../../../docs/RPDetail/ContentManagement/multi-chapter-sequential-aigc-flow.md)
- [Redux Store 架构](../../slice.ts)
- [Hooks 使用规范](../README.md)
