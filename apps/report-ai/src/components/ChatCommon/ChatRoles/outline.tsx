import { OutlineMessage } from '@/types';
import { AntRoleType, RoleAvatarHidden } from 'gel-ui';
import { FC, useMemo } from 'react';
import { useRPOutlineContext } from '../../ChatRPOutline/context';
import { OutlineTreeEditor } from '../../outline/OutlineTreeEditor';
import styles from './outline.module.less';

/**
 * 大纲消息渲染组件
 *
 * @description 根据 context 判断是否为最后一条消息，动态决定是否为只读模式
 */
const OutlineRoleMessage: FC<{
  content: OutlineMessage['content'];
}> = ({ content }) => {
  const { agentMessages, isLastAIMessage } = useRPOutlineContext();

  // 判断当前消息是否为最后一条 AI 消息
  const isLastMessage = useMemo(() => {
    return isLastAIMessage(content || {});
  }, [agentMessages, content, isLastAIMessage]);

  // 最后一条消息：可编辑模式
  // 非最后一条消息：只读预览模式
  return <OutlineTreeEditor initialValue={content} value={content} readonly={!isLastMessage} />;
};

export const reportOutlineRole: AntRoleType<OutlineMessage['content']> = {
  placement: 'start',
  avatar: RoleAvatarHidden,
  variant: 'borderless',
  style: {
    lineHeight: 40,
  },
  styles: {
    content: {
      fontSize: 16,
    },
  },
  className: styles['outline-editor-role'],
  messageRender: (content) => {
    if (!content) return null;
    return <OutlineRoleMessage content={content} />;
  },
};
