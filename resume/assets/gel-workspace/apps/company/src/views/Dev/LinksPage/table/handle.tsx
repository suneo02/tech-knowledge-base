import Links from '@/components/common/links/Links'
import React from 'react'

export const useLinksTableColumns = (useLinks, columns) => {
  const renderText = (res) => (useLinks ? <Links {...res} /> : res.title || '--')

  /**
   * 通用跳转-TXT
   * @param {column, data, row} param0
   * @returns
   */
  const renderLinks = ({ links, result, row }) => {
    if (!links) return result || '--'
    if (links.idKey) links.id = row[links.idKey]
    if (links.valueKey) links.value = row[links.valueKey]
    if (links.typeKey) links.type = row[links.typeKey]
    if (links.extraTypeKey) links.extraType = row[links.extraTypeKey]
    links.title = result
    return renderText(links)
  }

  return columns.map((column) => {
    column.render = (result, row) => {
      if (useLinks) return renderLinks({ links: column.links, result, row })
      return result || '--'
    }
    return column
  })
}

/**
 * @author Calvin <yxlu.calvin@wind.com.cn>
 * @param {Boolean} param.useLinks 是否可点击跳转
 * @returns handleColumns, handlePagination
 * @example
 */
export const useHandleLinksTablePagination = () => {
  const defaultPageTotal = 5000

  /**
   * 目前只处理最大条数的问题, 这里涉及到vip和svip
   * todo vip 和 svip 逻辑后期整理
   */
  const handlePagination = (pagination) => {
    const maxPageTotal = pagination?.maxTotal || defaultPageTotal
    pagination.total = pagination.total > maxPageTotal ? maxPageTotal : pagination.total
    return pagination
  }

  return {
    handlePagination,
  }
}
