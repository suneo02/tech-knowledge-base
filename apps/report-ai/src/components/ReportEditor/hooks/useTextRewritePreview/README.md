# 文本改写预览 Hook 模块

## 📁 文件结构

```
useTextRewritePreview/
├── README.md                              # 模块说明文档
├── types.ts                               # 类型定义
├── useTextRewritePreview.tsx              # 主 Hook 文件
└── utils/                                 # 工具模块
    ├── index.ts                           # 工具模块入口
    ├── calculatePreviewPosition.ts        # 预览位置计算
    ├── previewContainerManager.ts         # 容器管理
    └── previewRenderer.tsx                # 内容渲染
```

## 🔧 模块职责

### 主 Hook (`useTextRewritePreview.tsx`)
- 协调各个子模块
- 管理组件生命周期
- 处理状态变化和副作用

### 类型定义 (`types.ts`)
- `TextRewriteState` - 文本改写状态
- `UseTextRewritePreviewOptions` - Hook 配置选项
- `PreviewInstance` - 预览容器实例
- 其他相关类型定义

### 位置计算 (`calculatePreviewPosition.ts`)
- 根据选区位置计算悬浮容器定位
- 处理视口边界和空间限制
- 提供降级定位策略

### 容器管理 (`previewContainerManager.ts`)
- 创建和销毁悬浮容器
- 管理 React Root 实例
- 容器样式和 DOM 操作

### 内容渲染 (`previewRenderer.tsx`)
- 使用 AIAnswerMarkdownViewer 渲染内容
- 节流控制优化性能
- 支持加载状态和错误处理

## 🚀 使用方式

```tsx
import { useTextRewritePreview } from '@/components/ReportEditor/hooks';

const { cleanup } = useTextRewritePreview(editorRef, {
  entWebAxiosInstance,
  wsid: 'workspace-123',
  isDev: false,
  rewriteState: {
    isRewriting: true,
    correlationId: 'text_rewrite_123',
    snapshot: selectionSnapshot,
    previewContent: 'Generated content...',
    isCompleted: false,
  },
  onComplete: (content, snapshot) => {
    // 处理完成回调
  },
});
```

## 📊 拆分收益

- **代码可维护性**: 每个模块职责单一，易于理解和修改
- **可测试性**: 独立的工具函数更容易编写单元测试
- **可复用性**: 工具函数可以在其他场景中复用
- **团队协作**: 不同开发者可以并行维护不同模块