# 配置处理辅助工具

企业详情页配置处理的辅助工具模块，提供配置过滤、计算、数据处理等核心工具函数。

## 目录结构

```
helper/
├── getCorpModuleNum.ts               # 企业模块数字计算工具
├── filterReportConfigByBaseNum.ts    # 根据基础数字过滤配置
├── filterReportConfigByCorpType.ts   # 根据企业类型过滤配置
├── filterReportConfigByUser.ts       # 根据用户信息过滤配置
├── index.ts                          # 工具函数导出
├── processCorpBasicInfo.ts           # 企业基础信息处理工具
└── utils.ts                          # 通用工具函数
```

## 关键文件说明

- **`index.ts`**: 工具函数统一导出文件，提供所有辅助函数的对外接口。
- **`getCorpModuleNum.ts`**: 企业模块数字计算工具，用于计算企业各模块的数据数量和统计信息。
- **`filterReportConfigByBaseNum.ts`**: 根据基础数字过滤配置，实现基于数据量的配置动态筛选。
- **`filterReportConfigByCorpType.ts`**: 根据企业类型过滤配置，支持不同企业类型的差异化配置展示。
- **`filterReportConfigByUser.ts`**: 根据用户信息过滤配置，实现用户权限和偏好相关的配置筛选。
- **`processCorpBasicInfo.ts`**: 企业基础信息处理工具，提供企业基础数据的标准化处理功能。

## 依赖示意

```
helper/
├── 依赖 gel-types (CorpBasicInfo, ReportDetailConfig)
├── 依赖 lodash (工具函数库)
└── 被企业详情页各模块引用
    ├── ../baseInfo
    ├── ../business
    ├── ../finance
    └── ...
```

## 核心功能

### 配置过滤机制

- **数据量过滤**: 根据模块数据量动态调整展示配置
- **企业类型过滤**: 根据企业类型选择适合的配置模板
- **用户权限过滤**: 根据用户权限和角色过滤配置内容
- **地域过滤**: 根据企业所在地域调整配置

### 数据处理能力

- **数字统计**: 计算各模块的数据条数和统计指标
- **信息处理**: 标准化处理企业基础信息
- **配置优化**: 根据实际数据优化配置展示效果

## 配置特点

- **动态过滤**: 支持运行时根据条件动态过滤配置
- **类型安全**: 使用 TypeScript 确保函数类型安全
- **高性能**: 优化的算法确保配置处理性能
- **可扩展**: 模块化设计便于新增工具函数
- **复用性**: 通用工具函数可在多个模块中复用

## 应用场景

- **配置优化**: 根据企业实际情况优化展示配置
- **权限控制**: 根据用户权限控制信息展示范围
- **性能优化**: 通过配置过滤减少不必要的渲染
- **个性化展示**: 根据用户偏好调整展示内容

## 工具函数示例

```typescript
// 根据企业类型过滤配置
const filteredConfig = filterReportConfigByCorpType(
  baseConfig,
  corpType
);

// 根据用户权限过滤配置
const userConfig = filterReportConfigByUser(
  filteredConfig,
  userInfo
);

// 计算模块数据量
const moduleNum = getCorpModuleNum(corpData);
```

## 相关文档

- [配置处理规范](../../../../docs/rule/config-processing.md)
- [企业详情页性能优化](../../../../docs/rule/detail-page-performance.md)
- [TypeScript 工具函数规范](../../../../docs/rule/ts-utils.md)