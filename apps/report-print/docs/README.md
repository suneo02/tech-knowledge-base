# report-print 技术文档

## 文档导航

### 📋 核心文档
- [Core Architecture](./core-architecture.md) - 组件职责、兼容性要求、工作流
- [Core Rendering Flow](./core-rendering-flow.md) - 四阶段渲染流程详解

### 🔧 技术方案

#### PDF 自动分页
- [PDF 分页架构设计](./pdf-pagination-architecture.md) - 三层分页架构与设计目标
- [PDF 分页流程实现](./pdf-pagination-process.md) - 分页工作流程与实现细节
- [PDF Pagination Design](./pdf-pagination-design.md) - 自动分页机制设计（旧版）

#### DOM 行分割
- [DOM 行分割问题与目标](./dom-based-row-problem-goals.md) - 行分割的核心问题与目标
- [DOM 行分割算法实现](./dom-based-row-algorithm-implementation.md) - 行分割算法与实现细节
- [DOM-based Row Splitting](./dom-based-row-splitting.md) - 表格行分割实现（旧版）

### 🛠️ 开发指南
- [Development Guide](./development.md) - 开发验证流程、构建和测试方法

### 📖 阅读顺序建议

1. **新人入门**: 先阅读[Core Architecture](./core-architecture.md)了解整体架构
2. **开发准备**: 阅读[Development Guide](./development.md)掌握开发验证流程
3. **流程理解**: 阅读[Core Rendering Flow](./core-rendering-flow.md)掌握渲染流程
4. **技术深入**: 
   - PDF分页: [PDF 分页架构设计](./pdf-pagination-architecture.md) → [PDF 分页流程实现](./pdf-pagination-process.md)
   - DOM行分割: [DOM 行分割问题与目标](./dom-based-row-problem-goals.md) → [DOM 行分割算法实现](./dom-based-row-algorithm-implementation.md)

### ⚠️ 重要提醒

所有开发都必须严格遵守[Core Architecture](./core-architecture.md#核心原则为-wkhtmltopdf-而生)中的兼容性要求，这是项目正常运行的基础。