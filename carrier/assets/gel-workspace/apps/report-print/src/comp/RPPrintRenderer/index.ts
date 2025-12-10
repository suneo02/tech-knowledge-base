import { PDFPage } from '@/comp'
import { createRPAppendix } from '@/comp/Appendix'
import { pdfCoverCreator } from '@/comp/PDFCover/creator'
import { PDFPageUtils } from '@/comp/PDFPage/utils'
import { createRPComment } from '@/comp/RPComment'
import { corpBaseInfoStore, rpPrintStore } from '@/store'
import { corpOtherInfoStore } from '@/store/corpOtherInfoStore'
import { eventBus, REPORT_EVENTS } from '@/utils'
import { initZhEn, isEnForRPPrint, t } from '@/utils/lang'
import { getCreditRPAppendix, RP_PRINT_CONSTANTS } from 'report-util/constants'
import { getCorpName } from 'report-util/misc'
import { TableSectionsGenerator } from '../TableSectionsGenerator'
import styles from './index.module.less'

/**
 * ReportRenderer类 - 负责尽调报告的渲染逻辑
 *
 * 该类处理了整个报告的构建过程，包括封面、章节和表格的渲染。
 * 它实现了PDF式分页逻辑，确保长内容在多页之间正确分割。
 */
export class RPPrintRenderer {
  /**
   * PDFPage实例 - 管理页面的创建和内容添加
   * PDFPage组件会自动处理内容分页，确保内容不会溢出页面
   */
  private pdfPage: PDFPage | null = null

  /** SectionRenderer实例，专门处理章节和表格的渲染 */
  private sectionRenderer: TableSectionsGenerator | null = null

  /** 标记报告是否已全部渲染完成 */
  private isRenderingComplete: boolean = false

  /**
   * 构造函数
   * @param $reportContainer - 报告容器元素，整个报告将渲染到这个容器中
   */
  constructor(private $reportContainer: JQuery) {
    if (!$reportContainer || !$reportContainer.length) {
      throw new Error('ReportRenderer: 容器元素无效')
    }
  }

  /**
   * 初始化并渲染报告
   *
   * 这是报告生成的入口点，执行以下步骤：
   * 1. 初始化语言设置
   * 2. 创建PDF页面组件实例
   * 3. 渲染报告封面
   * 4. 加载报告配置并渲染内容
   * 5. 通知渲染完成
   */
  public initialize(): void {
    try {
      // 初始化语言
      initZhEn()

      // 创建PDF页面组件 - 这是处理分页的核心组件
      this.pdfPage = new PDFPage(this.$reportContainer, {})

      // 创建SectionRenderer实例，使用回调来处理渲染结果
      this.sectionRenderer = new TableSectionsGenerator(rpPrintStore.getData()?.reportConfig, {
        // 处理表格数据加载完成
        onTableDataLoaded: (data, tableKey) => {
          this.handleTableDataLoaded({
            data,
            tableKey,
          })
        },
        onAllTablesDataLoaded: () => {
          console.log('onAllTablesDataLoaded')
          this.addAllContentToPDF()
          this.onAllContentRendered()
        },
      })

      this.sectionRenderer.executeAllTableRequests()

      // 加载配置并渲染内容
      eventBus.trigger(REPORT_EVENTS.DATA_LOADING)
    } catch (error) {
      console.error(error)
      console.error(['Failed to initialize report:', error].map((item) => JSON.stringify(item)).join('\t'))
      eventBus.trigger(REPORT_EVENTS.DATA_LOAD_FAILED, { error })
    }
  }

  /**
   * 将所有收集的内容一次性添加到PDF页面
   */
  private addAllContentToPDF(): void {
    if (!this.pdfPage || !this.sectionRenderer) return

    // 渲染封面
    this.renderCover()
    // 渲染描述
    this.renderComment()

    // 封面之后创建第一个内容页
    this.pdfPage.addPage()

    // 从SectionRenderer中获取所有渲染内容
    const renderedContent = this.sectionRenderer.generateContent()

    // 按照收集的顺序依次添加内容
    for (const item of renderedContent) {
      if (item.type === 'table') {
        this.pdfPage.addTable(item.element, {})
      } else if (item.type === 'heading' || item.type === 'paragraph') {
        this.pdfPage.addContent(item.element)
      } else {
        console.error('Unknown element type:', item)
      }
    }

    // 渲染附录
    this.renderAppendix()

    this.pdfPage.updateAllFootersTotalPageCount()
  }

