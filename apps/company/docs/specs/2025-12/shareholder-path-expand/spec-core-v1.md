@see /docs/specs/shareholder-path-expand/README.md

## 背景与现状
- 业务场景：股东穿透「持股路径」表格，长文本用展开/收起交互。
- 现状问题：仅两行文本时依然出现“展开”按钮；展开后偶发无内容或不回收按钮。问题反复，已有临时修补未根治。
- 现有实现：`LongTxtMergenceLabel` 拼接 HTML + `dangerouslySetInnerHTML`，自测量高度判断是否显示按钮，首次展开时通过 `expandHandle` 拉取路径数据。

## 目标与非目标
- 目标：稳定的展开/收起体验，按钮仅在真实溢出时出现；接口异常或空数据时不阻塞交互；与现有埋点和跳转保持兼容。
- 非目标：不改动后端接口契约；不调整路径 HTML 结构与样式（`.path-shareholdertrace` 等）。

## 方案要点
- 复用成熟抽象：优先评估 `/packages/gel-ui/src/common/TextExpandable`，抽取其测量与溢出判断逻辑（`useSize` + clamp），改造成支持 `dangerouslySetInnerHTML` 的封装组件或 Hook。
- 抽象 Hook：`useExpandableHtml`（建议新建 `/apps/company/src/handle/corpModuleCfg/base/hooks/useExpandableHtml.ts`）暴露 `{ref, expanded, canExpand, toggle, setHtml}`，内部职责：
  - 初始化使用提供的 HTML；允许外部更新（接口返回后调用 `setHtml`）。
  - 使用 `useSize` + clamp 高度比对，结合纯文本长度兜底，避免两行内容出现按钮。
  - 只在 `canExpand` 为 true 时展示按钮；点击后同步滚动回位（复用现有 `scrollBack`）。
- 数据获取：将首次展开时的异步拉取封装为参数 `{onExpand?: () => Promise<string>}`，返回 HTML 字符串；异常或空数据时直接进入展开态但保持原内容。
- 兼容性：保留现有 `pingParam`、链接格式与样式类；埋点属性沿用。

## 拆解与负责人（建议）
1) Hook/组件落地：创建 `useExpandableHtml` + 可选 `ExpandableHtml` 轻量组件，完成单元测试（负责人：TODO）。  
2) 路径生成函数迁移：将 `buildPathHtml` 独立文件化，便于复用与测试（负责人：TODO）。  
3) 场景接入：`LongTxtMergenceLabel` 接入新 Hook；删除冗余测量逻辑，保持 API 兼容（负责人：TODO）。  
4) 回归与验收：覆盖短文本、长文本、接口空返回/错误场景，验证按钮显示与滚动行为（负责人：TODO）。

## 验收标准
- 两行以内文本不出现“展开”；三行及以上必出现且可正常展开/收起。
- 接口返回空或报错时，点击后可继续收起/展开，不出现卡死或按钮失效。
- 展开后收起可回到表格原位置；埋点、跳转行为与现状一致。

## 里程碑与风险
- 预估 0.5~1 人日完成 Hook + 接入，另需 0.5 人日回归。
- 风险：`dangerouslySetInnerHTML` 与 TextExpandable 现有实现存在差异，需要确认样式覆盖（Less 全局类名）及浏览器兼容性。

更新记录
- 2024-xx-xx by TODO：初版方案草稿。
