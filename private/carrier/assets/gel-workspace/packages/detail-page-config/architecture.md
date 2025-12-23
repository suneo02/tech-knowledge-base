# detail-page-config 架构说明

## 目录职责
本模块是一个用于详情页的配置包，提供了多个模块化导出的配置信息，如企业信息(corp)和校验规则(validation)。

## 目录结构
```
├── src/                      # 源代码
│   ├── corp/                 # 企业详情页相关配置
│   ├── validation/           # 校验规则相关配置
│   └── index.ts              # 主入口，导出通用配置
├── dist/                     # Vite 打包后的产物
├── vite.config.ts            # Vite 构建配置文件
└── package.json              # 项目依赖和脚本配置
```

## 文件职责说明
- **src/corp/**: 存放与企业详情页相关的配置数据和类型。
- **src/validation/**: 存放用于详情页的校验逻辑和规则。
- **src/index.ts**: 导出该模块的通用配置和主功能。
- **package.json**: `exports` 字段定义了多个入口点，允许按功能分子模块导入。

## 模块依赖
- **gel-types**: 依赖共享的 TypeScript 类型。
- 被 `apps/report-preview`, `apps/report-print` 等应用所依赖。

## 相关文档
- @see README.md - 包概述
- @see docs/design.md - 设计文档
- @see docs/validation-design.md - 类型校验系统设计
- @see docs/examples.md - 代码示例和使用方法
