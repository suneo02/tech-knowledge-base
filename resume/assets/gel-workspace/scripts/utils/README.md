# 通用工具模块

脚本工具集中的通用功能模块，提供文件处理、命令执行等基础能力支撑。

## 目录结构

```
utils/
├── fileProcessor.cjs          # 文件处理通用工具
└── README.md                  # 本文档
```

## 关键文件说明

| 文件 | 作用 |
|------|------|
| `fileProcessor.cjs` | 文件类型检测、过滤、JSON处理等通用文件操作工具 |

## 主要功能

### fileProcessor.cjs
- **文件类型检测**: JSON文件识别、隐藏文件检测
- **文件过滤**: 支持按类型、名称等条件过滤文件
- **文件处理**: 批量文件操作、路径处理
- **JSON处理**: JSON文件读取、解析、格式化

## 依赖关系

- **上游**: Node.js fs、path模块
- **下游**: scripts目录中的各个脚本文件
- **协作**: 被staging/utils/executor.js等模块调用

## 相关文档

- [脚本工具集](../README.md) - 脚本整体架构说明
- [预发布工具说明](../staging/utils/README.md) - 预发布专用工具
- [文档编写规范](../../docs/rule/readme-rule.md) - README文档标准