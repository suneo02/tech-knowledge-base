import { RPContentAgentMsgAI, RPContentSendInput } from '@/types/chat/RPContent';
import { XAgentConfig } from '@ant-design/x/es/use-x-agent';
import {
  ChatStaticConfig,
  createAgentAIMsgStream,
  createAgentMsgAIDataRetrieval,
  createAgentMsgAIInitBySendInput,
  createAgentMsgAISubQuestion,
  createChatRunContext,
  CreateHandleError,
  processChatPreflight,
  processChatSave,
  processPreprocessing,
  processStreamRequest,
  StreamDependencies,
} from 'gel-ui';
import { formatAIAnswerWithEntities } from 'gel-util/common';
import { ERROR_TEXT } from 'gel-util/config';

/**
 * 创建内容聊天统一请求函数，复用 gel-ui 三阶段流程。
 */
export const createReportContentXAgentReq = (
  dependencies: Omit<StreamDependencies<RPContentAgentMsgAI>, 'onAgentSuccess' | 'onAgentUpdate'>,
  staticCfg: ChatStaticConfig
): XAgentConfig<RPContentAgentMsgAI, RPContentSendInput, RPContentAgentMsgAI>['request'] => {
  return async (input, { onSuccess: onAgentSuccess, onUpdate: onAgentUpdate }) => {
    if (!input) {
      dependencies.setIsChating(false);
      return;
    }

    const streamDependencies: StreamDependencies<RPContentAgentMsgAI> = {
      ...dependencies,
      onAgentSuccess: (messages) => onAgentSuccess(messages),
      onAgentUpdate: (message) => onAgentUpdate(message),
      // 报告专用：自定义内容格式化器，不插入溯源标记
      customContentFormatter: formatAIAnswerWithEntities,
    };

    const context = createChatRunContext<RPContentSendInput>(input, staticCfg);

    if (context.eventBus) {
      context.eventBus.on('question:received', ({ questions, input }) => {
        const subQuestion = {
          ...createAgentMsgAISubQuestion(input, questions),
          status: 'pending' as const,
          chapterId: input.chapterId,
        };
        onAgentUpdate(subQuestion);
      });
    }

    dependencies.registerEventListeners?.(context.eventBus!);

    const handleError = (error: CreateHandleError) => {
      const { errorCode } = error;
      dependencies.setIsChating(false);

      const content = context.runtime.aigcContent || ERROR_TEXT[errorCode || 'DEFAULT'];
      const agentMsg: RPContentAgentMsgAI = {
        ...createAgentAIMsgStream(input, context, content, context.runtime.aigcReason),
        status: 'finish',
        questionStatus: errorCode,
        chapterId: input.chapterId,
      };
      onAgentUpdate(agentMsg);
      // @ts-expect-error 兼容 useXAgent 回调签名
      onAgentSuccess(agentMsg);

      processChatSave(context, {
        questionStatus: errorCode,
      });
    };

    try {
      await processPreprocessing<RPContentAgentMsgAI>(context, streamDependencies);

      onAgentUpdate({
        ...createAgentMsgAIInitBySendInput(input),
        status: 'pending',
        chapterId: input.chapterId,
      });

      await processChatPreflight(context, {
        enableDataRetrieval: false,
      });
      context.clearAbortController();

      context.createStreamAbortController();

      const aiResRef = createAgentMsgAIDataRetrieval(input, context) as RPContentAgentMsgAI;
      onAgentUpdate({
        ...aiResRef,
        status: 'receiving',
        chapterId: input.chapterId,
      });

      await processStreamRequest(context, streamDependencies);
    } catch (error) {
      handleError(error as CreateHandleError);
    }
  };
};
