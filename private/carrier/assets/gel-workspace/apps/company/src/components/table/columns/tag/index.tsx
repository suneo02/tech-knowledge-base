import { Tag } from '@wind/wind-ui'
import { isArray } from 'lodash'
import { isNil } from 'lodash/lang'
import React, { FC } from 'react'
import { IConfigDetailTableTagInfo, TConfigDetailTableColumn } from '../../../../types/configDetail/table.ts'
import './index.less'

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
    const type = tagInfo.type ?? 'secondary'
    const size = tagInfo.size
    return (
      <>
        {tags.map((item) => (
          <Tag
            className="table-column-tag"
            key={item}
            type={type}
            color={color}
            size={size}
            data-uc-id="St0iKSQyhm"
            data-uc-ct="tag"
            data-uc-x={item}
          >
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
