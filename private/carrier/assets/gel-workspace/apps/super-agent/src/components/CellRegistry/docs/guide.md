# CellRegistry 组件使用示例文档

本文档覆盖 `CellRegistry` 所有核心功能的使用场景，包含完整代码示例、技术细节和最佳实践，帮助快速上手低代码渲染器/增强器的配置与扩展，适配企业级项目开发需求。

## 版本历史

- v1.1.0：新增 `useLocalCellRender` Hook，支持组件级局部注册
- v1.0.0：初始版本，提供全局注册、基础渲染器及Addon机制
- 兼容性说明：API无破坏性变更，支持向下兼容

## 一、基础使用（快速集成）

### 1. 全局初始化（入口文件）

首先在应用入口注册 `CellRegistryProvider`，初始化全局渲染器和增强器（Addon）。

```tsx
// src/App.tsx
import React from 'react'
import { CellRegistryProvider } from '@/components/CellRegistry'
import { drawerAddon } from '@/components/CellAddon/DrawerAddon' // 假设抽屉Addon已实现
import AppRouter from './router'

const App = () => {
  // 初始注册全局Addon（如抽屉功能）
  const initialAddons = [{ name: 'drawer', addon: drawerAddon }]

  return (
    <CellRegistryProvider initialAddons={initialAddons}>
      <AppRouter />
    </CellRegistryProvider>
  )
}

export default App
```

### 2. 表格中使用 CellView 渲染单元格

在数据表格中直接使用 `CellView` 组件，自动适配列类型渲染。

```tsx
// src/pages/CompanyDirectory/CompanyTable.tsx
import React from 'react'
import { Table } from 'antd'
import { CellView, RenderMode } from '@/components/CellRegistry'
import type { BasicColumn, BasicRecord } from '@/components/CellRegistry'

// 表格列配置
const columns: BasicColumn[] = [
  {
    title: '公司名称',
    dataIndex: 'companyName',
    key: 'companyName',
    type: 'md', // 标记为Markdown类型，将自动使用MD渲染器
  },
  {
    title: '营收（万元）',
    dataIndex: 'revenue',
    key: 'revenue',
    type: String(ColumnDataTypeEnum.FLOAT), // 数值类型，自动格式化
  },
  {
    title: '增长率',
    dataIndex: 'growthRate',
    key: 'growthRate',
    type: String(ColumnDataTypeEnum.PERCENT), // 百分比类型，自动加%符号
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
    // 未指定type，使用默认渲染器
  },
]

// 模拟表格数据
const tableData: BasicRecord[] = [
  {
    id: '1',
    companyName: '**字节跳动**',
    revenue: 3800000,
    growthRate: 0.235,
    remark: '全球化布局中',
  },
  {
    id: '2',
    companyName: '[[腾讯控股]](https://example.com)',
    revenue: 5500000,
    growthRate: 0.182,
    remark: '游戏+社交双引擎',
  },
]

const CompanyTable = () => {
  return (
    <Table<BasicRecord>
      columns={columns.map((column) => ({
        ...column,
        render: (value, record) => (
          // 基础用法：直接渲染，自动匹配类型
          <CellView
            value={value}
            record={record}
            column={column}
            mode="inline" // 行内模式（单行省略）
            addons={['drawer']} // 启用抽屉Addon
          />
        ),
      }))}
      dataSource={tableData}
      rowKey="id"
    />
  )
}

export default CompanyTable
```

## 二、核心功能详解

### 1. 渲染器扩展（自定义数据类型渲染）

支持全局注册和局部注册两种方式，扩展新的数据类型渲染逻辑。

#### 1.1 全局注册（应用级生效）

在入口文件注册自定义渲染器，所有组件均可使用。

