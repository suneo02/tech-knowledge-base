import { ComponentTypeEnum } from '../../types/emun'
import { ApiContainerProps, ApiContainerReturns } from '../container/ApiContainer'
import { FilterContextType, FilterProviderProps } from '../container/FilterContainer'
import { WFilterProps } from '../wind/form/WFilter'

/** 通用传参 */
export interface CommonProps {
  /** 筛选项传参 */
  filter?: any
  updateFilter?: (params: Partial<any>) => void

  params?: any
  updateParams?: (params: Partial<any>) => void

  /** 是否是组件集的子组件 */
  integrationParent?: boolean
}

/**
 * !只属于json config 里面的参数
 */
export interface HeaderConfigProps {
  level?: number
  title?: string // 标题
  titleRemark?: string // 标题备注
  vip?: string // 是否是vip模式
  tooltip?: React.ReactNode // 提示
  downDocType?: string // 下载
}

/** 标题参数 */
export interface HeaderProps extends WFilterProps, HeaderConfigProps {
  integrationParent?: boolean // 是否是组件集内部的组件
  total?: number // 多数是列表场景，获取总数
  isTab?: boolean // 是否是标签页形式 需要用在 <SearchList /> 因为tabs的标签样式需要重构
  search?: { columns: any[] } // 用于渲染搜索的功能
  filterList?: any[] // 用于添加筛选过滤的功能
  style?: React.CSSProperties // 集成style
  initialValues?: any // 初始化参数
  align?: 'left' | 'right' // 对齐方式
}

/** wind 组件传参 */
export interface WComponentProps extends HeaderConfigProps {
  api: any // 用于请求数据的API函数
  apiParams?: any //  API请求参数
  autoChangeTablePagination?: boolean //  是否自动改变表格分页
  type: ComponentTypeEnum // 组件类型
  displayKey?: string // 显示字段
  children: WComponentProps[]
  width: string | number // 一般是用在tabs的结构上
  initialParams?: any // todo 初始化参数 该位置待定
}

export type TreeConfigProps = Partial<FilterContextType> &
  Omit<FilterProviderProps, 'children'> & // filter
  ApiContainerReturns &
  Omit<ApiContainerProps, 'children'> & {
    // api
    initialParams?: Record<string, unknown>
    type?: ComponentTypeEnum
    children?: any
    displayKey?: string // 展示字段
    width?: string | number
  }
