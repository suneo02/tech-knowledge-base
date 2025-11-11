# AI Chat 工具函数库

## 定位
提供应用所需的通用工具函数和业务逻辑封装，包括数据处理、消息提示、积分管理、提示词处理等核心功能模块。

## 目录结构
```
utils/
├── common/            # 通用工具函数
├── credits/           # 积分管理工具
├── message/           # 消息提示组件
├── prompt-processor/  # 提示词处理器
└── README.md         # 本文档
```

## 核心模块
- **common**: 数据处理、空值判断、唯一名称生成等通用功能
- **credits**: 积分消费、余额查询、充值管理等业务逻辑
- **message**: 统一的消息提示系统，支持多种类型和自定义配置
- **prompt-processor**: AI 提示词处理，支持标记替换和模板变量转换

## 设计原则
- **功能单一**: 每个工具函数专注于特定功能
- **通用复用**: 提供跨组件和模块的通用能力
- **类型安全**: 完整的 TypeScript 类型定义
- **易于测试**: 纯函数设计，便于单元测试

## 关联文件
- [common utilities design](./common/design.md)
- [credits utilities design](./credits/design.md)
- [message utilities design](./message/design.md)
- [prompt-processor utilities design](./prompt-processor/design.md)
- @see apps/ai-chat/src/utils/