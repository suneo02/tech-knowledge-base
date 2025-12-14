/**
 * 初始状态工厂函数
 *
 * @description 创建编辑器的初始状态
 */

import { ReportOutlineData } from 'gel-api';
import { EditorState } from './types';

/**
 * 创建初始状态
 *
 * @param initialData 初始大纲数据
 * @returns 编辑器初始状态
 */
export const createInitialState = (initialData?: ReportOutlineData): EditorState => ({
  // 基础状态
  data: initialData || {
    reportId: String(Date.now()),
    outlineName: '',
    chapters: [],
  },
  isSyncing: false,
  error: null,

  // 导航和编辑状态
  selectedPath: null,
  activeItem: null,

  // 编写思路生成状态
  thoughtGeneratingPaths: new Set(),
  thoughtGenerationErrors: {},
});
