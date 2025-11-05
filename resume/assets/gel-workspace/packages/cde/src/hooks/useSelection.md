# `useSelection` Hook 设计文档 (v3.0 - Minimal State)

## 1. 核心设计原则：最小化状态 (Core Principle: Minimal State)

v3.0 版本引入了全新的状态管理哲学：**`selectedValues` 集合只存储能代表当前选择状态的最小数据集。**

-   **最高节点优先 (Highest-Level-Node-Wins)**: 如果一个父节点被勾选，那么**只有父节点的 `value`** 会被存储在 `selectedValues` 中。其所有后代节点（无论多少层）的 `value` 都**不会**被存储。
-   **状态派生 (State Derivation)**: 任何一个节点的实际勾选状态 (`checked`) 都是在运行时动态派生出来的。一个节点被视为 `checked` 的条件是：
    1.  它自身的 `value` 存在于 `selectedValues` 中。
    2.  **或者**，它的任何一个祖先节点的 `value` 存在于 `selectedValues` 中。
-   **数据简洁性**: 这种方法确保了 `selectedValues` 始终保持最简状态，避免了冗余，使得状态的读取和持久化变得更高效。

## 2. 关键辅助函数 (Key Helpers)

为了实现这个模型，我们需要一个核心的辅助函数来判断节点的勾选状态。

### `isChecked(itemValue, selectedValues, parentMap)`

-   **作用**: 判断一个节点当前是否应为"勾选"状态。这是整个 Hook 中最核心的逻辑。
-   **流程**:
    1.  检查 `selectedValues.has(itemValue)`。如果为 `true`，直接返回 `true`。
    2.  如果为 `false`，则使用 `parentMap` 向上遍历该节点的所有祖先。
    3.  在遍历过程中，只要发现任何一个祖先的 `value` 存在于 `selectedValues` 中，就立即返回 `true`。
    4.  如果遍历完所有祖先都没有找到，则返回 `false`。

## 3. 关键函数与逻辑 (Key Functions and Logic)

关系查找表（`parentMap`, `childrenMap`, `descendantsMap`）依然是所有运算的基础。

### a. `calculateItemState(itemValue)`

计算任意节点的 UI 状态。

-   **`checked` 状态**: 完全由 `isChecked(itemValue, ...)` 的返回值决定。
-   **`indeterminate` (半选) 状态**: 一个节点处于半选状态，必须同时满足以下所有条件：
    1.  该节点**未被勾选** (`isChecked(itemValue, ...)` 返回 `false`)。
    2.  该节点拥有后代 (`descendantsMap.has(itemValue)`)。
    3.  它的后代中，**至少有一个**是 `checked` 状态。
    4.  它的后代中，**至少有一个**是 `unchecked` 状态。

### b. `handleItemChange(newChecked, itemValue)` - 单个节点状态变更

这是处理单个 Checkbox 用户交互的核心函数。它根据 `newChecked` 的值，内部调用 `_checkItem` 或 `_uncheckItem` 来执行相应的勾选或取消勾选逻辑。

-   **当 `newChecked` 为 `true` 时 (勾选操作，执行 `_checkItem`):**
    -   **流程**:
        1.  **清理后代 (Cleanup Descendants)**: 遍历 `itemValue` 的所有后代，将它们的 `value` 从 `newSelectedValues` 中全部移除。这是实现"最高节点优先"原则的关键。
        2.  **添加自身 (Add Self)**: 将 `itemValue` 添加到 `newSelectedValues`。
        3.  **向上整理 (Reconcile Ancestors)**: 从 `itemValue` 的父节点开始向上迭代检查。如果一个父节点的所有直属子节点现在都处于 `checked` 状态，那么这个父节点将被"整合"：它的所有直属子节点会从 `newSelectedValues` 中被移除，同时父节点自身会被添加进去。然后，检查会继续向上移动到更高一级的父节点，重复此过程，直至到达根节点或不再满足整合条件。

