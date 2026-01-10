# CellRegistry API 参考手册

本文档详细说明 `CellRegistry` 组件库的所有 API 定义、参数说明、返回值及使用约束，方便开发人员快速查询和调用。

## 一、核心类型定义

### 1. RenderMode

渲染模式枚举，控制单元格展示形态。

```typescript
type RenderMode = 'inline' | 'expanded'
```

- `inline`：行内模式（默认），单行省略，适合表格列表场景。
- `expanded`：详情模式，完整展示内容，适合详情页/抽屉场景。

### 2. RenderParams

单元格渲染核心参数，包含渲染所需的全部上下文信息。

```typescript
interface RenderParams {
  value: unknown // 单元格原始值
  record: BasicRecord // 当前行完整数据
  column: BasicColumn // 当前列配置
  mode: RenderMode // 渲染模式
}
```

### 3. BasicColumn

表格列配置类型（继承自业务表格基础类型）。

```typescript
interface BasicColumn {
  title: React.ReactNode // 列标题
  dataIndex: string // 数据字段名
  key?: string // 列唯一标识（默认使用 dataIndex）
  type?: CellType | string // 数据类型（用于匹配渲染器）
  disableExpand?: boolean // 是否禁用抽屉扩展（仅对抽屉Addon生效）
  unit?: string // 数值单位（自定义扩展属性）
  [key: string]: unknown // 支持自定义扩展属性
}
```

### 4. BasicRecord

表格行数据类型（业务基础数据类型）。

```typescript
interface BasicRecord {
  id: string | number // 行唯一标识
  [key: string]: unknown // 动态字段，存储列对应数据
}
```

### 5. CellRenderer

单元格渲染器函数，负责将原始值转换为 React 节点。

```typescript
type CellRenderer = (params: RenderParams) => React.ReactNode
```

- 参数：`RenderParams` - 渲染上下文参数。
- 返回值：`React.ReactNode` - 渲染后的 React 节点。

### 6. CellAddonConfig

Addon 增强器配置项，支持条件、排序和参数传递。

```typescript
interface CellAddonConfig {
  name: string // Addon 名称（需与注册名称一致）
  options?: Record<string, unknown> // Addon 自定义参数
  order?: number // 执行顺序（数字越小越先执行，默认 0）
  condition?: (params: RenderParams) => boolean // 执行条件（返回 true 才执行）
}
```

### 7. CellAddon

单元格增强器函数，用于扩展单元格功能（如 tooltip、抽屉）。

```typescript
type CellAddon = (
  node: React.ReactNode, // 上一级渲染结果（或基础渲染结果）
  params: RenderParams, // 渲染上下文参数
  options?: Record<string, unknown> // 自定义配置参数（来自 CellAddonConfig）
) => React.ReactNode
```

- 作用：对基础渲染结果进行二次增强（如添加交互、样式调整）。
- 返回值：增强后的 React 节点。

### 8. UseCellRenderOptions

`renderCell` 方法的配置选项。

```typescript
interface UseCellRenderOptions {
  addons?: (string | CellAddonConfig)[] // 启用的 Addon 列表
}
```

### 9. RendererTypes

内置渲染器类型枚举（固化核心类型，避免隐式转换）。

```typescript
const RendererTypes = {
  MARKDOWN: 'md', // Markdown 类型
  INTEGER: String(ColumnDataTypeEnum.INTEGER), // 整数类型
  FLOAT: String(ColumnDataTypeEnum.FLOAT), // 浮点数类型
  PERCENT: String(ColumnDataTypeEnum.PERCENT), // 百分比类型
  NUMBER: 'number', // 通用数值类型（用于类型链查找）
  DEFAULT: '__default__', // 默认渲染器类型
} as const

type CellType = (typeof RendererTypes)[keyof typeof RendererTypes]
```

## 二、核心组件

### 1. CellRegistryProvider

全局注册中心提供者，用于初始化全局渲染器和 Addon，必须在应用入口包裹。

#### Props

| 参数名           | 类型                                                        | 必选 | 默认值 | 说明                        |
| ---------------- | ----------------------------------------------------------- | ---- | ------ | --------------------------- |
| children         | React.ReactNode                                             | 是   | -      | 子组件（应用主体内容）      |
| initialRenderers | Array<{ type: CellType \| string; renderer: CellRenderer }> | 否   | []     | 初始渲染器列表（全局生效）  |
| initialAddons    | Array<{ name: string; addon: CellAddon }>                   | 否   | []     | 初始 Addon 列表（全局生效） |

#### 使用示例

```tsx
<CellRegistryProvider initialRenderers={[]} initialAddons={[]}>
  <App />
</CellRegistryProvider>
```

