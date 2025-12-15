# PDF 自动分页流程与实现

> 📌 **文档关联**
> - 上一篇: [PDF 分页架构设计](./pdf-pagination-architecture.md)
> - 返回: [README](./README.md)
> - 旧版文档: [PDF Pagination Design](./pdf-pagination-design.md)

## 整体工作流程

以下是系统从接收一个表格到最终完成分页的完整工作流程。

### 流程图

```mermaid
flowchart TD
    subgraph 初始化
        A[外部调用 PDFPage.addTable(table)] --> B[TableHandler 接收任务]
        B --> C[在当前页创建仅含表头的表格框架]
    end

    subgraph 核心循环 (逐行处理)
        C --> D{开始处理每一行}
        D --> E[添加一行 (N) 到表格中]
        E --> F{检查页面是否溢出 isCurrentPageHeightOverflow()}
    end

    subgraph 决策与处理
        F -- 否 (空间充足) --> D
        F -- 是 (空间不足) --> G{是在空白页上添加的第一行吗?}
        G -- 否 --> H[常规分页\n1. 移除溢出行 (N)\n2. 创建新页面 & 新表头\n3. 将行N及后续行设为新任务\n4. 返回 C]
        G -- 是 --> I[极端行处理\n调用 CellSplitter 分割行 (N)]
    end

    subgraph 极端行分割与后续
        I --> J[CellSplitter 返回 firstLineData 和 remainingData]
        J --> K[1. 将 firstLineData 渲染到当前行\n2. (可选) 创建新页]
        K --> L[将 remainingData 视作一个全新的行，放回待处理列表头部]
        L --> D
    end

    style I fill:#FDEDEC,stroke:#F1948A,stroke-width:2px
    style J fill:#FDEDEC,stroke:#F1948A,stroke-width:2px
```

### 步骤详解

1.  **启动与委托**: 外部调用 `PDFPage.addTable()`，`PDFPage` 将任务委托给 `TableHandler`。
2.  **框架初始化**: `TableHandler` 分析表格，提取所有行 (`<tr>`)，并在当前页面创建仅包含表头 (`<thead>`) 的表格框架。
3.  **逐行添加循环**: `TableHandler` 开始遍历所有待处理的行。在每一次循环中，它执行以下操作：
    -   将当前行追加到表格的 `<tbody>` 中。
    -   立即调用 `PDFPage.isCurrentPageHeightOverflow()` 检查页面是否溢出。
4.  **基于溢出状态的决策**:
    -   **情况A：未溢出 (Happy Path)**：页面空间充足，循环继续，处理下一行。
    -   **情况B：常规溢出**: 如果添加行导致溢出，且**不是**在空白页上添加的第一行，则执行**常规分页**：
        1.  移除导致溢出的那一行。
        2.  调用 `PDFPage.addPage()` 创建一个新页面。
        3.  在新页面上重新创建表格框架（含表头）。
        4.  将刚刚移除的行及所有后续行作为新的任务列表，返回步骤3的核心循环。
    -   **情况C：极端行溢出**: 如果添加的行导致溢出，且这**是**在空白页上添加的第一行（即该行自身高度超过一整页），则执行**极端行处理**:
        1.  调用 `splitForSingleLineFit` 函数对该行进行微观分割，得到 `firstLineData` (适配部分) 和 `remainingData` (剩余部分)。
        2.  将 `firstLineData` 的内容更新到当前行中，这部分保证了页面不会溢出。
        3.  如果 `remainingData` 不为空，则创建新页面，并将 `remainingData` 视作一个全新的、待处理的行，放回待处理列表的**最前端**。
        4.  返回步骤3的核心循环。`remainingData` 在下一次迭代中会被处理，它自身也可能是一个极端行，会被再次分割。

## 实际实现细节

### TableHandler 中的行处理

`TableHandler` 类中的 `handleAppendRow` 方法负责处理行的添加和可能的分页：

```typescript
// 处理极端行溢出的代码片段
const checkOverflow: CheckOverflowFn = ($elementToCheck: JQuery): boolean => {
  $testTableBody.append($elementToCheck)
  const overflows = this.pdfPage.isCurrentPageHeightOverflow()
  $elementToCheck.remove()
  return overflows
}

const { firstLineData, remainingData } = splitForSingleLineFit(
  originalCellsData,
  checkOverflow // 传递回调函数
)

// 添加适配到第一行的内容
if (firstLineData.some((cell) => cell.content.length > 0)) {
  const $firstFitRow = createRowFromData(firstLineData)
  $testTableBody.append($firstFitRow)
} else {
  console.log('PDFPage: 过高行的内容无法适配到当前页面的第一行。')
}

// 处理剩余数据
if (remainingData.length > 0 && remainingData.some((cell) => cell.content.length > 0)) {
  this.pdfPage.addPage() // 创建新页面
  this.createTableOnNewPage() // 在新页面创建新的表格框架（表头 + 空表体）

  // 将剩余的 CellData[] 转换回 JQuery 行以使用现有的 handleAppendRow 逻辑
  const $remainingRowAsJQuery = createRowFromData(remainingData)
  // 递归处理剩余行
  this.handleAppendRow($remainingRowAsJQuery)
}
```

### 错误处理与边界情况

实际实现中包含了多种错误处理机制：

1. 当 `splitForSingleLineFit` 函数遇到解析错误时，会记录错误并提供降级处理
2. 对于空内容或无法适配的内容，有专门的处理函数 `handleEmptyContent` 和 `handleNoFitContent`
3. 在极端情况下（如单个单元格内容过大），会尝试更细粒度的分割

通过这种宏观（页面管理）、中观（行处理）和微观（单元格内容分割）的三层架构，系统得以稳定、可靠地处理各种复杂的自动分页场景。