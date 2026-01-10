# 链接页面数据

提供开发环境下的链接页面数据配置，用于管理和展示系统中各种页面的链接。

## 目录结构

```
data/
├── KG.ts                      # 图谱平台链接数据
├── ScenarioApplication.ts     # 场景应用链接数据
├── detail.ts                  # 详情页链接数据
├── featured.ts               # 特色企业列表链接数据
├── index.ts                   # 数据统一导出和处理
├── misc.ts                    # 其他链接数据
├── qualifficationCodeMap.json # 资质代码映射表
├── qualification.ts           # 资质相关链接数据
├── search.ts                  # 搜索页面链接数据
└── user.ts                    # 用户中心链接数据
```

## 关键文件说明

| 文件 | 作用 |
|------|------|
| `index.ts` | 统一导出所有链接数据，提供`getLinksDataList`和`LinkGroupsData`用于获取链接配置 |
| `KG.ts` | 图谱平台相关链接数据，包括股权穿透、对外投资、实控人等图谱功能 |
| `search.ts` | 搜索页面链接数据，包括查企业、查人物、查招投标等搜索功能 |
| `qualifficationCodeMap.json` | 资质代码映射表，用于生成资质详情页链接 |

## 主要功能

- **链接配置管理**: 集中管理系统中所有页面的链接配置
- **分类组织**: 按功能模块组织链接，如图谱平台、综合查询、资质大全等
- **动态生成**: 支持基于配置动态生成链接，如基于资质代码映射生成资质详情页链接
- **分组展示**: 提供`LinkGroupsData`用于按分组展示链接

## 数据结构

### 链接项结构
```typescript
interface LinkItem extends TLinkOptions {
  title: string      // 链接标题
  module: LinksModule // 链接所属模块
}
```

### 链接分组结构
```typescript
interface LinkGroup {
  title: string      // 分组标题
  data: LinkItem[]   // 分组内的链接数据
}
```

## 依赖关系

- **上游**: 链接处理模块(`@/handle/link`)、链接页面组件(`../`)
- **下游**: 开发环境链接页面
- **协作**: 各功能模块的链接枚举定义

## 相关文档

- [链接处理模块](../../../handle/link/README.md)
- [链接页面组件](../README.md)
- [开发环境页面](../../README.md)