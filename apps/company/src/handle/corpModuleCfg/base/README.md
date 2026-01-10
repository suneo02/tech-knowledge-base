# 企业模块配置基础模块

负责企业基本信息、股权结构、行业分类等核心业务逻辑处理。

## 目录结构
```
base/
├── HKCorpInfo/cfg/           # 港企信息配置文件
├── ShowShareSearch/          # 股权搜索展示组件
├── baseIndustry/             # 基础行业分类处理
├── base.tsx                  # 基础组件
├── companyNotice.ts          # 公司公告处理
├── directIntest.tsx          # 直接利益相关
├── finalBeneficiary.ts       # 最终受益人
├── group.ts                  # 集团信息
├── index.ts                  # 入口文件
├── mainMember.ts             # 主要成员
├── showActualController.ts   # 实际控制人展示
└── ultimateBeneficiary.tsx   # 最终受益人组件
```

## 关键文件说明
- `index.ts` - 模块入口，导出所有基础功能
- `baseIndustry/` - 行业分类处理逻辑，包含行业选择与展示组件
- `ShowShareSearch/` - 股权信息展示与搜索功能
- `HKCorpInfo/cfg/` - 港企股权结构配置数据

## 依赖示意
- 依赖：`../qualification` - 资质信息处理
- 上游：企业详情页面、企业搜索功能
- 下游：企业基本信息展示组件

## 相关文档
- [企业模块配置设计](../../../docs/corp-module-cfg-design.md)
- [行业分类数据结构](../../../docs/industry-data-structure.md)