```tsx
// src/App.tsx（扩展全局渲染器）
import { CellRegistryProvider, RendererTypes } from '@/components/CellRegistry'
import { formatDate } from '@/utils/date' // 自定义日期格式化工具

// 自定义日期渲染器
const dateRenderer = ({ value }: RenderParams) => {
  if (!value) return '-'
  return <span style={{ color: '#1890ff' }}>{formatDate(value as Date, 'YYYY-MM-DD HH:mm')}</span>
}

const initialRenderers = [
  { type: 'date', renderer: dateRenderer }, // 注册自定义日期类型
  {
    type: RendererTypes.MARKDOWN,
    renderer: ({ value }) => {
      // 覆盖默认MD渲染器，增加自定义样式
      const source = typeof value === 'string' ? value : ''
      const html = createStockCodeAwareMarkdownRenderer(isDev).render(source)
      return <div dangerouslySetInnerHTML={{ __html: html }} style={{ lineHeight: 1.6 }} />
    },
    overwrite: true, // 必须显式开启覆盖
  },
]

const App = () => {
  return (
    <CellRegistryProvider initialRenderers={initialRenderers} initialAddons={[{ name: 'drawer', addon: drawerAddon }]}>
      <AppRouter />
    </CellRegistryProvider>
  )
}
```

#### 1.2 局部注册（组件级生效）

使用 `useLocalCellRender` Hook，在组件内注册临时渲染器，组件卸载后自动清理。

```tsx
// src/pages/CompanyDirectory/DetailTable.tsx
import React from 'react'
import { Table } from 'antd'
import { CellView, useLocalCellRender, RendererTypes } from '@/components/CellRegistry'

const DetailTable = () => {
  // 局部注册：仅当前组件生效的渲染器
  useLocalCellRender([
    {
      type: 'tag',
      renderer: ({ value }) => {
        // 自定义标签渲染器
        const tags = (value as string[]).map((tag) => (
          <span
            key={tag}
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 4,
              backgroundColor: '#f0f9ff',
              color: '#1890ff',
              marginRight: 4,
              fontSize: 12,
            }}
          >
            {tag}
          </span>
        ))
        return <div>{tags}</div>
      },
    },
    {
      type: RendererTypes.NUMBER,
      renderer: ({ value, column }) => {
        // 局部覆盖数值渲染器，增加千分位和单位
        const formatted = formatNumberByType(value, column?.type)
        return (
          <span>
            {formatted} {column?.unit || ''}
          </span>
        )
      },
      overwrite: true,
    },
  ])

  // 列配置中使用局部注册的渲染器
  const columns = [
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      type: 'tag', // 使用局部注册的tag渲染器
    },
    {
      title: '注册资本',
      dataIndex: 'registeredCapital',
      key: 'registeredCapital',
      type: RendererTypes.INTEGER,
      unit: '万元', // 自定义列属性，在局部渲染器中使用
    },
  ]

  const tableData = [
    { id: '1', tags: ['高新技术企业', '独角兽'], registeredCapital: 5000 },
    { id: '2', tags: ['上市公司', '制造业'], registeredCapital: 12000 },
  ]

  return (
    <Table
      columns={columns.map((col) => ({
        ...col,
        render: (value, record) => <CellView value={value} record={record} column={col} mode="expanded" />,
      }))}
      dataSource={tableData}
      rowKey="id"
    />
  )
}

export default DetailTable
```

### 2. Addon 增强器使用（功能扩展）

Addon 支持配置化使用，可设置条件、排序和参数，实现灵活的功能组合。

#### 2.1 基础用法（直接启用已注册的Addon）

```tsx
// 启用单个Addon
<CellView
  value={value}
  record={record}
  column={column}
  addons={['drawer']} // 直接指定Addon名称
/>

// 启用多个Addon（按顺序执行）
<CellView
  value={value}
  record={record}
  column={column}
  addons={['tooltip', 'drawer']} // 先执行tooltip，再执行drawer
/>
```

#### 2.2 高级用法（带配置的Addon）

支持条件过滤、排序和参数传递，满足复杂场景需求。

