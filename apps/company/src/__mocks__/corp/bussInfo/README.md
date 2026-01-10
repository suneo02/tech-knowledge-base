# 企业业务信息模拟数据

提供企业业务信息的模拟数据，用于开发和测试环境。

## 目录结构
```
bussInfo/
├── mockCO.ts                  # 公司模拟数据
├── mockCanada.ts              # 加拿大企业模拟数据
├── mockFCP.ts                 # FCP企业模拟数据
├── mockHK.ts                  # 香港企业模拟数据
├── mockInvestment.ts          # 投资企业模拟数据
├── mockMO.ts                  # 澳门企业模拟数据
├── mockNormal.ts              # 普通企业模拟数据
├── mockOverseas.ts            # 海外企业模拟数据
├── mockPerson.ts              # 个人企业模拟数据
├── mockPublic.ts              # 公共企业模拟数据
├── mockReligion.ts            # 宗教组织模拟数据
├── mockSchool.ts              # 学校机构模拟数据
├── mockSocialOrg.ts           # 社会组织模拟数据
├── mockTW.ts                  # 台湾企业模拟数据
└── index.ts                   # 入口文件
```

## 关键文件说明
- `index.ts` - 模拟数据入口，导出所有模拟数据
- `mockCO.ts` - 公司类型企业模拟数据
- `mockNormal.ts` - 普通企业模拟数据
- `mockPublic.ts` - 公共企业模拟数据
- `mockOverseas.ts` - 海外企业模拟数据集合

## 依赖示意
- 依赖：无（纯数据文件）
- 上游：企业信息API、企业详情组件
- 下游：企业列表页面、企业详情页面、测试用例

## 相关文档
- [企业数据模型](../../../docs/corp-data-model.md)
- [测试数据使用指南](../../../docs/mock-data-usage.md)