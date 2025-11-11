import { AliceBitmapAnimation } from '@wind/alice-bitmap-animation'
import styles from './index.module.less'
import React from 'react'
import { BitMap } from '@/assets'

const PREFIX = 'ai-box'

export type AIBoxProps = {
  size?: 'small' | 'default' | 'large'
  style?: React.CSSProperties
}

export const AIBox: React.FC<AIBoxProps> = ({ size = 'default', style }) => {
  const scale = size === 'small' ? 0.4 : size === 'large' ? 0.8 : 0.6
  return (
    <div
      className={styles[`${PREFIX}-container`]}
      style={
        {
          overflow: 'hidden',
          '--scale': scale,
          width: 'calc(94px * var(--scale))',
          height: 'calc(36px * var(--scale))',
          ...style,
        } as React.CSSProperties
      }
    >
      <AliceBitmapAnimation imageSrc={BitMap} frameWidth={94} frameHeight={36} fps={10} width="0px" />
    </div>
  )
}
