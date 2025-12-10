# 链接配置模块

提供链接生成所需的各类配置项和参数定义。

## 目录结构

```
├── index.ts            # 配置模块入口
├── linkModule.ts       # 链接模块定义
├── params/             # 参数配置目录
│   ├── chat.ts         # 聊天相关参数
│   ├── common.ts       # 通用参数
│   ├── company.ts      # 公司相关参数
│   ├── facade.ts       # 外观参数
│   ├── index.ts        # 参数模块入口
│   ├── innerlink.ts    # 内部链接参数
│   ├── kg.ts           # 知识图谱参数
│   ├── report.ts       # 报告相关参数
│   ├── requiredParams.ts # 必需参数定义
│   ├── search.ts       # 搜索相关参数
│   └── user.ts         # 用户相关参数
├── type.ts             # 配置类型定义
└── urlConfig.ts        # URL配置
```

## 核心功能

- 定义各模块链接参数
- 管理URL配置和规则
- 提供参数类型定义和验证

## 依赖关系

```
┌─────────────┐
│   index.ts  │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│ linkModule.ts│◄────┤ urlConfig.ts│
└──────┬──────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│  params/    │
└─────────────┘
```