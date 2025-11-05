import React from 'react'
import './index.less'
import intl from '@/utils/intl'
import { AddrComp } from '@/components/company/info/comp/AddrComp.tsx'

export const Park: React.FC<{ title: string; id: string }> = ({ title, id }) => {
  return (
    <span className="park">
      <i></i>
      {intl('419887', '所属园区')}
      {intl(99999681, '：')}
      {id ? (
        <div>
          <a
            href={`${window.location.protocol}//wx.wind.com.cn/govweb/?pageId=SKJTDJM&parkId=${id}#/GeneralPage`}
            target="_blank"
            rel="noreferrer"
          >
            {title}
          </a>
        </div>
      ) : (
        title
      )}
    </span>
  )
}

export const ParkBox: React.FC<{ title: string; row: Record<string, any>; parkId: string; parkTitle: string }> = ({
  title,
  row,
  parkId,
  parkTitle,
}) => {
  return (
    <div className="address park">
      <span>{AddrComp(title, row, 1)}</span>
      {parkTitle ? <Park title={parkTitle} id={parkId} /> : null}
    </div>
  )
}
