/**
 * 右侧筛选器配置接口
 * 用于定义表格右侧的筛选下拉框或复选框配置
 */
export interface CorpDetailRightFilterConfig {
  /** 用于聚合查询的字段名 */
  key4sel: string
  /** 用于 Ajax 请求的参数名 */
  key4ajax: string
  /** 筛选器显示的默认名称（如"全部类型"） */
  name?: string
  /** 筛选器的默认值 */
  key?: string
  titleKey?: string
  /** 值的类型（如 'string'） */
  typeOf?: string
  /** 是否为静态固定筛选项（如排序选项） */
  isStatic?: boolean
  /** 静态筛选项是否需要显示计数 */
  needStaticCount?: boolean
  /** 静态筛选项的固定列表 */
  listSort?: Array<{
    key: string
    value?: string | number
    doc_count?: number | string
    doc_count_key?: string
  }>
  /** 自定义渲染函数，用于格式化显示的 key 值 */
  keyRender?: (data: string) => string
  /** 是否为复选框类型 */
  isCheckBox?: boolean
  /** 筛选器类型（如 'tag' 表示标签选择器） */
  type?: string
  /** 是否不需要"全部"选项 */
  noNeedAll?: boolean
  /** 下拉框宽度 */
  width?: number
}
