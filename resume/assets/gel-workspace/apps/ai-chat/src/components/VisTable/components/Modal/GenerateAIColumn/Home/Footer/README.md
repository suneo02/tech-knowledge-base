# GenerateAIColumn Footer 组件功能文档

## 概述

该组件是 AI 生成列功能的底部操作区域，主要包含"保存不运行"和"运行全部"两个核心功能按钮。

## 核心功能

### 1. 保存不运行 (handleSaveNoRun)

创建 AI 列但不立即执行生成，只保存配置。

### 2. 运行全部 (handleRunAll)

创建 AI 列并立即对所有数据行执行 AI 生成操作。

## 方法调用链路分析

### handleSaveNoRun 调用链路

```
handleSaveNoRun()
├── aiInsertColumn(RunTypeEnum.SAVE_BUT_NOT_RUN)
│   ├── nanoid(14) - 生成列ID
│   ├── form.getFieldsValue() - 获取表单数据
│   ├── processMentions(prompt, columns) - 处理@提及
│   ├── requestToWFCSuperlistFcs(AI_INSERT_COLUMN_API, options) - API请求
│   ├── addColumn() - 添加列到表格
│   └── insertAIColumnHandler({ columnId, Data, runType })
│       ├── getDisplayRowIds() - 获取显示行ID
│       ├── updateRecords(rowData, updateIndexes) - 更新记录
│       └── selectCell(columns.length + 1, 0) - 选择单元格
├── onClose() - 关闭弹窗
└── generateColumnName({ prompt, columnId })
    ├── requestToSuperlistFcs(AI_GENERATE_COLUMN_NAME_API, {...}) - 生成列名API
    ├── getColByColumnId(columnId) - 获取列索引
    ├── setCellValue() - 设置单元格值
    └── generateUniqueName() - 生成唯一名称
```

### handleRunAll 调用链路

```
handleRunAll()
├── form.validateFields() - 表单验证
├── aiInsertColumn(RunTypeEnum.RUN_ALL)
│   └── [同 handleSaveNoRun 中的 aiInsertColumn 调用链路]
├── onClose() - 关闭弹窗
├── generateColumnName({ prompt, columnId })
│   └── [同上 generateColumnName 调用链路]
└── setTimeout(() => runColumn({ col: columns.length + 1 }), 1000) - 延迟运行列
```

## 涉及的组件和方法

### 外部依赖组件

- `@/components/VisTable/context/VisTableContext` - VisTable上下文
- `@/components/VisTable/hooks/useTableActions` - 表格操作hooks
- `wind/wind-ui` - UI组件库
- `antd` - Ant Design组件库

### API请求方法

- `requestToWFCSuperlistFcs()` - WFC超级列表API请求
- `requestToSuperlistFcs()` - 超级列表API请求

### 工具方法

- `nanoid()` - 生成唯一ID
- `processMentions()` - 处理@提及语法
- `generateUniqueName()` - 生成唯一名称

### Context方法 (useVisTableContext)

- `sheetId` - 工作表ID
- `getDisplayRowIds()` - 获取显示行ID列表
- `getColByColumnId()` - 根据列ID获取列索引

### Table操作方法 (useTableActions)

- `addColumn()` - 添加新列
- `updateRecords()` - 批量更新记录
- `selectCell()` - 选择指定单元格
- `setCellValue()` - 设置单元格值
- `runColumn()` - 运行指定列的AI生成

### 表单相关

- `form.getFieldsValue()` - 获取表单所有字段值
- `form.validateFields()` - 验证表单字段

### API端点

- `AI_INSERT_COLUMN_API`: 'superlist/excel/aiInsertColumn' - AI插入列接口
- `AI_GENERATE_COLUMN_NAME_API`: 'intelligentFill/generateColumnName' - 生成列名接口

### 枚举类型

- `RunTypeEnum.SAVE_BUT_NOT_RUN` - 保存但不运行
- `RunTypeEnum.RUN_ALL` - 运行全部
- `SourceTypeEnum.AI_GENERATE_COLUMN` - AI生成列源类型
- `AiToolEnum` - AI工具枚举

### 常量配置

- `COLUMN_GENERATING_TEXT` - 列生成中显示文本
- `GENERATE_TEXT` - 生成文本
- `superListTools` - 超级列表工具配置

## 主要数据流

1. 用户点击按钮 → 获取表单数据 → 处理@提及 → 构建工具配置
2. 发送API请求 → 添加列到表格 → **批量更新记录数据** → 生成列名
3. 关闭弹窗 → (运行全部时)延迟执行列运行

## 性能优化

### 批量更新优化 (v2.0)

针对大量数据场景（几万个单元格）进行了专门优化：

#### 优化策略

- **分批处理**: 每批处理100个单元格，避免一次性更新造成UI阻塞
- **requestAnimationFrame**: 使用RAF确保更新在浏览器空闲时间执行，保持60fps流畅度
- **可中断机制**: 支持取消正在进行的批处理任务，防止任务冲突
- **进度反馈**: 提供批处理进度日志，便于调试和监控

#### 实现细节

```typescript
const batchUpdateCells = (
  batchData: BatchUpdateItem[],
  onComplete?: () => void,
  onProgress?: (processed: number, total: number) => void
)
```

#### 配置参数

- `BATCH_SIZE`: 100 - 每批处理的单元格数量
- `BATCH_DELAY`: 16ms - 批次间间隔（约60fps）

#### 优化效果

- **内存使用**: 相比一次性更新减少内存峰值
- **UI流畅性**: 避免长时间阻塞主线程
- **用户体验**: 大数据更新时界面保持响应
- **可控性**: 支持任务取消和进度监控

### 批处理数据结构

```typescript
interface BatchUpdateItem {
  rowData: Omit<RowData, 'rowId'>
  updateIndex: number
}
```

## 错误处理

- 表单验证失败时阻止执行
- @提及检查：必须包含至少一个@列引用
- API请求异常处理
- 数据更新前的有效性检查
- 批处理任务冲突检查和自动取消
