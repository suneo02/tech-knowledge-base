# 地区树配置

提供地区树形结构数据，包括中国大陆、港澳台及海外地区的层级划分，用于地区选择和地理信息展示。

## 目录结构

```
areaTree/
├── areaTreeCNMainland.json           # 中国大陆地区树（大文件）
├── areaTreeForeign.json               # 外国地区树
├── areaTreeHK.json                   # 香港地区树
├── areaTreeMacao.json                # 澳门地区树
├── areaTreeMapOversea.ts             # 海外地区映射
├── areaTreeTw.json                   # 台湾地区树
├── index.ts                          # 入口文件
└── type.ts                           # 类型定义
```

## 关键文件说明

- `index.ts` - 地区树配置的入口文件
- `type.ts` - 地区树相关的类型定义
- `areaTreeCNMainland.json` - 中国大陆地区树数据（大文件，545KB），包含完整的省市区层级结构
- `areaTreeForeign.json` - 外国地区树数据
- `areaTreeHK.json` - 香港地区树数据
- `areaTreeMacao.json` - 澳门地区树数据
- `areaTreeTw.json` - 台湾地区树数据
- `areaTreeMapOversea.ts` - 海外地区映射配置

## 数据结构

地区树采用层级结构，通常包含以下层级：
- 国家/地区
- 省/州/特别行政区
- 市
- 区/县

## 依赖示意

```
地区树配置
├── 依赖: JSON数据
├── 依赖: TypeScript类型定义
├── 依赖: 地理编码标准
└── 依赖: 国际化配置
```

## 相关文档

- [GEL工具库文档](../../README.md)
- [配置文档](../README.md)
- [行业树配置](../industryTree/README.md)