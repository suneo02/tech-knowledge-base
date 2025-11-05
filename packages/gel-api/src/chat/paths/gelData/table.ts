// 基础链接接口
interface BaseLink {
  hash: string
  id?: string
  idKey?: string
  params?: Record<string, string>
}

// 左侧链接接口
interface LeftLink extends BaseLink {
  text: string
  isBaifen?: boolean
  access?: string
  showOnlyOne?: boolean
}

// 链接组接口
interface Links {
  card: BaseLink
  left: LeftLink
}

// 基础列属性
interface BaseColumn {
  dataIndex: string | string[]
  titleId?: string
  title: string
  isTitle?: boolean
  showLabel?: boolean
  align?: 'center'
  width?: string
  type?: 'image' | 'tag'
  formatParams?: string[]
  tagType?: string
  css?: string
  fontWeight?: string
}

// 布局方向接口
interface DirectionLayout {
  direction: 'row' | 'column'
  justify: 'start' | 'center'
  gap?: string
  marginBottom?: string
  children: (BaseColumn | DirectionLayout)[]
}

// 图片列特有属性
interface ImageColumn extends BaseColumn {
  type: 'image'
  imageSuffix?: number
  txtLogoIndex?: string
  idLogoIndex?: string
}

// 过滤器接口
interface Filter {
  api: string
  searchKey: string
}

// 基础数据项接口
interface BaseDataItem {
  type: string
  title: string
  titleId?: string
  links: Links
  wxColumns: (BaseColumn | DirectionLayout)[]
}

// 标准信息特有属性
interface StandardDataItem extends BaseDataItem {
  type: 'standard'
  api: string
  countKey: string
  columns: BaseColumn[]
  filters: Filter[]
  hiddenTitle: boolean
}

// 集团系特有属性
interface GroupDataItem extends BaseDataItem {
  type: 'group'
  countKey: string
}

// 专利信息特有属性
interface PatentDataItem extends BaseDataItem {
  type: 'patent'
  api: string
  countKey: string
  downDocType: string
}

// 联合类型表示所有可能的数据项类型
export type DataItem = BaseDataItem | StandardDataItem | GroupDataItem | PatentDataItem

// 导出数组类型
export type MockData = DataItem[]
