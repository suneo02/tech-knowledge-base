import { RPDetailLeftAgentMsgAI, RPDetailSendInput } from '@/types/chat/RPDetailLeft';
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
import { ERROR_TEXT } from 'gel-util/config';

/**
 * 创建详情聊天统一请求函数。
 *
 * 该函数遵循 gel-ui 的统一流程：预处理 → 会话预检 → 流式处理，
 * 并通过 EventBus 将生命周期事件暴露给上层。
 */
export const createRPDetailXAgentReq = (
  dependencies: Omit<StreamDependencies<RPDetailLeftAgentMsgAI>, 'onAgentSuccess' | 'onAgentUpdate'>,
  staticCfg: ChatStaticConfig
): XAgentConfig<RPDetailLeftAgentMsgAI, RPDetailSendInput, RPDetailLeftAgentMsgAI>['request'] => {
  return async (input, { onSuccess: onAgentSuccess, onUpdate: onAgentUpdate }) => {
    if (!input) {
      dependencies.setIsChating(false);
      return;
    }

    const streamDependencies: StreamDependencies<RPDetailLeftAgentMsgAI> = {
      ...dependencies,
      onAgentSuccess,
      onAgentUpdate,
    };

    const context = createChatRunContext<RPDetailSendInput>(input, staticCfg);

    if (context.eventBus) {
      // 内部监听问句拆解事件，更新 UI 的子问题消息
      context.eventBus.on('question:received', ({ questions, input }) => {
        onAgentUpdate({
          ...createAgentMsgAISubQuestion(input, questions),
          status: 'pending',
        });
      });
    }

    dependencies.registerEventListeners?.(context.eventBus!);

    const handleError = (error: CreateHandleError) => {
      const { errorCode } = error;
      dependencies.setIsChating(false);

      const content = context.runtime.aigcContent || ERROR_TEXT[errorCode || 'DEFAULT'];
      const agentMsg: RPDetailLeftAgentMsgAI = {
        ...createAgentAIMsgStream(input, context, content, context.runtime.aigcReason),
        status: 'finish',
        questionStatus: errorCode,
      };

      // @ts-expect-error 保持与 XAgent 接口的兼容性
      onAgentSuccess(agentMsg);

      processChatSave(context, {
        questionStatus: errorCode,
      });
    };

    try {
      // 1. 预处理阶段：清空输入 / 设置 chat 状态 / 创建 abort controller
      await processPreprocessing(context, streamDependencies);

      onAgentUpdate({
        ...createAgentMsgAIInitBySendInput(input),
        status: 'pending',
      });

      // 2. 预检阶段：创建会话、触发分析、实体检索等
      await processChatPreflight(context);
      context.clearAbortController();

      context.createStreamAbortController();

      const aiResRef = createAgentMsgAIDataRetrieval(input, context);
      onAgentUpdate({
        ...aiResRef,
        status: 'receiving',
      });

      // 3. 流式阶段：持续接收模型输出，刷新 runtime
      await processStreamRequest(context, streamDependencies);
    } catch (error) {
      handleError(error as CreateHandleError);
    }
  };
};
