import { corpBaseInfoStore, rpPrintStore } from '@/store'
import { isEnForRPPrint, t } from '@/utils/lang'
import { COMMON_CONSTANTS, getPageFooterLocales, getPageHeaderLocales } from 'report-util/constants'
import { getCorpName } from 'report-util/misc'
import { createPageContent, createPageFooter, createPageHeader } from './creator'
import styles from './index.module.less'
import { TableHandler } from './TableHandler'
import { PDFPageOptions, PDFPageProps, TableOptions } from './types'
import { PDFPageUtils } from './utils'

/**
 * PDFPage 类 - 创建和管理PDF式报告的页面元素
 */
export class PDFPage {
  private $reportContainer: JQuery
  private currentPageId: number = 0
  private pageHeight: number
  private options: PDFPageProps
  private tableHandler: TableHandler

  /**
   * 构造函数
   * @param $reportContainer - 将包含所有报告页面的jQuery元素
   * @param options - 页面配置选项
   */
  constructor($reportContainer: JQuery, options: PDFPageProps = {}) {
    if (!$reportContainer || !$reportContainer.length) {
      throw new Error('PDFPage: Container element is invalid')
    }

    const footerLocales = getPageFooterLocales(t, isEnForRPPrint())
    const corpName = getCorpName(corpBaseInfoStore.getData(), isEnForRPPrint())

    const { reportTitle = '' } = rpPrintStore.getData()
    this.$reportContainer = $reportContainer

    this.options = {
      footerLeftText: footerLocales.printPageFooterLeftText,
      footerRightText: footerLocales.printPageFooterRightText,
      headerRightText: getPageHeaderLocales(corpName, reportTitle, isEnForRPPrint()),
      logoPath: COMMON_CONSTANTS.WIND_LOGO_PATH,
      ...options,
    }

    // 创建第一个页面后设置初始页面高度参考值
    this.pageHeight = 0

    // 初始化表格处理器
    this.tableHandler = new TableHandler(this)
  }

  /**
   * 获取当前页面
   * @returns 当前页面
   */
  findCurrentPage(): JQuery {
    return this.$reportContainer.find(`#${PDFPageUtils.generatePageId(this.currentPageId)}`)
  }

  /**
   * 检查当前页面是否为空白页
   * 空白页的定义：页面内容区域没有任何子元素，或者只包含空白文本
   * @returns true 表示当前页面为空白页，false 表示页面有内容
   */
  isCurrentPageBlank(): boolean {
    return this.isPageBlank(this.findCurrentPage())
  }

  /**
   * 检查当前页面是否高度溢出
   * @returns true 表示当前页面高度溢出，false 表示页面高度正常
   */
  isCurrentPageHeightOverflow(): boolean {
    return this.findCurrentPage().height() > this.pageHeight
  }

  /**
   * 检查当前页面内容高度是否接近页面总高度的阈值。
   * @param thresholdPercent - 可选的阈值百分比 (0.0 到 1.0)。默认为 0.8 (80%)。
   * @returns 如果内容高度达到或超过页面高度的指定百分比，则返回 true，否则返回 false。
   *          如果页面高度尚未设定 (this.pageHeight 为 0)，或当前页面没有实际内容，则返回 false。
   */
  isCurrentPageNearingFull(thresholdPercent: number = 0.8): boolean {
    if (this.pageHeight === 0) {
      // 页面高度基准未设置，无法判断
      return false
    }

    const $currentPage = this.findCurrentPage()
    if (!$currentPage.length) {
      return false // 当前页面不存在
    }

    const $contentArea = $currentPage.find(`.${styles['page-content-area']}`)
    if (!$contentArea.length || $contentArea.children().length === 0) {
      // 内容区域不存在或没有子元素，视为未接近满
      return false
    }

    const contentHeight = $contentArea.height() || 0
    const thresholdHeight = this.pageHeight * thresholdPercent

    return contentHeight >= thresholdHeight
  }

  /**
   * 获取页面高度信息
   * @param $page - 要检查的页面jQuery对象，如果不提供则检查当前页面
   * @returns 页面高度信息对象
   */
  getPageHeightInfo($page?: JQuery): {
    contentHeight: number
    pageHeight: number
    hasContent: boolean
  } {
    const $targetPage = $page || this.findCurrentPage()

    if (!$targetPage.length) {
      return {
        contentHeight: 0,
        pageHeight: 0,
        hasContent: false,
      }
    }

    const $contentArea = $targetPage.find(`.${styles['page-content-area']}`)
    const contentHeight = $contentArea.length ? $contentArea.height() || 0 : 0
    const pageHeight = $targetPage.height() || 0
    const hasContent = $contentArea.length > 0 && $contentArea.children().length > 0

    return {
      contentHeight,
      pageHeight,
      hasContent,
    }
  }

  /**
   * 检查页面是否可以视为"空白"（用于决定是否需要创建新页面）
   * 基于内容区域的实际高度而不是内容存在性
   * @param $page - 要检查的页面jQuery对象，如果不提供则检查当前页面
   * @returns true 表示页面基本为空（内容区域高度为0或很小），false 表示页面已有较多内容
   */
  isPageBlank($page?: JQuery): boolean {
    if (!$page) {
      $page = this.findCurrentPage()
    }
    if (!$page.length) {
      return false
    }

    const heightInfo = this.getPageHeightInfo($page)

    // 如果没有内容，认为是空白的
    if (!heightInfo.hasContent) {
      return true
    }
    return false
  }

