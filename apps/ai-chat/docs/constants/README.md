# AI Chat 常量配置

## 定位
管理应用中的全局常量、配置项和数据结构定义，提供统一的数据源和工具方法。

## 目录结构
```
constants/
├── fileStructure/    # 文件系统相关常量
└── README.md        # 本文档
```

## 核心模块
- **fileStructure**: 文件系统数据结构和工具函数
  - FileNode 接口定义
  - 基础文件结构数据
  - 树形数据转换工具
  - 路由模式检测

## 使用原则
- 集中管理配置，避免魔法值
- 提供类型定义和工具函数
- 支持数据格式转换和适配
- 与组件层松耦合

## 关联文件
- [fileStructure design](./fileStructure/design.md)
- @see apps/ai-chat/src/constants/