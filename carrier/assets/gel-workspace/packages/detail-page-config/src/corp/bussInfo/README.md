# 企业工商信息配置

企业工商信息展示的核心配置模块，提供差异化配置支持，满足不同国家、地区和企业类型的工商信息展示需求。

## 目录结构

```
bussInfo/
├── CO.json                           # CO 类型企业配置
├── defaultConfig.json                # 默认工商信息配置
├── rowsByCorpTypeId/                 # 按企业类型ID分类配置
│   ├── HK.json                       # 香港企业配置
│   ├── LS.json                       # LS 类型企业配置
│   ├── SH.json                       # 上海企业配置
│   └── index.ts                      # 企业类型配置导出
├── rowsByNation/                     # 按国家/地区分类配置
│   ├── canada.json                   # 加拿大企业配置
│   ├── england.json                  # 英国企业配置
│   ├── france.json                   # 法国企业配置
│   ├── germany.json                  # 德国企业配置
│   ├── india.json                    # 印度企业配置
│   ├── italy.json                    # 意大利企业配置
│   ├── japan.json                    # 日本企业配置
│   ├── korea.json                    # 韩国企业配置
│   ├── lux.json                      # 卢森堡企业配置
│   ├── malaysia.json                 # 马来西亚企业配置
│   ├── nzl.json                      # 新西兰企业配置
│   ├── russia.json                   # 俄罗斯企业配置
│   ├── singapore.json                # 新加坡企业配置
│   ├── tha.json                      # 泰国企业配置
│   ├── TW.json                       # 台湾企业配置
│   ├── vie.json                      # 越南企业配置
│   └── index.ts                      # 国家配置导出
├── rowsByOrgType/                    # 按组织类型分类配置
│   ├── FCP.json                      # FCP 类型配置
│   ├── FPC.json                      # FPC 类型配置
│   ├── GOV.json                      # 政府组织配置
│   └── index.ts                      # 组织类型配置导出
└── index.ts                          # 核心模块导出
```

## 关键文件说明

- **`index.ts`**: 核心模块文件，提供 `getCorpInfoConfigByInfo` 函数，实现智能配置匹配逻辑。
- **`defaultConfig.json`**: 默认工商信息配置，包含企业名称、统一社会信用代码、法定代表人等基础字段。
- **`rowsByCorpTypeId/index.ts`**: 企业类型配置导出模块，根据企业类型ID提供对应的配置。
- **`rowsByNation/index.ts`**: 国家配置导出模块，支持多国企业的差异化配置。
- **`rowsByOrgType/index.ts`**: 组织类型配置导出模块，针对不同组织类型提供专门配置。

## 配置匹配规则

`getCorpInfoConfigByInfo` 函数实现四层匹配机制：

1. **Config Type 优先**: 根据 `configType` 匹配特定组织类型配置
2. **Area Code 次优**: 根据 `areaCode` 匹配国家/地区配置
   - 海外企业默认使用加拿大配置（`areaCode` 以 18 开头）
3. **Corp Type ID 兜底**: 根据 `corp_type_id` 匹配企业类型配置
4. **Default 配置**: 以上均未匹配时使用默认配置

## 依赖示意

```
bussInfo/
├── 依赖 gel-types (CorpBasicInfo, ReportDetailNodeOrNodesJson)
├── 依赖 @/validation (validateReportDetailNodeOrNodesJson)
├── 内部依赖 rowsByCorpTypeId
├── 内部依赖 rowsByNation
├── 内部依赖 rowsByOrgType
└── 被企业详情页工商信息模块引用
    └── ../index.ts
```

## 配置特点

- **国际化支持**: 覆盖 15+ 国家和地区的差异化配置
- **类型区分**: 支持多种企业类型和组织类型
- **智能匹配**: 根据企业基础信息自动选择最优配置
- **灵活扩展**: 模块化设计便于新增国家和地区配置
- **统一验证**: 所有配置都经过标准化验证

## 支持的企业类型

- **国内企业**: HK（香港）、LS（ LS 类型）、SH（上海）
- **海外企业**: 加拿大、英国、法国、德国、日本、韩国、新加坡等
- **组织类型**: FCP、FPC、GOV 等特殊组织类型

## 相关文档

- [工商信息配置规范](../../../../docs/rule/business-info-config.md)
- [国际化配置标准](../../../../docs/rule/international-config.md)
- [企业详情页设计文档](../../../../docs/design/corp-detail-page.md)