  /**
   * 添加新页面到报告
   * 如果当前页面为空白页，则不创建新页面
   * @param id - 可选的页面ID。如果不提供，将自动生成
   * @returns 创建的页面ID
   */
  addPage(option: PDFPageOptions = {}): string {
    if (this.findCurrentPage().length && this.isCurrentPageBlank()) {
      return ''
    }

    let pageId: string
    let headerId: string
    let contentId: string
    let pageIndex: number
    const { id } = option

    if (id) {
      // 使用提供的ID（例如，封面页）
      pageId = id
      headerId = `${id}-header`
      contentId = `${id}-content`
    } else {
      // 为常规页面生成ID
      this.currentPageId += 1
      pageIndex = this.currentPageId
      const ids = PDFPageUtils.generatePageIds(pageIndex)
      pageId = ids.pageId
      headerId = ids.headerId
      contentId = ids.contentId
    }

    const $page = $('<section>').addClass(styles['content-icbc']).attr('id', pageId)

    // 如果启用了页眉，则使用工具函数添加页眉
    const $header = createPageHeader(
      {
        ...this.options,
        ...option,
      },
      headerId
    )
    $page.append($header)

    // 添加内容区域容器
    const $contentArea = $('<div>').addClass(styles['page-content-area']).attr('id', contentId)

    if (option.contentClassName) {
      $contentArea.addClass(option.contentClassName)
    }

    $page.append($contentArea)

    // 页脚文本支持"第 % 页 / 共 % 页"格式
    const textReplaced = this.options.footerRightText?.replace('%', String(pageIndex))
    const $footer = createPageFooter({
      ...this.options,
      ...option,
      footerRightText: textReplaced,
    })
    $page.append($footer)

    this.$reportContainer.append($page)

    // 根据第一个实际内容页设置 pageHeight 参考值
    if (!this.pageHeight && pageIndex === 1) {
      this.pageHeight = $page.height() || 0 // 初始化页面高度
    }

    return pageId
  }

  /**
   * 添加内容到当前页面，如果需要则创建新页面
   * @param content - 要添加的HTML内容（字符串或jQuery对象）
   * @param contentId - 要分配给内容元素的可选ID
   * @returns 分配给内容的ID
   */
  addContent(content: string | JQuery, contentId?: string, addPageOption?: PDFPageOptions): string {
    const $contentArea = this.getCurrentContentArea()

    // 准备要添加的内容元素
    const $addedContent = createPageContent(content, contentId)

    // 添加到内容区域而不是直接添加到页面
    $contentArea.append($addedContent)

    // 检查元素的高度是否超过页面高度
    if ($addedContent.height() > this.pageHeight) {
      console.error('PDFPage: 内容高度超过页面高度', $addedContent.height(), content)
      $addedContent.remove()
      return ''
    }

    // 检查内容是否超出页面高度
    if (this.isCurrentPageHeightOverflow()) {
      // 从当前页面移除内容
      $addedContent.remove()

      // 创建新页面并在那里添加内容
      this.addPage(addPageOption)

      return this.addContent(content, contentId)
    }

    return $addedContent.attr('id')
  }

  /**
   * 添加表格到报告并处理分页
   * 自动处理表格可能超出页面高度的情况，确保表格在页面之间正确分割
   *
   * @param table - 表格内容（字符串或jQuery对象）
   * @param options - 表格选项
   * @returns 生成的表格ID或空字符串（如果添加失败）
   */
  addTable(table: JQuery, options: TableOptions = {}): string {
    return this.tableHandler.addTable(table, options)
  }

  /**
   * 添加一组 jQuery 元素，并为它们创建一个新页面
   * @param contents - 要添加的 jQuery 元素数组
   * @param options - 控制页面创建的选项
   */
  public addContentBulk(contents: JQuery[], options: PDFPageOptions = {}): void {
    if (!contents || !contents.length) {
      return
    }

    // Create a new page for the bulk content
    this.addPage(options)

    // Add each content item to the new page
    for (const content of contents) {
      this.addContent(content, undefined, options)
    }
  }

  /**
   * 获取当前页面ID
   * @returns 当前页面ID
   */
  getCurrentPageId(): number {
    return this.currentPageId
  }

  /**
   * 设置自定义页面高度参考值
   * @param height - 要设置的高度值
   */
  setPageHeight(height: number): void {
    this.pageHeight = height
  }

  /**
   * 获取页面高度
   * @returns 页面高度
   */
  getPageHeight(): number {
    return this.pageHeight
  }

  /**
   * 获取当前页面的内容区域 jQuery 对象
   */
  private getCurrentContentArea(): JQuery {
    return this.findCurrentPage().find(`.${styles['page-content-area']}`)
  }

  /**
   * 生成完所有页面后，更新所有页脚的总页数
   */
  public updateAllFootersTotalPageCount() {
    const totalPages = this.currentPageId
    for (let i = 1; i <= totalPages; i++) {
      const pageId = PDFPageUtils.generatePageId(i)
      const $page = this.$reportContainer.find(`#${pageId}`)
      const $footer = $page.find(`.${styles['page-foot']}`)
      const $pageNo = $footer.find(`.${styles['page-foot-page-no']}`)
      $pageNo.each((_, el) => {
        const $el = $(el)
        $el.html($el.html().replace('%', String(totalPages)))
      })
    }
  }
}

export default PDFPage
