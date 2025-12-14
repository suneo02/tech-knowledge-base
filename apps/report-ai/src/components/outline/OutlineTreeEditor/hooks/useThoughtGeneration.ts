/**
 * 编写思路生成 Hook
 *
 * @description 处理章节标题修改后的自动编写思路生成
 */

import { axiosInstance } from '@/api/axios';
import { entWebAxiosInstance } from '@/api/entWeb';
import { createPathKey } from '@/components/outline/pathUtils';
import { RPOutlineSendInput } from '@/types/chat/RPOutline';
import { isDev } from '@/utils';
import { ChatPresetQuestion } from 'gel-api';
import { ChatRunContext, createChatRunContext } from 'gel-ui';
import { TreePath } from 'gel-util/common';
import { useCallback, useRef } from 'react';
import { OutlineAction, useOutlineDispatch } from '../context';
import { processWrightThoughtAgentReq } from './processWrightThoughtAgentReq';

/**
 * 编写思路生成 Hook
 */
export function useThoughtGeneration() {
  const dispatch = useOutlineDispatch();
  const activeContextsRef = useRef<Map<string, ChatRunContext>>(new Map());

  /**
   * 生成编写思路
   *
   * @param path 章节路径
   * @param title 章节标题
   * @param chapterId 章节ID，用于调用 processChatPreflight API
   * @param generationType 生成类型：'create' 新增章节，'modify' 修改章节
   * @returns 生成的编写思路文本
   * @throws {Error} 当 API 调用失败、返回结果无效或生成内容为空时抛出错误
   */
  const generateThought = useCallback(
    async (path: TreePath, title: string, chapterId: string): Promise<string> => {
      // 设置生成中状态
      dispatch({
        type: OutlineAction.START_THOUGHT_GENERATION,
        payload: { chapterPath: path },
      });

      try {
        // 外部创建上下文（包含 axios、环境配置、以及预设的搜索词）
        const agentContext = createChatRunContext<RPOutlineSendInput>(
          {
            entityType: 'chapter',
            entityCode: chapterId,
            content: ChatPresetQuestion.CHAPTER_GEN_THOUGHT,
            clientType: 'aireport',
          },
          {
            axiosInstance: axiosInstance,
            axiosEntWeb: entWebAxiosInstance,
            isDev: isDev,
          }
        );

        // 创建并注册中止控制器，允许外部暂停
        agentContext.createAbortController();
        const pathKey = createPathKey(path);
        activeContextsRef.current.set(pathKey, agentContext);

        // 执行流程（预处理），由内部函数统一处理，可被中止
        await processWrightThoughtAgentReq(agentContext);
        const runTimeState = agentContext.runtime;
        const reportData = runTimeState.reportData;

        // 检查是否有章节操作结果
        if (!reportData?.chapterOperation) {
          throw new Error('未获取到章节操作结果');
        }

        const { chapterOperation } = reportData;

        // 检查操作是否成功
        if (!chapterOperation.status.success) {
          throw new Error(chapterOperation.status.message || '生成编写思路失败');
        }

        // 提取生成的编写思路
        const generatedThought = chapterOperation.chapter.writingThought || '';

        if (!generatedThought.trim()) {
          throw new Error('生成的编写思路为空');
        }

        // 完成生成状态
        dispatch({
          type: OutlineAction.FINISH_THOUGHT_GENERATION,
          payload: { chapterPath: path },
        });

        // 清理上下文引用
        activeContextsRef.current.delete(pathKey);

        return generatedThought;
      } catch (error) {
        // 记录错误日志
        console.error('生成编写思路失败:', {
          path,
          title,
          chapterId,
          error: error instanceof Error ? error.message : error,
        });

        // 设置错误状态
        dispatch({
          type: OutlineAction.FAIL_THOUGHT_GENERATION,
          payload: {
            chapterPath: path,
            error: error instanceof Error ? error.message : '生成编写思路失败',
          },
        });

        // 清理上下文引用（包括被中止的情况）
        const pathKey = createPathKey(path);
        activeContextsRef.current.delete(pathKey);

        // 重新抛出错误，让调用方处理
        throw new Error(error instanceof Error ? error.message : '生成编写思路失败');
      }
    },
    [dispatch]
  );

  /**
   * 暂停（中止）指定路径的编写思路生成
   */
  const pauseThought = useCallback(
    (path: TreePath) => {
      try {
        const pathKey = createPathKey(path);
        const context = activeContextsRef.current.get(pathKey);
        if (context) {
          context.abort('用户取消');
        }
        // 更新状态：移除生成中标记
        dispatch({ type: OutlineAction.STOP_THOUGHT_GENERATION, payload: { chapterPath: path } });
        // 清理引用
        activeContextsRef.current.delete(pathKey);
      } catch (e) {
        console.warn('暂停编写思路生成失败:', e);
      }
    },
    [dispatch]
  );

  return {
    generateThought,
    pauseThought,
  };
}