```tsx
// 假设已注册tooltipAddon（提示框增强器）和drawerAddon（抽屉增强器）
<CellView
  value={value}
  record={record}
  column={column}
  addons={[
    // 带参数的Addon
    {
      name: 'tooltip',
      options: {
        placement: 'top',
        maxWidth: 300,
      },
      order: 1, // 执行顺序：1（先执行）
    },
    // 带条件的Addon（仅数值类型列启用抽屉）
    {
      name: 'drawer',
      condition: (params) => {
        const { column } = params
        return [RendererTypes.INTEGER, RendererTypes.FLOAT].includes(column.type as RendererTypes)
      },
      order: 2, // 执行顺序：2（后执行）
    },
  ]}
/>
```

#### 2.3 自定义Addon（扩展新增强功能）

实现自定义Addon并注册，扩展单元格的交互功能。

```tsx
// src/components/CellAddon/TooltipAddon.tsx（自定义提示框Addon）
import React from 'react'
import { Popover } from 'antd'
import type { CellAddon, RenderParams } from '@/components/CellRegistry'

// 带参数的Tooltip Addon
export const tooltipAddon: CellAddon = (node, params, options) => {
  const { placement = 'top', maxWidth = 200 } = options || {}
  const { value } = params

  // 仅当值长度超过10时显示提示框
  if (typeof value === 'string' && value.length <= 10) return node

  return (
    <Popover
      content={<div style={{ maxWidth, wordBreak: 'break-all' }}>{node}</div>}
      placement={placement as any}
      trigger="hover"
    >
      {node}
    </Popover>
  )
}

// 注册到全局（src/App.tsx）
import { tooltipAddon } from '@/components/CellAddon/TooltipAddon'

const initialAddons = [
  { name: 'tooltip', addon: tooltipAddon },
  { name: 'drawer', addon: drawerAddon },
]
```

### 3. 模式切换（inline/expanded）

支持两种渲染模式，适配表格行内和详情页等不同场景。

#### 3.1 inline 模式（默认）

适合表格行内渲染，自动单行省略，MD类型自带弹窗预览。

```tsx
<CellView
  value={value}
  record={record}
  column={column}
  mode="inline" // 单行省略，占用空间小
  addons={['tooltip', 'drawer']}
/>
```

#### 3.2 expanded 模式（详情模式）

适合详情页或抽屉内渲染，完整展示内容，无省略。

```tsx
<CellView
  value={value}
  record={record}
  column={column}
  mode="expanded" // 完整展示，支持换行
  addons={['drawer']}
/>
```

### 4. 错误处理与降级显示

组件内置错误捕获机制，渲染失败时友好降级，开发环境提供详细日志。

```tsx
// 模拟错误场景（如值格式异常）
const errorData = {
  id: '3',
  companyName: '**异常数据**',
  revenue: '非数字值', // 数值列传入字符串，会触发渲染错误
  growthRate: 0.15
}

// 渲染时会自动捕获错误，显示友好提示
<CellView
  value={errorData.revenue}
  record={errorData}
  column={columns.find(c => c.dataIndex === 'revenue')!}
  fallback="数据加载失败" // 自定义降级提示
/>

// 开发环境控制台输出错误详情：
// ❌ Cell render failed: {
//   error: Error: 数值格式化失败,
//   column: 'revenue',
//   recordKey: '3',
//   value: '非数字值'
// }
```

## 三、常见场景示例

### 1. 复杂数据类型渲染（JSON格式）

注册JSON渲染器，实现JSON数据的格式化展示。

```tsx
// 1. 实现JSON渲染器
const jsonRenderer = ({ value }: RenderParams) => {
  if (!value) return '-'
  try {
    const jsonStr = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
    return (
      <pre
        style={{
          backgroundColor: '#f5f5f5',
          padding: 8,
          borderRadius: 4,
          fontSize: 12,
          overflowX: 'auto',
        }}
      >
        <code>{jsonStr}</code>
      </pre>
    )
  } catch (e) {
    return <span>JSON格式错误</span>
  }
}

// 2. 注册渲染器（全局或局部）
const initialRenderers = [{ type: 'json', renderer: jsonRenderer }]

// 3. 使用
const columns = [
  {
    title: '配置信息',
    dataIndex: 'config',
    key: 'config',
    type: 'json',
  },
]

const tableData = [
  {
    id: '1',
    config: { apiKey: 'xxx', timeout: 3000, enabled: true },
  },
]
```

