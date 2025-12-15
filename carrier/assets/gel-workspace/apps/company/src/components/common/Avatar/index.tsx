import { getWsid } from '@/utils/env'
import { renderLogo } from '@/utils/renderLogo'
import { Tooltip } from '@wind/wind-ui'
import React, { useRef, useState } from 'react'
import './index.less'

/** 组件属性类型，继承自img标签属性，但要求必须提供alt */
type AvatarProps = Prettify<
  Omit<
    React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
    'alt' | 'width' | 'height' | 'src'
  > & {
    src?: string
    alt: string // alt属性必填，用于图片加载失败时显示文字Logo
    width?: number
    height?: number
  }
>

/**
 * 去除字符串中的HTML标签
 * @param str - 包含HTML标签的字符串
 * @returns 清理后的纯文本
 */
const removeHtmlTags = (str: string): string => {
  return str.replace(/<\/?[^>]+(>|$)/g, '')
}

/**
 * 处理图片URL
 * 如果是相对路径，则拼接完整的CDN地址
 * @param src - 原始图片地址
 * @returns 处理后的完整URL
 */
const handleSrc = (src: string): string => {
  if (!src) return ''
  try {
    new URL(src + `?wind.sessionid=${getWsid()}`)
    return src + `?wind.sessionid=${getWsid()}`
  } catch {
    return `${window.location.protocol}//news.windin.com/ns/imagebase/${src.split('.').join('/')}?wind.sessionid=${getWsid()}`
  }
}

/** 默认尺寸常量 */
const DEFAULT_SIZE = 60
/** 预览图片的放大倍数 */
const DEFAULT_TOOLTIP_SIZE = 2.5
const DEFAULT_TOOLTIP_MAX_WIDTH = 200

/**
 * 图片组件
 * 支持以下功能：
 * 1. 自动处理图片加载失败，降级为文字Logo
 * 2. 自动处理图片URL，支持相对路径和完整URL
 * 3. 悬浮显示放大2.5倍预览, 默认悬浮最大宽度200px, 超过则不展示悬浮预览
 * 4. 自适应容器尺寸
 *
 * @author Calvin<yxlu.calvin@wind.com.cn>
 * @param props - 组件属性，继承自img标签属性
 * @example
 * <Avatar src={item.logo} alt={item.corpName} width={60} height={60} />
 */
const Avatar: React.FC<AvatarProps> = (props) => {
  const [imgError, setImgError] = useState(false)
  const imgContainerRef = useRef<HTMLImageElement>(null)
  const width = props.width || DEFAULT_SIZE
  const height = props.height || DEFAULT_SIZE

  // useEffect(() => {
  //   if (imgContainerRef.current) {
  //     const rect = imgContainerRef.current.getBoundingClientRect()
  //     setRect(rect)
  //   }
  // }, [props.src])

  if (!props.src || imgError) {
    return renderLogo({ name: props.alt, width, height })
  }

  const { src, alt, ...restProps } = props
  const processedUrl = handleSrc(src)
  const tooltipWidth = width * DEFAULT_TOOLTIP_SIZE

  if (tooltipWidth > DEFAULT_TOOLTIP_MAX_WIDTH) {
    return (
      <div className="image-container">
        <img
          {...props}
          ref={imgContainerRef}
          src={processedUrl}
          alt={removeHtmlTags(alt)}
          style={{
            ...props.style,
            objectFit: 'contain',
          }}
          onError={() => setImgError(true)}
          data-uc-id="mOeAwE1HkT"
          data-uc-ct="img"
        />
      </div>
    )
  }

  return (
    <div className="image-container">
      <Tooltip
        placement="bottomLeft"
        title={
          <img
            {...restProps}
            src={processedUrl}
            alt={removeHtmlTags(alt)}
            style={{
              width: tooltipWidth,
              height: height * DEFAULT_TOOLTIP_SIZE,
              objectFit: 'contain',
            }}
            onError={() => setImgError(true)}
            data-uc-id="9WNH4BIv_A"
            data-uc-ct="img"
          />
        }
      >
        <img
          {...props}
          ref={imgContainerRef}
          src={processedUrl}
          alt={removeHtmlTags(alt)}
          style={{
            ...props.style,
            objectFit: 'contain',
          }}
          onError={() => setImgError(true)}
          data-uc-id="uKkEbmi4GG"
          data-uc-ct="img"
        />
      </Tooltip>
    </div>
  )
}

export default Avatar
