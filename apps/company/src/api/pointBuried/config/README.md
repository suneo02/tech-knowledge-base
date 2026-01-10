# 埋点配置

提供企业应用各模块的埋点事件配置和参数定义。

## 目录结构
```
config/
├── index.ts                     # 配置入口文件
├── type.ts                      # 类型定义
├── FrontAndSearch.ts            # 前端搜索埋点配置
├── KG.ts                        # 知识图谱埋点配置
├── character.ts                 # 人物埋点配置
├── company.ts                   # 公司埋点配置
├── featured.ts                  # 特色企业埋点配置
├── group.ts                     # 企业集团埋点配置
├── qualification.ts             # 资质埋点配置
├── ranking.ts                   # 排名埋点配置
├── special.ts                   # 特殊企业埋点配置
├── user.ts                      # 用户埋点配置
├── vip.ts                       # VIP功能埋点配置
├── DATA_EXPORT_REVIEW/          # 数据导出审核埋点
└── corp/                        # 企业相关埋点
    ├── detail.ts                # 企业详情埋点
    ├── oversea.ts               # 海外企业埋点
    └── report.ts                # 企业报告埋点
```

## 关键文件说明
- `index.ts` - 配置入口，导出所有埋点配置
- `type.ts` - 埋点事件类型和参数定义
- `company.ts` - 企业相关页面埋点配置
- `corp/` - 企业详情、报告等特定场景埋点
- `KG.ts` - 知识图谱模块埋点配置

## 依赖示意
- 依赖：无（纯配置文件）
- 上游：埋点收集服务、数据分析平台
- 下游：企业应用各页面组件、路由守卫

## 相关文档
- [埋点实施指南](../../../../../docs/point-buried-implementation.md)
- [数据分析规范](../../../../../docs/data-analysis-standard.md)