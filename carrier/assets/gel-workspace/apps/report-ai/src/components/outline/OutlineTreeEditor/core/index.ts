/**
 * 大纲编辑器核心模块统一导出
 *
 * @description 导出分层架构的所有核心模块
 */

// Ops 层 - 大纲编辑操作对象和逆操作定义
export {
  executeOutlineEditAction,
  outlineEditActionFactory,
  OutlineEditActionType,
  type BaseOutlineEditAction,
  type IndentAction,
  type InsertAction,
  type OutlineEditAction,
  type OutlineEditBatch,
  type RemoveAction,
  // 具体操作类型
  type RenameAction,
  type UnindentAction,
  type UpdateThoughtAction,
} from './operations';

// Transport 层 - 传输层
export { createSaveOutline, saveOutline, type SaveOutlineFn, type SaveOutlineResponse } from './transport';
