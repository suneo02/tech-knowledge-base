# Components

报告 AI 应用的 UI 组件库，包含编辑器、大纲、聊天、文件预览等核心组件

## 目录结构

```
components/
├── ReportEditor/              # 富文本编辑器（基于 TinyMCE）
├── outline/                   # 大纲相关组件
│   ├── OutlineTreeEditor/     # 大纲树形编辑器
│   ├── OutlineView/           # 大纲展示组件
│   └── FreeOutlineEditor/     # 自由大纲编辑器
├── Reference/                 # 引用资料展示组件
├── File/                      # 文件相关组件
│   ├── PDFViewer/             # PDF 查看器
│   ├── ImagePreview/          # 图片预览
│   ├── FileDisplay/           # 文件展示
│   ├── FileItem/              # 文件项
│   ├── ProgressCircle/        # 进度圆环
│   └── UnsupportedFilePreview/ # 不支持的文件预览
├── ChatCommon/                # 聊天通用组件
│   ├── Conversation/          # 对话列表
│   ├── Sender/                # 消息发送器
│   ├── ChatRoles/             # 聊天角色组件
│   ├── markdown/              # Markdown 渲染
│   ├── PlaceHolder/           # 占位符
│   └── UploadMaterial/        # 上传资料
├── ChatRPLeft/                # 报告详情左侧聊天
│   ├── messages/              # 消息组件
│   ├── parsers/               # 消息解析器
│   └── roles.tsx              # 角色定义
├── ChatRPOutline/             # 大纲聊天组件
│   ├── AIFooter/              # AI 底部工具栏
│   ├── ChatSync/              # 聊天同步
│   ├── messages/              # 消息组件
│   ├── parsers/               # 消息解析器
│   ├── roles/                 # 角色组件
│   ├── OperationArea/         # 操作区域
│   └── ProgressArea/          # 进度区域
├── RPContent/                 # 报告内容组件
│   └── StatusTip/             # 状态提示
├── RPDetailMisc/              # 报告详情杂项
│   └── ChatSync/              # 聊天同步
├── common/                    # 通用组件
│   ├── ContentEditable/       # 可编辑内容
│   ├── CopyOnSelect/          # 选中复制
│   ├── Generating/            # 生成中状态
│   └── PreviewArea/           # 预览区域
├── misc/                      # 杂项组件
│   ├── HomeBtn/               # 首页按钮
│   └── SiderMain/             # 侧边栏主体
├── TemplateList/              # 模板列表
├── types/                     # 类型定义
│   ├── ai.ts                  # AI 相关类型
│   └── index.ts               # 统一导出
├── fileStatusDisplay.ts       # 文件状态展示工具
└── index.ts                   # 统一导出
```

## 核心组件职责

### ReportEditor

富文本编辑器，基于 TinyMCE 实现，支持 AI 功能和自动保存

### outline

大纲相关组件集合，包含编辑器和展示组件

### Reference

引用资料展示，支持文件、表格、建议资料的预览和管理

### File

文件处理组件集合，支持 PDF、图片等多种文件类型的预览

### ChatCommon

聊天通用组件，提供对话列表、消息发送、Markdown 渲染等功能

### ChatRPLeft / ChatRPOutline

报告详情页的聊天组件，分别用于左侧聊天和大纲聊天

### common

通用 UI 组件，提供可编辑内容、复制、生成状态等基础功能

## 模块依赖

```
页面组件
  ├─> ReportEditor (编辑器)
  ├─> outline/* (大纲)
  ├─> Reference (引用)
  ├─> File/* (文件预览)
  ├─> ChatCommon/* (聊天基础)
  ├─> ChatRPLeft (左侧聊天)
  ├─> ChatRPOutline (大纲聊天)
  └─> common/* (通用组件)
```

## 相关文档

- [报告详情页设计](../../../docs/RPDetail/README.md) - 报告详情页整体设计
- [大纲模块设计](../../../docs/RPOutline/README.md) - 大纲模块设计
- [引用资料模块](../../../docs/RPDetail/Reference/README.md) - 引用资料设计