-   **当 `newChecked` 为 `false` 时 (取消勾选操作, 执行 `_uncheckItem`):**
    -   **流程**:
        1.  **找到责任祖先 (Find Responsible Ancestor)**: 找到是哪个 `value` (它自己或它的某个祖先) 在 `selectedValues` 中导致了 `itemValue` 被勾选。我们称之为 `anchorValue`。
        2.  **移除锚点 (Remove Anchor)**: 从 `newSelectedValues` 中移除 `anchorValue`。
        3.  **打散子集 (Break Apart Children)**: 获取 `anchorValue` 的所有**直属子节点**。将这些子节点的 `value` **全部添加**到 `newSelectedValues` 中，**除了**那个触发了本次取消操作的分支 (`itemValue` 或 `itemValue` 在这一层的祖先)。

### d. `handleGroupChange(newValuesForGroup, groupParentValue)`

处理 `Checkbox.Group` 的 `onChange`。此函数的实现逻辑较为复杂，因为它需要在一个原子操作中，模拟多次独立的勾选和取消勾选事件，以保证状态的最终一致性。

-   **流程**:
    1.  **计算差异 (Calculate Diff)**:
        -   首先，调用 `getGroupValue(groupParentValue)` 来获取在本次变更**之前**，该分组内有哪些子项被勾选。
        -   然后，将新旧两个 `value` 数组进行对比，计算出哪些子项是新**勾选**的 (`added`)，哪些是**被取消**的 (`removed`)。
    2.  **创建临时状态 (Create Intermediate State)**: 创建一个 `selectedValues` 的可变副本，后续所有操作都基于此副本进行，以确保所有变更的原子性。
    3.  **批量应用取消逻辑 (Batch Uncheck)**: 遍历 `removed` 数组。对于每一个被取消的 `value`，都在临时状态副本上执行一遍与 `handleUncheck` 完全相同的核心逻辑。
    4.  **批量应用勾选逻辑 (Batch Check)**: 遍历 `added` 数组。对于每一个新勾选的 `value`，都在临时状态副本上执行一遍与 `handleCheck` 完全相同的核心逻辑。
    5.  **最终回调 (Final Callback)**: 在所有变更都应用到临时状态副本上之后，调用一次 `onChange`，并传入最终计算出的状态。这确保了UI只会进行一次更新，且状态是完全一致的。


### e. `getGroupValue(groupParentValue: string): string[]`

-   **作用**: 计算并返回一个 `Checkbox.Group` 组件所需的 `value` 数组 (即其内部应被勾选的所有子项的 `value` 组成的数组)。
-   **调用时机**: 在渲染一个 `Checkbox.Group` 时，调用此函数以获取其 `value` prop。
-   **流程**:
    1.  接收 `groupParentValue` (即该 group 的父节点的 `value`)。
    2.  使用 `childrenMap` 查找出该父节点的所有**直属子节点**的 `value` 列表。
    3.  遍历这个子节点列表。
    4.  对每个子节点，调用核心辅助函数 `isChecked(childValue, ...)` 来判断它是否应该被视为 "勾选" 状态。
    5.  返回一个新数组，其中只包含那些 `isChecked` 返回 `true` 的子节点的 `value`。

## 4. 交互场景分析 (Use Cases)

-   **Case 1: 勾选父节点 "P"**
    -   `handleItemChange(true, "P")` 执行。
    -   `selectedValues` 中任何 P 的后代被移除。
    -   `"P"` 被加入 `selectedValues`。
    -   结果: `selectedValues` 包含 `"P"`。其子节点 C1, C2 虽未在 set 中，但 `isChecked("C1")` 会返回 `true`。

-   **Case 2: "P" 已勾选，此时取消其子节点 "C1"**
    -   `handleItemChange(false, "C1")` 执行。
    -   找到 `anchorValue` 是 `"P"`。
    -   从 `selectedValues` 中移除 `"P"`。
    -   获取 "P" 的所有直属子节点 (比如 C1, C2, C3)。
    -   将 C2, C3 添加到 `selectedValues` (C1 是被取消的分支，不添加)。
    -   结果: `selectedValues` 变为 `{ "C2", "C3" }`。

-   **Case 3: C2, C3 已勾选，此时勾选 C1**
    -   `handleItemChange(true, "C1")` 执行。
    -   将 `"C1"` 加入 `selectedValues`。此时 `selectedValues` 为 `{ "C1", "C2", "C3" }`。
    -   向上整理，检查父节点 "P"。发现其所有子节点 C1, C2, C3 都已被勾选。
    -   对 "P" 执行整合操作：移除 C1, C2, C3，添加 "P"。
    -   结果: `selectedValues` 变为 `{ "P" }`。