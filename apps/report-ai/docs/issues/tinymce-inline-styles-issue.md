# TinyMCE 编辑器样式内联化改造

## 问题描述
当前 TinyMCE 编辑器通过 `content_css` 引入位于 `public/editor-styles/` 目录的多个 CSS 文件（见 `apps/report-ai/src/components/ReportEditor/config/contentCss.ts:22`）。编辑器 iframe 依赖外链样式，导致导出完整 HTML、复制内容或离线预览时需要额外的样式内联处理。

## 现状分析
### 当前方案
- `contentCss.ts` 返回 TinyMCE 需要的样式 URL 列表，并分为 `base.css`、`layout.css`、`noneditable.css`、`rpGenerating.css`、`table.css`、`statusTip.css`、`wind-ui.css` 等模块。
- 这些样式在编辑态依靠浏览器缓存加载，运行时与业务 bundle 解耦。

### 存在问题
1. **导出链路复杂**：`reportEditorRef.current.getContent()`（`apps/report-ai/src/pages/ReportDetail/Header/index.tsx:67`）仅返回 HTML 结构，导出接口需要另行补齐样式。
2. **内容与样式分离**：导出的 HTML 在其他系统打开时缺少视觉样式，影响可读性与验收。
3. **离线不可用**：在无网络或 CDN 未命中场景，内容失去约束样式。

## 改造方案
### 目标
- 让导出/复制/预览后的 HTML 保持与编辑态一致的视觉表现。
- 统一样式来源，降低维护与回退成本。

### 技术实现
1. **LESS 化**：将既有 CSS 转换为 LESS，统一变量与模块引用。
2. **内联策略**：通过 `content_style` 或导出阶段注入 `<style>`，实现 html 与样式同步交付。
3. **构建支持**：在构建链路中增加 LESS 编译与字符串拼接能力，提供 `styleMode` 配置切换。

### 代码示例
```typescript
// 改造前
export const getEditorContentCss = (): IProps['init']['content_css'] => {
  return [
    ...tinymceCssFiles.map((file) => path.join('/', prefix, file)),
    ...customCssFiles.map((file) => path.join('/', prefix, editorStylePath, file)),
  ];
};

// 改造后（概念示例）
export const getEditorContentStyle = (): string => {
  return compiledLessStyles; // 构建阶段编译并拼接
};
```

## 方案评估
| 方案 | 核心思路 | 预期收益 | 主要代价/风险 | 适用情景 | 结论 |
| ---- | -------- | -------- | ------------- | -------- | ---- |
| 方案 A：保留 `content_css` + 导出阶段内联 | 样式仍以静态文件形式加载，导出或复制时单独运行内联脚本完成 `<style>` 注入 | TinyMCE 配置改动小，浏览器缓存与 CDN 仍可复用，阶段性交付风险最低 | 导出链路需要维护额外脚本，编辑态与导出态双配置；离线和跨系统粘贴仍缺样式 | 快速提供导出能力或仅在少量导出场景试点 | 作为过渡策略与 `styleMode: 'external'` 配置共同存在 |
| 方案 B：`content_style` 全量内联 | 构建期编译 LESS 并拼接成字符串，直接注入 TinyMCE `content_style` | HTML/复制内容天然包含完整样式，满足 [样式规范](../../../../docs/rule/style-rule.md) 对变量与模块化的要求，并支持离线传输 | bundle 体积上升，需要监控注入字符串大小；构建链需新增 LESS/哈希处理与灰度发布 | 面向需要“所见即所得”导出、复制、离线预览的主场景 | 推荐作为最终态，通过 `styleMode` 灰度切换为默认 |
| 方案 C：导出函数拼接 `content_css` | 在 `handleExportReport`（`apps/report-ai/src/pages/ReportDetail/Header/index.tsx:67`）中读取 `getEditorContentCss`，实时拉取 CSS 内容并在导出的 HTML 顶部包裹 `<style>` | 不影响编辑态加载方式，逻辑集中在导出函数，易于快速上线验证 | 每次导出都需串行请求多份 CSS，易受网络影响；无法覆盖复制/粘贴和离线预览；调试需要同时关注导出脚本与 TinyMCE 配置 | 仅需在导出接口保证样式完整，且能接受导出耗时增加的短期诉求 | 可作为兜底策略，与 A/B 并行验证但不作为最终形态 |

