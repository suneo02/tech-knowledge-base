/**
 * AIGC 智能生成按钮组件
 *
 * @description 章节标题 hover 时显示的智能生成按钮
 * @see apps/report-ai/docs/issues/aigc-button-icon-color-issue.md - 图标颜色修复说明
 */
import { SmartGenIcon } from '@/assets/icon';
import type { CSSProperties } from 'react';
import { ActionIcon } from '../ActionIcon';
import { WuiIconWrapper } from '../Icon';

export type SmartGenBtnProps = {
  dragHandleMenu?: string;
  addBlock?: Function;
  selectBlock?: Function;
  onClick?: Function;
  disabled?: boolean;
  isSearchMaterial?: boolean;
  className?: string;
  style?: CSSProperties;
};

export const SmartGenBtn: React.FC<SmartGenBtnProps> = (props) => {
  const { onClick, disabled, className = '', style } = props;

  return (
    <ActionIcon
      onClick={onClick}
      hintText={'根据标题自动生成下方正文'}
      className={disabled ? 'sideMenuDisable ' + className : className}
      style={style}
    >
      <div>
        <WuiIconWrapper size={18}>
          <SmartGenIcon />
        </WuiIconWrapper>
        <span className={'action-Icon-tooltip-show'}>{'智能生成'}</span>
      </div>
    </ActionIcon>
  );
};
