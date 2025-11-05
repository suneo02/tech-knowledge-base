# SectionHeading 章节标题组件

为报告、文档等具有层级结构的内容提供带序号标题的组件。

## 功能特点

- 支持带序号的标题渲染 (如 "1.2.3 标题内容")
- 支持动态更新序号和标题
- 支持选择标题级别 (h1-h6)
- 提供标题事件监听机制，支持外部状态同步
- 可独立使用或与其他组件组合

## 使用方法

```typescript
import { SectionHeadingView } from '@/comp/SectionHeading'

// 创建容器
const $container = $('#headingContainer')

// 创建章节标题视图实例
const sectionHeadingView = new SectionHeadingView($container, {
  // 初始化标题配置
  initialHeading: {
    numbers: [1, 2, 3], // 显示为 "1.2.3"
    title: '企业基本信息',
    hideNumber: true,
  },
  // 设置标题级别 (h1-h6)
  headingLevel: 3,
  // 是否启用标题点击事件
  enableHeadingClick: true,
})

// 添加标题事件监听器
sectionHeadingView.addHeadingEventListener((heading, eventType) => {
  console.log(`标题事件: ${eventType}`, heading)

  if (eventType === 'click') {
    // 处理标题点击事件
    scrollToSection(heading.numbers)
  } else if (eventType === 'update') {
    // 处理标题更新事件
    updateTOC(heading)
  }
})

// 渲染组件
sectionHeadingView.render()

// 更新章节标题
sectionHeadingView.updateHeading({
  numbers: [1, 2, 4],
  title: '更新后的标题',
})
```

## 与 SectionTable 组件集成

SectionHeadingView 可以与 SectionTable 组件配合使用，创建带标题的表格内容：

```typescript
import { SectionTable } from '@/comp/SectionTable'
import { ReportDetailTableJson } from 'gel-types'

const $container = $('#sectionContainer')
const sectionTable = new SectionTable($container, {
  initialHeading: {
    numbers: [2, 1],
    title: '财务数据',
    hideNumber: true,
  },
})

// 渲染带标题的表格
sectionTable.render(tableConfig, data)

// 通过 SectionTable 访问 SectionHeadingView
const headingView = sectionTable.getHeadingView()
```

## API 参考

### 构造函数选项

| 属性               | 说明                 | 类型                       | 默认值                                       |
| ------------------ | -------------------- | -------------------------- | -------------------------------------------- |
| className          | 自定义类名           | string                     | -                                            |
| initialHeading     | 初始章节标题配置     | SectionHeading             | { numbers: [], title: '', hideNumber: true } |
| headingLevel       | 标题级别 (1-6)       | 1 \| 2 \| 3 \| 4 \| 5 \| 6 | 3                                            |
| enableHeadingClick | 是否启用标题点击事件 | boolean                    | true                                         |

### SectionHeading 接口

| 属性       | 说明                                  | 类型                | 默认值 |
| ---------- | ------------------------------------- | ------------------- | ------ |
| numbers    | 序号数组，如 [1, 2, 3] 显示为 "1.2.3" | number[]            | []     |
| title      | 标题文本                              | string              | ''     |
| hideNumber | 是否显示序号                          | boolean             | true   |
| data       | 额外的数据属性                        | Record<string, any> | -      |

### 方法

| 方法名                     | 说明               | 参数                              | 返回值             |
| -------------------------- | ------------------ | --------------------------------- | ------------------ |
| render                     | 渲染组件           | heading?: Partial<SectionHeading> | SectionHeadingView |
| updateHeading              | 更新章节标题       | heading: Partial<SectionHeading>  | SectionHeadingView |
| getHeading                 | 获取当前标题设置   | -                                 | SectionHeading     |
| addHeadingEventListener    | 添加标题事件监听器 | listener: HeadingEventListener    | SectionHeadingView |
| removeHeadingEventListener | 移除标题事件监听器 | listener: HeadingEventListener    | SectionHeadingView |

### 事件类型

组件支持以下事件类型：

- `update`: 当标题被更新时触发
- `click`: 当标题被点击时触发（如果启用了标题点击）

## 注意事项

- 组件不会修改原始配置对象
- 事件监听器接收的是标题对象的副本，修改它不会影响组件内部状态
- 对于需要复杂标题结构的应用，建议使用外部状态管理模块来维护序号
