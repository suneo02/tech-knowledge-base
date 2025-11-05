import { SearchHomeItemData } from '@/views/HomeAI/comp/RecommendFunc/config/type'

export interface DepartmentItemData {
  groupSystemId: string
  groupSystemLogoUrl: string
  groupSystemName: string
  subjectCompanyNum: number
  memberCompanyNum: number
}

export interface FeaturedItemData {
  objectId: string
  objectName: string
  count: number
  description: string
}

export interface ExtendData {
  records?: number
  listDictory?: number
}

export interface HotItemProps {
  hotFlag: 'department' | 'fetured' | 'searchHome'
  itemData: DepartmentItemData | FeaturedItemData | SearchHomeItemData
  extendData: ExtendData
}

export const isDepartmentData = (
  data: DepartmentItemData | FeaturedItemData | SearchHomeItemData
): data is DepartmentItemData => {
  return 'groupSystemId' in data
}

export const isFeaturedData = (
  data: DepartmentItemData | FeaturedItemData | SearchHomeItemData
): data is FeaturedItemData => {
  return 'objectId' in data
}

export const isSearchHomeData = (
  data: DepartmentItemData | FeaturedItemData | SearchHomeItemData
): data is SearchHomeItemData => {
  return 'key' in data
}
