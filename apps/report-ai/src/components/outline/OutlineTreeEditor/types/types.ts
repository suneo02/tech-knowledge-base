/**
 * 大纲模版编辑器组件的类型定义
 *
 * 这个文件定义了大纲模版编辑器中使用的所有数据结构和接口
 * 支持多层级的树形结构，每个节点可以有无限层级的子节点
 */

import { RPChapter, ReportOutlineData } from 'gel-api';
import { TreePath } from 'gel-util/common';

/**
 * 保存状态的枚举类型
 *
 * 用于表示数据的保存状态，提供用户反馈
 */
export type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

/**
 * 大纲编辑器的主要属性接口
 *
 * @description 只包含生产代码中实际使用的属性
 */
export interface OutlineTreeEditorProps {
  /** 组件样式 */
  style?: React.CSSProperties;

  /** 初始数据，如果不提供则创建空的大纲 */
  initialValue?: ReportOutlineData;

  /** 受控模式的值 */
  value?: ReportOutlineData;

  /** 是否为只读模式（预览模式），默认为false */
  readonly?: boolean;
}

/**
 * 大纲编辑器容器组件的属性接口
 *
 * 用于递归渲染大纲树的容器组件
 * 注意：大部分状态和操作由子组件直接从 context 读取，减少 prop drilling
 */
export interface OutlineEditorContainerProps {
  /** 要渲染的大纲项目列表 */
  items: ReportOutlineData['chapters'];

  /** 父级路径，用于构建完整的项目路径 */
  parentPath: TreePath;

  /** 空项目的占位符文本 */
  placeholder: string;

  /** 是否为只读模式（预览模式） */
  readonly?: boolean;

  /** 思路摘要显示的行数 */
  ideaSummaryLines?: number;
}

/**
 * 大纲编辑器项目组件的属性接口
 *
 * 单个大纲项目的渲染和交互逻辑
 * 注意：大部分状态和操作由组件直接从 context 读取，减少 prop drilling
 */
export interface OutlineEditorItemProps {
  /** 项目数据 */
  item: RPChapter;

  /** 项目在树形结构中的完整路径 */
  path: TreePath;

  /** 是否为当前编辑的项目（本地 UI 状态） */
  isEditing: boolean;

  /** 空项目的占位符文本 */
  placeholder: string;

  /** 是否为只读模式（预览模式） */
  readonly?: boolean;

  /** 思路摘要显示的行数 */
  ideaSummaryLines?: number;
}

/**
 * 层级编号组件的属性接口
 *
 * 显示项目的层级编号（如 1, 1.1, 1.2.1 等）
 * 层级深度通过路径动态计算
 */
export interface HierarchicalNumberProps {
  /** 项目在树形结构中的完整路径 */
  path: TreePath;

  /** 额外的CSS类名 */
  className?: string;
}

/** 内部：思路面板 Props（抽屉/面板） */
export interface WritingIdeaPanelProps {
  open: boolean;
  readonly?: boolean;
  value?: string;
  onChange?: (next: string) => void;
  onClose: () => void;
  onSave?: () => void;
}
