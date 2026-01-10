# 股东穿透持股路径展开逻辑分析

## 问题描述

用户反馈：内容为一行半，但是展示了展开组件，点击展开之后什么也没有变多。

## 根本原因分析

### 1. 判定逻辑不一致

- **JS 判定**：使用字符长度（`textLength > 80`）估算显示高度。
- **CSS 表现**：使用 `-webkit-line-clamp: 2` 限制视觉高度。
- **冲突点**：80 个字符在某些情况下（如包含大量短名字或英文）不足以填满 2 行，导致 JS 判定需要展开，但 CSS 实际上并未截断内容。

## 解决方案评估

### 方案一：调整阈值（快速修复）

- **做法**：将触发阈值从 `80` 提高到 `150` 或 `200`。
- **优点**：改动极小，风险可控。
- **缺点**：仍然是估算，无法覆盖所有极端情况（如极宽屏幕或极窄列宽），可能导致长文本被截断但无展开按钮，或短文本仍有展开按钮。

### 方案二：使用 Ant Design `Typography.Paragraph`（推荐尝试）

- **做法**：利用项目已有的 `antd` 库。

  ```tsx
  import { Typography } from 'antd';

  // 需确认 SharePathRenderer 的输出是否能被 Typography 正确处理
  <Typography.Paragraph
    ellipsis={{
      rows: 2,
      expandable: true,
      symbol: '展开',
      onExpand: handleExpand // 可结合异步加载
    }}
  >
    <SharePathRenderer ... />
  </Typography.Paragraph>
  ```

- **优点**：
  - **所见即所得**：基于浏览器渲染结果自动判断是否需要截断。
  - **标准组件**：维护成本低，交互体验好。
- **注意**：需验证 `SharePathRenderer` 生成的复杂 DOM（多行 div）在 `Typography` 中的表现。

### 方案三：封装通用 `AutoExpandable` 组件（最佳通用解）

- **做法**：创建一个基于 `ResizeObserver` 或 `scrollHeight` 检测的通用组件。
- **逻辑**：
  1. 渲染内容到容器中。
  2. 检测 `container.scrollHeight > container.clientHeight`。
  3. 如果溢出，显示“展开”按钮；否则隐藏。
- **代码示例结构**：
  ```tsx
  const AutoExpandable = ({ children, maxLines = 2 }) => {
    const [showExpand, setShowExpand] = useState(false)
    // ... 使用 useLayoutEffect 检测高度 ...
    return (
      <div>
        <div className={expanded ? '' : 'line-clamp-2'}>{children}</div>
        {showExpand && <Button>展开</Button>}
      </div>
    )
  }
  ```
- **优点**：彻底解决“估算不准”的问题，适用于任何内容类型。

## 最终实施方案：方案三 (AutoExpandable)

已实现通用的 `AutoExpandable` 组件，并重构了相关逻辑。

### 实现细节

1.  **创建组件**：`packages/gel-ui/src/common/AutoExpandable/index.tsx`

    - 使用 `useLayoutEffect` 和 `scrollHeight > clientHeight` 自动检测是否溢出。
    - 支持 `onExpand` (支持 Promise) 和 `onCollapse` 回调。
    - 使用 CSS Modules (`index.module.less`) 替代 styled-components 以符合项目规范。
    - **实现逻辑**：
      - 容器默认应用 CSS Modules 定义的 `display: -webkit-box` 和 `overflow: hidden`。
      - 通过 inline style 动态设置 `-webkit-line-clamp`。
      - 在 `useLayoutEffect` 中比较 `scrollHeight` 和 `clientHeight`，如果前者大（且当前未展开），则显示展开按钮。
      - 监听窗口 `resize` 事件以适应响应式变化。

2.  **导出组件**：

    - 已在 `packages/gel-ui/src/common/index.ts` 中导出。
    - 执行了 `pnpm -F gel-ui build` 确保构建更新。

3.  **重构 `LongTxtMergenceLabel`**：

    - 引入 `AutoExpandable` from `gel-ui`。
    - 移除原有的手动折叠状态管理。
    - 将数据获取逻辑封装在 `onExpand` 中。
    - 保留原有的 Collapse 时的滚动定位逻辑（通过 `onCollapse` 回调）。

4.  **更新 `CombinedStatistics`**：
    - 移除 `textLength > 80` 的硬编码判断。
    - 现在总是渲染 `LongTxtMergenceLabel`（只要有数据）。
    - `AutoExpandable` 会自动判断内容是否足够长；如果不足 2 行，自动隐藏“展开”按钮，仅显示内容。

### 验证

- **短文本**：渲染 `LongTxtMergenceLabel` -> `AutoExpandable` 检测无溢出 -> 显示完整文本，不显示按钮。解决了“一行半显示展开按钮”的 Bug。
- **长文本**：`AutoExpandable` 检测到溢出 -> 显示按钮 -> 点击“展开” -> 触发数据加载 -> 显示完整内容。
- **收起**：点击“收起” -> 触发 `onCollapse` -> 滚动到指定位置。
