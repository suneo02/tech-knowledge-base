import { AddrComp } from '@/components/company/info/comp/AddrComp.tsx'
import intl from '@/utils/intl'
import { Modal, Button } from '@wind/wind-ui'
import Table, { ColumnProps } from '@wind/wind-ui-table'
import React, { useMemo, useState } from 'react'
import { CorpBasicInfoFront } from '../../handle'
import './index.less'
import { ParkItem } from 'gel-types'

export const Park: React.FC<{ title: string; id: string }> = ({ title, id }) => {
  return (
    <span className="park">
      <i></i>
      {intl('419887', '所属园区')}
      {intl('99999681', '：')}
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
  row: CorpBasicInfoFront
  parkId?: string
  parkTitle?: string
  parkList?: ParkItem[]
  isBusAddress: boolean
}> = ({ title, row, parkId, parkTitle, parkList, isBusAddress }) => {
  const [visible, setVisible] = useState(false)

  const parks = useMemo(() => {
    let arr: Array<{ parkId: string; parkName: string; corpCount?: number }> = []

    if (Array.isArray(parkList) && parkList?.length) {
      arr = parkList
        .filter((i) => i && (i.parkId || i.parkName))
        .map((i) => ({ parkId: i.parkId || '', parkName: i.parkName || '', corpCount: parkList.length }))
    } else if (parkTitle) {
      arr = [{ parkId: parkId || '', parkName: parkTitle }]
    }

    if (arr.length === 0) {
      const mock = typeof window !== 'undefined' ? (window as any).__parkMock : null
      if (mock && Array.isArray(mock.data)) {
        arr = mock.data
          .filter((i: any) => i && (i.id || i.name))
          .map((i: any) => ({ parkId: i.id, parkName: i.name, corpCount: i.corpCount }))
      }
    }

    // if (arr.length === 0) {
    //   arr = [
    //     { parkId: 'P001', parkName: '张江高科技园区', corpCount: 12345 },
    //     { parkId: 'P002', parkName: '浦东软件园区', corpCount: 67890 },
    //     { parkId: 'P003', parkName: '临港新片区园区', corpCount: 3456 },
    //   ]
    // }

    return arr
  }, [parkTitle, parkId, parkList])

  const count = parks.length
  const showMore = count > 2

  const primary = parks[0]

  return (
    <div className="address park">
      <div>
        <AddrComp address={title} corpId={row?.corp_id} isBusinessAddress={isBusAddress} />
      </div>
      <div style={{ minWidth: 'fit-content', display: 'flex' }}>
        {primary ? <Park title={primary.parkName} id={primary.parkId} /> : null}
        {showMore ? (
          <Button
            type="link"
            size="small"
            style={{ padding: '0 0 0 2px' }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setVisible(true)
            }}
            data-uc-id="Hk3cG2More"
            data-uc-ct="a"
          >
            {`${intl('272167', '更多')}(${count})`}
          </Button>
        ) : null}
      </div>
      <Modal
        visible={visible}
        title={`${intl('419887', '所属园区')}（${parks?.length}）`}
        onCancel={() => setVisible(false)}
        // width={}
        destroyOnClose
        footer={null}
      >
        {(() => {
          const columns: ColumnProps[] = [
            {
              title: intl('28846', '序号'),
              dataIndex: '__index',
              key: '__index',
              width: 60,
              render: (_text, _record, index) => index + 1,
            },
            {
              title: intl('70981', '园区名称'),
              dataIndex: 'parkName',
              key: 'parkName',
              render: (text, record) => (
                <a
                  href={`${window.location.protocol}//wx.wind.com.cn/govweb/?pageId=SKJTDJM&parkId=${record.parkId}#/GeneralPage`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ textDecoration: 'underline' }}
                  data-uc-id="Hk3cG2Park"
                  data-uc-ct="a"
                >
                  {text}
                </a>
              ),
            },
          ]
          return <Table columns={columns} dataSource={parks} pagination={false} />
        })()}
      </Modal>
    </div>
  )
}
