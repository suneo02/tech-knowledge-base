import React from 'react'

/** Logo组件属性类型 */
export interface RenderLogoProps {
  /** 要显示的文字内容 */
  name: string
  /** 容器宽度 */
  width?: number
  /** 容器高度 */
  height?: number
  /** 背景颜色 */
  backgroundColor?: string
}

/**
 * 去除字符串中的HTML标签
 * @param str - 包含HTML标签的字符串
 * @returns 清理后的纯文本
 */
const removeHtmlTags = (str: string): string => {
  return str.replace(/<\/?[^>]+(>|$)/g, '')
}

/**
 * 判断字符串是否为英文名称
 */
const isEnglishName = (str: string): boolean => {
  const firstCharIsEnglish = /^[a-zA-Z]/.test(str)
  const onlyEnglishChars = /^[a-zA-Z0-9\s.,&()'\-]+$/.test(str)
  return firstCharIsEnglish && onlyEnglishChars
}

/**
 * 判断字符串是否为中文名称
 */
const isChineseName = (str: string): boolean => {
  return /[\u4e00-\u9fa5]/.test(str)
}

/**
 * 文字Logo组件
 * 用于在图片加载失败或无图片时，将文字转换为Logo显示
 * 支持以下功能：
 * 1. 自动识别中英文
 * 2. 英文：取第一个单词前6个字符，超过3个字符时自动换行
 * 3. 中文：最多显示4个字，按2x2网格排列
 * 4. 自适应容器尺寸
 * 5. 自动去除HTML标签
 *
 * @author Calvin<yxlu.calvin@wind.com.cn>
 * @param name - 要显示的文字内容
 * @param width - 容器宽度
 * @param height - 容器高度
 * @example
 * <div style={{ width: 200, height: 200 }}>
 *   {renderLogo({ name: 'Hello World', width: 200, height: 200 })}
 * </div>
 */
export const renderLogo = ({ name, width, height, backgroundColor = 'rgb(209, 217, 255)' }: RenderLogoProps) => {
  let DEFAULT_TIMES = 2.5
  const containerStyle: React.CSSProperties = {
    minWidth: width,
    height: height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxSizing: 'border-box',
    borderRadius: 4,
  }

  // 处理文字logo，先去除HTML标签
  const cleanName = removeHtmlTags(name)
  let displayText = cleanName || ''

  const getCharacters = (str, count) => {
    // 规范化字符串
    const normalizedStr = str.normalize('NFC')
    // 使用 Array.from() 获取字符数组
    const characters = Array.from(normalizedStr)
    // 截取指定数量的字符
    return characters.slice(0, count).join('')
  }
  const displayText6 = getCharacters(cleanName, 6)

  if (isEnglishName(displayText6)) {
    // 英文处理: 取第一个单词，最多6个字符，超过3个字符换行
    if (displayText6.length > 3) {
      const firstPart = getCharacters(displayText6, 3)
      const secondPart = getCharacters(displayText6.slice(3), 3)
      displayText = [firstPart, secondPart].filter(Boolean).join('\n')
    }
  } else if (isChineseName(displayText6)) {
    // 中文处理: 最多显示4个字，2x2排列
    const displayText4 = getCharacters(displayText6, 4)
    if (displayText4.length > 2) {
      displayText = getCharacters(displayText4, 2) + '\n' + getCharacters(displayText4.slice(2), 2)
    }
  } else {
    console.log('其他语言', displayText)
    // 其他情况：直接显示
    displayText = getCharacters(displayText6, 4)
    DEFAULT_TIMES = 3
  }
  return (
    <div
      style={{
        ...containerStyle,
        backgroundColor: backgroundColor,
        fontSize: Math.min(width, height) / DEFAULT_TIMES,
        fontWeight: 500,
        color: '#fff',
      }}
    >
      <span
        style={{
          whiteSpace: 'pre-line',
          textAlign: 'center',
          lineHeight: '1.2',
        }}
      >
        {displayText}
      </span>
    </div>
  )
}
