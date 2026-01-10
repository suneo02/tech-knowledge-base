import { wftCommon } from '@/utils/utils.tsx'
import { isEn } from 'gel-util/intl'
import { buildBaiFenMapUrl } from 'gel-util/link'
import { FC } from 'react'

interface Props {
  address: string
  corpId?: string
  isBusinessAddress: boolean
}

/**
 * 地址渲染组件相关类型和函数
 */

/**
 * 地址渲染组件
 * 优化后的实现，提供更清晰的类型定义和逻辑结构
 */
export const AddrComp: FC<Props> = ({ address, corpId, isBusinessAddress }) => {
  const displayText = address || '--'

  // 海外配置直接返回文本
  if (isEn()) {
    return displayText
  }

  // 无公司ID或地址时，直接显示文本
  if (!corpId || !address) {
    return displayText
  }

  // 构建地图链接
  const handleClick = () => {
    const mapUrl = buildBaiFenMapUrl({
      corpId,
      isBusinessAddress: !!isBusinessAddress,
    })
    wftCommon.jumpJqueryPage(mapUrl)
  }

  return (
    <a onClick={handleClick} data-uc-id="4R2GdcZ5Dk" data-uc-ct="a">
      {displayText}
    </a>
  )
}
