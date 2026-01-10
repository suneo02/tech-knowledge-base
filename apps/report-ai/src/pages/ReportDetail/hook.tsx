import { useRequest } from 'ahooks';
import { message } from 'antd';
import { ApiCodeForWfc, TRequestToChat } from 'gel-api';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { createChatRequest } from '../../api';
import { useReportDetailContext } from '../../context';
import { rpDetailActions, useRPDetailDispatch } from '../../store/reportContentStore';
import { useAutoGenerate } from './hooks/useAutoGenerate';

type FuncGetReport = TRequestToChat<'report/query'>;

const getReportOutlineFinished = (data: Awaited<ReturnType<FuncGetReport>> | undefined) => {
  return (data?.Data?.chapters?.length || 0) > 0;
};

/**
 * 初始化报告内容的Hook
 *
 * @description 负责获取报告数据，管理轮询状态，并更新报告详情上下文
 * @since 1.0.0
 *
 * @returns 包含报告数据状态的对象
 */
export const useInitReportContent = () => {
  const { id: reportId } = useParams<{ id: string }>();
  const dispatch = useRPDetailDispatch();
  const { cancelRequests, setMsgs } = useReportDetailContext();
  const prevReportIdRef = useRef<string | undefined>();

  useEffect(() => {
    dispatch(rpDetailActions.setReportId(reportId));
  }, [reportId, dispatch]);

  useEffect(() => {
    if (prevReportIdRef.current && prevReportIdRef.current !== reportId) {
      cancelRequests();
      setMsgs([]);
      dispatch(rpDetailActions.setHydrationTask({ type: 'idle' }));
    }
    prevReportIdRef.current = reportId;
  }, [reportId, cancelRequests, setMsgs, dispatch]);

  const { data, run } = useRequest<Awaited<ReturnType<FuncGetReport>>, Parameters<FuncGetReport>>(
    createChatRequest('report/query'),
    {
      manual: true,
      onBefore: () => {
        dispatch(rpDetailActions.startChapterLoading());
      },
      onSuccess: (data) => {
        // 当报告完成时更新状态
        if (data.ErrorCode === ApiCodeForWfc.SUCCESS) {
          dispatch(
            rpDetailActions.chapterLoadingSuccess({
              chapters: data.Data?.chapters || [],
              reportName: data.Data?.name || '',
              referencePriority: data.Data?.referencePriority,
              loadedAt: Date.now(),
            })
          );
          message.success('获取报告大纲成功');
        } else {
          // API 返回错误码，视为失败
          const errorMsg = `获取报告大纲失败: ${data.ErrorCode}`;
          dispatch(rpDetailActions.chapterLoadingFailure(errorMsg));
          message.error('获取报告大纲失败');
        }
      },
      onError: (error) => {
        // 网络错误或其他异常
        const errorMsg = error instanceof Error ? error.message : '获取报告大纲失败';
        dispatch(rpDetailActions.chapterLoadingFailure(errorMsg));
        message.error('获取报告大纲失败');
        console.error('获取报告大纲失败:', error);
      },
    }
  );

  // 当reportId变化时重新获取数据
  useEffect(() => {
    if (reportId) {
      run(undefined, {
        appendUrl: reportId,
      });
    }
  }, [reportId, run]);

  // 注意：章节数据和报告名称已在 chapterLoadingSuccess 中统一更新
  // 移除了重复的 setChapters 和 setReportName 调用，避免双重注水

  // 自动生成全文逻辑
  useAutoGenerate(data);

  return {
    chapters: data?.Data?.chapters || [],
    reportName: data?.Data?.name || '',
    isRPOutlineFinished: getReportOutlineFinished(data),
    data,
  };
};
