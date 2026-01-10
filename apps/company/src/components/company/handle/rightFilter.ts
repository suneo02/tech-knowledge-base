import { CorpTableCfg } from '@/types/corpDetail'

/**
 * 决定 table 右侧筛选是否展示
 *
 */
const isShowCompanyTableRightFilter = (tableCfg: CorpTableCfg, tableData?: any[]) => {
  try {
    // 没有右侧筛选，则不展示
    if (!tableCfg.rightFilters || !tableCfg.rightFilters.length) {
      return false
    }

    // 表格数据为空时，并且配置了隐藏右侧筛选，则隐藏右侧筛选
    if (tableCfg.rightFilterHideWhenEmpty && (!tableData || tableData.length === 0)) {
      return false
    }

    return true
  } catch (error) {
    console.error(error)
    return true
  }
}

/**
 * 决定 table 右侧筛选是否展示 根据各种各样的 table 数据
 */
export const isShowCompanyTableRightFilterByMultiTableData = (tableCfg: CorpTableCfg) => {
  try {
    return isShowCompanyTableRightFilter(tableCfg)
  } catch (error) {
    console.error(error)
    return true
  }
}
