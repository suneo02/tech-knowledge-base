/**
 * ConfigTable 类型定义
 */

import { TCorpDetailNodeKey } from 'gel-types'

/**
 * 根据 json 配置渲染表格
 */
export interface ConfigTableOptions {
  /** 数据加载完成的回调函数，提供表格数据和表格key  当表格数据加载失败也会调用*/
  onDataLoadedSuccess?: (data: any, key: TCorpDetailNodeKey) => void
  /** 表格数据加载失败后的回调函数 */
  onDataLoadError?: (error: Error) => void
  /** 表格数据加载完成后并渲染完成的回调函数 */
  onDataRender?: () => void
  /** 表格数据，有些模块由外部发送请求，外部传入数据，目前只有 基本信息 */
  tableData?: any
}
