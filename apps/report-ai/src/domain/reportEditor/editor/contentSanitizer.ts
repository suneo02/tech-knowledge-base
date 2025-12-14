/**
 * 内容清洗工具 - 移除外部渲染节点和溯源标记
 *
 * 业务背景：
 * 编辑器内部使用外部渲染节点（loading、citation、source-marker 等）来增强用户体验，
 * 但这些节点不应该出现在导出、保存、diff 的内容中。
 *
 * 职责：
 * - 移除所有 data-gel-external 标记的外部渲染节点（loading、citation、source-marker 等）
 * - 清理 TinyMCE 特定属性（data-mce-bogus）
 * - 确保导出和保存的内容纯净，只包含实际的报告内容
 *
 * 使用场景：
 * - getContent: 导出报告内容时
 * - onContentChange: 保存/diff 报告内容时
 *
 * 参考设计文档：apps/report-ai/docs/RPDetail/RPEditor/ExternalRendering/design.md
 */

import { RP_DATA_ATTRIBUTES } from '../foundation';
import { EditorFacade } from './editorFacade';

/**
 * 移除外部渲染节点，返回用于保存/导出的纯净报告内容
 *
 * 业务用途：用于保存、diff、导出等需要纯净内容的场景
 *
 * 处理步骤：
 * 1. 移除所有外部渲染节点（data-gel-external）：loading、citation、source-marker 等
 * 2. 清理 TinyMCE 内部标记属性（data-mce-bogus）
 *
 * 注：source-marker 已经包含 data-gel-external 属性，不需要单独处理
 *
 * @param html - 编辑器原始 HTML 内容（包含外部渲染节点）
 * @returns 纯净的报告 HTML 内容（不含外部渲染节点）
 *
 * @example
 * const cleanHtml = removeExternalRenderingNodes(editor.getContent({ format: 'raw' }));
 */
export const removeExternalRenderingNodes = (html: string): string => {
  if (!html) return '';

  // 创建临时 DOM 容器
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // 1. 移除所有外部渲染节点（loading、citation、source-marker 等）
  const externalNodes = tempDiv.querySelectorAll(`[${RP_DATA_ATTRIBUTES.GEL_EXTERNAL}]`);
  externalNodes.forEach((node) => node.remove());

  // 2. 清理 TinyMCE 内部标记属性
  const mceBogusNodes = tempDiv.querySelectorAll(`[${RP_DATA_ATTRIBUTES.MCE_BOGUS}]`);
  mceBogusNodes.forEach((node) => {
    node.removeAttribute(RP_DATA_ATTRIBUTES.MCE_BOGUS);
  });

  return tempDiv.innerHTML;
};

/**
 * 从编辑器获取用于导出的纯净报告内容（移除外部渲染节点）
 *
 * 业务用途：用于导出报告时获取纯净的 HTML 内容
 *
 * @param editor - EditorFacade 实例
 * @returns 纯净的报告 HTML 内容（不含外部渲染节点）
 *
 * @example
 * const cleanContent = getCleanContentForExport(editor);
 */
export const getCleanContentForExport = (editor: EditorFacade): string => {
  const editorBody = editor.getBody();
  if (!editorBody) return '';

  // 直接复用 removeExternalRenderingNodes 逻辑
  return removeExternalRenderingNodes(editorBody.innerHTML);
};
