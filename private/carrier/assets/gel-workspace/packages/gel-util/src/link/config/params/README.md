# Params - 链接参数配置

## 概述

Params 模块提供系统中各种链接的参数配置，包括聊天、通用、企业、知识图谱等模块的链接参数定义和生成函数。

## 目录结构

```
params/
├── chat.ts          # 聊天模块参数配置
├── common.ts        # 通用参数配置
├── company.ts       # 企业相关参数配置
├── facade.ts        # 外观参数配置
├── index.ts         # 导出入口文件
├── innerlink.ts     # 内部链接参数配置
├── kg.ts            # 知识图谱参数配置
├── report.ts        # 报告相关参数配置
├── requiredParams.ts # 必需参数配置
└── search.ts        # 搜索相关参数配置
```

## 各模块配置

| 模块 | 文件 | 功能描述 |
|------|------|----------|
| 聊天 | chat.ts | 聊天模块链接参数配置 |
| 通用 | common.ts | 通用链接参数配置 |
| 企业 | company.ts | 企业相关链接参数配置 |
| 外观 | facade.ts | 外观相关链接参数配置 |
| 内部链接 | innerlink.ts | 内部链接参数配置 |
| 知识图谱 | kg.ts | 知识图谱相关链接参数配置 |
| 报告 | report.ts | 报告相关链接参数配置 |
| 必需参数 | requiredParams.ts | 必需参数定义 |
| 搜索 | search.ts | 搜索相关链接参数配置 |

## 使用示例

```typescript
import { chatParams, companyParams } from './params';

// 生成聊天链接参数
const chatLink = generateLink(chatParams, {
  companyId: '12345',
  chatType: 'enterprise'
});

// 生成企业链接参数
const companyLink = generateLink(companyParams, {
  companyId: '12345',
  tab: 'overview'
});
```