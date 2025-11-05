import intl from '@/utils/intl'
import './noData.less'
import React, { FC } from 'react'

const NoData: FC<{
  title?: string
}> = ({ title }) => {
  return (
    <div className="no-data-container">
      {/* <div>
        <img src={noDataImg} alt="" />
      </div> */}
      <div>{title || intl('132725', '暂无数据')}</div>
    </div>
  )
}

export default NoData