### 2. CellView

便捷单元格渲染组件，直接使用注册中心的渲染逻辑，无需手动调用 `renderCell`。

#### Props

| 参数名 | 类型                          | 必选 | 默认值   | 说明              |
| ------ | ----------------------------- | ---- | -------- | ----------------- |
| value  | unknown                       | 是   | -        | 单元格原始值      |
| record | BasicRecord                   | 是   | -        | 当前行完整数据    |
| column | BasicColumn                   | 是   | -        | 当前列配置        |
| mode   | RenderMode                    | 否   | 'inline' | 渲染模式          |
| addons | (string \| CellAddonConfig)[] | 否   | []       | 启用的 Addon 列表 |

#### 使用示例

```tsx
<CellView value={record.companyName} record={record} column={column} mode="inline" addons={['drawer']} />
```

## 三、核心 Hooks

### 1. useCellRender

核心 Hook，提供单元格渲染能力和注册方法。

#### 返回值

| 字段名           | 类型                                                                            | 说明                                 |
| ---------------- | ------------------------------------------------------------------------------- | ------------------------------------ |
| renderCell       | (params: RenderParams, options?: UseCellRenderOptions) => React.ReactNode       | 单元格渲染函数                       |
| registerRenderer | (type: CellType \| string, renderer: CellRenderer, overwrite?: boolean) => () => void | 注册渲染器（全局生效，返回卸载函数） |
| registerAddon    | (name: string, addon: CellAddon, overwrite?: boolean) => () => void             | 注册 Addon（全局生效，返回卸载函数） |
| resolveRenderer  | (type?: CellType \| string) => CellRenderer                                     | 解析指定类型的渲染器                 |

#### 关键方法详情

##### renderCell

- 功能：根据列类型和配置，渲染单元格内容并应用 Addon 增强。
- 参数：
  - `params: RenderParams`：渲染上下文参数（必选）。
  - `options?: UseCellRenderOptions`：渲染配置（可选）。
- 返回值：`React.ReactNode` - 最终渲染节点。

##### registerRenderer

- 功能：注册全局渲染器。
- 参数：
  - `type: CellType | string`：渲染器类型（必选）。
  - `renderer: CellRenderer`：渲染器函数（必选）。
  - `overwrite?: boolean`：是否允许覆盖已存在的渲染器（默认 false）。
- 约束：核心类型（如 `md`、`integer`）需显式设置 `overwrite: true` 才能覆盖。

##### registerAddon

- 功能：注册全局 Addon。
- 参数：
  - `name: string`：Addon 名称（唯一标识，必选）。
  - `addon: CellAddon`：Addon 函数（必选）。
  - `overwrite?: boolean`：是否允许覆盖已存在的 Addon（默认 false）。

### 3. 顶层封装方法

提供便捷的全局注册/卸载封装函数（无需显式获取 Registry 实例）。

```typescript
// 注册渲染器（返回卸载函数）
registerRenderer(type: CellType | string, renderer: CellRenderer, overwrite?: boolean): () => void

// 卸载渲染器（调用之前注册时返回的卸载函数）
unregisterRenderer(type: string): void

// 注册 Addon（返回卸载函数）
registerAddon(name: string, addon: CellAddon, overwrite?: boolean): () => void

// 卸载 Addon（调用之前注册时返回的卸载函数）
unregisterAddon(name: string): void
```

使用示例：

```tsx
import { registerRenderer, unregisterRenderer, RendererTypes } from '@/components/CellRegistry'

const fn = registerRenderer(RendererTypes.MARKDOWN, ({ value }) => {
  const html = createStockCodeAwareMarkdownRenderer(true).render(String(value ?? ''))
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}, true)

// 需要恢复默认时：
fn() // 或者 unregisterRenderer(RendererTypes.MARKDOWN)
```

### 2. useLocalCellRender

局部注册 Hook，在组件内注册临时渲染器/Addon，组件卸载时自动清理。

#### 参数

| 参数名         | 类型                                                        | 必选 | 默认值 | 说明            |
| -------------- | ----------------------------------------------------------- | ---- | ------ | --------------- |
| localRenderers | Array<{ type: CellType \| string; renderer: CellRenderer }> | 否   | []     | 局部渲染器列表  |
| localAddons    | Array<{ name: string; addon: CellAddon }>                   | 否   | []     | 局部 Addon 列表 |

#### 使用约束

- 局部注册会覆盖全局同名渲染器/Addon，组件卸载后自动恢复全局配置。
- 局部注册的优先级高于全局注册。

#### 使用示例

