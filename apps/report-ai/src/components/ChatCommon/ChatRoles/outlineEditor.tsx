import { OutlineEditorMessage } from '@/types';
import { AntRoleType, RoleAvatarHidden } from 'gel-ui';
import { FC } from 'react';
import { OutlineTreeEditor } from '../../outline/OutlineTreeEditor';
import styles from './outline.module.less';

const OutlineEditorRoleMessage: FC<{
  content: OutlineEditorMessage['content'];
}> = ({ content }) => {
  return <OutlineTreeEditor style={!content ? { display: 'none' } : {}} initialValue={content} value={content} />;
};

export const reportOutlineEditorRole: AntRoleType<OutlineEditorMessage['content']> = {
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
    return <OutlineEditorRoleMessage content={content} />;
  },
};
