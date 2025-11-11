# 样式开发规范

## 快速准则
- 所有业务组件样式使用 Less Module，文件命名 `Component.module.less`。
- 类名统一遵循 BEM（`block__element--modifier`），状态命名语义化如 `--active`。
- 颜色、间距、阴影等全部引用 `packages/gel-ui/src/styles/shared/variables.less` 或 `token.ts`。
- 组合类名只使用 `classnames`/`clsx`，禁止字符串拼接。
- 样式文件聚焦组件主体，跨组件逻辑收敛到公共样式目录。

## 资产与导入
- 设计 token：`packages/gel-ui/src/styles/shared/variables.less`。
- 运行时 token：`packages/gel-ui/src/styles/token.ts`（通过 `index.ts` 导出）。
- Less mixin：`packages/gel-ui/src/styles/mixin/`，新增效果先写 mixin 再复用。
- 导入路径保持一致，可使用别名 `gel-ui/variables.less` 等，避免重复引用。

## 写法约束
- 样式书写顺序建议：定位 → 盒模型 → 视觉 → 交互，嵌套不超过 3 层。
- 组件样式文件控制在 200~300 行，超过即拆分模块或抽公共 mixin。
- 状态切换由 TSX 中 `classnames` 控制；`data-` 属性仅用于测试/脚本。
- 必要的全局覆盖通过 `:global(...)` 包裹，并附 `// TODO` 注释说明原因。

## 检查清单
- [ ] 模块样式命名符合 BEM 且来源唯一。
- [ ] 所有魔法值都替换成 token/mixin，新增 token 已在共享库登记。
- [ ] 文件顶部集中 import 公共资源，无重复导入。
- [ ] `classnames` 使用模块类名，不暴露裸字符串。
- [ ] PR 描述包含新增或修改的公共样式目的。

## 相关
- [前端开发通用基线](./frontend-baseline.md)
- [React 开发规范](./react-rule.md)
