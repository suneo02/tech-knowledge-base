import { legacyLogicalPropertiesTransformer, StyleProvider } from '@ant-design/cssinjs';

import { useOutlineFilePolling } from '@/hooks';
import { ChatRoomProvider, useChatRoomContext } from 'ai-ui';
import { getGapCompatTransformer, needsBrowserCompat, useInitialMsgFromUrl } from 'gel-ui';
import { Suspense, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChatRPOutlineMessages, OperationArea } from '../../components';
import { RPOutlineProvider } from '../../context';
import { useClearInitialMsg } from '../../hooks/useClearInitialMsg';
import { useExpandedSidebar } from '../../hooks/usePageSidebar';
import { Loading } from '../Fallback/loading';
import styles from './index.module.less';

/**
 * 聊天内容组件
 *
 * @description 处理聊天室的核心逻辑，包括房间 ID 管理和消息显示
 * @since 1.0.0
 */
const ChatContent: React.FC = () => {
  useExpandedSidebar();
  const { roomId, updateRoomId } = useChatRoomContext();
  const { initialMessage, initialDeepthink, initialFiles, initialRefFiles } = useInitialMsgFromUrl();
  const { chatId } = useParams<{ chatId?: string }>();

  useClearInitialMsg(initialMessage);
  useOutlineFilePolling();

  // 当 URL 中的 chatId 参数变化时，更新 room id
  useEffect(() => {
    if (chatId) {
      updateRoomId(chatId);
    }
  }, [chatId, updateRoomId]);

  return (
    <div className={styles['chat-container']}>
      <div className={styles['dialog-area']}>
        <Suspense fallback={<Loading />}>
          <ChatRPOutlineMessages
            key={`chat-messages-${roomId}`}
            initialMessage={initialMessage}
            initialDeepthink={initialDeepthink}
            initialFiles={initialFiles}
            initialRefFiles={initialRefFiles}
          />
        </Suspense>
      </div>

      <div className={styles['operation-area']}>
        <Suspense fallback={<Loading />}>
          <OperationArea />
        </Suspense>
      </div>
    </div>
  );
};

/**
 * 聊天大纲页面组件
 *
 * @description 提供聊天大纲功能的主页面，包含样式兼容性处理和状态管理
 * @since 1.0.0
 */
export const ChatOutline: React.FC = () => {
  // 获取是否需要兼容性修复的标志
  const isLegacyBrowser = needsBrowserCompat();
  const { chatId } = useParams<{ chatId?: string }>();

  /**
   * 自定义 CSS 转换器，解决 Chrome 83 兼容性问题
   * 将 gap 属性替换为 margin
   */
  const gapCompatTransformer = getGapCompatTransformer();

  return (
    <StyleProvider
      hashPriority={isLegacyBrowser ? 'high' : undefined}
      // @ts-expect-error 兼容83版本样式问题 :where 选择器 和 CSS 逻辑属性降级兼容方案
      transformers={isLegacyBrowser ? [gapCompatTransformer, legacyLogicalPropertiesTransformer] : []}
    >
      <ChatRoomProvider initialRoomId={chatId}>
        <RPOutlineProvider>
          <ChatContent />
        </RPOutlineProvider>
      </ChatRoomProvider>
    </StyleProvider>
  );
};