### 思考
1. 方案 A 能提供平滑过渡，但无法解决复制、离线及第三方嵌入缺样式的问题。
2. 方案 B 需要配合构建指标与 bundle 监控，否则 `content_style` 字符串过大将导致首屏抖动，需要在 `apps/report-ai` 层采集加载指标。
3. 方案 C 通过导出前拼接 `<style>` 可以快速解用户燃眉之急，但导出耗时取决于静态文件的获取情况，且调试路径与编辑态不同步，容易形成隐形分支。
4. 推荐“先 A 后 B、C 兜底”的节奏：先完成 LESS 化与导出脚本，再在 `styleMode: 'auto'` 下采集 HTML 体积和交互指标，满足 [项目结构规范](../../../../docs/rule/project-structure.md) 的可回退要求后再全量切换到 B。

## 优缺点分析
### 优势
1. **导出简化**：HTML 内含样式，导出链路无需额外打包。
2. **内容一致**：内容与样式在物理上绑定，跨系统传输时表现一致。
3. **离线友好**：无需依赖外部静态文件缓存即可渲染。
4. **性能收益**：减少 TinyMCE iframe 的 HTTP 请求，首屏更稳定。
5. **开发体验**：LESS 支持变量/嵌套/混合，便于维护。

### 劣势
1. **HTML 规范压力**：大量内联 `<style>` 并非最佳实践。
2. **样式复用难**：多个编辑器实例间无法共享缓存。
3. **缓存效率差**：浏览器无法对嵌入样式单独缓存。
4. **构建复杂度**：需要新增 LESS 编译、拼接与校验流程。
5. **维护成本**：任何样式调整都需要重新触发构建或导出脚本。

## 风险评估
### 高风险
- **样式冲突**：内联样式可能与页面级样式互相覆盖，需要命名空间隔离。
- **构建稳定性**：LESS 编译链条出错会阻塞编辑器加载。
- **性能影响**：`content_style` 体积过大可能拖慢编辑器初始化。

### 中风险
- **浏览器兼容**：部分旧版本浏览器对大体积内联样式解析效率低。
- **调试体验**：内联样式不易在 DevTools 中定位文件来源。
- **版本耦合**：样式变更与代码版本强绑定，需配合文档/版本策略。

## 实施建议
### 分阶段实施
1. **阶段一**：完成 LESS 化与样式模块梳理，保持 `content_css` 模式运行。
2. **阶段二**：实现可配置的内联注入（方案 B）与导出脚本（方案 A/C），并通过 `styleMode` 灰度控制。
3. **阶段三**：收集性能与导出反馈后，逐步将 `styleMode` 默认切换为 `inline`，保留回退开关。

### 配置建议
```typescript
interface EditorStyleConfig {
  styleMode: 'external' | 'inline' | 'auto';
  enableLess: boolean;
  inlineThreshold: number; // auto 模式下触发内联的大小阈值
}
```

### 回退方案
保留现有外部 CSS 文件，并在 `styleMode` 配置中提供 `external` 选项，导出脚本也必须能在无 LESS 结果的情况下回退到附件模式，保证随时可以切换回旧路径。

## 相关规范
- [样式规范](../../../../docs/rule/style-rule.md)：LESS Module + BEM 约束
- [项目结构规范](../../../../docs/rule/project-structure.md)：目录组织与回退要求
- [TypeScript 规范](../../../../docs/rule/typescript-rule.md)：类型与命名约定
- [文档规范](../../../../docs/rule/documentation-rule.md)：Issue 文档格式要求

## 后续跟踪
- [ ] LESS 文件设计与实现
- [ ] 构建流程改造与 `styleMode` 配置
- [ ] 性能与体积监控
- [ ] 导出功能验证（含方案 C 兜底）
- [ ] 兼容性测试
- [ ] 文档与示例同步

---
**创建时间**：2025-01-09  
**优先级**：🟡 P1  
**影响范围**：TinyMCE 编辑器样式体系  
**预估工期**：3-5 人日
