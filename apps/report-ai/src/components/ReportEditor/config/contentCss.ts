import { isDev } from '@/utils';
import { IProps } from '@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor';
import { GELService, generatePrefixUrl } from 'gel-util/link';
import path from 'path-browserify';

/**
 * TinyMCE 编辑器内容样式配置
 *
 * 构建注入到 TinyMCE iframe 的 CSS 文件列表，所有编辑器专用样式集中管理。
 *
 * @see ../../../docs/RPDetail/RPEditor/QuickToolbar.md Quick Toolbar 设计文档（非目标：不覆盖视觉主题）
 * @see ../../../../docs/rule/code-style-less-bem-rule.md 样式规范
 *
 * 方案优势：
 * 1. 静态文件缓存友好
 * 2. 支持 CSS 代码分割和优化
 * 3. 开发生产环境一致性
 * 4. 支持热更新（开发环境）
 *
 * @returns TinyMCE content_css 配置数组
 */
export const getEditorContentCss = (): IProps['init']['content_css'] => {
  const prefix = generatePrefixUrl({ service: GELService.ReportAI, isDev });
  const editorStylePath = 'editor-styles';

  const tinymceCssFiles = [];

  // 模块化 CSS 文件，按功能拆分便于维护
  const customCssFiles = [
    'base.css', // 基础样式：HTML 标签、字体等
    'layout.css', // 布局样式：间距、对齐等
    'noneditable.css', // 不可编辑区域样式
    'table.css', // 表格样式
    'wind-ui.css', // Wind UI 组件样式适配
  ];

  return [
    ...tinymceCssFiles.map((file) => path.join('/', prefix, file)),
    ...customCssFiles.map((file) => path.join('/', prefix, editorStylePath, file)),
  ];
};

