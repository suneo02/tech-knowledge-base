export interface DownloadFileResponse {
  /**
   *  账号ID
   */
  accountId: string
  active: boolean
  /**
   * 创建时间
   */
  created: number
  /**
   * 显示名称
   */
  displayName: string
  /**
   * 下载文件名
   */
  downloadFileName: string
  /**
   * 下载次数
   */
  downloads: number
  /**
   * 实体ID
   */
  entityId: string
  /**
   * 实体名称
*/
  entityName: string
  /**
   * 点击次数
   */
  hits: number
  /**
   * 唯一标识
   */
  id: number
  /**
   * 修改时间
   */
  modified: number
  /**
   * 名称
   */
  name: string
  /**
   * 参数
   */
  params: string
  /**
   * 匹配的记录数量
   */
  records: number
  /**
   * 来源ID
   */
  sourceId: string
  /**
   * 状态
   */
  status: number
  /**
   * 报告 desc 类型
   */
  descType?: // 报告主体
  | 'reportSubject'
    // 匹配公司数
    | 'matchCount'
    // 导出主体
    | 'exportSubject'
}
