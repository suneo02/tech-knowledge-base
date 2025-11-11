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
  sendRPContentMessage: (message: RPContentSendInput) => void;
  parsedRPContentMessages: MessageInfo<MessageParsedReportContent>[];
  setMessages: (action: SetStateAction<MessageInfo<RPContentAgentMsg>[]>) => void;
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
    sendMessage: sendRPContentMessage,
    parsedMessages: parsedRPContentMessages,
    setMessages,
  } = useRPContentChat();

  // 单点的编辑器 ref，通过 Context 在页面内共享，避免放入 Redux 导致被冻结
  const reportEditorRef = useRef<ReportEditorRef | null>(null);

  // 引用资料视图的 ref，用于外部程序化控制预览
  const referenceViewRef = useRef<ReferenceViewHandle | null>(null);

  return (
    <Context.Provider
      value={{
        sendRPContentMessage,
        parsedRPContentMessages,
        setMessages,
        reportEditorRef,
        referenceViewRef,
      }}
    >
      {children}
    </Context.Provider>
  );
};
