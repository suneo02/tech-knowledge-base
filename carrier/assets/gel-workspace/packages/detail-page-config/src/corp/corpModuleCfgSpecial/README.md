# 特殊企业配置模块

针对特定国家/地区企业的特殊配置模块，提供差异化展示结构，满足不同地区企业的特殊信息展示需求。

## 目录结构

```
corpModuleCfgSpecial/
├── corpShareholderInfomationEngland.json   # 英国股东信息特殊配置
├── corpShareholderInfomationIndian.json    # 印度股东信息特殊配置
├── corpShareholderInfomationThailand.json  # 泰国股东信息特殊配置
└── index.ts                                 # 模块导出文件
```

## 关键文件说明

- **`index.ts`**: 模块核心导出文件，定义了特殊企业配置的导出接口，使用 `validateReportDetailTableJson` 进行表格配置验证。
- **`corpShareholderInfomationEngland.json`**: 英国企业股东信息特殊配置，针对英国企业的股东信息展示结构进行定制。
- **`corpShareholderInfomationIndian.json`**: 印度企业股东信息特殊配置，适配印度企业的股东信息展示需求。
- **`corpShareholderInfomationThailand.json`**: 泰国企业股东信息特殊配置，为泰国企业提供专门的股东信息展示配置。

## 依赖示意

```
corpModuleCfgSpecial/
├── 依赖 gel-types (ReportDetailTableJson)
├── 依赖 @/validation (validateReportDetailTableJson)
└── 被企业详情页特殊配置模块引用
    └── ../index.ts
```

## 配置特点

- **国家特化**: 针对特定国家的企业信息展示需求进行专门配置
- **股东信息**: 专注于股东信息的差异化展示
- **表格验证**: 使用 `validateReportDetailTableJson` 确保表格配置正确性
- **灵活扩展**: 便于新增其他国家的特殊配置

## 支持国家

- **英国**: 适配英国企业的股东信息展示标准
- **印度**: 符合印度企业股东信息披露规范
- **泰国**: 满足泰国企业股东信息展示要求

## 应用场景

- **跨境企业**: 为跨境投资提供符合当地标准的股东信息展示
- **合规需求**: 满足不同国家/地区的合规展示要求
- **本地化**: 提供符合当地商业习惯的信息展示结构

## 配置差异

相比标准股东信息配置，特殊配置可能包含：
- **字段差异**: 根据当地法规调整字段名称和类型
- **展示顺序**: 按照当地习惯调整信息展示优先级
- **数据格式**: 适配当地的数据格式和单位
- **合规要求**: 满足当地监管部门的披露要求

## 相关文档

- [特殊企业配置规范](../../../../docs/rule/special-corp-config.md)
- [国际化股东信息标准](../../../../docs/rule/international-shareholder.md)
- [企业详情页设计文档](../../../../docs/design/corp-detail-page.md)