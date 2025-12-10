/**
 * useHydrationExecutor - 纯执行层 Hook（极简版）
 *
 * @description
 * 职责：
 * 1. 当编辑器就绪时，如果有内容就设置一次
 * 2. 当任务变化时，执行对应的注水操作
 *
 * 核心逻辑：
 * - 编辑器就绪 + 有数据 → setContent
 * - 任务变化 + 编辑器就绪 → setContent
 *
 * @see {@link ./HYDRATION.md | Hydration 运行手册 - 执行层}
 * @see {@link ../README.md | Hooks 架构说明}
 */

import { ReportEditorRef } from '@/types/editor';
import { useEffect, useRef } from 'react';
import { useReportContentDispatch, useReportContentSelector } from '../../hooksRedux';
import { selectCanonicalDocHtml, selectChapterContentMap, selectCurrentHydrationTask } from '../../selectors';
import { rpContentSlice } from '../../slice';

export interface UseHydrationExecutorOptions {
  /** 编辑器引用 */
  editorRef: React.RefObject<ReportEditorRef>;
}

/**
 * 注水执行器 Hook - 纯执行层
 *
 * @description 读取 Redux 任务，执行编辑器操作
 */
export const useHydrationExecutor = (options: UseHydrationExecutorOptions) => {
  const { editorRef  } = options;
  const dispatch = useReportContentDispatch();

  const currentTask = useReportContentSelector(selectCurrentHydrationTask);
  const docHtml = useReportContentSelector(selectCanonicalDocHtml);
  const chapterContentHtmlMap = useReportContentSelector(selectChapterContentMap);

  // 追踪已执行的任务，避免重复
  const executedTaskRef = useRef<string | null>(null);

  useEffect(() => {
    // 编辑器未就绪，跳过
    if (!editorRef.current) {
      return;
    }

    // 无任务，跳过
    if (currentTask.type === 'idle') {
      return;
    }

    // 任务已执行过，跳过
    const taskKey = JSON.stringify(currentTask);
    if (executedTaskRef.current === taskKey) {
      return;
    }

    // 标记任务已执行
    executedTaskRef.current = taskKey;

    // 执行对应的注水操作
    const executeTask = async () => {
      try {


        switch (currentTask.type) {
          case 'full-init': {
    
            // 生成完整 HTML 并注入编辑器
            // 当 Redux 中的 chapter.content 被清空后，这里会将空内容注入 TinyMCE
            await editorRef.current?.setFullContent(docHtml);
            dispatch(rpContentSlice.actions.completeHydrationTask({ taskType: 'full-init' }));
            break;
          }

          case 'full-rehydrate': {

            // 生成完整 HTML 并注入编辑器
            // 全文生成开始时，Redux 中的 chapter.content 已被清空，这里会将空内容同步到编辑器
            // @see {@link ../../../../docs/RPDetail/ContentManagement/full-generation-flow.md#清空流程 | 全文生成流程 - 清空流程}
            await editorRef.current?.setFullContent(docHtml);
            dispatch(rpContentSlice.actions.completeHydrationTask({ taskType: 'full-rehydrate' }));
            break;
          }

          case 'chapter-rehydrate': {

            // 逐个章节注水
            for (let i = 0; i < currentTask.chapterIds.length; i++) {
              const chapterId = currentTask.chapterIds[i];
              const chapterContentHtml = chapterContentHtmlMap[chapterId];

              if (chapterContentHtml) {
                await editorRef.current?.updateChapterContent(chapterId, chapterContentHtml);
              } 
            }

            // 完成任务
            dispatch(rpContentSlice.actions.completeHydrationTask({ taskType: 'chapter-rehydrate' }));
            break;
          }

          default:
              console.warn('[HydrationExecutor] Unknown task type:', currentTask);
        }
      } catch (error) {
          console.error('[HydrationExecutor] Task execution failed:', error);
        // 失败也要重置任务，避免卡住
        dispatch(
          rpContentSlice.actions.setHydrationTask({
            type: 'idle',
          })
        );
      }
    };

    // 执行任务
    executeTask();
  }, [currentTask, editorRef, editorRef.current, dispatch]);
};
