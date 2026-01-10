# Service

项目级别的服务层，提供统一的业务逻辑和数据访问能力

## 目录结构

```
service/
├── pdfService.ts            # PDF 文件加载和管理服务
├── eagles.ts                # Eagles 相关服务
└── bury.ts                  # 埋点服务
```

## 关键说明

- **pdfService.ts**: 提供统一的 PDF 加载能力，支持 GFS、URL、Blob 等多种方式
- **eagles.ts**: Eagles 系统相关的业务逻辑
- **bury.ts**: 用户行为埋点和数据上报

## 设计原则

- **统一接口**: 为相同类型的操作提供统一的 API
- **可复用**: 服务层逻辑可在多个组件和页面中复用
- **关注点分离**: 将业务逻辑从组件中抽离，组件只负责展示

## 相关文档

- [pdfService 详细文档](./pdfService.ts) - PDF 服务的完整 API 说明

---

> 📖 本文档遵循 [README 编写规范](../../../../docs/rule/doc-readme-structure-rule.md)

