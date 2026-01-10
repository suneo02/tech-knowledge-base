/**
 * 自动生成全文 Hook
 *
 * @description 处理从特定入口进入报告详情时自动触发生成全文的逻辑
 * @since 1.0.0
 */

import { RP_URL_PARAMS } from '@/constants/urlParams';
import { TRequestToChat } from 'gel-api';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFullDocGeneration } from '../../../store/reportContentStore/hooks/useFullDocGeneration';

type FuncGetReport = TRequestToChat<'report/query'>;

/**
 * 检查报告大纲是否已完成
 */
const getReportOutlineFinished = (data: Awaited<ReturnType<FuncGetReport>> | undefined): boolean => {
  return (data?.Data?.chapters?.length || 0) > 0;
};

/**
 * 检查报告是否已有内容
 */
const hasReportContent = (data: Awaited<ReturnType<FuncGetReport>> | undefined): boolean => {
  return data?.Data?.chapters?.some((chapter) => chapter.content && chapter.content.trim().length > 0) || false;
};

/**
 * 自动生成全文 Hook
 *
 * @param data - 报告数据
 */
export const useAutoGenerate = (data: Awaited<ReturnType<FuncGetReport>> | undefined) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { startGeneration } = useFullDocGeneration();

  useEffect(() => {
    // 检查是否需要自动生成
    const autoGenerate = searchParams.get(RP_URL_PARAMS.AUTO_GENERATE) === 'true';
    if (!autoGenerate || !data) return;

    // 检查报告是否已有内容
    const hasContent = hasReportContent(data);

    // 只有在报告无内容且大纲已完成时才自动触发生成
    if (!hasContent && getReportOutlineFinished(data)) {
      // 自动触发生成全文
      startGeneration();

      // 清除 URL 参数，避免刷新重复触发
      searchParams.delete(RP_URL_PARAMS.AUTO_GENERATE);
      searchParams.delete(RP_URL_PARAMS.SOURCE);
      setSearchParams(searchParams, { replace: true });
    }
  }, [data, searchParams, setSearchParams, startGeneration]);
};
