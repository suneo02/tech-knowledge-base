import { ChatLogLevel, ChatRunContext, processChatPreflight, registerProcessLogListeners } from 'gel-ui';

/**
 * 处理章节编写思路生成请求
 *
 * @param context 已创建的聊天运行上下文（外部负责创建）
 * @returns 运行完成（预处理已执行）的上下文
 */
export const processWrightThoughtAgentReq = async (context: ChatRunContext) => {
  // 注册流程日志监听（可选）
  registerProcessLogListeners(context.eventBus, {
    level: ChatLogLevel.INFO,
    formatter: (level, process, message, data) => {
      return `🚀 [RPOutline] [${level.toUpperCase()}] [${process}] ${message} ${data ? JSON.stringify(data) : ''}`;
    },
  });
  // 在此执行 preflight，由外部提前创建并可注入 AbortController
  await processChatPreflight(context, { enableDataRetrieval: false });
  return context;
};
