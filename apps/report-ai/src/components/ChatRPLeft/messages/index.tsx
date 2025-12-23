import { RPOutlineChatSenderCB } from '@/components/ChatCommon/Sender/type';
import { useRPDetailChat } from '@/hooks';
import { RPMsgAgentShared } from '@/types/chat/RPLeft';
import { Bubble } from '@ant-design/x';
import { DefaultMessageInfo } from '@ant-design/x/es/use-x-chat';
import {
  CHAT_ROOM_ID_PREFIX,
  PlaceholderPromptsComp,
  ScrollToBottomButton,
  useBubbleItems,
  useChatRestore,
  useChatRoomContext,
} from 'ai-ui';
import { Spin } from 'antd';
import cn from 'classnames';
import { ChatThinkSignal } from 'gel-api';
import { getChatPlaceholder, useScrollToBottom } from 'gel-ui';
import { t } from 'gel-util/intl';
import { uniqueId } from 'lodash-es';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../../api/axios';
import { PlaceholderReport } from '../../ChatCommon/PlaceHolder';
import { ChatSenderReport } from '../../ChatCommon/Sender';
import { rolesReport } from '../roles';
import styles from './index.module.less';

/**
 * 聊天消息组件，整合了聊天室上下文和消息管理功能
 *
 * @component
 */
interface ChatMessageProps {
  /** 初始消息，通常用于从其他页面跳转时带入的消息 */
  initialMessage?: string | null;
  initialDeepthink?: ChatThinkSignal['think'] | null;
  /** 当有会话ID但无消息时是否显示占位内容 */
  showPlaceholderWhenEmpty?: boolean;
  /** 占位组件类型 */
  PlaceholderNode?: PlaceholderPromptsComp;
  defaultMessages?: DefaultMessageInfo<RPMsgAgentShared>[];
}

/**
 * 聊天消息组件核心实现
 */
export const ChatRPLeftMessages = memo(
  ({
    initialMessage,
    initialDeepthink,
    showPlaceholderWhenEmpty = false,
    PlaceholderNode = PlaceholderReport,
    defaultMessages,
  }: ChatMessageProps) => {
    // 获取聊天室上下文
    const { chatId, roomId, isChating } = useChatRoomContext();

    // 获取聊天相关的状态和方法
    const { content, parsedMessages, handleContentChange, sendMessage, setMessages, cancelRequest } =
      useRPDetailChat(defaultMessages);

    // 获取历史消息恢复状态
    const { messagesByChatRestore, bubbleLoading } = useChatRestore({
      axiosChat: axiosInstance,
      chatId,
      // 当 room id 含有 prefix时，说明当前会话是新创建的会话，不应恢复历史
      // 当 room id 与 chat id 相同时，说明是从历史加载的会话，应该恢复历史
      shouldRestore: !roomId.includes(CHAT_ROOM_ID_PREFIX) && !!chatId,
    });

    // 深度思考模式状态，可以是 1 或 undefined
    const [deepthink, setDeepthink] = useState<ChatThinkSignal['think']>(initialDeepthink ?? undefined);

    // 用于确保初始消息只发送一次的标记
    const initialMessageSentRef = useRef(false);

    // 使用滚动控制 hook
    const { chatContainerRef, showScrollBottom, scrollToBottom } = useScrollToBottom({
      parsedMessages,
      isChating,
    });

    // 包装发送消息函数，添加自动滚动到底部功能
    const handleSendMessage = useCallback<RPOutlineChatSenderCB>(
      (input) => {
        sendMessage({
          content: input.content,
          files: input.files,
          refFiles: input.refFiles,
        });
        // 发送消息后立即滚动到底部
        setTimeout(scrollToBottom, 50);
      },
      [sendMessage, scrollToBottom]
    );

    // 处理历史消息恢复
    useEffect(() => {
      if (messagesByChatRestore) {
        setMessages(messagesByChatRestore);
      }
    }, [messagesByChatRestore, setMessages]);

    useEffect(() => {
      if (defaultMessages) {
        setMessages(
          defaultMessages.map((item) => ({
            id: item.id ?? uniqueId(),
            status: 'success',
            ...item,
          }))
        );
      }
    }, [defaultMessages]);

    // 处理初始深度思考
    useEffect(() => {
      if (initialDeepthink) {
        setDeepthink(initialDeepthink);
      }
    }, [initialDeepthink]);

    // 处理初始消息发送
    useEffect(() => {
      if (initialMessage && !initialMessageSentRef.current) {
        initialMessageSentRef.current = true;
        sendMessage({ content: initialMessage, think: initialDeepthink ?? undefined });
      }
    }, [initialMessage, sendMessage, initialDeepthink]);

    // 气泡项处理逻辑
    const { bubbleItems } = useBubbleItems(
      parsedMessages,
      chatId,
      showPlaceholderWhenEmpty,
      PlaceholderNode,
      (message) => sendMessage({ content: message, think: deepthink })
    );

    return (
      <Spin spinning={bubbleLoading} wrapperClassName={styles['spin-container']}>
        <div className={styles.chat}>
          <div ref={chatContainerRef} className={cn(styles.chatContainer, styles.chatContainerTop)}>
            <Bubble.List
              className={cn(styles.bubbleListContainer, 'bubble-list-container')}
              roles={rolesReport}
              items={bubbleItems}
            />
          </div>

          {/* 使用独立的滚动到底部按钮组件 */}
          <ScrollToBottomButton visible={showScrollBottom} onClick={scrollToBottom} />

          {/* 聊天操作区域 */}
          <div className={cn(styles.chatActionsContainer, styles.chatContainerTop)}>
            <ChatSenderReport
              className={styles.chatActions}
              placeholder={getChatPlaceholder(parsedMessages, isChating)}
              isLoading={isChating}
              value={content}
              senderClassName={styles.sender}
              onCancel={cancelRequest}
              onChange={handleContentChange}
              sendMessage={handleSendMessage}
            />
          </div>
          <div className={styles.footer}>{t('451199', '内容由AI生成，仅供参考，请检查数据和信息的正确性')}</div>
        </div>
      </Spin>
    );
  }
);

ChatRPLeftMessages.displayName = 'ChatRPLeftMessages';
