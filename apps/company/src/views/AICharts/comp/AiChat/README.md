# AI聊天组件

提供企业图谱AI助手交互界面，支持用户与AI进行对话、生成图表、查看历史记录等功能。

## 目录结构

```
AiChat/
├── assets/                     # 静态资源
│   └── send.svg               # 发送按钮图标
├── constant.ts                 # 常量定义
├── feedback-modal/             # 反馈弹窗组件
│   └── index.tsx              # 反馈弹窗实现
├── history-panel-wrapper/      # 历史记录面板包装器
│   ├── index.module.less      # 历史面板样式
│   └── index.tsx              # 历史面板实现
├── history-records/            # 历史记录组件
│   ├── index.module.less      # 历史记录样式
│   ├── index.tsx               # 历史记录实现
│   └── record-item.tsx        # 历史记录项组件
├── index.module.less           # 主样式文件
├── index.tsx                   # 主组件入口
├── message-item/               # 消息项组件
│   ├── carousel-item.tsx      # 轮播项组件
│   ├── index.module.less      # 消息项样式
│   ├── index.tsx               # 消息项入口
│   ├── own-item.tsx           # 用户消息组件
│   ├── robot-item.tsx         # AI消息组件
│   └── summary-item.tsx       # 摘要消息组件
├── sender/                     # 发送消息组件
│   ├── index.module.less      # 发送器样式
│   └── index.tsx               # 发送器实现
└── utils.ts                    # 工具函数
```

## 关键文件说明

| 文件 | 作用 |
|------|------|
| `index.tsx` | AI聊天主组件，管理聊天状态、消息列表、历史记录等核心功能 |
| `constant.ts` | 定义聊天相关的常量，如机器人消息ID、初始消息列表等 |
| `message-item/index.tsx` | 消息项组件入口，根据角色区分用户消息和AI消息 |
| `sender/index.tsx` | 消息发送组件，支持文本、Excel文件和Markdown文件上传 |

## 主要功能

- **对话交互**: 支持用户与AI进行实时对话，获取企业图谱相关信息
- **文件上传**: 支持Excel和Markdown文件上传，AI可基于文件内容生成图表
- **历史记录**: 提供历史对话记录查看和管理功能
- **版本控制**: 支持图表版本管理和切换
- **反馈系统**: 提供点赞/点踩反馈功能，收集用户对AI回复的评价
- **缩略图展示**: 支持图表缩略图预览和快速切换

## 依赖关系

- **上游**: AI图表上下文(`../../context`)、AI图表状态管理(`../../store`)、图表生成钩子(`../../hooks`)
- **下游**: AI图表页面
- **协作**: UI组件库(`@wind/wind-ui`)、国际化工具(`gel-util/intl`)、API服务(`@/api/ai-graph`)

## 相关文档

- [AI图表页面](../../README.md)
- [AI图表上下文](../../context/README.md)
- [AI图表状态管理](../../store/README.md)