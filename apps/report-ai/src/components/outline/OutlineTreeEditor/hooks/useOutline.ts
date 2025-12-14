import { createChapter, getRealChapterId as getDomainRealChapterId } from '@/domain/chapter';
import { RPChapterSavePayload } from 'gel-api';
import { getTreeNodeByPath, TreePath } from 'gel-util/common';
import { useCallback } from 'react';
import { OutlineAction, useOutlineDispatch, useOutlineState } from '../context';
import { outlineEditActionFactory, saveOutline } from '../core';
import { SaveMode, UseOutlineOperationsOptions, UseOutlineOperationsReturn } from '../types/hook';
import { useOutlinePersistence } from './useOutlinePersistence';
import { useThoughtGeneration } from './useThoughtGeneration';

export function useOutlineOperations(options: UseOutlineOperationsOptions = {}): UseOutlineOperationsReturn {
  const state = useOutlineState();
  const dispatch = useOutlineDispatch();
  const thoughtGeneration = useThoughtGeneration();
  const saveImpl = options.saveImpl ?? saveOutline;

  // `useOutlinePersistence` 现同时封装 SaveController 与乐观更新逻辑，返回统一的
  // 保存入口与状态，避免在多个 Hook 中重复注入控制器实例。
  const {
    applyOptimisticAction,
    markUnsaved,
    saving,
    hasUnsaved,
    lastSavedAt,
    lastError,
    requestManualSave,
    requestAutoSave,
    requestImmediateSave,
  } = useOutlinePersistence({ saveImpl });

  /**
   * 获取章节节点（从 Context 中读取最新数据）
   */
  const getChapterByPath = useCallback(
    (path: TreePath) => {
      return getTreeNodeByPath(state.data.chapters, path);
    },
    [state.data]
  );

  /**
   * 获取真实的 chapterId（使用 domain 层工具）
   */
  const getRealChapterId = useCallback(
    (tempId: string | undefined, idMap: Record<string, string> | undefined, path: TreePath): string | undefined => {
      return getDomainRealChapterId(state.data.chapters, path, tempId, idMap);
    },
    [state.data]
  );

  /**
   * 生成编写思路并更新状态
   * @param path - 章节路径
   * @param title - 章节标题
   * @param chapterId - 章节 ID
   * @param type - 生成类型
   * @param previousThought - 之前的编写思路
   * @param withStateManagement - 是否管理生成状态（START/FINISH/FAIL）
   */
  const generateThoughtWithDispatch = useCallback(
    async (
      path: TreePath,
      title: string,
      chapterId: string,
      previousThought: string = '',
      withStateManagement: boolean = true
    ) => {
      try {
        if (withStateManagement) {
          dispatch({
            type: OutlineAction.START_THOUGHT_GENERATION,
            payload: { chapterPath: path },
          });
        }

        const newThought = await thoughtGeneration.generateThought(path, title, chapterId);

        dispatch({
          type: OutlineAction.UPDATE_WRITING_THOUGHT,
          payload: {
            chapterPath: path,
            newThought,
            previousThought,
          },
        });

        if (withStateManagement) {
          dispatch({
            type: OutlineAction.FINISH_THOUGHT_GENERATION,
            payload: { chapterPath: path },
          });
        }
      } catch (thoughtError) {
        if (withStateManagement) {
          dispatch({
            type: OutlineAction.FAIL_THOUGHT_GENERATION,
            payload: {
              chapterPath: path,
              error: thoughtError instanceof Error ? thoughtError.message : '生成编写思路失败',
            },
          });
        }
        console.warn('自动生成编写思路失败:', thoughtError);
      }
    },
    [dispatch, thoughtGeneration]
  );

  const rename = useCallback(
    async (path: TreePath, newTitle: string) => {
      const chapter = getChapterByPath(path);
      if (!chapter) return;

      const oldTitle = chapter.title;

      await applyOptimisticAction(() => outlineEditActionFactory.createRename(path, newTitle, oldTitle), {
        mode: 'manual',
        afterSuccess: async (action, idMap) => {
          if (newTitle.trim() === oldTitle.trim() || newTitle.trim() === '') {
            return;
          }

          // 获取真实的 chapterId
          // 注意：大多数情况下章节已有 chapterId，只有刚创建未保存的章节才有 tempId
          const tempId = (chapter as Partial<RPChapterSavePayload>).tempId;
          const realChapterId = getRealChapterId(tempId, idMap, path);
          if (!realChapterId) {
            console.warn('[rename] 无法获取真实 chapterId，跳过编写思路生成');
            return;
          }

          // 获取更新后的章节数据用于 previousThought
          const updatedChapter = getChapterByPath(path);
          const previousThought = updatedChapter?.writingThought || '';

          await generateThoughtWithDispatch(path, newTitle, realChapterId, previousThought, true);
        },
      });
    },
    [applyOptimisticAction, getChapterByPath, getRealChapterId, generateThoughtWithDispatch]
  );

  const updateThought = useCallback(
    async (path: TreePath, newThought: string, options?: { mode?: SaveMode }) => {
      const chapter = getChapterByPath(path);
      if (!chapter) return;

      await applyOptimisticAction(
        () => outlineEditActionFactory.createUpdateThought(path, newThought, chapter.writingThought || ''),
        { mode: options?.mode ?? 'manual' }
      );
    },
    [applyOptimisticAction, getChapterByPath]
  );

  const updateKeywords = useCallback(
    async (path: TreePath, newKeywords: string[], options?: { mode?: SaveMode }) => {
      const chapter = getChapterByPath(path);
      if (!chapter) return;

      await applyOptimisticAction(
        () => outlineEditActionFactory.createUpdateKeywords(path, newKeywords, chapter.keywords || []),
        { mode: options?.mode ?? 'manual' }
      );
    },
    [applyOptimisticAction, getChapterByPath]
  );

  const insertAfter = useCallback(
    async (path: TreePath, chapterData?: Partial<{ title: string; writingThought: string; keywords?: string[] }>) => {
      const chapter = createChapter(chapterData?.title || '', chapterData?.writingThought || '');
      if (chapterData?.keywords) {
        chapter.keywords = [...chapterData.keywords];
      }

      const tempId = chapter.tempId;
      const chapterTitle = chapterData?.title?.trim();
      const hasExistingThought = chapterData?.writingThought?.trim();

      const executed = await applyOptimisticAction(() => outlineEditActionFactory.createInsert(path, chapter), {
        mode: 'manual',
        afterSuccess: async (action, idMap) => {
          const newPath = action.newPath ?? path;

          // 只有标题且无现有思路时才生成
          if (!chapterTitle || hasExistingThought) {
            return;
          }

          // 获取真实的 chapterId
          const realChapterId = getRealChapterId(tempId, idMap, newPath);
          if (!realChapterId) {
            console.warn('[insertAfter] 无法获取真实 chapterId，跳过编写思路生成');
            return;
          }

          // 新增章节不需要状态管理，直接生成
          await generateThoughtWithDispatch(newPath, chapterTitle, realChapterId, '', false);
        },
      });

      return executed.newPath ?? path;
    },
    [applyOptimisticAction, getChapterByPath, getRealChapterId, generateThoughtWithDispatch]
  );

  const remove = useCallback(
    async (path: TreePath) => {
      const chapter = getChapterByPath(path);
      if (!chapter) return;

      await applyOptimisticAction(() => outlineEditActionFactory.createRemove(path, chapter), { mode: 'manual' });
    },
    [applyOptimisticAction, getChapterByPath]
  );

  const indent = useCallback(
    async (path: TreePath) => {
      const executed = await applyOptimisticAction(() => outlineEditActionFactory.createIndent(path), {
        mode: 'manual',
      });
      return executed.newPath ?? null;
    },
    [applyOptimisticAction]
  );

  const unindent = useCallback(
    async (path: TreePath) => {
      const executed = await applyOptimisticAction(() => outlineEditActionFactory.createUnindent(path), {
        mode: 'manual',
      });
      return executed.newPath ?? null;
    },
    [applyOptimisticAction]
  );

  return {
    rename,
    updateThought,
    updateKeywords,
    insertAfter,
    remove,
    indent,
    unindent,
    pauseThought: thoughtGeneration.pauseThought,
    markUnsaved,
    saving,
    hasUnsaved,
    lastSavedAt,
    lastError,
    requestManualSave,
    requestAutoSave,
    requestImmediateSave,
  };
}
