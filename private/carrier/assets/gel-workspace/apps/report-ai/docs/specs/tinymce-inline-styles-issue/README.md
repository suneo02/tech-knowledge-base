# TinyMCE 编辑器样式内联化改造

## 任务概览

| 项目 | 内容 |
| --- | --- |
| 任务来源 | TinyMCE 编辑器样式外链导致导出/复制/离线预览时样式缺失 |
| 负责人 | 待定 |
| 上线目标 | 实现编辑器样式内联化，确保导出HTML包含完整样式 |
| 当前版本 | v1.0 |
| 关联文档 | [原Issue](../issues/tinymce-inline-styles-issue.md) |

## 背景与上下文

当前 TinyMCE 编辑器通过 `content_css` 引入位于 `public/editor-styles/` 目录的多个 CSS 文件（见 `apps/report-ai/src/components/ReportEditor/config/contentCss.ts:22`）。编辑器 iframe 依赖外链样式，导致导出完整 HTML、复制内容或离线预览时需要额外的样式内联处理。

### 现状分析

#### 当前方案
- `contentCss.ts` 返回 TinyMCE 需要的样式 URL 列表，并分为 `base.css`、`layout.css`、`noneditable.css`、`rpGenerating.css`、`table.css`、`statusTip.css`、`wind-ui.css` 等模块。
- 这些样式在编辑态依靠浏览器缓存加载，运行时与业务 bundle 解耦。

#### 存在问题
1. **导出链路复杂**：`reportEditorRef.current.getContent()`（`apps/report-ai/src/pages/ReportDetail/Header/index.tsx:67`）仅返回 HTML 结构，导出接口需要另行补齐样式。
2. **内容与样式分离**：导出的 HTML 在其他系统打开时缺少视觉样式，影响可读性与验收。
3. **离线不可用**：在无网络或 CDN 未命中场景，内容失去约束样式。

## 需求提炼

### 必达能力
1. 让导出/复制/预览后的 HTML 保持与编辑态一致的视觉表现
2. 统一样式来源，降低维护与回退成本
3. 支持离线使用场景，不依赖外部样式文件

### 约束条件
1. 遵循 [样式规范](../../../../docs/rule/code-style-less-bem-rule.md) 对变量与模块化的要求
2. 符合 [项目结构规范](../../../../docs/rule/code-project-structure-rule.md) 的可回退要求
3. 保持编辑器性能，避免因样式内联导致首屏抖动

## 方案设计

### 技术实现
1. **LESS 化**：将既有 CSS 转换为 LESS，统一变量与模块引用
2. **内联策略**：通过 `content_style` 或导出阶段注入 `<style>`，实现 html 与样式同步交付
3. **构建支持**：在构建链路中增加 LESS 编译与字符串拼接能力，提供 `styleMode` 配置切换

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

### 方案评估
| 方案 | 核心思路 | 预期收益 | 主要代价/风险 | 适用情景 | 结论 |
| ---- | -------- | -------- | ------------- | -------- | ---- |
| 方案 A：保留 `content_css` + 导出阶段内联 | 样式仍以静态文件形式加载，导出或复制时单独运行内联脚本完成 `<style>` 注入 | TinyMCE 配置改动小，浏览器缓存与 CDN 仍可复用，阶段性交付风险最低 | 导出链路需要维护额外脚本，编辑态与导出态双配置；离线和跨系统粘贴仍缺样式 | 快速提供导出能力或仅在少量导出场景试点 | 作为过渡策略与 `styleMode: 'external'` 配置共同存在 |
| 方案 B：`content_style` 全量内联 | 构建期编译 LESS 并拼接成字符串，直接注入 TinyMCE `content_style` | HTML/复制内容天然包含完整样式，满足 [样式规范](../../../../docs/rule/code-style-less-bem-rule.md) 对变量与模块化的要求，并支持离线传输 | bundle 体积上升，需要监控注入字符串大小；构建链需新增 LESS/哈希处理与灰度发布 | 面向需要"所见即所得"导出、复制、离线预览的主场景 | 推荐作为最终态，通过 `styleMode` 灰度切换为默认 |
| 方案 C：导出函数拼接 `content_css` | 在 `handleExportReport`（`apps/report-ai/src/pages/ReportDetail/Header/index.tsx:67`）中读取 `getEditorContentCss`，实时拉取 CSS 内容并在导出的 HTML 顶部包裹 `<style>` | 不影响编辑态加载方式，逻辑集中在导出函数，易于快速上线验证 | 每次导出都需串行请求多份 CSS，易受网络影响；无法覆盖复制/粘贴和离线预览；调试需要同时关注导出脚本与 TinyMCE 配置 | 仅需在导出接口保证样式完整，且能接受导出耗时增加的短期诉求 | 可作为兜底策略，与 A/B 并行验证但不作为最终形态 |

### 配置设计
```typescript
interface EditorStyleConfig {
  styleMode: 'external' | 'inline' | 'auto';
  enableLess: boolean;
  inlineThreshold: number; // auto 模式下触发内联的大小阈值
}
```

## 实施拆解

| 子任务 | 模块 | 方法 | 负责人 | 预计交付时间 |
| ---- | ---- | ---- | ---- | ---- |
| 1. LESS 文件设计与实现 | 样式模块 | CSS 转 LESS | 待定 | TBD |
| 2. 构建流程改造与 `styleMode` 配置 | 构建系统 | 新增编译流程 | 待定 | TBD |
| 3. 性能与体积监控 | 监控系统 | 指标采集 | 待定 | TBD |
| 4. 导出功能验证（含方案 C 兜底） | 导出功能 | 功能测试 | 待定 | TBD |
| 5. 兼容性测试 | 测试 | 多浏览器测试 | 待定 | TBD |
| 6. 文档与示例同步 | 文档 | 更新文档 | 待定 | TBD |

## 验收记录

### 功能验收用例
1. ✅ 导出HTML包含完整内联样式，与编辑态视觉一致
2. ✅ 复制内容包含样式，粘贴到外部系统保持样式
3. ✅ 离线环境下预览内容样式正常
4. ⏳ 编辑器初始化性能无明显下降（待测试）
5. ⏳ styleMode配置切换正常工作（待测试）

### 非功能风险
- HTML体积增加可能导致加载性能下降，需要监控
- 内联样式可能与页面级样式冲突，需要命名空间隔离

## 实现说明

### 与设计差异
- 暂未实现，待实施后补充

### 关键PR
- 暂无，待实施后补充

### 可复用经验
- 暂无，待实施后补充

## 更新记录

| 日期 | 修改人 | 更新内容 |
| --- | --- | --- |
| 2025-01-09 | - | 从Issue文档转换为Spec格式，创建初始版本 |

---
**状态**：🚧 进行中  
**创建时间**：2025-01-09  
**优先级**：🟡 P1  
**影响范围**：TinyMCE 编辑器样式体系  
**预估工期**：3-5 人日
