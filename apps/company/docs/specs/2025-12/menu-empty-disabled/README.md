# 企业详情菜单无数据节点禁用展示

## 状态
- [x] 需求澄清
- [x] 分析完成
- [x] 方案设计
- [x] 研发完成
- [x] 验证完成
> 归档日期：2025-12-10

## 任务背景
- 现状：`buildCompleteMenuTree` 基于 `basicNum` 过滤无数据子菜单，用户无法感知模块覆盖范围。
- 诉求：无数据模块也需在菜单中展示，但以禁用态呈现，避免误导并保留信息架构。
- 组件层可能需要直接接受 `currentMenus`（而非仅 treeData），以便统一处理禁用态与统计数字展示。

## 产出物
- [实施计划](./implementation-plan.json)
- [设计说明](./spec-design.md)

## 成功标准
- 无数据子菜单在左侧菜单可见且为禁用态；点击或搜索不会触发滚动、选中或埋点。
- 有数据子菜单保持统计数字展示与滚动联动行为。
- 组件接口明确（treeData vs currentMenus）并在代码中增加 `@see` 注记。
- 文档与测试覆盖禁用态渲染、搜索过滤与滚动联动。

## 归档说明

- 设计文档已补充并与实现一致：
  - @see /apps/company/docs/CorpDetail/layout-left.md
  - @see /apps/company/docs/CorpDetail/layout-config.md
  - @see /apps/company/docs/CorpDetail/README.md
- 规范与索引已更新至 2025-12 已归档任务。

_最后更新：2025-12-10_

## 参考
- @see /apps/company/docs/CorpDetail/layout-config.md
- @see /apps/company/docs/CorpDetail/layout-left.md
- @see /apps/company/src/views/Company/menu/handleCorpDetailMenu.tsx
