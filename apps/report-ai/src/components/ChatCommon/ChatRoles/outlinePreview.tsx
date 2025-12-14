import { OutlinePreviewMessage } from '@/types';
import { AntRoleType, RoleAvatarHidden } from 'gel-ui';
import { FC } from 'react';
import { OutlineTreeEditor } from '../../outline/OutlineTreeEditor';
import styles from './outline.module.less';

const OutlinePreviewRoleMessage: FC<{
  message: OutlinePreviewMessage['content'];
}> = ({ message }) => {
  return <OutlineTreeEditor value={message} readonly />;
};

export const reportOutlinePreviewRole: AntRoleType<OutlinePreviewMessage['content']> = {
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
    return <OutlinePreviewRoleMessage message={content} />;
  },
};
