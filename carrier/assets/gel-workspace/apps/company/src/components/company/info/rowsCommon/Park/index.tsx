import { AddrComp } from '@/components/company/info/comp/AddrComp.tsx'
import intl from '@/utils/intl'
import React from 'react'
import { ICorpBasicInfoFront } from '../../handle'
import './index.less'

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
            data-uc-id="-aU103bn3G"
            data-uc-ct="a"
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

export const ParkBox: React.FC<{
  title: string
  row: ICorpBasicInfoFront
  parkId: string
  parkTitle: string
  isBusAddress: boolean
}> = ({ title, row, parkId, parkTitle, isBusAddress }) => {
  return (
    <div className="address park">
      <span>
        <AddrComp address={title} corpId={row?.corp_id} isBusinessAddress={isBusAddress} />
      </span>
      {parkTitle ? <Park title={parkTitle} id={parkId} /> : null}
    </div>
  )
}
