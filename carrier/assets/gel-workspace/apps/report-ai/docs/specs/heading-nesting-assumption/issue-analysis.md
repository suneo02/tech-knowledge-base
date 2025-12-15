# 问题分析 - 标题嵌套假设问题

> 📖 [返回问题概览](./README.md) | 遵循 [Issue 文档编写规范](../../../../../docs/rule/issue-doc-rule.md)

## 背景与预期

报告编辑器通过解析 HTML 文档提取章节结构，核心逻辑假设标题标签（h1-h6）与内容节点是平级的（siblings）。

**标准结构**：

```html
<body>
  <h1>第一章</h1>
  <p>内容段落1</p>
  <p>内容段落2</p>
  <h2>第二章</h2>
  <p>内容段落3</p>
</body>
```

## 问题陈述

### 现象

1. **解析逻辑依赖平级结构**：`getContentNodesAfterHeading` 使用 `headingElement.nextSibling` 遍历内容节点，假设标题与内容是平级的
2. **嵌套结构未验证**：如果 h 标签被嵌套在 div 或其他容器中，可能导致内容收集不完整或错误
3. **缺少结构验证**：解析流程没有校验或规范化 HTML 结构，未确保 h 标签在最外层

**来源**：@see `foundation/chapterStructure.ts:109-130`

### 根因

1. **设计假设未文档化**：`getContentNodesAfterHeading` 隐式依赖平级结构，未在文档或代码中明确声明
2. **缺少预处理步骤**：文档解析流程直接使用原始 HTML，未进行结构规范化
3. **未覆盖异常场景**：测试用例可能未涵盖嵌套标题的场景

**来源**：

- @see `foundation/chapterStructure.ts:109-130` - getContentNodesAfterHeading 实现
- @see `document/parse.ts:108-208` - collectChapterSegments 实现

### 影响

- **解析失败风险**：如果 AI 生成或用户粘贴的 HTML 包含嵌套标题，可能导致章节内容丢失
- **数据完整性问题**：内容收集不完整会导致保存的章节数据不准确
- **用户体验差**：解析错误会导致编辑器显示异常，用户可能无法正常编辑
- **维护隐患**：隐式假设未明确文档化，后续维护可能引入 bug

### 潜在场景示例

```html
<!-- 场景 1: 标题被嵌套在容器中 -->
<body>
  <div class="section">
    <h1>标题 1</h1>
    <p>内容 1</p>
  </div>
  <div class="section">
    <h2>标题 2</h2>
    <p>内容 2</p>
  </div>
</body>

<!-- 场景 2: 标题与内容在不同容器中 -->
<body>
  <header>
    <h1>标题 1</h1>
  </header>
  <section>
    <p>内容 1</p>
  </section>
</body>

<!-- 场景 3: 复杂嵌套结构 -->
<body>
  <article>
    <div class="header">
      <h1>标题 1</h1>
    </div>
    <div class="content">
      <p>内容 1</p>
    </div>
  </article>
</body>
```

## 关键参考

| 文档/代码路径                                                   | 作用                             | 备注                   |
| --------------------------------------------------------------- | -------------------------------- | ---------------------- |
| `foundation/chapterStructure.ts:109-130`                        | getContentNodesAfterHeading 实现 | 依赖 nextSibling 遍历  |
| `foundation/chapterStructure.ts:142-171`                        | getContentHtmlAfterHeading 实现  | 同样依赖平级结构       |
| `document/parse.ts:108-208`                                     | collectChapterSegments 实现      | 使用 getContentHtml... |
| `chapter/parse.ts:36-62`                                        | parseChapterContent 实现         | 使用 getContentHtml... |
| [文档编写规范](../../../../../docs/rule/documentation-rule.md)  | 文档规范                         | 代码假设需明确文档化   |
| [TypeScript 规范](../../../../../docs/rule/typescript-rule.md)  | 代码规范                         | 边界条件处理           |
| [错误处理规范](../../../../../docs/rule/error-handling-rule.md) | 错误处理                         | 异常场景处理           |

## 相关代码片段

```typescript
// chapterStructure.ts:109-130
export const getContentNodesAfterHeading = (headingElement: Element): Node[] => {
  const nodes: Node[] = [];
  let nextNode = headingElement.nextSibling; // ⚠️ 假设内容节点与标题平级

  while (nextNode) {
    if (nextNode.nodeType === Node.ELEMENT_NODE) {
      const element = nextNode as Element;
      const level = getHeadingLevel(element);

      if (level > 0) {
        break; // 遇到下一个标题停止
      }
    }

    nodes.push(nextNode);
    nextNode = nextNode.nextSibling; // ⚠️ 只查找同级节点
  }

  return nodes;
};
```

## 更新记录

| 日期       | 修改人 | 更新内容             |
| ---------- | ------ | -------------------- |
| 2025-10-29 | Kiro   | 从主文档拆分问题分析 |
