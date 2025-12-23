import { RPOutlineAgentMsgAI } from '@/types';
import { useChatRoomContext } from 'ai-ui';
import { ChatQuestionStatus } from 'gel-api';
import { AICopyButton, AIDislikeButton, AILikeButton, AIRetryButton, ChatSenderOptions } from 'gel-ui';
import { FC } from 'react';
import { axiosInstance } from '../../../api/axios';
import { entWebAxiosInstance } from '../../../api/entWeb';
import { CompanySelector } from './CompanySelector';
import styles from './index.module.less';

/**
 * AI消息底部组件，包含复制、点赞、踩一下和重试按钮
 */
export const RPOutlineAIFooter: FC<{
  content: string;
  agentMessage: RPOutlineAgentMsgAI;
  sendMessage?: (message: string, options: Pick<ChatSenderOptions, 'agentId' | 'think' | 'entityCode'>) => void;
  /** 是否为最后一条消息 */
  isLastMessage?: boolean;
}> = ({ content, agentMessage, sendMessage, isLastMessage = true }) => {
  const { companyList } = agentMessage?.reportData || {};
  const { isChating } = useChatRoomContext();

  // 只有最后一条消息且不在对话中才允许交互
  const isInteractive = isLastMessage && !isChating;
  // 意图审计不通过  不展示重试按钮
  if (agentMessage.questionStatus === ChatQuestionStatus.AUDIT_FAILED) {
    return null;
  }
  // 如果问答状态不是成功，则展示重试按钮
  if (agentMessage.questionStatus && agentMessage.questionStatus !== ChatQuestionStatus.SUCCESS) {
    return (
      <div className={styles.retryContainer}>
        <AIRetryButton
          content={content}
          isBury
          rawSentence={agentMessage.rawSentence}
          rawSentenceID={agentMessage.rawSentenceID}
          onRetry={() => {
            // 调用sendMessage重新发送原始问题
            if (sendMessage && agentMessage.rawSentence) {
              sendMessage(agentMessage.rawSentence, {
                agentId: agentMessage.agentId,
                think: agentMessage.think,
                entityCode: agentMessage.entityCode,
              });
            }
          }}
        />
      </div>
    );
  }
  return (
    <div className={styles.wrapper}>
      <div className={styles.row}>
        <CompanySelector
          candidates={companyList}
          disabled={!isInteractive}
          onSelect={({ entityCode, entityName }) => {
            if (sendMessage && isInteractive) {
              sendMessage(entityName, {
                agentId: agentMessage.agentId,
                think: agentMessage.think,
                entityCode,
              });
            }
          }}
        />
      </div>
      <div className={styles.row}>
        <AICopyButton axiosEntWeb={entWebAxiosInstance} content={content} isBury />
        <AILikeButton
          axiosEntWeb={entWebAxiosInstance}
          content={content}
          question={agentMessage.rawSentence || ''}
          isBury
        />
        <AIDislikeButton
          axiosChat={axiosInstance}
          axiosEntWeb={entWebAxiosInstance}
          content={content}
          question={agentMessage.rawSentence || ''}
          questionID={agentMessage.rawSentenceID}
          isBury
        />
      </div>
    </div>
  );
};
