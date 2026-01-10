# Custom - 表格单元格自定义渲染器

## 概述

Custom 模块提供表格单元格的自定义渲染器集合，支持企业信息、行业与业务、评级与状态、日期等多种数据类型的定制化展示。

## 目录结构

```
custom/
├── IntegrityInformationPenaltyStatus.ts  # 诚信信息处罚状态渲染器
├── bondIssueRating.ts                    # 债券发行评级渲染器
├── bussChangeInfo.ts                     # 业务变更信息渲染器
├── bussScope.ts                          # 业务范围渲染器
├── controllerInfo.ts                     # 控制人信息渲染器
├── creditRating.ts                       # 信用评级渲染器
├── date.ts                               # 日期渲染器
├── index.ts                              # 导出入口文件
├── litigationInfo.ts                     # 诉讼信息渲染器
├── listCo.ts                             # 上市公司信息渲染器
├── overseasInvestInfo.ts                 # 海外投资信息渲染器
├── pledge.ts                             # 质押信息渲染器
└── taxInfo.ts                            # 税务信息渲染器
```

## 支持的渲染器类型

| 渲染器类型 | 文件 | 功能描述 |
|-----------|------|----------|
| 企业信息 | controllerInfo.ts, listCo.ts | 控制人信息、上市公司信息 |
| 行业与业务 | bussChangeInfo.ts, bussScope.ts, overseasInvestInfo.ts | 业务变更、业务范围、海外投资 |
| 评级与状态 | bondIssueRating.ts, creditRating.ts, IntegrityInformationPenaltyStatus.ts | 债券评级、信用评级、诚信信息 |
| 其他 | date.ts, litigationInfo.ts, pledge.ts, taxInfo.ts | 日期、诉讼、质押、税务 |

## 使用方式

### 注册渲染器

```typescript
import { registerTableCellRenderer } from './index';

// 注册自定义渲染器
registerTableCellRenderer('customDate', dateRenderer);
```

### 表格配置中使用

```typescript
const columns = [
  {
    title: '日期',
    dataIndex: 'date',
    customRender: 'customDate' // 使用自定义渲染器
  }
];
```