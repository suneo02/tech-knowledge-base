# reportShare

报告分享相关的 Mock 数据

## 目录结构

```
reportShare/
├── mock1.ts                 # 基础测试数据
├── mock2.ts                 # 扩展测试数据
└── mock3.ts                 # 文件状态完整测试数据
```

## 关键说明

- **mock3.ts**: 包含 16 个文件，覆盖所有文件解析状态（FINISHED、UPLOADED、OUTLINE_PARSED、FAILED、INFO_CONFIRMED、BALANCE_DIAGNOSED、NOT_BALANCED）
- 用于测试文件状态轮询和展示功能
- 包含多种文件类型（PDF、Word、Excel、图片、PPT）

## 依赖关系

Mock 数据 → MSW handlers → Storybook/测试
