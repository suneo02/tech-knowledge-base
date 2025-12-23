/**
 * RPOutline 选择器统一导出
 *
 * @description 使用具名导出重新导出所有模块化的选择器
 */

// 基础选择器
export { selectHasOutline, selectRPOutlineAgentMessages, selectRPOutlineState } from './base';

// 文件管理选择器
export { selectFileById, selectFileCount, selectFiles } from './files';

// 进度状态选择器
export {
  selectCurrentStep,
  selectHasProgressFailed,
  selectIsProgressCompleted,
  selectOverallProgress,
  selectProgress,
  selectProgressSteps,
} from './progress';

// 注意：交互状态选择器已移除，逻辑已迁移到消息解析器中
