import { generateSafeId } from '@/utils/idGenerator'
import styles from './index.module.less'
import { PDFPageOptions, PDFPageProps } from './types'

/**
 * 准备要添加的内容元素
 * @param content - 内容字符串或jQuery对象
 * @param id - 内容ID
 * @returns 准备好的jQuery元素
 */
export function createPageContent(content: string | JQuery, id?: string): JQuery {
  const contentId = id || generateSafeId('content')
  let $contentElement: JQuery

  if (typeof content === 'string') {
    // 处理字符串内容：尝试解析为HTML，否则包裹在div中
    try {
      $contentElement = $(content)
      // 如果解析的内容只是文本或多个根元素，则包裹起来
      if ($contentElement.length !== 1 || $contentElement[0].nodeType === Node.TEXT_NODE) {
        $contentElement = $(`<div>${content}</div>`)
      }
    } catch (e) {
      $contentElement = $(`<div>${content}</div>`)
    }
  } else {
    // 处理jQuery对象内容
    $contentElement = content
  }

  // 确保元素具有正确的ID
  if (!$contentElement.attr('id')) {
    $contentElement.attr('id', contentId)
  }

  return $contentElement
}

/**
 * 生成页眉的HTML。
 * @param options - 包含 logoPath 和 contactNumber 的 PDFPage 选项。
 * @param headerId - 要分配给页眉容器 div 的 ID。
 * @returns 页眉的 jQuery 对象。
 */
export function createPageHeader(options: PDFPageProps & PDFPageOptions, headerId: string): JQuery {
  const $header = $('<div>').attr('id', headerId).addClass(styles['page-header'])

  if (options.logoPath) {
    const $logoImg = $('<img>').attr({
      src: options.logoPath,
      width: '150px',
      alt: 'Logo', // 添加 alt 属性以提高可访问性
    })
    $header.append($logoImg)
  }

  if (!options.hideHeader && options.headerRightText) {
    const $tel = $('<span>').addClass(styles['page-header-right'])
    // 注意：如果需要，考虑将 "联系电话：" 进行本地化处理
    $tel.text(options.headerRightText)
    $header.append($tel)
  }

  return $header
}

/**
 * 生成页脚的HTML。
 * @param options - 包含 footerText 的 PDFPage 选项。
 * @param pageNumber - 要显示的页码。
 * @returns 页脚的 jQuery 对象。
 */
export function createPageFooter(options: PDFPageProps & PDFPageOptions): JQuery {
  const $footer = $('<div>').addClass(styles['page-foot'])

  if (options.hideFooter) {
    return $footer
  }
  if (options.footerLeftText) {
    const $textDiv = $('<span>').html(options.footerLeftText) // 使用 .html() 以支持可能的 HTML 内容
    $footer.append($textDiv)
  }

  if (options.footerRightText) {
    const $textDiv = $('<span>').addClass(styles['page-foot-page-no']).html(options.footerRightText) // 使用 .html() 以支持可能的 HTML 内容
    $footer.append($textDiv)
  }

  return $footer
}