```tsx
useLocalCellRender([{ type: 'tag', renderer: tagRenderer }], [{ name: 'localTooltip', addon: localTooltipAddon }])
```

## 四、工具常量

### STRINGS

国际化常量集合，统一管理组件内文本，方便外部复用。

```typescript
const STRINGS = {
  CLOSE: t('common.close', '关闭'), // 关闭按钮文本（支持i18n）
} as const
```

## 五、内置渲染器

注册中心默认提供以下渲染器，无需额外注册即可使用：

| 类型标识                   | 对应 RendererTypes     | 功能说明                                  | 适用场景                            |
| -------------------------- | ---------------------- | ----------------------------------------- | ----------------------------------- |
| 'md'                       | RendererTypes.MARKDOWN | 解析 Markdown 文本为 HTML                 | 富文本内容（如公司名称、描述）      |
| ColumnDataTypeEnum.INTEGER | RendererTypes.INTEGER  | 整数格式化（千分位分隔）                  | 整数类型数据（如员工数、注册资本）  |
| ColumnDataTypeEnum.FLOAT   | RendererTypes.FLOAT    | 浮点数格式化（保留2位小数）               | 浮点数类型数据（如营收、金额）      |
| ColumnDataTypeEnum.PERCENT | RendererTypes.PERCENT  | 百分比格式化（保留2位小数+%）             | 比例类型数据（如增长率、占比）      |
| 'number'                   | RendererTypes.NUMBER   | 通用数值格式化（适配整数/浮点数）         | 所有数值类型（用于类型链 fallback） |
| '**default**'              | RendererTypes.DEFAULT  | 直接渲染原始值（null/undefined 显示为空） | 未匹配到其他类型时兜底              |

## 六、使用约束与注意事项

1. **注册优先级**：局部注册（`useLocalCellRender`）> 全局初始注册（`initialRenderers`/`initialAddons`）> 内置默认配置。
2. **类型匹配**：列配置的 `type` 需与渲染器注册类型完全一致（大小写敏感），否则会触发兜底渲染。
3. **Addon 执行顺序**：
   - 未指定 `order` 时，按数组顺序执行。
   - 指定 `order` 时，按数值从小到大执行（相同 `order` 按数组顺序）。
4. **性能优化**：
   - 避免在 `CellView` 的 `addons` 中动态创建对象，建议提前定义为常量。
   - 复杂渲染器（如 JSON 解析、大量 DOM 节点）建议使用 `React.memo` 优化重渲染。
5. **错误处理**：
   - 渲染器/Addon 中抛出的错误会被 `renderCell` 捕获，开发环境打印日志，生产环境降级显示错误提示。
   - 自定义渲染器建议自行处理异常（如 JSON 解析失败、空值判断），提升用户体验。
6. **全局与局部注册**：
   - 全局注册适用于全应用通用的渲染逻辑（如日期、标签）。
   - 局部注册适用于特定页面的个性化需求（如页面专属格式、临时功能）。

## 七、常见问题解答

### Q1：如何覆盖内置渲染器？

A：注册时显式设置 `overwrite: true`，示例：

```tsx
registerRenderer(RendererTypes.MARKDOWN, customMdRenderer, true)
```

### Q2：Addon 如何根据条件动态启用？

A：使用 `CellAddonConfig` 的 `condition` 参数，示例：

```tsx
addons={[
  {
    name: 'drawer',
    condition: (params) => params.value !== null && params.value !== undefined, // 非空值才启用
  }
]}
```

### Q3：如何自定义新的数据类型渲染器？

A：1. 实现 `CellRenderer` 函数；2. 通过 `initialRenderers` 或 `registerRenderer` 注册；3. 列配置 `type` 指向注册的类型标识。

### Q4：局部注册的渲染器如何避免全局污染？

A：`useLocalCellRender` 会在组件卸载时自动恢复全局配置，无需手动清理，放心使用。

## 八、调试工具

开发环境自动注入调试接口到 `window.__CELL_REGISTRY_DEBUG__`，用于查看和重置注册信息：

```typescript
// 开发环境（自动注入）：
window.__CELL_REGISTRY_DEBUG__ = {
  // 获取已注册的渲染器类型
  getRegisteredRenderers: () => string[],
  // 获取已注册的 Addon 名称
  getRegisteredAddons: () => string[],
  // 清空注册表并恢复默认渲染器
  clearAll: () => void,
  // 当前版本
  version: '1.1.0',
}

// 控制台使用示例：
console.log(window.__CELL_REGISTRY_DEBUG__.getRegisteredRenderers())
console.log(window.__CELL_REGISTRY_DEBUG__.getRegisteredAddons())
```