### 2. 权限控制Addon（根据权限显示操作）

实现基于权限的操作按钮Addon，动态展示功能。

```tsx
// 1. 实现权限控制Addon
import { Button } from 'antd'
import { usePermission } from '@/hooks/usePermission'

export const permissionButtonAddon: CellAddon = (node, params, options) => {
  const { permissionKey, buttonText = '操作', onClick } = options || {}
  if (!permissionKey || !onClick) return node

  const { hasPermission } = usePermission()
  const canOperate = hasPermission(permissionKey as string)

  if (!canOperate) return node

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {node}
      <Button size="small" onClick={() => onClick(params.record)}>
        {buttonText}
      </Button>
    </div>
  )
}

// 2. 使用
;<CellView
  value={value}
  record={record}
  column={column}
  addons={[
    {
      name: 'permissionButton',
      options: {
        permissionKey: 'company:edit',
        buttonText: '编辑',
        onClick: (record) => handleEdit(record),
      },
      condition: (params) => params.mode === 'inline', // 仅行内模式显示
    },
  ]}
/>
```

## 四、性能优化

### 1. 渲染器优化

- 避免在渲染器中执行复杂计算、大量DOM操作，优先使用`useMemo`缓存计算结果，`React.memo`包装渲染组件。
- 示例：

```tsx
// 优化前（不推荐）
const badRenderer = ({ value }) => {
  // 复杂计算直接在渲染逻辑中执行
  const formattedValue = heavyCalculation(value)
  return <span>{formattedValue}</span>
}

// 优化后（推荐）
const OptimizedRenderer = React.memo(({ value }) => {
  const formattedValue = useMemo(() => heavyCalculation(value), [value])
  return <span>{formattedValue}</span>
})

const goodRenderer = ({ value }) => <OptimizedRenderer value={value} />
```

### 2. Addon配置优化

- Addon数组建议用`useMemo`固化，避免每次渲染创建新对象，减少不必要重渲染。
- 示例：

```tsx
const MyTable = () => {
  // 用useMemo缓存Addon配置
  const cellAddons = useMemo(() => [{ name: 'tooltip', options: { placement: 'top' } }], []) // 空依赖数组确保只创建一次

  return (
    <CellView
      value={value}
      record={record}
      column={column}
      addons={cellAddons} // 使用缓存的配置
    />
  )
}
```

### 3. 大数据场景优化

- 表格数据量超过1000条时，建议关闭非必要Addon（如`tooltip`），优先使用`inline`模式减少DOM节点数量。
- 对高频更新列（如实时数据），可通过`shouldUpdate`属性控制更新时机：

```tsx
<CellView
  value={value}
  record={record}
  column={column}
  shouldUpdate={(prevProps, nextProps) => {
    // 仅当值或关键属性变化时更新
    return prevProps.value !== nextProps.value || prevProps.mode !== nextProps.mode
  }}
/>
```

## 五、测试支持

### 1. 单元测试示例

