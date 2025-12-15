import { TConfigDetailTableColumn } from '../../../../types/configDetail/table.ts'
import { LinksModule, TLinkOptions } from '@/handle/link'
import { getStandardEnumByLevel } from '@/handle/link/module/miscDetail/standard.ts'
import { isArray, isNil } from 'lodash'
import React, { FC } from 'react'
import { TableColumnTags } from '@/components/table/columns'
import Links from '@/components/common/links/Links.tsx'
import intl from '@/utils/intl'

/**
 * 处理 table column 的 link 参数解析
 * @param row 有可能是整个对象，有可能是 数组中的一个对象值
 */
export const handleTableLinkParams = (field: any, row: any, col: TConfigDetailTableColumn) => {
  try {
    if (typeof row !== 'object' || isNil(row)) {
      console.error('~ table column link row error', row)
      return {}
    }
    const linksParams: TLinkOptions & {
      module: LinksModule
    } = { ...col.links }
    if (col.links?.id) linksParams.id = row[col.links?.id]
    if (col.links.standardTypeKey) linksParams.type = getStandardEnumByLevel(row[col.links.standardTypeKey])
    if (col.links.typeKey) linksParams.type = row[col.links.typeKey]
    if (col.links.standardLevelCodeKey) linksParams.standardLevelCode = row[col.links.standardLevelCodeKey]
    return linksParams
  } catch (e) {
    console.error(e)
    return {}
  }
}

/**
 *
 * @param txt
 * @param row 有可能是整个对象，有可能是 数组中的一个对象值
 * @param col
 * @constructor
 */
export const TableColLinkRender: FC<{
  txt: any
  row: Record<string, any>
  col: TConfigDetailTableColumn
}> = ({ txt, row, col }) => {
  try {
    // 递归渲染
    if (col.isArray) {
      if (isArray(txt)) {
        return txt.map((item) => {
          const title = col.links.titleKey ? item[col.links.titleKey] : undefined
          return (
            <div key={JSON.stringify(item)}>
              <TableColLinkRender
                txt={title}
                col={{
                  ...col,
                  isArray: false,
                }}
                row={item}
              />
            </div>
          )
        })
      } else {
        console.error('~ table col config error !, field is obj, and config array', txt, row, col)
      }
    }
    const tag = col.tagInfo ? <TableColumnTags record={row} tagInfo={col.tagInfo} /> : null
    const linksParams = handleTableLinkParams(txt, row, col)

    if (col?.info?.type === 3) {
      if (col.info?.id) {
        const _title = col?.info?.titleId ? intl(col.info.titleId) : col?.info?.title || txt

        return <>{row[col.info?.id] ? <Links title={_title} {...linksParams} info /> : txt}</>
      } else {
        return (
          <>
            <Links title={txt} {...linksParams} info />
            {tag}
          </>
        )
      }
    } else {
      return (
        <>
          <Links title={txt} {...linksParams} />
          {tag}
        </>
      )
    }
  } catch (e) {
    console.error(e)
    return '--'
  }
}
