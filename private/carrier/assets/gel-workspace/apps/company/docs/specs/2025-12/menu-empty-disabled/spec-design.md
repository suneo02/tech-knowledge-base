# 企业详情菜单无数据节点禁用方案设计

## 1. 背景与问题

- `buildCompleteMenuTree` 依据 `basicNum` 过滤无数据子菜单，导致用户无法获知模块覆盖范围，搜索结果也缺少这些节点。@see /apps/company/src/views/Company/menu/handleCorpDetailMenu.tsx
- 业务期望：无数据模块需展示但禁用，避免误导，同时提示用户数据缺失。@see /apps/company/docs/CorpDetail/layout-left.md
- 组件层当前通过 `treeDatas` 驱动，缺少原始菜单配置上下文，调整为接受 `currentMenus` 能更好地表达“完整配置 + 状态”。

## 2. 目标与范围

- 展示：完整菜单树保留全部配置项，无数据模块以禁用态呈现，统计数字显示 `0`（若 hideMenuNum 则保持空）。
- 行为：禁用节点无法点击、不会触发滚动或埋点，但允许展开收起。搜索结果不允许选中禁用节点。
- 数据：输出的菜单数据结构显式包含 `hasData/disabled` 状态，便于组件和滚动逻辑使用。
- 非目标：不改动菜单配置来源（`createCorpDetailMenus`）、不新增模块。

## 3. 方案设计

- **数据生成（useCorpMenuData + buildCompleteMenuTree）**
  - 保留子菜单，不再因 `modelNum` 为 0/false 过滤；新增字段 `hasData`（布尔）与 `disabled`（`!hasData`）。@see /apps/company/src/views/Company/menu/useCorpMenuData.ts
  - 统计数字：`hideMenuNum` 时仍为空；否则 `titleNum` 使用 `CorpMenuNum`，无数据时展示 0 且灰态（组件内支持禁用样式）。@see /apps/company/src/components/company/detail/comp/CorpNum.tsx
  - 数据输出拆分：`treeDatas`（包含禁用节点，用于渲染），`allTreeDatas`（仅可点击节点，用于搜索与默认选中），`allTreeDataObj` 仅索引可点击节点，避免滚动联动到禁用模块。
- **组件接口（CorpDetailMenu）**
  - Props 调整为 `menuConfig: CorpMenuCfg`（currentMenus 原始配置）+ `menuState`（treeDatas、searchableTreeDatas、allTreeDataObj 等），减少对“过滤后 treeData”单一依赖。@see /apps/company/src/views/Company/comp/menu/index.tsx
  - 渲染：TreeNode 使用 `disabled` 属性；搜索组件基于 `searchableTreeDatas`，禁用节点仅用于展示不触发 `treeMenuClick`。
  - 默认选中：若 `showCompanyInfo` 不存在或被禁用，回退到 `searchableTreeDatas` 的第一个可用节点。
- **滚动与埋点**
  - `handleCorpDetailScrollMenuLoad/Changed` 在选中与滚动同步时跳过禁用节点；埋点同样只记录可用模块。@see /apps/company/src/handle/corp/misc/scroll.ts
  - 初次渲染的展开逻辑保持 `overview` 自动展开，但禁用节点不加入 `expandedKeys`。

### 展开/收起行为

- 展开全部菜单：显示禁用节点（`showDisabled = true`），并展开所有非叶子节点。@see /apps/company/src/views/Company/comp/menu/ExpandAll.tsx、/apps/company/src/views/Company/comp/menu/index.tsx
- 仅展开有数据菜单：隐藏禁用节点（`showDisabled = false`），使用过滤后的树（仅 `hasData` 节点），并展开所有非叶子节点。@see /apps/company/src/views/Company/comp/menu/ExpandAll.tsx、/apps/company/src/views/Company/comp/menu/index.tsx
- 收起：在当前可见数据基础上收起（清空 `expandedKeys`），不改变 `showDisabled` 显示模式。@see /apps/company/src/views/Company/comp/menu/ExpandAll.tsx

## 4. 验收与测试

- 无数据场景：构造 `basicNum` 缺失模块，左侧显示禁用菜单项，点击/搜索不触发滚动或选中；视觉表现为灰态。
- 有数据场景：统计数字与现有一致，点击后滚动与选中联动正常。
- 混合场景：同级下部分禁用、部分启用，搜索仅返回启用项；滚动监听不会因禁用节点导致选中跳变。
- 回退场景：`basicNum` 未加载时仍显示简化菜单；加载后自动切换为含禁用态的完整菜单。
- 单元测试：补充 `buildCompleteMenuTree` 输出禁用节点、`searchableTreeDatas` 过滤逻辑、默认选中回退逻辑。

## 5. 里程碑

- 12/08：完成方案设计与任务拆解。
- 12/09：完成数据结构与组件接口改造，补充单元测试。
- 12/10：联调滚动/搜索场景，自测通过后提测。

## 6. 风险与关注点

- 统计字段缺失或接口新增字段时，需要确认禁用判断与 `getCorpModuleNum` 输出的兼容性。
- 搜索与滚动逻辑共享数据源，需避免旧逻辑依赖被过滤的 `allTreeDatas` 导致行为变化。
- UI 库 `Tree` 对 `disabled` 的行为需验证（禁止点击、键盘导航），必要时增加前置拦截。
