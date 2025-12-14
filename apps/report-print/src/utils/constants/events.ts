/**
 * 事件常量
 * 集中管理应用中使用的事件名称，防止字符串硬编码和名称冲突
 */

/**
 * 报表相关事件
 */
export const REPORT_EVENTS = {
  /** 报表数据加载 */
  DATA_LOADING: 'report:dataLoading',
  /** 报表数据加载完成 */
  DATA_LOADED: 'report:dataLoaded',
  /** 报表数据加载失败 */
  DATA_LOAD_FAILED: 'report:dataLoadFailed',
  /** 报表渲染完成 */
  RENDER_COMPLETE: 'report:renderComplete',
  /** 报表导出 */
  EXPORT: 'report:export',
  /** BussInfo 数据加载完成 */
  BUSSINFO_DATA_LOADED: 'report:bussinfoDataLoaded',
}
