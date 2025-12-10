import { Card, List } from '@wind/wind-ui'

import React, { useEffect, useState } from 'react'
import { getCompanyHotView } from '@/api/searchListApi.ts'
import { wftCommon } from '@/utils/utils'
import intl from '@/utils/intl'
import { LinksModule } from '@/handle/link'
import { Links } from '@/components/common/links'
import { refreshHistoryEmitter } from '@/views/GlobalSearch/emitter'

const PopularSearch: React.FC = () => {
  const [hotList, setHotList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const getHotList = async () => {
    setLoading(true)
    const { Data } = await getCompanyHotView()
    if (window.en_access_config) {
      wftCommon.zh2en(Data, (endata) => {
        setHotList(endata)
      })
    } else {
      if (Data?.length) setHotList(Data)
    }
    setLoading(false)
  }
  useEffect(() => {
    getHotList()
  }, [])
  return (
    <div style={{ width: '100%', marginBlockEnd: 12 }}>
      <Card title={intl('437297', '热门浏览企业')}>
        <List
          loading={loading}
          split={false}
          dataSource={hotList}
          renderItem={(item, index) => (
            <List.Item key={index}>
              <Links
                module={LinksModule.COMPANY}
                id={item.id}
                title={item.name}
                addRecordCallback={() => {
                  refreshHistoryEmitter.emit()
                }}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  )
}

export default PopularSearch
