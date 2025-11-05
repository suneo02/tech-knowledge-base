import { Tag } from '@wind/wind-ui'
import './index.less'
import { isArray } from 'lodash'
import { isNil } from 'lodash/lang'
import React, { FC } from 'react'
import { IConfigDetailTableTagInfo, TConfigDetailTableColumn } from '../../../../types/configDetail/table.ts'

export const TableColumnTag: FC<{
  record: Record<string, any>
  tagInfo: IConfigDetailTableTagInfo
}> = ({ record, tagInfo }) => {
  try {
    if (!tagInfo) {
      return null
    }

    let tags = record[tagInfo.dataIndex]
    if (isNil(tags)) {
      return null
    }
    if (!isArray(tags)) tags = [tags]

    const color = tagInfo.color
    const type = tagInfo.type ?? 'primary'
    const size = tagInfo.size
    return (
      <>
        {tags.map((item) => (
          // @ts-expect-error ttt
          <Tag className="table-column-tag" key={item} type={type} color={color} size={size}>
            {item}
          </Tag>
        ))}
      </>
    )
  } catch (e) {
    console.error(e)
    return null
  }
}

export const TableColumnTags: FC<{
  record: Record<string, any>
  tagInfo: TConfigDetailTableColumn['tagInfo']
}> = ({ record, tagInfo }) => {
  try {
    if (!tagInfo) {
      return null
    }
    const tagInfoArr = isArray(tagInfo) ? tagInfo : [tagInfo]
    return (tagInfoArr as IConfigDetailTableTagInfo[])?.map((info) => (
      <TableColumnTag key={`column-tag=${info.dataIndex}`} record={record} tagInfo={info} />
    ))
  } catch (e) {
    console.error(e)
    return null
  }
}
