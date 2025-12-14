import { useRPOutlineContext } from '@/context';
import { useAppDispatch } from '@/store';
import { rpOutlineActions } from '@/store/rpOutline';
import { RPFileUploaded } from '@/types';
import { Bubble } from '@ant-design/x';
import { Spin } from '@wind/wind-ui';
import {
  CHAT_ROOM_ID_PREFIX,
  PlaceholderPromptsComp,
  ScrollToBottomButton,
  useBubbleItems,
  useChatRestore,
  useChatRoomContext,
} from 'ai-ui';
import cn from 'classnames';
import { ChatThinkSignal } from 'gel-api';
import { ErrorBoundary, useScrollToBottom } from 'gel-ui';
import { t } from 'gel-util/intl';
import { memo, useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../../api/axios';
import { PlaceholderReport } from '../../ChatCommon/PlaceHolder';
import { RPOutlineChatSync } from '../ChatSync';
import { rolesReportOutline } from '../roles';
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
  initialFiles?: RPFileUploaded[] | null;
  initialRefFiles?: RPFileUploaded[] | null;
  /** 当有会话ID但无消息时是否显示占位内容 */
  showPlaceholderWhenEmpty?: boolean;
  /** 占位组件类型 */
  PlaceholderNode?: PlaceholderPromptsComp;
}

/**
 * 聊天消息组件核心实现
 */
export const ChatRPOutlineMessages = memo(
  ({
    initialMessage,
    initialDeepthink,
    initialFiles,
    initialRefFiles,
    showPlaceholderWhenEmpty = false,
    PlaceholderNode = PlaceholderReport,
  }: ChatMessageProps) => {
    // 获取聊天室上下文
    const { chatId, roomId, isChating } = useChatRoomContext();

    // 使用 Redux dispatch 直接调用 actions
    const dispatch = useAppDispatch();

    useEffect(() => {
      if (initialFiles && initialFiles.length > 0) {
        dispatch(rpOutlineActions.batchAddFiles(initialFiles));
      }
    }, [initialFiles, dispatch]);

    // 获取聊天相关的状态和方法
    const { parsedMessages, sendMessage, setMessages } = useRPOutlineContext();

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

    // 处理历史消息恢复
    useEffect(() => {
      if (messagesByChatRestore) {
        setMessages(messagesByChatRestore);
      }
    }, [messagesByChatRestore, setMessages]);

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
        sendMessage({
          content: initialMessage,
          think: initialDeepthink ?? undefined,
          files: initialFiles ?? undefined,
          refFiles: initialRefFiles ?? undefined,
        });
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
      // @ts-expect-error wind-ui
      <Spin spinning={bubbleLoading} wrapperClassName={styles.spinContainer}>
        {/* 同步 parsedMessages 到 Redux */}
        <RPOutlineChatSync />
        <div className={styles.chat}>
          <div ref={chatContainerRef} className={cn(styles['chat-container'])}>
            <ErrorBoundary>
              <Bubble.List
                className={cn(styles.bubbleListContainer, 'bubble-list-container')}
                roles={rolesReportOutline}
                items={bubbleItems}
              />
            </ErrorBoundary>
          </div>

          {/* 使用独立的滚动到底部按钮组件 */}
          <ScrollToBottomButton visible={showScrollBottom} onClick={scrollToBottom} className={styles.scrollButton} />
          <div className={styles.footer}>{t('451199', '内容由AI生成，仅供参考，请检查数据和信息的正确性')}</div>
        </div>
      </Spin>
    );
  }
);

ChatRPOutlineMessages.displayName = 'ChatRPOutlineMessages';
