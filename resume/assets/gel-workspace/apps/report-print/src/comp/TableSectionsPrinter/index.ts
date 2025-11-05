import { t } from '@/utils/lang'
import { ReportPageJson, TCorpDetailNodeKey } from 'gel-types'
import { ProcessedInitializationData, processAndInitializeSectionsTree } from 'report-util/corpConfigJson'
import { ApiResponseForWFC } from 'report-util/types'
import { TableSectionsStateCommon } from '../TableSectionsHelper/type'
import { tableSectionsCreator } from './creator'
import { executeApiRequestsForTables } from './executeApiRequestsForTables'

/**
 * TableSectionsRenderer 类 - 专门负责报告章节和表格的渲染
 *
 * 该类处理具体章节和表格的定义与初始化，维护所有实例引用，
 * 统一管理表格API请求，并在所有请求完成后通知外部组件。
 */
export class TableSectionsPrinter {
  /** 存储所有表格配置 */
  private tableConfigsStore: TableSectionsStateCommon['tableConfigsStore'] = {}
  /** 存储已加载的表格数据 */
  private apiDataStore: TableSectionsStateCommon['apiDataStore'] = {}
  /** 存储所有自定义节点配置 */
  private customNodeConfigStore: TableSectionsStateCommon['customNodeConfigStore'] = {}
  /** 存储所有表格数据整体 */
  private tableDataOverallStore: Partial<Record<TCorpDetailNodeKey, ApiResponseForWFC<any>>> = {}
  /** 存储所有章节标题 或者表格标题配置 */
  private headingConfigsStore: TableSectionsStateCommon['sectionHeadingConfigsStore'] = {}

  /** 所有表格数据加载完成的回调函数 */
  private onAllTablesDataLoaded: Function | null = null

  /** 表格数据加载完成回调 */
  private onTableDataLoaded: (data: any, tableKey: TCorpDetailNodeKey) => void

  /** 记录渲染顺序的数组 */
  private renderOrder: TableSectionsStateCommon['renderOrder'] = []
  /** 初始化完成标志 */
  private initialized: boolean = false

  /**
   * 构造函数
   * @param rootSections - 报告的根章节数组
   * @param callbacks - 回调函数集合
   * @param startLevel - 起始章节级别，默认为1, 对应h2
   */
  constructor(
    rootSections: ReportPageJson,
    callbacks: {
      onTableDataLoaded?: (data: any, tableKey: string) => void
      onTableRendered?: (sectionId: string, tableId: string, pending: number) => void
      onAllTablesDataLoaded?: Function
    },
    startLevel: number = 1
  ) {
    this.onTableDataLoaded = callbacks.onTableDataLoaded || (() => {})
    this.onAllTablesDataLoaded = callbacks.onAllTablesDataLoaded || null

    this._initializeAndProcessSections(rootSections, startLevel)
  }

  /**
   * 获取所有已渲染内容，按照渲染顺序排列
   */
  public generateContent() {
    return tableSectionsCreator({
      tableConfigsStore: this.tableConfigsStore,
      apiDataStore: this.apiDataStore,
      tableDataOverallStore: this.tableDataOverallStore,
      sectionHeadingConfigsStore: this.headingConfigsStore,
      renderOrder: this.renderOrder,
      customNodeConfigStore: this.customNodeConfigStore,
    })
  }

  /**
   * 初始化报告章节和表格
   * This method is now private and called from the constructor.
   *
   * @param rootSections - 报告的根章节数组
   * @param startLevel - 起始章节级别，默认为1, 对应h2
   */
  private _initializeAndProcessSections(rootSections: ReportPageJson, startLevel: number = 1): void {
    try {
      const initializationResult: ProcessedInitializationData = processAndInitializeSectionsTree(
        rootSections,
        startLevel,
        t
      )

      this.tableConfigsStore = initializationResult.tableConfigsStore
      this.headingConfigsStore = initializationResult.sectionConfigStore
      this.renderOrder = initializationResult.renderOrder
      this.customNodeConfigStore = initializationResult.customNodeConfigStore
      this.initialized = true
    } catch (e: any) {
      console.error('初始化章节和表格失败:', e)
      // console.trace(e) // It's good practice to have trace in dev but maybe not in prod logs by default
    }
  }

  /**
   * 执行所有表格的API请求
   * 在完成章节和表格的初始化后调用此方法来加载所有表格数据
   * @returns 请求的表格数量
   */
  public executeAllTableRequests(): number {
    if (!this.initialized) {
      console.warn('TableSectionRenderer: 尚未完成初始化，请先调用 initializeSections')
      return 0
    }

    return executeApiRequestsForTables(
      this.tableConfigsStore,
      this.customNodeConfigStore,
      this.apiDataStore,
      this.tableDataOverallStore,
      (data, tableKey) => {
        // This is the existing onTableDataLoaded logic from the class
        this.onTableDataLoaded(data, tableKey)
        // The original onTableRendered call was also here, implicitly tied to data loading completion for a table
        // If onTableRendered needs to be called per table load, it could be integrated here too,
        // but its primary trigger was pendingTableDataLoads decrementing, which is now handled by the all_done callback.
        // For simplicity, if onTableRendered is purely about individual table load status, it should be tied to onTableDataLoaded.
        // If it's about overall progress, its role might need to be re-evaluated with this refactor.
        // The original call: this.onTableRendered?.(sectionId, tableId, this.pendingTableDataLoads);
        // tableId is not directly available in this specific callback signature without more context passing.
        // This might need careful consideration if `onTableRendered` is crucial per-table *during* the loading phase of *this* method.
      },
      () => {
        this.onAllTablesDataLoaded?.()
      }
    )
  }
}
