import React, { FC } from 'react'
import { IConfigDetailApiJSON, IConfigDetailTitleJSON } from '../../types/configDetail/common.ts'
import TableNew from '@/components/table/TableNew'
import LeaderBoardMap from '@/components/map/LeaderBoardMap'
import CardHeader from '@/components/common/card/header/Header'
import { WCB } from '@/components/wind/WindChart'
import RelationshipChart from '@/components/company/RelationChart'
import { IChartOption } from '@/types/configDetail/chart.ts'
import { ICfgDetailNodeType } from '@/types/configDetail/module.ts'

export const Item: FC<
  {
    listKey?: string
    data?: any
    type?: ICfgDetailNodeType
    chartOptions?: IChartOption
    treeKey?: string
  } & IConfigDetailTitleJSON &
    Partial<IConfigDetailApiJSON>
> = (item) => {
  const { data, ...rest } = item
  const _data = item.listKey ? data?.[item.listKey] : data
  switch (item.type) {
    case 'table':
    case 2:
      // @ts-expect-error ttt
      return <TableNew {...rest} dataSource={_data} />
    case 'map':
      return <LeaderBoardMap {...rest} />
    case 'chart':
      return (
        <>
          {item.title && !item.hiddenTitle ? <CardHeader {...item} /> : null}
          <WCB {...item?.chartOptions} data={_data} />
        </>
      )
    case 'relationship':
      return <RelationshipChart {...item} />
    default:
      return null
  }
}

Item.displayName = 'ConfigDetailItem'
