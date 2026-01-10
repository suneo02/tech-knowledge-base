import { getIsOutlineConfirmed, hasOutlineInMessages } from '@/domain/chat';
import { buildReportDetailUrlFromOutline } from '@/utils/reportNavigation';
import { message } from '@wind/wind-ui';
import { useRequest } from 'ahooks';
import { useChatRoomContext } from 'ai-ui';
import { TRequestToChat } from 'gel-api';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChatRequest } from '../../../../api';
import { useRPOutlineContext } from '../../../../context';

type FuncCreateReport = TRequestToChat<'report/create'>;

/**
 * 操作区业务逻辑Hook返回类型
 */
export interface UseOperationActionsReturn {
  /** 返回首页 */
  handleBack: () => void;
  /** 重新生成大纲 */
  handleRegenerate: () => void;
  /** 生成全文 */
  handleGenerateFullText: () => void;
  /** 是否正在生成全文 */
  isGeneratingFullText: boolean;
  /** 返回按钮是否禁用 */
  isBackDisabled: boolean;
  /** 重新生成按钮是否禁用 */
  isRegenerateDisabled: boolean;
  /** 生成全文按钮是否禁用 */
  isGenerateFullTextDisabled: boolean;
}

/**
 * 操作区业务逻辑Hook
 */
export const useOperationActions = (): UseOperationActionsReturn => {
  const navigate = useNavigate();
  const { chatId, isChating } = useChatRoomContext(); // chatId 是唯一数据源
  const { agentMessages, parsedMessages, sendMessage } = useRPOutlineContext();

  // 生成全文请求
  const { run: runGenerateFullText, loading: isGeneratingFullText } = useRequest<
    Awaited<ReturnType<FuncCreateReport>>,
    Parameters<FuncCreateReport>
  >(createChatRequest('report/create'), {
    manual: true,
    onSuccess: (res) => {
      const reportId = res?.Data?.reportId;
      if (reportId) {
        // 导航到报告详情页，并携带自动生成标识
        navigate(buildReportDetailUrlFromOutline(reportId));
      } else {
        message.error('生成全文失败');
      }
    },
    onError: (error) => {
      console.error(error);
      message.error('生成全文失败');
    },
  });

  /**
   * 返回首页
   */
  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  /**
   * 重新生成大纲 - 重新发送上一个问句
   * 从 parsedMessages 中查找最后一个用户消息
   * sendMessage 内部会自动使用最新的 chatId
   */
  const handleRegenerate = useCallback(() => {
    // 从后向前查找最后一个用户消息
    const lastUserMessage = [...agentMessages].reverse().find((msg) => msg.message.role === 'user');

    if (!lastUserMessage || lastUserMessage.message.role !== 'user') {
      console.warn('未找到用户消息，无法重新生成');
      return;
    }

    // 提取用户消息内容
    const { content, files, refFiles, entityCode } = lastUserMessage.message;

    // sendMessage 内部会自动使用 ChatRoomContext 中的最新 chatId
    sendMessage({
      content,
      files,
      refFiles,
      entityCode,
    });
  }, [agentMessages, sendMessage]);

  /**
   * 生成全文 - 调用生成全文接口
   */
  const handleGenerateFullText = useCallback(() => {
    runGenerateFullText({
      groupId: chatId,
    });
  }, [runGenerateFullText, chatId]);

  // 获取大纲状态信息

  const isOutlineConfirmed = getIsOutlineConfirmed(parsedMessages);

  const hasOutline = hasOutlineInMessages(parsedMessages);

  return {
    handleBack,
    handleRegenerate,
    handleGenerateFullText,
    isGeneratingFullText,
    // 生成全文或正在对话时禁用返回
    isBackDisabled: isGeneratingFullText || isChating,
    // 无大纲或正在对话或正在生成全文时禁用
    isRegenerateDisabled: !hasOutline || isChating || isGeneratingFullText,
    // 无大纲、未确认或正在对话或正在生成全文时禁用
    isGenerateFullTextDisabled: !hasOutline || !isOutlineConfirmed || isChating,
  };
};
