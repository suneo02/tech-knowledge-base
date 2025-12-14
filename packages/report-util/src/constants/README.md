# constants - 共享常量模块

## 🎯 一句话定位

集中管理**报告系统所需的配置常量**，包括API地址、超时时间、联系信息等**全局共享数据**。

## 📁 目录结构

```
src/constants/
├── api.ts                    # API相关常量（超时时间等）
├── common.ts                 # 通用常量
├── credit.ts                 # 信用相关常量
├── creditEvaluation.ts       # 信用评估常量
├── dd.ts                     # 数据字典常量
├── page.ts                   # 页面相关常量
├── ReportCfg.ts              # 报告配置常量
└── index.ts                  # 统一导出
```

## 🚀 核心常量

### API配置
| 常量 | 值 | 用途 |
| :--- | :--- | :--- |
| **`API_TIMEOUT`** | `180000` | API请求超时时间（毫秒） |

### 报告配置
| 文件 | 内容 | 用途 |
| :--- | :--- | :--- |
| **`ReportCfg.ts`** | 报告生成相关配置 | 报告参数、模板配置等 |
| **`page.ts`** | 页面相关常量 | 分页、页面配置等 |

### 业务常量
| 文件 | 内容 | 用途 |
| :--- | :--- | :--- |
| **`credit.ts`** | 信用相关常量 | 信用等级、评分标准 |
| **`creditEvaluation.ts`** | 信用评估常量 | 评估规则、阈值设置 |
| **`dd.ts`** | 数据字典 | 枚举值、状态映射 |

## 💡 使用示例

```typescript
import { API_TIMEOUT } from 'report-util/constants/api';
import { ReportCfg } from 'report-util/constants/ReportCfg';

// API请求配置
const fetchWithTimeout = (url: string) => {
  return fetch(url, { timeout: API_TIMEOUT });
};

// 报告配置
const reportConfig = {
  template: ReportCfg.DEFAULT_TEMPLATE,
  pageSize: ReportCfg.DEFAULT_PAGE_SIZE
};
```

## 🎯 设计原则

### 集中管理
- **唯一来源**: 所有常量在此模块统一定义
- **避免硬编码**: 业务代码中不出现魔法数字或字符串
- **版本控制**: 常量变更可追踪和回滚

### 模块化组织
- **按功能分类**: API、页面、业务等分类管理
- **按需导入**: 支持细粒度按需导入
- **类型安全**: TypeScript类型定义确保正确使用

## ⚠️ 注意事项

### 变更影响
- **全局影响**: 常量变更会影响所有使用方
- **测试要求**: 修改后需回归测试所有相关功能
- **版本兼容**: 注意向后兼容性

### 配置管理
- **环境区分**: 支持开发、测试、生产环境不同配置
- **敏感信息**: 避免在常量中存储敏感数据

## 📖 相关文档

- [report-util 主文档](../README.md)
- [环境配置规范](../../../docs/rule/environment-config.md)