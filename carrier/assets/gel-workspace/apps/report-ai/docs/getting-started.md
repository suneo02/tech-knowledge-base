# 快速开始指南

## 环境要求

- **Node.js**: 18.x 或更高版本
- **npm**: 8.x 或更高版本
- **Git**: 最新版本

## 项目设置

### 1. 克隆项目

```bash
git clone <repository-url>
cd gel-workspace-back/apps/report-ai
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境配置

```bash
# 复制环境配置文件
cp .env.example .env

# 编辑环境变量
# 配置API地址、AI服务等
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用。

## 项目结构

```
src/
├── components/          # 组件目录
├── pages/              # 页面目录
├── hooks/              # 自定义Hooks
├── store/              # 状态管理
├── api/                # API接口
├── utils/              # 工具函数
└── types/              # 类型定义
```

## 开发命令

| 命令            | 说明           |
| --------------- | -------------- |
| `npm run dev`   | 启动开发服务器 |
| `npm run build` | 构建生产版本   |
| `npm run test`  | 运行测试       |
| `npm run lint`  | 代码检查       |

## 核心功能

### 首页模块

- 智能对话输入
- 文件上传管理
- 模板选择

### 文件管理

- 批量文件上传
- 企业关联处理
- 文件解析与向量化（解析状态可内部处理）

### 大纲会话

- AI对话生成大纲
- 大纲编辑确认
- 结构化展示

### 报告详情

- 三栏布局编辑
- 实时内容生成
- 引用素材管理

## 技术栈

- **React 18** - 前端框架
- **TypeScript** - 类型系统
- **Redux Toolkit** - 状态管理
- **Ant Design** - UI组件
- **TinyMCE** - 富文本编辑器

## 开发规范

- 使用 TypeScript 严格模式
- 遵循组件设计原则
- 统一错误处理机制
- 使用 ahooks 和 lodash

## 相关文档

- [架构设计](./architecture.md) - 技术架构详解
- [API文档](./api/README.md) - 接口规范
- [组件文档](./components/README.md) - 组件使用说明

---

_最后更新时间: 2024年12月_
