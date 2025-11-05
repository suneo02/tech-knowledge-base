# ConfigTable 配置化表格组件

基于JSON配置的表格组件，能够自动识别并渲染普通表格或水平表格。

## 功能特点

- 支持通过 `ReportDetailTableJson` 配置数据自动生成表格
- 根据配置自动识别并选择合适的表格类型（普通表格或水平表格）
- 支持自定义样式、尺寸和加载状态
- 自动处理表格标题展示
- 提供错误处理机制

## 使用方法

```typescript
import { ConfigTable } from '@/comp/table'
import { ReportDetailTableJson } from 'gel-types'

// 准备表格配置
const tableConfig: ReportDetailTableJson = {
  title: '企业基本信息',
  titleId: '123456',
  columns: [
    // 普通表格配置 (一维数组)
    [
      { title: '企业名称', dataIndex: 'companyName', renderType: 'text' },
      { title: '成立日期', dataIndex: 'establishDate', renderType: 'date' },
    ],
  ],
}

// 数据源
const recordData = { companyName: '示例公司', establishDate: '2020-01-01' }

// 方法1: 使用render方法直接渲染到容器（需要容器）
const $container = $('#tableContainer')
const configTable = new ConfigTable($container, tableConfig, {
  bordered: true,
  size: 'default',
})
configTable.render(undefined, recordData)

// 方法2: 使用generate方法生成元素，然后手动添加到DOM（不需要预先设置容器）
const configTable2 = new ConfigTable(undefined, tableConfig, {
  bordered: true,
  size: 'default',
})
// generate返回jQuery元素，可以自行决定如何使用
const $tableElement = configTable2.generate(undefined, recordData)
$('#anotherContainer').append($tableElement)

// 方法3: 先创建实例，再设置容器并渲染
const configTable3 = new ConfigTable(undefined, tableConfig)
// 可以在任意时间点设置容器
configTable3.setContainer($('#dynamicContainer'))
// 然后渲染
configTable3.render(undefined, recordData)
```

## API 参考

### 构造函数选项

```typescript
constructor(
  $container?: JQuery,
  config?: ReportDetailTableJson,
  options?: ConfigTableOptions
)
```

| 参数       | 说明         | 类型                  | 是否必填 |
| ---------- | ------------ | --------------------- | -------- |
| $container | 表格容器元素 | JQuery                | 否       |
| config     | 表格配置     | ReportDetailTableJson | 否       |
| options    | 表格选项     | ConfigTableOptions    | 否       |

### 主要方法

| 方法名       | 说明                       | 参数                                                                       | 返回值      |
| ------------ | -------------------------- | -------------------------------------------------------------------------- | ----------- |
| generate     | 生成表格元素但不渲染到容器 | config?: ReportDetailTableJson, record?: any, options?: ConfigTableOptions | JQuery      |
| render       | 渲染表格到容器             | config?: ReportDetailTableJson, record?: any, options?: ConfigTableOptions | ConfigTable |
| setContainer | 设置或更改表格容器         | $container: JQuery                                                         | ConfigTable |
| setLoading   | 设置加载状态               | loading: boolean                                                           | ConfigTable |

### generate 和 render 的区别

- `generate()`: 根据配置创建并返回一个jQuery元素，不需要容器。适用于需要手动控制DOM插入的场景。
- `render()`: 将表格渲染到指定容器中，必须先设置容器（通过构造函数或setContainer方法）。内部会调用generate并将结果添加到容器。

### ConfigTableOptions 选项

| 属性       | 说明                 | 类型                             | 默认值    |
| ---------- | -------------------- | -------------------------------- | --------- |
| bordered   | 是否显示边框         | boolean                          | true      |
| size       | 表格大小             | 'default' \| 'middle' \| 'small' | 'default' |
| loading    | 是否显示加载状态     | boolean                          | false     |
| className  | 自定义类名           | string                           | ''        |
| labelWidth | 标签宽度（水平表格） | string \| number                 | '120px'   |

### ReportDetailTableJson 配置说明

| 属性        | 说明         | 类型                                                         | 是否必填 |
| ----------- | ------------ | ------------------------------------------------------------ | -------- |
| title       | 表格标题     | string                                                       | 否       |
| titleId     | 国际化标题ID | string \| number                                             | 否       |
| hiddenTitle | 是否隐藏标题 | boolean                                                      | 否       |
| columns     | 列配置       | ConfigTableCellJsonConfig[] \| ConfigTableCellJsonConfig[][] | 是       |
| api         | API接口配置  | string                                                       | 否       |

## 内部工作原理

1. 组件接收 `ReportDetailTableJson` 配置（通过构造函数或方法参数）
2. `generate()` 方法根据配置创建表格元素并返回
3. `render()` 方法调用 `generate()` 并将结果插入到容器中
4. 数据加载后，表格会自动更新显示内容

## 注意事项

- `generate()` 方法不需要容器，适合需要手动控制DOM插入的场景
- `render()` 方法需要容器，使用前必须通过构造函数或`setContainer()`设置容器
- 对于普通表格，数据源应该是一个记录数组
- 对于水平表格，`columns` 需要是二维数组结构，数据源是单个对象
