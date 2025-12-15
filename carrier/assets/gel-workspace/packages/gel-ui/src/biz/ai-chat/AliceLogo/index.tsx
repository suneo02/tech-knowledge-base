import { aliceIcon } from '@/assets/alice'
import { AliceAvatar } from '@wind/wui-alice-logo'
import { usedInClient } from 'gel-util/env'

/**
 * @description AliceLogo 组件 在终端会展示@wind/wui-alice-logo组件，在web端展示aliceIcon图片
 *
 * @param {number} width - 宽度
 * @param {number} height - 高度
 * @param {React.CSSProperties} style - 样式
 * @param {string} placement - 位置 ‘bottomleft’ | 'bottomright' | 'topleft' | 'topright'
 * @returns
 */
export const AliceLogo = ({
  width = 40,
  height = 40,
  style,
  placement = 'bottomleft',
}: {
  width?: number
  height?: number
  style?: React.CSSProperties
  placement?: 'bottomleft' | 'bottomright' | 'topleft' | 'topright'
}) => {
  const staticStyle = {
    borderRadius: '10%',
    overflow: 'hidden',
  }

  if (usedInClient()) {
    return <AliceAvatar placement={placement} style={{ ...staticStyle, width, height, ...style }} />
  }

  return <img src={aliceIcon} draggable={false} alt="Alice" style={{ ...staticStyle, width, height, ...style }} />
}
