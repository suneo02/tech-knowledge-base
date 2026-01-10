# Markdown处理工具

提供Markdown文档处理和转换的工具函数，包括源标记转换、AI答案格式化、实体链接插入和追踪标记等功能。

## 目录结构

```
md/
├── __tests__/                        # 测试文件目录
│   └── sourceMarkerIntegration.test.ts # 源标记集成测试
├── appendModelTypeInfo.ts             # 追加模型类型信息
├── convertNerLinksToHtml.ts          # NER链接转HTML
├── convertSourceMarkersToHtml.ts     # 源标记转HTML
├── filterTracesByValidSource.ts      # 按有效源过滤追踪
├── formatAIAnswer.ts                 # AI答案格式化
├── index.ts                          # 入口文件
├── insertEntityMarkdownLinks.ts      # 插入实体Markdown链接
├── insertTraceMarkers.ts             # 插入追踪标记
├── sourceMarkerUtils.ts              # 源标记工具
└── stripMarkdownAndTraces.ts         # 去除Markdown和追踪
```

## 关键文件说明

- `index.ts` - Markdown处理工具的入口文件
- `formatAIAnswer.ts` - AI答案格式化工具，用于格式化AI生成的答案
- `convertSourceMarkersToHtml.ts` - 源标记转HTML工具，将Markdown源标记转换为HTML
- `convertNerLinksToHtml.ts` - NER链接转HTML工具，处理命名实体识别链接
- `insertEntityMarkdownLinks.ts` - 插入实体Markdown链接工具
- `insertTraceMarkers.ts` - 插入追踪标记工具，用于在文本中插入追踪标记
- `filterTracesByValidSource.ts` - 按有效源过滤追踪工具
- `sourceMarkerUtils.ts` - 源标记处理工具集
- `stripMarkdownAndTraces.ts` - 去除Markdown和追踪标记工具
- `appendModelTypeInfo.ts` - 追加模型类型信息工具
- `__tests__/` - 测试文件目录
  - `sourceMarkerIntegration.test.ts` - 源标记集成测试

## 依赖示意

```
Markdown处理工具
├── 依赖: Markdown解析库
├── 依赖: HTML处理库
├── 依赖: 正则表达式库
└── 依赖: 文本处理工具
```

## 相关文档

- [GEL工具库文档](../../README.md)
- [通用工具文档](../README.md)
- [Markdown规范文档](../../../docs/markdown.md)