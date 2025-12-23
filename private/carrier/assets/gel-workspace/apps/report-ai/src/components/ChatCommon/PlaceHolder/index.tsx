import { Space } from 'antd';
import { WelcomeSection } from 'gel-ui';
import { FC } from 'react';
import styles from './index.module.less';

/**
 * 基础版提示占位组件
 * 使用基础版上下文，简单地显示问题和图标
 */
export const PlaceholderReport: FC = () => {
  return (
    <Space className={styles['placeholder']} style={{ paddingTop: '32px' }} direction="vertical" size={16}>
      <WelcomeSection size={'normal'} />
    </Space>
  );
};