  /**
   * 渲染报告封面
   *
   * 创建并渲染报告的封面页，包括公司名称、报告标题和日期
   */
  private renderCover(): void {
    if (!this.pdfPage) return

    // 添加封面页 - 使用特定ID 'cover' 创建封面页
    this.pdfPage.addPage({
      id: RP_PRINT_CONSTANTS.CoverPageId,
      hideFooter: true,
    })

    // 使用bussInfoData中的公司名称（如果可用）
    const companyName = getCorpName(corpBaseInfoStore.getData(), isEnForRPPrint())

    // 使用页面内容区域作为PDFCover的渲染目标
    const $coverContainer = $(`#${PDFPageUtils.generateContentId(RP_PRINT_CONSTANTS.CoverPageId)}`)

    const { reportTitle } = rpPrintStore.getData()
    const $coverJQuery = pdfCoverCreator({
      companyName,
      reportTitle,
    })
    $coverJQuery.addClass(styles['pdf-cover'])
    $coverContainer.append($coverJQuery)
  }

  /**
   * 渲染报告描述
   *
   * 创建并渲染报告的描述页，包括公司名称、报告标题和日期
   */
  private renderComment(): void {
    if (!this.pdfPage) return

    // 添加封面页 - 使用特定ID 'cover' 创建封面页
    this.pdfPage.addPage({
      id: RP_PRINT_CONSTANTS.CommentPageId,
      hideFooter: true,
    })

    // 使用页面内容区域作为PDFCover的渲染目标
    const $coverContainer = $(`#${PDFPageUtils.generateContentId(RP_PRINT_CONSTANTS.CommentPageId)}`)

    const funcToGetRpComment = rpPrintStore.getData()?.getRpDisclaimer
    const $coverJQuery = createRPComment(
      funcToGetRpComment({
        config: rpPrintStore.getData()?.reportConfigAfterApi,
        t,
        isEn: isEnForRPPrint(),
      })
    )
    $coverJQuery.addClass(styles['pdf-comment'])
    $coverContainer.append($coverJQuery)

    // 添加内容页并更新当前页面ID
    // 封面之后创建第一个内容页
    this.pdfPage.addPage()
  }

  /**
   * 渲染报告附录
   *
   * 创建并渲染报告的附录页，包括附录内容
   */
  private renderAppendix(): void {
    if (!this.pdfPage) return

    const appendixItems = createRPAppendix(
      getCreditRPAppendix(corpOtherInfoStore.getData()?.isObjection, t, isEnForRPPrint())
    )

    this.pdfPage.addContentBulk(appendixItems, {
      hideFooter: true,
      contentClassName: styles['pdf-appendix'],
    })
  }

  /**
   * 处理所有内容渲染完成的回调
   * 在所有表格渲染完成后触发
   */
  private onAllContentRendered(): void {
    if (this.isRenderingComplete) return

    this.isRenderingComplete = true

    // 触发渲染完成事件
    eventBus.trigger(REPORT_EVENTS.RENDER_COMPLETE)

    console.log('Report rendering completed successfully')
  }

  /**
   * 处理表格数据加载事件
   *
   * 当表格数据通过API加载完成时触发
   * 针对特定类型的表格执行特殊处理，例如更新公司信息
   *
   * @param event - 事件数据
   * @private
   */
  private handleTableDataLoaded(event: any): void {
    if (!event || !event.data || !event.tableKey) return

    // 可以在这里添加其他类型表格的处理逻辑

    // 触发事件总线事件，供其他组件使用
    eventBus.trigger(REPORT_EVENTS.BUSSINFO_DATA_LOADED, event)
  }
}
