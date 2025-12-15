import { RPOutlineUserMsgParse } from '@/types';
import { AntRoleType, UserRole } from 'ai-ui';
import { FileDisplay } from '../../File/FileDisplay';

export const UserRoleRPOutline: AntRoleType<RPOutlineUserMsgParse['content']> = {
  className: UserRole.className,
  placement: UserRole.placement,
  style: UserRole.style,
  styles: UserRole.styles,
  messageRender: (content) => {
    return <div>{content.message}</div>;
  },
  footer: (content) => {
    return <FileDisplay files={content.files || []} />;
  },
};
