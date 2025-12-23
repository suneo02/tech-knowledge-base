# 核心数据结构

## 表格配置体系

UI层通过解析配置中的 `type` 字段来决定使用哪种表格渲染器。所有表格的基础是**单元格配置**。

## 单元格基础配置

构成所有表格的最小原子，定义每个单元格的取值、渲染方式和行为。

| 属性 | 类型 | 描述 |
|------|------|------|
| `label` | `string` | 单元格的标题 |
| `prop` | `string` | 对应数据源中的key，用于自动取值 |
| `renderType` | `string` | 渲染器类型，告知UI使用何种组件渲染 |
| `renderConfig` | `object` | 渲染器配置，提供精细化控制参数 |
| `customRenderName`| `string` | 自定义渲染器名称，用于复杂渲染逻辑 |

## 渲染控制体系

### 常用渲染器类型

| `renderType` | 说明 | 常用场景 |
|--------------|------|----------|
| `'text'` | 格式化文本或数字 | 基础文本显示 |
| `'money'` | 货币格式化 | 金额字段显示 |
| `'date'` | 日期格式化 | 时间字段显示 |
| `'dateRange'`| 日期范围渲染 | 起止时间字段 |
| `'link'` | 超链接渲染 | 可点击链接 |
| `'tags'` | 标签组渲染 | 状态标签 |
| `'image'` | Logo图片渲染 | 企业标识 |
| `'html'` | HTML字符串渲染 | 复杂格式内容 |

### 自定义渲染器机制

**作用**：提供"逃生舱"机制，处理标准渲染器无法覆盖的复杂逻辑。

**机制**：
1. `customRenderName` 指定预定义字符串
2. 消费端维护名称到React组件的映射表
3. UI层忽略`renderType`，直接渲染自定义组件
4. 将整行数据作为props传入组件

## 三种核心表格类型

### 1. 垂直表格 (`type: 'verticalTable'`)

- **用途**：标准多行多列表格，顶部统一表头
- **结构**：`columns` 为一维数组
- **示例**：企业名单、财务数据列表

### 2. 横向表格 (`type: 'horizontalTable'`)

- **用途**：键值对样式表格，展示对象详情
- **结构**：`columns` 为二维数组，每个数组为一行
- **示例**：企业基本信息、详情页字段

### 3. 交叉表格 (`type: 'crossTable'`)

- **用途**：复杂交叉表格/透视表，行列都作为数据维度
- **结构**：定义行头、列头、单元格配置
- **示例**：财务报表、数据统计表

## 配置模块层次

```
ReportPageJson (根配置)
├── ModuleConfig[] (模块配置数组)
│   ├── baseInfo (基本信息)
│   ├── businessRisk (业务风险)
│   ├── finance (财务信息)
│   ├── intellectual (知识产权)
│   ├── qualification (资质信息)
│   └── risk (风险信息)
└── 特殊配置
    ├── 地区差异化配置
    └── 企业类型特殊配置
```

## 相关文档

- @see ../README.md - 包概述
- @see ./validation-design.md - 类型校验系统设计
- @see ./examples.md - 代码示例和使用方法
- @see ./node-configuration-design.md - 节点配置设计详解
- @see ./custom-nodes-complete-list.md - 自定义节点完整列表
- @see ./design.md - 整体设计文档