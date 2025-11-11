# detail-page-config - 详情页配置中心

**一句话定位**：提供配置即代码（Configuration as Code）的中央枢纽，生成驱动复杂详情页UI渲染的TypeScript配置对象。

## 目录树

```
packages/detail-page-config/
├── src/                        # 源代码目录
│   ├── corp/                   # 企业详情页配置模块
│   │   ├── baseInfo/           # 基本信息配置 (JSON + index.ts)
│   │   ├── businessRisk/       # 业务风险配置
│   │   ├── finance/            # 财务信息配置
│   │   ├── helper/             # 配置生成Helper函数
│   │   └── *.ts                # 主要配置生成函数
│   ├── validation/             # 配置验证模块
│   │   ├── schema/             # JSON Schema定义
│   │   └── validator/          # 无依赖验证器实现
│   └── index.ts                # 主入口文件
├── docs/                       # 文档目录
│   ├── architecture.md         # 架构说明
│   ├── design.md               # 设计文档
│   ├── data-structures.md      # 数据结构说明
│   ├── validation-design.md    # 类型校验设计
│   ├── node-configuration-design.md # 节点配置详解
│   ├── custom-nodes-complete-list.md # 自定义节点列表
│   ├── documentation-index.md  # 文档索引
│   └── examples.md             # 代码示例
├── dist/                       # 构建产物
├── package.json                # 包配置 (多入口点导出)
├── vite.config.ts              # Vite构建配置
└── README.md                   # 本文档
```

## 关键文件说明

- **src/corp/creditRP.ts** - 企业信用报告配置生成函数，整合所有模块并应用业务逻辑
- **src/corp/helper/\*** - 封装常用业务判断，如权限过滤、地区差异化处理
- **src/validation/schema/\*** - 从gel-types自动生成的JSON Schema，确保配置结构正确
- **package.json** - 定义多入口点导出，支持按需导入优化包体积

## 依赖示意

**上游依赖**：
- `gel-types` ← 提供共享的TypeScript类型定义

**下游消费**：
- `report-preview-ui` ← 使用配置渲染React组件
- `report-print` ← 使用配置生成PDF文档 (wkhtmltopdf环境)

**核心约束**：所有运行时代码必须兼容ES5，支持wkhtmltopdf的旧版JavaScript引擎

## 相关文档

- **设计文档** → @see docs/design.md
- **架构说明** → @see docs/architecture.md
- **数据结构** → @see docs/data-structures.md
- **类型校验设计** → @see docs/validation-design.md
- **节点配置详解** → @see docs/node-configuration-design.md
- **自定义节点列表** → @see docs/custom-nodes-complete-list.md
- **文档索引** → @see docs/documentation-index.md
- **代码示例** → @see docs/examples.md

## 核心约束

**wkhtmltopdf兼容**：所有运行时代码必须兼容ES5，支持wkhtmltopdf的旧版JavaScript引擎。详情参见代码示例文档。

**技术栈**：使用Vite构建，依赖gel-types提供类型定义，运行时零第三方依赖。 