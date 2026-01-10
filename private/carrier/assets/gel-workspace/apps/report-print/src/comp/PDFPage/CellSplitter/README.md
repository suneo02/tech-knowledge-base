# CellSplitter - 表格单元格拆分器

## 概述

CellSplitter 是 PDF 报告生成模块中的表格单元格智能拆分工具集，用于处理单元格内容的自动拆分，确保报告的可读性和美观性。

## 目录结构

```
CellSplitter/
├── createRowFromData.ts              # 从数据创建表格行
├── extractCellsData.ts               # 提取单元格数据
├── extractSplittableDetailsFromUnit.ts # 从单元中提取可拆分详情
├── extractSplittableDetailsFromUnit.test.ts # 测试文件
├── getCellHtmlUnits.ts                # 获取单元格HTML单元
├── helper.ts                          # 通用辅助函数
├── splitForSingleLineFit.ts          # 单行适配拆分逻辑
├── splitTextualHtmlUnitByFit.ts      # 根据适配度拆分文本HTML单元
├── tryFineGrainedSplitAfterOverflow.ts # 溢出后的细粒度拆分
└── type.ts                            # 类型定义
```

## 主要功能

- **智能拆分算法**：根据单元格内容和页面空间，自动计算最佳拆分点
- **HTML 单元格处理**：支持处理包含 HTML 格式的单元格内容
- **溢出检测**：检测单元格内容是否超出页面边界
- **多级拆分**：支持对过高行进行多级拆分，提高空间利用率

## 关键类型

- `SplitOptions`: 拆分选项配置
- `CellData`: 单元格数据结构
- `SplitResult`: 拆分结果结构
- `HtmlUnit`: HTML 单元结构

## 使用示例

```typescript
import { splitForSingleLineFit, SplitOptions } from './type';

const options: SplitOptions = {
  baseSplitLength: 100,
  minSplitLength: 50,
  isBlankPage: false,
  maxRows: 3
};

const result = splitForSingleLineFit(cellData, options);
```