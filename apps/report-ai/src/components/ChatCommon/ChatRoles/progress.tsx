import { RPOutlineProgressMessage } from '@/types/chat/RPOutline';
import { Progress } from '@wind/wind-ui';
import { AntRoleType, RoleAvatarHidden } from 'gel-ui';
import { FC } from 'react';
import styles from './progress.module.less';

/**
 * 进度消息组件
 *
 * @description 展示 AIGC 生成进度
 */
export const ProgressRoleMessage: FC<{
  message: RPOutlineProgressMessage['content'];
}> = ({ message }) => {
  const { currentStepName, progressPercentage } = message;

  return (
    <div className={styles['progress-message']}>
      <div className={styles['progress-content']}>
        <div className={styles['progress-step-name']}>{currentStepName}</div>
        <div className={styles['progress-bar']}>
          <Progress percent={progressPercentage} status="active" />
        </div>
      </div>
    </div>
  );
};

/**
 * 进度消息角色配置
 */
export const reportProgressRole: AntRoleType<RPOutlineProgressMessage['content']> = {
  placement: 'start',
  avatar: RoleAvatarHidden,
  variant: 'borderless',
  style: {
    lineHeight: 'normal',
  },
  styles: {
    content: {
      fontSize: 14,
      padding: '4px 8px',
    },
  },
  className: styles['progress-role'],
  messageRender: (content) => {
    return <ProgressRoleMessage message={content} />;
  },
};
