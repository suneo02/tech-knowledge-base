/**
 * RPOutline 大纲相关类型定义
 *
 * @description 基于现有 gel-api 类型的扩展定义
 */

/**
 * 节点编辑状态
 *
 * @description 单个节点的编辑状态信息
 */
export interface RPOutlineNodeEditState {
  /** 节点ID */
  nodeId: number; // 使用 RPChapter 的 chapterId
  /** 是否正在编辑 */
  isEditing: boolean;
  /** 编辑中的标题 */
  editingTitle?: string;
  /** 编辑中的编写思路 */
  editingGuidance?: string;
  /** 是否有未保存的更改 */
  hasUnsavedChanges: boolean;
  /** 最后编辑时间 */
  lastEditedAt?: Date;
}

/**
 * 大纲编辑状态
 *
 * @description 整个大纲的编辑状态管理
 */
export interface RPOutlineEditState {
  /** 当前编辑的节点ID */
  currentEditingNodeId?: number;
  /** 所有节点的编辑状态 */
  nodeEditStates: Record<number, RPOutlineNodeEditState>;
  /** 是否处于编辑模式 */
  isEditMode: boolean;
  /** 是否有任何未保存的更改 */
  hasAnyUnsavedChanges: boolean;
}

/**
 * 节点操作类型
 *
 * @description 可对节点执行的操作类型
 */
export enum RPOutlineNodeOperation {
  /** 添加子节点 */
  ADD_CHILD = 'add_child',
  /** 添加同级节点 */
  ADD_SIBLING = 'add_sibling',
  /** 删除节点 */
  DELETE = 'delete',
  /** 移动节点 */
  MOVE = 'move',
  /** 编辑节点 */
  EDIT = 'edit',
  /** 展开/折叠节点 */
  TOGGLE_EXPAND = 'toggle_expand',
}

/**
 * 节点操作参数
 *
 * @description 执行节点操作时的参数
 */
export interface RPOutlineNodeOperationPayload {
  /** 目标节点ID */
  nodeId: string;
  /** 操作类型 */
  operation: RPOutlineNodeOperation;
  /** 操作参数 */
  params?: {
    /** 新节点标题 */
    title?: string;
    /** 新节点编写思路 */
    writingGuidance?: string;
    /** 移动目标位置 */
    targetParentId?: string;
    /** 移动目标索引 */
    targetIndex?: number;
  };
}

/**
 * 大纲预览配置
 *
 * @description 大纲预览显示的配置选项
 */
export interface RPOutlinePreviewConfig {
  /** 是否显示编写思路摘要 */
  showGuidanceSummary: boolean;
  /** 摘要最大字符数 */
  maxSummaryLength: number;
  /** 是否显示节点编号 */
  showNodeNumbers: boolean;
  /** 默认展开层级 */
  defaultExpandLevel: number;
  /** 是否启用拖拽排序 */
  enableDragSort: boolean;
}
