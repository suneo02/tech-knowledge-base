# 数据结构设计：统一配置源

> 所属任务：[企业详情页配置重复维护问题](./README.md)
> 文档版本：v1
> 创建日期：2024-11-07

## 统一配置结构

统一配置只保留可序列化的 JSON/元数据，通过 `contentConfigLoader` 延迟加载实现。

| 字段 | 说明 | 加载策略 |
| --- | --- | --- |
| `moduleKey` | 全局唯一键 | 同步 |
| `meta.title` | 展示标题 | 同步 |
| `meta.order` | 排序 | 同步 |
| `meta.statisticField` | 统计字段 | 同步 |
| `meta.menuConfig` | 菜单信息 | 同步 |
| `meta.visibility` | 过滤规则 | 同步 |
| `contentConfigLoader` | 动态 import 函数 | 按需 |

**约束**：`meta` 中不允许写入函数/JSX。

## 两层树结构 (Left/Middle 统一)

**数据模型**：

| 节点 | 字段 | 说明 |
| --- | --- | --- |
| Group | `groupKey` | 分组标识 |
| Group | `title` | 分组标题 |
| Group | `children` | moduleKey 数组 |
| Module | `moduleKey` | 引用统一配置 |

**示例**：

| groupKey | title | children |
| --- | --- | --- |
| basicProfile | 企业概况 | basicInfo, shareholder |
| risk | 风险预警 | judicialRisk, businessRisk |

## 类型定义

```typescript
// src/types/module-config.ts
export interface UnifiedModuleConfig {
  moduleKey: string
  meta: ModuleMeta
  contentConfigLoader: () => Promise<ContentConfig>
}

export interface ModuleMeta {
  title: string
  order: number
  statisticField?: string
  menuConfig?: MenuConfig
  visibility?: VisibilityRule
}

// src/types/module-tree.ts
export interface GroupNode {
  groupKey: string
  title: string
  children: string[] // moduleKeys
}
```
