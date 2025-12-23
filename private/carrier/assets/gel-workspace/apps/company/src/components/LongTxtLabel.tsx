import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import intl from '../utils/intl'

// 常量定义
const DEFAULT_LINE_HEIGHT = 16 // 默认行高
const MAX_LINES = 2 // 最大行数

/**
 * 长文本标签组件
 *
 * @description 用于显示长文本，当文本超过两行时提供展开/收起功能
 *
 * @param txt - 要显示的文本内容
 * @param className - 自定义样式类名
 *
 * @returns JSX.Element 长文本标签组件
 */
interface LongTxtLabelProps {
  /** 要显示的文本内容 */
  txt: string
  /** 自定义样式类名 */
  className?: string
}

const LongTxtLabel: React.FC<LongTxtLabelProps> = ({ txt, className }) => {
  const [open, setOpen] = useState(true)
  const [showButton, setShowButton] = useState(false)
  const textRef = useRef<HTMLSpanElement>(null)

  // 检查文本是否超过两行
  const checkTextOverflow = () => {
    if (!textRef.current) return

    const element = textRef.current
    const lineHeight = parseInt(window.getComputedStyle(element).lineHeight) || DEFAULT_LINE_HEIGHT
    const maxHeight = lineHeight * MAX_LINES

    // 临时移除限制样式来获取实际高度
    element.style.display = '-webkit-box'
    element.style.webkitLineClamp = 'unset'
    element.style.webkitBoxOrient = 'vertical'
    element.style.overflow = 'visible'
    element.style.maxHeight = 'none'

    const actualHeight = element.scrollHeight

    // 恢复限制样式
    element.style.display = ''
    element.style.webkitLineClamp = ''
    element.style.webkitBoxOrient = ''
    element.style.overflow = ''
    element.style.maxHeight = ''

    setShowButton(actualHeight > maxHeight)
  }

  useEffect(() => {
    checkTextOverflow()

    // 监听窗口大小变化，重新检查文本溢出
    const handleResize = () => {
      checkTextOverflow()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [txt])

  const handleToggle = () => {
    setOpen(!open)
  }

  return (
    <Box className={className}>
      <span ref={textRef} className={open ? 'long-txt-label-2' : ''}>
        {txt}
      </span>
      {showButton && (
        <span className="wi-btn-color" onClick={handleToggle} data-uc-id="7G_nmREqqAy" data-uc-ct="span">
          {' '}
          {open ? intl('28912', '展开') : intl('119102', '收起')}{' '}
        </span>
      )}
    </Box>
  )
}

const Box = styled.div``

export default LongTxtLabel
