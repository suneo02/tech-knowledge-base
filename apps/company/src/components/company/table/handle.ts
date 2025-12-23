import intl from '../../../utils/intl'

/**
 * Get table locale configuration based on data loaded state
 */
export const getTableLocale = (dataLoaded: boolean) => {
  return {
    emptyText: dataLoaded ? intl('132725', '暂无数据') : 'loading...',
  }
}
