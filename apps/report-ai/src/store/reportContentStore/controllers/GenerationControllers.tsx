/**
 * AIGC 生成控制器组件
 *
 * 此组件负责挂载所有 AIGC 生成相关的控制器 Hook
 * 这些控制器负责监听 Redux 状态变化并触发副作用
 *
 * ⚠️ 重要：此组件应该只在 ReportContentRTKScope 内部挂载一次
 * 多次挂载会导致重复监听和重复请求
 *
 * @see {@link ../../docs/issues/full-doc-generation-duplicate-requests.md | 全文生成重复请求问题}
 */

import { useFullDocGenerationController } from '../hooks/useFullDocGenerationController';

/**
 * AIGC 生成控制器组件
 *
 * 集中管理所有 AIGC 生成相关的副作用监听
 * 确保每个控制器只被挂载一次，避免重复请求
 */
export const GenerationControllers: React.FC = () => {
  // 全文生成控制器
  useFullDocGenerationController();

  // TODO: 添加其他控制器
  // useMultiChapterGenerationController();
  // useTextRewriteController();

  // 此组件不渲染任何内容，仅用于挂载 Hook
  return null;
};
