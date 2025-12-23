# 共享功能文档

本目录包含项目中多个组件和模块共享使用的通用功能文档。

## 功能模块

### [文件上传功能](./FileUpload/)

统一的文件上传功能模块，为项目中的多个场景提供标准化的文件上传能力。

**主要特性：**

- 支持点击、拖拽、粘贴三种上传方式
- 完整的状态管理和错误处理
- 统一的API接口和数据格式
- 丰富的交互反馈和用户体验

**使用场景：**

- 聊天发送器中的文件上传
- 文件管理系统的批量上传
- 报告详情页面的素材上传
- 其他需要文件上传的业务场景

**文档结构：**

- [功能概览](./FileUpload/README.md) - 功能介绍和使用指南
- [需求规格](./FileUpload/requirements.md) - 详细功能需求和验收标准
- [交互设计](./FileUpload/design.md) - 界面设计和用户体验规范
- [API文档](./FileUpload/api.md) - 接口规范和数据格式
- [最佳实践](./FileUpload/best-practices.md) - 使用建议和优化方案

## 文档规范

### 抽离原则

当一个功能在多个组件或模块中使用时，应当将其通用部分抽离为共享文档：

1. **使用场景超过2个** - 功能在2个以上不同场景中使用
2. **核心逻辑一致** - 不同场景使用相同的核心逻辑和API
3. **配置化差异** - 差异部分可以通过配置参数解决
4. **维护成本考虑** - 抽离后能够降低文档维护成本

### 引用规范

组件特定文档应当引用共享文档，避免重复内容：

```markdown
<!-- ✅ 推荐：引用共享文档 -->

文件上传功能集成了通用的[文件上传模块](../../shared/FileUpload/README.md)

<!-- ❌ 避免：重复描述通用功能 -->

支持点击、拖拽、粘贴上传，文件大小限制50MB...
```

### 维护策略

- **共享文档**：由功能负责人维护，确保准确性和完整性
- **组件文档**：专注于组件特有功能，引用共享部分
- **版本同步**：共享功能更新时，及时更新引用文档

## 目录结构

```
shared/
├── README.md              # 本文件，共享功能索引
├── FileUpload/            # 文件上传功能文档
│   ├── README.md          # 功能概览
│   ├── requirements.md    # 需求规格
│   ├── design.md          # 交互设计
│   ├── api.md             # API文档
│   └── best-practices.md  # 最佳实践
└── [其他共享功能]/
```

## 贡献指南

### 添加新的共享功能

1. 评估功能是否符合抽离原则
2. 在`shared/`目录下创建功能文件夹
3. 按照标准结构创建文档文件
4. 更新本索引文档
5. 更新相关组件文档的引用

### 更新现有共享功能

1. 确保更改不会破坏现有引用
2. 更新版本记录和变更说明
3. 通知相关组件负责人
4. 验证所有引用文档的正确性

## 相关文档

### 设计文档

- [自动保存设计](./auto-save-design.md) - 通用自动保存机制
- [文件状态轮询](./file-status-polling.md) - 文件处理状态轮询
- [文件上传功能](./FileUpload/README.md) - 文件上传完整设计

### 代码实现

- [文件上传 Hook](../../src/hooks/useFileUpload.ts) - 文件上传实现
- [SaveController](../../src/utils/SaveController.ts) - 自动保存控制器
- [ChatCommon/Sender](../../src/components/ChatCommon/Sender/README.md) - 聊天发送器（使用文件上传）
- [OutlineTreeEditor](../../src/components/outline/OutlineTreeEditor/README.md) - 大纲编辑器（使用自动保存）
- [ReportEditor](../../src/components/ReportEditor/README.md) - 报告编辑器（使用自动保存）
