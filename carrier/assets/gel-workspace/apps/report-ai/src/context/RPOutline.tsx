/**
 * RPOutline 聊天 context
 */

import { RPOutlineAgentMsg } from '@/types';
import { DefaultMessageInfo, MessageInfo } from '@ant-design/x/es/use-x-chat';
import { createContext, FC, ReactNode, SetStateAction, useContext } from 'react';
import { useRPOutlineChat } from '../hooks';
import { RPOutlineMsgParsed, RPOutlineSendInput } from '../types/chat/RPOutline';

export type RPOutlineCtx = {
  sendMessage: (messageInput: RPOutlineSendInput) => void;
  rawMessages: MessageInfo<RPOutlineAgentMsg>[];
  parsedMessages: MessageInfo<RPOutlineMsgParsed>[];
  setMessages: (action: SetStateAction<MessageInfo<RPOutlineAgentMsg>[]>) => void;
};

const Context = createContext<RPOutlineCtx | undefined>(undefined);

export const useRPOutlineContext = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useRPOutlineContext must be used within a RPOutlineProvider');
  }
  return context;
};

export const RPOutlineProvider: FC<{
  children: ReactNode;
  defaultMessages?: DefaultMessageInfo<RPOutlineAgentMsg>[];
}> = ({ children, defaultMessages }) => {
  const { sendMessage, rawMessages, parsedMessages, setMessages } = useRPOutlineChat(defaultMessages);

  return (
    <Context.Provider
      value={{
        sendMessage,
        rawMessages,
        parsedMessages,
        setMessages,
      }}
    >
      {children}
    </Context.Provider>
  );
};
