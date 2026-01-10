## 目标
- 针对特定列的长文本，鼠标悬浮提示“点击查看全部”，点击后弹出只读弹窗显示完整内容（可滚动、可关闭、大小适中）。
- 将列白名单独立为配置，便于维护，不与业务逻辑耦合。

## 现状与约束
- 现有点击弹层为 `useCellPopover`（src/components/ETable/hooks/useCellPopover.tsx:18-156），当前会根据 `sourceId` 拉取详情并渲染业务化内容，不符合“无数据来源显示”的诉求。
- 事件来源：`setEventListener`（src/components/ETable/hooks/setEventListener.ts:33-87），已提供 `mouseenter_cell`/`selected_cell` 等入口，支持显示自定义 tooltip（`ref.showTooltip`）。
- 容器与样式：`ETable`（src/components/ETable/ETable.tsx:1-80）与样式（src/components/ETable/index.module.less:1-14），Popover 已使用 antd，符合弹窗诉求。

## 方案概述
- 新增轻量弹层 hook：`useLongTextPopover`（只显示当前单元格的文本内容，不发起任何请求）。
- Hover 提示：在 `mouseenter_cell` 时，命中白名单且文本溢出（或超过长度阈值）时，用 VTable 的 `showTooltip` 显示“点击查看全部”。
- 点击弹出：命中白名单时，使用 `openLongTextPopover(rect, { columnName, value })` 显示弹层。
- 白名单拆分：将白名单移至独立配置模块，供 ETable 与事件监听共同引用。

## 具体改动
1) 拆分白名单
- 新增 `src/config/longTextColumns.ts`（或 `src/components/ETable/constants/longTextColumns.ts`），导出 `Set<string>`。
- `ETable.tsx` 改为从该模块导入白名单。

2) 新增轻量弹层 hook
- 路径：`src/components/ETable/hooks/useLongTextPopover.tsx`
- 导出：`openLongTextPopover(rect, record)` 与 `LongTextPopover`。
- 行为：
  - 仅维护本地状态 `{ open, rect, columnName, value }`；不依赖 `sourceId`，不发起请求。
  - 使用 antd `Popover`（与现有 `useCellPopover` 风格一致）锚定到 `rect`；标题显示 `columnName`，右上角关闭按钮。
  - 内容容器样式：`width: 520px; maxHeight: 60vh; overflow: auto; white-space: pre-wrap; word-break: break-word;`，只读展示。

3) 事件接入与 hover 提示
- `setEventListener.ts`：在 `mouseenter_cell` 分支新增逻辑：
  - 若列名命中白名单且文本溢出（或长度 > N，如 50），调用 `ref.showTooltip({ content: '点击查看全部', placement: bottom, disappearDelay: 100 })`。
- `ETable.tsx`：点击处理逻辑改为：
  - 白名单列：调用 `openLongTextPopover(rect, record)`。
  - 其他列维持原逻辑（如需要保留原 `useCellPopover`）。

4) 样式与交互细节
- 弹窗大小适中：宽 520px、最大高 60vh，可滚动；保留 `zIndex` 足够高避免被覆盖。
- 只读：不使用可编辑组件，仅使用 `div` 文本渲染，`pre-wrap` 保留换行。
- 可关闭：支持 `onOpenChange(false)`、标题关闭按钮。

## 验证与测试
- 人工验证：
  - 将白名单列填充长文本，悬浮出现“点击查看全部”，点击弹出显示完整内容；重复点击、关闭均正常。
- 边界用例：
  - 文本不长/不溢出时不显示 tooltip，点击仍可打开（或仅白名单+溢出时可打开，依据最终阈值策略）。
  - 非白名单列不触发弹窗。
- 兼容性：不改动现有 `useCellPopover` 的业务逻辑，可并存。

## 可配置性与演进
- 白名单来源：当前为本地模块，后续可迁移为 `public/config/longTextColumns.json` 或远程配置。
- 溢出判定：初版用长度阈值与 VTable 内置溢出判断结合，后续可根据字体度量精细化。

## 交付物
- 新增：`src/config/longTextColumns.ts`（或 constants 子目录）。
- 新增：`src/components/ETable/hooks/useLongTextPopover.tsx`。
- 修改：`src/components/ETable/ETable.tsx` 点击逻辑接入。
- 修改：`src/components/ETable/hooks/setEventListener.ts` 悬浮提示逻辑。