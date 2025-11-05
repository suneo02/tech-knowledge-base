export interface IConfigDetailTitleJSON {
  title: string
  titleId?: string | number // FIXME 上线时此处需要改为必须，开发可以暂时可选来避免报错
  hiddenTitle?: boolean
}

export type IConfigDetailApiJSON = {
  api?: string
  /**
   * 该字段用于定制化 获得父组件的 data，暂时先用 string类型，后期可以改为 object 类型定义更多参数
   */
  listKey?: string

  /**
   * basic num 中的 key 值
   */
  countKey?: string

  apiExtra?: {
    type?: string
    apiKey: string
    key?: string
    value: string
  }[]
  apiParams?: object
}

export type TConfigDetailLayout = 'horizontal' | 'vertical' | 'tabs' | undefined | string

/**
 * 单个节点
 */
export type ICfgDetailNodeCommonJson = {
  display?: boolean
  disabled?: boolean
  treeKey?: string // 组件的唯一key
  key?: string
  /**
   * 是否展示最近三年数据
   */
  ifRecentThreeYears?: boolean
}
