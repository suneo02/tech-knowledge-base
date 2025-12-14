/**
 * 报告内容 context
 */

import { ReferenceViewHandle } from '@/components/Reference';
import { useRPContentChat } from '@/hooks/ReportContent';
import { RPContentSendInput } from '@/types/chat/RPContent';
import { ReportEditorRef } from '@/types/editor';
import { MessageInfo } from '@ant-design/x/es/use-x-chat';
import { createContext, FC, ReactNode, SetStateAction, useContext, useRef } from 'react';
import { MessageParsedReportContent, RPContentAgentMsg } from '../types';

export type ReportDetailCtx = {
  sendRPContentMsg: (message: RPContentSendInput) => void;
  parsedRPContentMsgs: MessageInfo<MessageParsedReportContent>[];
  rpContentAgentMsgs: MessageInfo<RPContentAgentMsg>[];
  setMsgs: (action: SetStateAction<MessageInfo<RPContentAgentMsg>[]>) => void;
  clearChapterMessages: (chapterId: string) => void;
  reportEditorRef: React.MutableRefObject<ReportEditorRef | null>;
  referenceViewRef: React.MutableRefObject<ReferenceViewHandle | null>;
};

const Context = createContext<ReportDetailCtx | undefined>(undefined);

export const useReportDetailContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useReportDetailContext must be used within a ReportDetailProvider');
  }
  return context;
};

export const ReportDetailProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const {
    sendMessage: sendRPContentMsg,
    parsedMessages: parsedRPContentMsgs,
    agentMessages: rpContentAgentMsgs,
    setMessages: setMsgs,
  } = useRPContentChat();

  // 单点的编辑器 ref，通过 Context 在页面内共享，避免放入 Redux 导致被冻结
  const reportEditorRef = useRef<ReportEditorRef | null>(null);

  // 引用资料视图的 ref，用于外部程序化控制预览
  const referenceViewRef = useRef<ReferenceViewHandle | null>(null);

  /**
   * 清理指定章节的流式消息
   * 用于章节完成后移除临时消息，确保渲染切换到 chapter.content
   *
   * @see {@link ../docs/issues/chapter-rendering-missing-source-data.md | 章节渲染缺失溯源数据问题}
   */
  const clearChapterMessages = (chapterId: string) => {
    setMsgs((prevMessages) => {
      return prevMessages.filter((msg) => {
        // 保留用户消息
        if (msg.message.role === 'user') return true;
        // AI 消息：过滤掉指定章节的消息
        if (msg.message.role === 'ai' && 'chapterId' in msg.message) {
          return msg.message.chapterId !== chapterId;
        }
        return true;
      });
    });
  };

  return (
    <Context.Provider
      value={{
        sendRPContentMsg: sendRPContentMsg,
        parsedRPContentMsgs,
        rpContentAgentMsgs,
        setMsgs,
        clearChapterMessages,
        reportEditorRef,
        referenceViewRef,
      }}
    >
      {children}
    </Context.Provider>
  );
};
