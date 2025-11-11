# 文件管理页面 - 方案设计

> 📖 返回 [任务概览](./README.md)

## 需求背景

文件管理页面提供文件搜索筛选、批量上传、文件操作等功能，采用上下分区布局。

**需求来源**：@see [../../FileManagement/requirement.md](../../FileManagement/requirement.md)

## 核心功能

1. **搜索筛选**：文件名/企业名搜索、日期范围筛选、标签多选筛选
2. **文件上传**：批量上传（最多5个）、拖拽上传、企业关联
3. **文件列表**：表格展示、分页、状态显示、排序
4. **文件操作**：查看、下载、编辑（企业/标签）、删除

## 技术方案

### 页面布局
```
搜索筛选区域：文件名搜索、日期范围、标签筛选、上传按钮
文件列表区域：文件列表表格、分页控制
```

### 组件架构
```
FileManagement/
├── SearchFilter/           # 搜索筛选
├── FileList/              # 文件列表
├── FileUpload/            # 文件上传
├── FileActions/           # 文件操作
└── hooks/
    ├── useFileList.ts
    ├── useFileUpload.ts
    └── useFileStatusPolling.ts
```

### API接口
- **API定义**：@see [../../../packages/gel-api/src/chat/report/file.ts](../../../packages/gel-api/src/chat/report/file.ts)
- **上传API**：@see [../../docs/shared/FileUpload/api.md](../../docs/shared/FileUpload/api.md) - 文件上传接口规范
- **主要接口**：fileList、fileUpload、fileDelete、fileDownload、getTaskStatus

### 组件复用
| 组件 | 位置 | 用途 |
|------|------|------|
| ReferenceItemFile | @see [../../src/components/Reference/ReferenceItemFile/](../../src/components/Reference/ReferenceItemFile/) | 文件项展示 |
| FilePreviewRenderer | @see [../../src/components/Reference/FilePreviewRenderer/](../../src/components/Reference/FilePreviewRenderer/) | 文件预览 |
| useFileReferenceManager | @see [../../src/components/ChatCommon/Sender/hooks/useFileReferenceManager.ts](../../src/components/ChatCommon/Sender/hooks/useFileReferenceManager.ts) | 文件管理逻辑 |
| useFileUploadService | @see [../../../../src/hooks/useFileUploadService.ts](../../../../src/hooks/useFileUploadService.ts) | 统一文件上传服务 |

## 关键文件

### 核心实现
- **主页面**：@see [../../src/pages/FileManagement/index.tsx](../../src/pages/FileManagement/index.tsx)
- **文件列表**：@see [../../src/pages/FileManagement/components/FileList/index.tsx](../../src/pages/FileManagement/components/FileList/index.tsx)
- **列表Hook**：@see [../../src/pages/FileManagement/hooks/useFileList.ts](../../src/pages/FileManagement/hooks/useFileList.ts)

### 状态轮询
- **轮询设计**：@see [../../docs/shared/file-status-polling.md](../../docs/shared/file-status-polling.md) - 文件状态轮询设计文档
- **轮询Hook**：@see [../../../../src/hooks/useFileStatusPolling.ts](../../../../src/hooks/useFileStatusPolling.ts) - 智能轮询实现
- **状态判断**：@see [../../domain/file/fileStatus.ts](../../domain/file/fileStatus.ts) - 可变状态和完成状态判断

### Domain层
- **数据聚合**：@see [../../domain/file/aggregation.ts](../../domain/file/aggregation.ts)
- **统一导出**：@see [../../domain/file/index.ts](../../domain/file/index.ts)

## 技术约束

- **组件库**：@wind/wind-ui + gel-ui CorpPresearch
- **状态管理**：ahooks useRequest + useState
- **样式规范**：Less Module + BEM
- **开发规范**：@see [../../../docs/rule/react-rule.md](../../../docs/rule/react-rule.md)
- **TypeScript规范**：@see [../../../docs/rule/typescript-rule.md](../../../docs/rule/typescript-rule.md)

## 📝 更新记录

| 日期 | 修改人 | 更新内容 |
|------|--------|----------|
| 2025-01-27 | AI助手 | 简化文档，移除冗余内容，保留核心文件引用 |
| 2025-10-30 | 开发团队 | 初始版本创建 |

---

*最后更新：2025-01-27*