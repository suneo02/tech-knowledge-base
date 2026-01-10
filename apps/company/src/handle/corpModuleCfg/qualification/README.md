# 企业模块配置资质模块

负责企业各类资质证书、许可证、备案信息等资质管理业务逻辑处理。

## 目录结构
```
qualification/
├── ListInfo.tsx               # 列表信息组件
├── adminLicenseBureau.tsx     # 行政许可证-局方
├── adminLicenseChina.tsx      # 行政许可证-中方
├── creditInvestigationFiling.ts # 征信备案
├── financialInfo.ts           # 财务信息
├── gameApproval.tsx           # 游戏审批
├── index.ts                   # 入口文件
├── listInformation.tsx        # 列表信息展示
├── qualifications.tsx         # 资质信息
└── selectList.tsx             # 选择列表组件
```

## 关键文件说明
- `index.ts` - 模块入口，导出所有资质相关功能
- `qualifications.tsx` - 企业资质信息展示与处理核心组件
- `adminLicenseBureau.tsx` - 局方行政许可证处理逻辑
- `adminLicenseChina.tsx` - 中方行政许可证处理逻辑
- `selectList.tsx` - 通用选择列表组件

## 依赖示意
- 依赖：`../base` - 企业基础信息
- 上游：企业详情页面、资质审核模块
- 下游：企业资质展示组件、许可证验证功能

## 相关文档
- [企业资质管理设计](../../../docs/corp-qualification-design.md)
- [行政许可证数据结构](../../../docs/admin-license-data-structure.md)