```tsx
// 使用Jest + React Testing Library测试渲染器
import { render, screen } from '@testing-library/react'
import { CellView, CellRegistryProvider } from '@/components/CellRegistry'

describe('Number Renderer', () => {
  it('应正确格式化数值类型', () => {
    render(
      <CellRegistryProvider>
        <CellView value={1234567} column={{ type: 'number', key: 'test' }} record={{ id: '1' }} />
      </CellRegistryProvider>
    )

    // 验证数值格式化结果（千分位分隔）
    expect(screen.getByText('1,234,567')).toBeInTheDocument()
  })
})

// 测试Hook功能
import { renderHook, act } from '@testing-library/react-hooks'
import { useLocalCellRender, RendererTypes } from '@/components/CellRegistry'

test('局部注册应覆盖全局渲染器', () => {
  const { result } = renderHook(() =>
    useLocalCellRender([
      {
        type: RendererTypes.NUMBER,
        renderer: () => <span>自定义数值</span>,
        overwrite: true,
      },
    ])
  )

  const renderer = result.current.resolveRenderer(RendererTypes.NUMBER)
  const { container } = render(renderer({ value: 123 }))
  expect(container.textContent).toBe('自定义数值')
})
```

## 六、调试工具

开发环境提供调试接口，方便排查注册信息和渲染问题：

```typescript
// 开发环境自动注入window的调试API
if (process.env.NODE_ENV === 'development') {
  window.__CELL_REGISTRY_DEBUG__ = {
    // 获取所有注册的渲染器类型
    getRegisteredRenderers: () => Array.from(globalRenderers.keys()),
    // 获取所有注册的Addon名称
    getRegisteredAddons: () => Array.from(globalAddons.keys()),
    // 清空全局注册（用于测试环境重置）
    clearAll: () => {
      globalRenderers.clear()
      globalAddons.clear()
    },
    // 当前组件版本
    version: '1.1.0',
  }
}

// 使用示例（浏览器控制台）
// 查看所有注册的渲染器
console.log(window.__CELL_REGISTRY_DEBUG__.getRegisteredRenderers())
// 输出: ["md", "number", "date", "json"]
```

## 七、注意事项

1. **注册覆盖规则**：全局注册核心类型（如`md`、`integer`）时，需显式设置`overwrite: true`，否则会触发控制台警告并忽略覆盖操作。
2. **局部注册生命周期**：`useLocalCellRender`注册的渲染器/Addon会在组件卸载时自动恢复全局配置，无需手动清理，但需注意：

   - 避免在注册逻辑中引用外部大对象（如完整表格数据），防止闭包导致的内存占用
   - 局部注册优先级高于全局注册，同一类型会优先使用局部渲染器

3. **类型匹配规则**：列配置的`type`需与注册的渲染器类型完全一致（大小写敏感），否则会自动降级为`__default__`渲染器。

4. **Addon执行顺序**：当多个Addon同时生效时，按`order`值升序执行（值越小越先执行），未指定`order`的Addon默认按数组顺序执行。

5. **错误边界范围**：
   - 自动捕获：渲染器执行错误、Addon执行错误
   - 不捕获：异步操作错误（如`setTimeout`、接口请求）、事件处理器错误（如按钮点击回调）

## 八、浏览器兼容性

- **支持浏览器**：
  - Chrome ≥ 60
  - Firefox ≥ 55
  - Safari ≥ 12
  - Edge ≥ 79
- **兼容处理**：
  - IE11需补充`Map`、`Set` polyfill（推荐使用`core-js@3`）
  - 如需支持更低版本浏览器，需通过Babel转换ES6+语法（如箭头函数、解构赋值）

## 九、类型导出说明

全局索引文件导出所有公共类型，方便开发者导入使用：

```typescript
// src/components/CellRegistry/index.ts
export type {
  // 基础类型
  RenderMode,
  RenderParams,
  BasicColumn,
  BasicRecord,
  // 渲染器相关
  CellRenderer,
  RendererConfig,
  // Addon相关
  CellAddon,
  CellAddonConfig,
  CellAddonOptions,
  // Hook相关
  UseLocalCellRenderOptions,
  // 核心类型
  CellType,
}

export {
  // 组件
  CellRegistryProvider,
  CellView,
  // Hook
  useLocalCellRender,
  // 工具函数
  registerRenderer,
  unregisterRenderer,
  registerAddon,
  unregisterAddon,
  // 常量
  RendererTypes,
}
```
