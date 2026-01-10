# Link 模块重构设计

> 回链：[README.md](./README.md) | 状态：✅ 已完成

## 一、设计目标

- 统一内外部链接生成接口
- 集中环境配置管理
- 统一参数处理和错误处理
- 配置与逻辑分离
- 提升类型安全和测试覆盖

## 二、架构设计

### 2.1 整体架构

```
link/
├── core/                    # 核心基础设施（新增）
│   ├── generator.ts         # 统一生成器接口
│   ├── environment.ts       # 环境管理器
│   ├── params.ts            # 参数序列化器
│   └── error.ts             # 错误处理
├── config/                  # 内部模块配置
│   ├── data.ts              # 纯数据配置（新）
│   └── resolver.ts          # 配置解析器（新）
├── generators/              # 链接生成器（重构 out）
│   ├── internal.ts          # 内部模块生成器
│   ├── baifen.ts            # 百分生成器
│   ├── alice.ts             # Alice 生成器
│   └── ...
└── handle/                  # 统一入口
    └── index.ts             # generateUrl 入口
```

### 2.2 核心接口

#### 统一生成器类型

```typescript
// 链接生成器函数类型
type LinkGenerator<TParams = any> = (params: TParams, context: LinkContext) => string

// 链接上下文
interface LinkContext {
  isDev: boolean
  isTerminal: boolean
  isStaging?: boolean
  origin?: string
}
```

#### 环境管理函数

```typescript
// 获取当前环境上下文
function getContext(): LinkContext

// 获取服务 origin
function getOrigin(service?: GELService): string

// 获取 host 映射
function getHostMap(): Record<string, string>
```

#### 参数序列化函数

```typescript
// 转换为 query string
function toQueryString(params: Record<string, any>): string

// 转换为 hash 参数
function toHashParams(params: Record<string, any>): string
```

#### 错误处理

```typescript
// 创建链接生成错误
function createLinkError(module: string, reason: string, params?: any): Error
```

## 三、重构方案

### 3.1 统一链接生成

**方案：** 内外部使用统一的生成器函数

| 生成器函数         | 适用场景   | 实现方式     |
| ------------------ | ---------- | ------------ |
| generateFromConfig | 内部模块   | 基于配置生成 |
| generateBaiFenLink | 百分系统   | 自定义逻辑   |
| generateAliceLink  | Alice 系统 | 自定义逻辑   |

**优势：**

- 函数式，简洁直观
- 配置化和自定义可共存
- 便于测试和组合

### 3.2 环境配置中心化

**方案：** 纯函数管理所有环境判断

**核心函数：**

- `getContext()` - 检测当前环境（isDev、isTerminal、isStaging）
- `getOrigin(service?)` - 获取服务 origin
- `getHostMap()` - 获取 host 映射

**优势：**

- 环境逻辑集中
- 易于测试（函数参数注入）
- 无状态，无副作用

### 3.3 统一参数处理

**方案：** 使用纯函数统一处理参数

**核心函数：**

- `toQueryString(params)` - 转换为 query string
- `toHashParams(params)` - 转换为 hash 参数

**规范：**

- 统一使用 qs 库
- 统一编码规则
- 统一 null/undefined 处理

**优势：**

- 参数编码一致
- 函数可组合
- 易于测试

### 3.4 配置与逻辑分离

**方案：** 纯数据配置 + 运行时解析

**配置层（data.ts）：**

- 纯 JSON 可序列化数据
- 不包含函数调用
- 易于理解和维护

**逻辑层（resolver.ts）：**

- 运行时解析配置
- 处理环境差异
- 生成最终配置

**优势：**

- 配置可导出
- 逻辑可独立测试
- 性能可优化（缓存）

### 3.5 增强类型安全

**方案：** 集中管理参数类型 + 运行时校验

**类型管理：**

```typescript
export namespace LinkParams {
  export namespace BaiFen { ... }
  export namespace Alice { ... }
}
```

**校验机制：**

- 编译时类型检查
- 运行时参数校验
- 清晰的错误提示

### 3.6 统一错误处理

**方案：** 错误工厂函数

**核心函数：**

- `createLinkError(module, reason, params?)` - 创建标准错误

**错误信息包含：**

- 模块名称
- 失败原因
- 输入参数

**优势：**

- 错误信息完整
- 便于调试和监控
- 函数式，易组合

## 四、兼容性策略

### 4.1 向后兼容

- 保留现有导出接口
- 新旧实现并存过渡期
- 提供迁移工具

### 4.2 渐进式迁移

| 阶段   | 内容         | 影响范围 |
| ------ | ------------ | -------- |
| 阶段 1 | 基础设施搭建 | 无       |
| 阶段 2 | 内部模块重构 | 低       |
| 阶段 3 | 外部系统重构 | 中       |
| 阶段 4 | 废弃旧接口   | 高       |

## 五、性能考虑

### 5.1 配置缓存

- 使用闭包缓存解析后的配置
- 使用 memoize 缓存环境信息
- 减少重复计算

### 5.2 懒加载

- 外部系统生成器按需导入
- 减少初始化开销

## 六、设计权衡

| 方案       | 优势           | 劣势           | 选择 |
| ---------- | -------------- | -------------- | ---- |
| 完全配置化 | 统一、易维护   | 灵活性不足     | ❌   |
| 完全自定义 | 灵活性高       | 不统一、难维护 | ❌   |
| 混合模式   | 兼顾统一和灵活 | 复杂度略高     | ✅   |

## 更新记录

| 日期       | 修改人 | 更新内容     |
| ---------- | ------ | ------------ |
| 2025-01-XX | Kiro   | 创建设计方案 |
