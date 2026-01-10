import { RPOutlineAgentMsgAI, RPOutlineSendInput } from '@/types/chat/RPOutline';
import { XAgentConfig } from '@ant-design/x/es/use-x-agent';
import {
  ChatStaticConfig,
  createAgentAIMsgStream,
  createAgentMsgAIDataRetrieval,
  createAgentMsgAIInitBySendInput,
  createAgentMsgAIProgress,
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
 * 统一的聊天处理器 - 主函数
 *
 * 基于函数式流程设计，将原来的两个耦合函数合并为一个统一的处理器
 * 保持 API 兼容性，支持渐进式迁移
 */
export const createRPOutlineXAgentReq = (
  dependencies: Omit<StreamDependencies, 'onAgentSuccess' | 'onAgentUpdate'>,
  staticCfg: ChatStaticConfig
): XAgentConfig<RPOutlineAgentMsgAI, RPOutlineSendInput, RPOutlineAgentMsgAI>['request'] => {
  return async (input, { onSuccess: onAgentSuccess, onUpdate: onAgentUpdate }) => {
    if (!input) {
      dependencies.setIsChating(false);
      return;
    }
    // 创建简化的运行上下文，包含所有流程回调
    const streamDependencies: StreamDependencies<RPOutlineAgentMsgAI> = {
      ...dependencies,
      onAgentSuccess,
      onAgentUpdate,
    };

    const context = createChatRunContext<RPOutlineSendInput>(input, staticCfg);

    // 外部如需暂停或取消，请使用 onAbortControllerChange / onStreamAbortControllerChange 提供的 controller

    // 注册内部事件监听器
    if (context.eventBus) {
      // 内部处理 question:received 事件
      context.eventBus.on('question:received', ({ questions, input }) => {
        onAgentUpdate({
          ...createAgentMsgAISubQuestion(input, questions),
          status: 'pending',
        });
      });

      // 内部处理 progress:received 事件
      context.eventBus.on('progress:received', ({ progress, questions, input }) => {
        onAgentUpdate({
          ...createAgentMsgAIProgress(input, progress, questions),
          status: 'pending',
        });
      });
    }

    // 注册外部 EventBus 事件监听器
    dependencies.registerEventListeners?.(context.eventBus!);

    // 错误处理函数
    const handleError = (error: CreateHandleError) => {
      const { errorCode } = error;
      dependencies.setIsChating(false);
      // AbortController 清理现在通过 context.clearAbortController() 处理

      const content = context.runtime.aigcContent || ERROR_TEXT[errorCode || 'DEFAULT'];
      const agentMsg: RPOutlineAgentMsgAI = {
        ...createAgentAIMsgStream(input, context, content, context.runtime.aigcReason),
        status: 'finish',
        questionStatus: errorCode,
      };

      // @ts-expect-error 保持原有的类型兼容性
      onAgentSuccess(agentMsg);

      processChatSave(context, {
        questionStatus: errorCode,
      });
    };

    try {
      // 执行统一的处理流程
      await processPreprocessing(context, streamDependencies);

      // 初始化状态更新
      onAgentUpdate({
        ...createAgentMsgAIInitBySendInput(input),
        status: 'pending',
      });

      // Preflight 处理：执行会话初始化、子问题处理
      await processChatPreflight(context, {
        enableDataRetrieval: false,
      });
      // 清理 preflight 阶段的 AbortController（会自动触发 'abortController:cleared' 事件）
      context.clearAbortController();

      // 流式处理准备：创建流式控制器
      // 创建新的流式 AbortController（会自动触发 'streamAbortController:created' 事件）
      context.createStreamAbortController();

      // 更新为接收状态
      const aiResRef = createAgentMsgAIDataRetrieval(input, context);
      onAgentUpdate({
        ...aiResRef,
        status: 'receiving',
      });

      // 执行流式请求处理
      await processStreamRequest(context, streamDependencies);

      // Unified chat processing completed
    } catch (error) {
      handleError(error as CreateHandleError);
    }
  };
};
