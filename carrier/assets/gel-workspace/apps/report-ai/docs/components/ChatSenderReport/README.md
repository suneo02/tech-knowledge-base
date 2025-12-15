# ChatSenderReport 组件

报告AI聊天发送器组件，支持文本输入、文件上传和'@'引用功能。遵循单一上传入口设计，提供统一的用户体验。

## 功能概览

- **文本输入**: 多行输入、实时验证、发送状态管理
- **文件上传**: 支持点击、拖拽、粘贴三种上传方式
- **'@'引用**: 快速引用已上传文件，提高交互效率
- **状态管理**: 统一的加载、错误和成功状态处理

## 组件架构

```mermaid
graph TD
    A[ChatSenderReport] --> B[DragUpload容器]
    B --> C[Suggestion组件]
    C --> D[Sender输入区]
    D --> E[TextArea]
    D --> F[Footer操作区]
    F --> G[UploadButton]
    F --> H[FileDisplay]
    F --> I[SendButton]

    C --> J[@文件菜单]
    J --> K[文件选项列表]
```

## 主要特性

### 文件上传功能

ChatSenderReport集成了通用的[文件上传功能](../../shared/FileUpload/README.md)，支持：

- **多种上传方式**: 点击、拖拽、粘贴三种方式
- **文件类型支持**: PDF、DOC/DOCX、TXT、图片、Excel等
- **大小限制**: 单文件最大50MB
- **状态管理**: 完整的上传、成功、错误状态处理

### '@'引用功能

- 输入'@'触发文件选择菜单
- 支持键盘导航和快捷选择
- 引用标记：`@[fileName]`格式
- 数据分离：区分上传文件(`files`)和引用文件(`refFiles`)
- 智能快捷键：建议菜单打开时自动切换为 Shift+Enter 发送，避免误操作

## 数据接口

| 字段     | 类型       | 说明                |
| -------- | ---------- | ------------------- |
| message  | string     | 包含@引用的用户输入 |
| files    | FileItem[] | 直接上传的文件列表  |
| refFiles | FileItem[] | @引用的文件列表     |

## 相关文档

### 组件特定文档

- [需求规格](./requirements.md) - 用户故事和验收标准
- [交互设计](./design.md) - 界面设计和状态管理
- [Storybook示例](../../stories/ChatSenderReport/) - 组件使用示例

### 设计文档

- [需求规格](./requirements.md) - 用户故事和验收标准
- [交互设计](./design.md) - 界面设计和状态管理
- [文件上传功能](../../shared/FileUpload/README.md) - 通用文件上传设计
  - [需求规格](../../shared/FileUpload/requirements.md) - 文件上传详细需求
  - [交互设计](../../shared/FileUpload/design.md) - 上传交互设计规范
  - [API文档](../../shared/FileUpload/api.md) - 文件上传接口规范
  - [最佳实践](../../shared/FileUpload/best-practices.md) - 使用建议和优化方案

### 代码实现

- [ChatCommon/Sender](../../../src/components/ChatCommon/Sender/README.md) - 聊天发送器组件实现
- [文件上传 Hook](../../../src/hooks/useFileUpload.ts) - 文件上传逻辑实现

## 版本记录

- **v1.4.0**: 新增'@'文件引用功能
- **v1.3.0**: 简化文件状态展示
- **v1.2.0**: 统一文件上传入口
