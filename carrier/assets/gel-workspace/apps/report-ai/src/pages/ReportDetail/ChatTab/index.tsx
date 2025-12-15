import { StyleProvider } from '@ant-design/cssinjs';
import { ChatRoomProvider, useChatRoomContext } from 'ai-ui';
import { getGapCompatTransformer, needsBrowserCompat, useInitialMsgFromUrl } from 'gel-ui';
import { FC, Suspense } from 'react';
import { ChatRPLeftMessages } from '../../../components';
import { useClearInitialMsg } from '../../../hooks/useClearInitialMsg';
import { Loading } from '../../Fallback/loading';
import styles from './index.module.less';

const RPChatTabInner: FC = () => {
  const { roomId } = useChatRoomContext();
  const { initialMessage, initialDeepthink } = useInitialMsgFromUrl();
  useClearInitialMsg(initialMessage);

  return (
    <div className={styles['chat-content']}>
      <Suspense fallback={<Loading />}>
        <ChatRPLeftMessages
          key={`chat-messages-${roomId}`}
          initialMessage={initialMessage}
          initialDeepthink={initialDeepthink}
        />
      </Suspense>
    </div>
  );
};

export const RPChatTab: FC = () => {
  // 获取是否需要兼容性修复的标志
  const isLegacyBrowser = needsBrowserCompat();

  /**
   * 自定义 CSS 转换器，解决 Chrome 83 兼容性问题
   * 将 gap 属性替换为 margin
   */
  const gapCompatTransformer = getGapCompatTransformer();

  return (
    <StyleProvider
      hashPriority={isLegacyBrowser ? 'high' : undefined}
      // @ts-expect-error 兼容83版本样式问题 :where 选择器 和 CSS 逻辑属性降级兼容方案
      transformers={isLegacyBrowser ? [gapCompatTransformer] : []}
    >
      <ChatRoomProvider>
        <RPChatTabInner />
      </ChatRoomProvider>
    </StyleProvider>
  );
};
