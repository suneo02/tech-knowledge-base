/**
 * 大纲编辑器组件导出文件
 *
 * 这个文件导出了大纲模版编辑器的所有子组件，包括：
 * - 容器组件（OutlineEditorContainer）
 * - 项目组件（OutlineEditorItem）
 * - 基础组件（ContentEditable、HierarchicalNumber）
 */

// 容器和项目组件
export { OutlineEditorContainer, OutlineEditorContainer as OutlineTemplateContainer } from './OutlineEditorContainer';
export { OutlineEditorItem, OutlineEditorItem as OutlineTemplateItem } from './OutlineEditorItem';

// 基础组件
export { HierarchicalNumber } from './HierarchicalNumber';
export { HoverActions } from './HoverActions';

// 项目子组件（用于高级定制）
export { OutlineItemHeader } from './OutlineEditorItem/OutlineItemHeader';
export { OutlineItemWritingThought } from './OutlineEditorItem/OutlineItemWritingThought';
