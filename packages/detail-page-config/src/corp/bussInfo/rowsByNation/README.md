# rowsByNation - 按国家/地区配置的企业信息

## 概述

rowsByNation 模块提供按国家/地区分类的企业信息配置，支持 16 个国家/地区的特定企业数据结构，用于企业详情页面的动态渲染。

## 目录结构

```
rowsByNation/
├── AUS.json          # 澳大利亚企业配置
├── BMU.json          # 百慕大企业配置
├── CAY.json          # 开曼群岛企业配置
├── CHN.json          # 中国企业配置
├── CYM.json          # 塞浦路斯企业配置
├── DEU.json          # 德国企业配置
├── FRA.json          # 法国企业配置
├── GBR.json          # 英国企业配置
├── HKG.json          # 香港企业配置
├── IDN.json          # 印度尼西亚企业配置
├── LIE.json          # 列支敦士登企业配置
├── LUX.json          # 卢森堡企业配置
├── NLD.json          # 荷兰企业配置
├── SGP.json          # 新加坡企业配置
├── USA.json          # 美国企业配置
├── VGB.json          # 英属维尔京群岛企业配置
└── index.ts          # 导出入口文件
```

## 配置列表

| 代码 | 国家/地区 | 配置文件 |
|------|-----------|----------|
| AUS | 澳大利亚 | AUS.json |
| BMU | 百慕大 | BMU.json |
| CAY | 开曼群岛 | CAY.json |
| CHN | 中国 | CHN.json |
| CYM | 塞浦路斯 | CYM.json |
| DEU | 德国 | DEU.json |
| FRA | 法国 | FRA.json |
| GBR | 英国 | GBR.json |
| HKG | 香港 | HKG.json |
| IDN | 印度尼西亚 | IDN.json |
| LIE | 列支敦士登 | LIE.json |
| LUX | 卢森堡 | LUX.json |
| NLD | 荷兰 | NLD.json |
| SGP | 新加坡 | SGP.json |
| USA | 美国 | USA.json |
| VGB | 英属维尔京群岛 | VGB.json |

## 使用方式

```typescript
// 直接导入特定国家配置
import { CHN } from './rowsByNation';

// 通过地区代码获取配置
import { corpConfigMapByAreaCode } from './rowsByNation';
const chinaConfig = corpConfigMapByAreaCode['CHN'];
```