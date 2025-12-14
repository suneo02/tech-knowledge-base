import { Button, Tooltip } from '@wind/wind-ui';
import classNames from 'classnames';
import type { CSSProperties, FormEventHandler, ReactElement } from 'react';
import React from 'react';
import './index.less';
import styles from './index.module.less';

export interface ActionIconProps {
  onClick?: Function;
  className?: string;
  children: JSX.Element;
  hintText?: string;
  style?: CSSProperties;
}

export const ActionIcon: React.FC<ActionIconProps> = (props) => {
  const { onClick, hintText, className = '', style } = props;

  return (
    <Tooltip
      placement="bottom"
      title={hintText}
      overlayClassName={
        className && className.indexOf('sideMenuDisable') !== -1
          ? classNames(styles.tooltip_wrapper, 'action-Icon-tooltip')
          : styles.tooltip_wrapper
      }
    >
      <Button onClick={onClick as FormEventHandler} className={classNames(styles.action, className)} style={style}>
        {React.Children.map(props.children, (child: ReactElement) => {
          return React.cloneElement(child, { ...child.props, width: 16, height: 16 });
        })}
      </Button>
    </Tooltip>
  );
};
