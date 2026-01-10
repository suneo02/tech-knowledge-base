import { createRequest } from '@/api/request'
import { Links } from '@/components/common/links'
import { LinksModule } from '@/handle/link'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { refreshHistoryEmitter } from '@/views/GlobalSearch/emitter'
import { DeleteOutlined } from '@ant-design/icons'
import { CloseO } from '@wind/icons'
import { Button, Card, List, message, Modal, Tooltip } from '@wind/wind-ui'
import { CompanybrowsehistorylistResult } from 'gel-api'
import React, { useEffect, useState } from 'react'
import './index.less'

const HistorySearch: React.FC = () => {
  const [list, setList] = useState<CompanybrowsehistorylistResult[]>([])
  const [loading, setLoading] = useState(false)
  const api = createRequest({ noExtra: true })
  const getList = async () => {
    setLoading(true)
    const { Data } = await api('operation/get/companybrowsehistorylist', { params: { pageSize: 5 } })
    const tempData = Data?.slice(0, 5)
    if (window.en_access_config) {
      wftCommon.zh2en(tempData, (endata) => {
        setList(endata)
      })
    } else {
      setList(tempData)
    }
    setLoading(false)
  }
  // 订阅来自 PopularSearch 的刷新事件
  refreshHistoryEmitter.useSubscription(() => getList())
  const showModal = () => {
    Modal.confirm({
      title: intl(31041, '提示'),
      content: intl(478693, '全部清除最近浏览企业'),
      onOk: () => {
        api('operation/delete/companybrowsehistorydeleteall').then(() => {
          getList()
          message.success(intl(135057, '删除成功！'))
        })
      },
    })
  }
  const delItem = (entityId: string) => {
    api('operation/delete/companybrowsehistorydeleteone', { params: { entityId } }).then(() => {
      message.success(intl(135057, '删除成功！'))
      setList(list.filter((item) => item.entityId !== entityId))
    })
  }
  useEffect(() => {
    getList()
  }, [])
  return list?.length ? (
    <div style={{ width: '100%' }}>
      <Card
        title={intl('437296', '最近浏览企业')}
        style={{ marginBottom: 12 }}
        extra={
          <Tooltip title={intl(149222, '清空')}>
            <Button
              icon={<DeleteOutlined />}
              type="text"
              onClick={() => showModal()}
              data-uc-id="0m6IG4T_DH"
              data-uc-ct="button"
            />
          </Tooltip>
        }
      >
        <List
          loading={loading}
          split={false}
          dataSource={list}
          renderItem={(item, index) => (
            <List.Item key={item.entityId + index} className={'list-container'}>
              <Links
                module={LinksModule.COMPANY}
                id={item.entityId}
                title={item.entityName}
                addRecordCallback={() => getList()}
              />
              <Button
                className="delete-btn"
                // @ts-expect-error ttt
                icon={<CloseO data-uc-id="j0gTjADWx6" data-uc-ct="closeo" />}
                type="text"
                onClick={() => delItem(item.entityId)}
                data-uc-id="avzPWrPAjr"
                data-uc-ct="button"
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  ) : null
}

export default HistorySearch
