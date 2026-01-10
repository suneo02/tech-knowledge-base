/**
 * RPOutline 聊天 Context
 *
 * @description 提供 RPOutline 聊天的状态管理和业务逻辑封装
 * @since 1.0.0
 *
 * 架构说明：
 * - 移至 components/ChatRPOutline/context 避免循环依赖
 * - 形成内聚的模块：hooks → parsers → AIFooter → context
 */

import { isLastAgentMsgAI } from '@/domain/chat';
import { useAppDispatch } from '@/store';
import { rpOutlineActions } from '@/store/rpOutline';
import { RPOutlineAgentMsg } from '@/types';
import { RPOutlineFile, RPOutlineMsgParsed, RPOutlineSendInput } from '@/types/chat/RPOutline';
import { DefaultMessageInfo, MessageInfo } from '@ant-design/x/es/use-x-chat';
import { ChatRawSentenceIdIdentifier, RPFileStatus } from 'gel-api';
import { createContext, FC, ReactNode, SetStateAction, useCallback, useContext, useEffect } from 'react';
import { useRPOutlineChat } from '../hooks';

export type RPOutlineCtx = {
  sendMessage: (messageInput: RPOutlineSendInput) => void;
  agentMessages: MessageInfo<RPOutlineAgentMsg>[];
  parsedMessages: MessageInfo<RPOutlineMsgParsed>[];
  setMessages: (action: SetStateAction<MessageInfo<RPOutlineAgentMsg>[]>) => void;
  /**
   * 批量更新文件状态
   * @param fileStatusMap - 文件 ID 到状态的映射
   */
  updateFileStatus: (fileStatusMap: Map<string, RPFileStatus>) => void;
  /**
   * 判断指定消息是否为最后一条 AI 消息
   * @param agentMessage - 要判断的 AI 消息
   * @returns 是否为最后一条 AI 消息
   */
  isLastAIMessage: (sentence: Partial<ChatRawSentenceIdIdentifier>) => boolean;
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
  const dispatch = useAppDispatch();
  const { sendMessage, agentMessages, parsedMessages, setMessages, cancelRequest } = useRPOutlineChat(defaultMessages);

  /**
   * 更新单个文件的状态
   */
  const updateFileInList = useCallback((files: RPOutlineFile[] | undefined, statusMap: Map<string, RPFileStatus>) => {
    if (!files) return { updated: files, hasChange: false };

    let hasChange = false;
    const updated = files.map((file) => {
      const newStatus = statusMap.get(file.fileId);
      if (newStatus === undefined) return file;

      hasChange = true;
      return { ...file, status: newStatus };
    });

    return { updated, hasChange };
  }, []);

  /**
   * 批量更新文件状态
   */
  const updateFileStatus = useCallback(
    (fileStatusMap: Map<string, RPFileStatus>) => {
      setMessages((prevMessages) =>
        prevMessages.map((messageInfo) => {
          const message = messageInfo.message;

          // 只处理包含 files 的消息类型
          if (!('files' in message)) return messageInfo;

          // 更新 files 和 refFiles
          const filesResult = updateFileInList(message.files, fileStatusMap);
          const refFilesResult = updateFileInList(message.refFiles, fileStatusMap);

          // 如果没有任何更新，返回原消息
          if (!filesResult.hasChange && !refFilesResult.hasChange) return messageInfo;

          // 返回更新后的消息
          return {
            ...messageInfo,
            message: {
              ...message,
              files: filesResult.updated,
              refFiles: refFilesResult.updated,
            },
          };
        })
      );
    },
    [setMessages, updateFileInList]
  );

  /**
   * 判断指定消息是否为最后一条 AI 消息
   */
  const isLastAIMessageFn = useCallback(
    (sentence: Partial<ChatRawSentenceIdIdentifier>): boolean => {
      const allMessages = agentMessages.map((msg) => msg.message);
      return isLastAgentMsgAI(sentence, allMessages);
    },
    [agentMessages]
  );

  useEffect(() => {
    return () => {
      cancelRequest();
      setMessages([]);
      dispatch(rpOutlineActions.reset());
    };
  }, []);

  return (
    <Context.Provider
      value={{
        sendMessage,
        agentMessages,
        parsedMessages,
        setMessages,
        updateFileStatus,
        isLastAIMessage: isLastAIMessageFn,
      }}
    >
      {children}
    </Context.Provider>
  );
};
