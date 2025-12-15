import { Button, Tooltip } from '@wind/wind-ui';
import classNames from 'classnames';
import { t } from 'gel-util/intl';
import { FC } from 'react';
import { HomeIcon } from '../../../assets/icon';
import styles from './index.module.less';

export const HomeBtn: FC<{
  className?: string;
  onClick: () => void;
}> = ({ className, onClick }) => {
  return (
    <Tooltip title={t('273158', '返回首页')}>
      <Button
        className={classNames(styles['home-button'], className)}
        onClick={onClick}
        icon={<HomeIcon className={styles.homeButtonIcon} style={{ transition: 'transform 0.2s' }} />}
      />
    </Tooltip>
  );
};
