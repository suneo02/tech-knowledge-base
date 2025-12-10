import { useCDEModal } from '@/components/CDE/component/Search'
import { useSuperChatRoomContext } from '@/contexts/SuperChat'
import { fetchPoints, useAppDispatch } from '@/store'
import { UpO } from '@wind/icons'
import { Tooltip } from '@wind/wind-ui'
import { Collapse, ConfigProvider } from 'antd'
import { CDEFormBizValues } from 'cde'
import { GetSubscriptionListResponse } from 'gel-api'
import { t } from 'gel-util/intl'
import SubscribeItem from '../Item'
import styles from './index.module.less'
import { postPointBuried } from '@/utils/common/bury'

const PREFIX = 'subscribe-list'

const STRINGS = {
  TITLE: (total: number) => t('464170', '筛选条件({{total}})', { total }),
  NEW_COUNT: t('464149', '新增数量:'),
  TOOLTIP_TITLE: t('437736', '点击查看')
}

const SubscribeList = ({ list, preview }: { list: GetSubscriptionListResponse['list']; preview?: boolean }) => {
  const dispatch = useAppDispatch()
  const [cdeModalAPI, cdeModalContextHolder] = useCDEModal()
  const { tableId, addDataToCurrentSheet, activeSheetId } = useSuperChatRoomContext()
  const getItems = list.map((item, index) => {
    return {
      key: index,
      label: preview ? (
        <div className={styles[`${PREFIX}-preview-item`]}>
          <div>{STRINGS.TITLE(item.displayCdeFilter.length)}</div>
          {item.newCompanyCount ? (
            <div className={styles[`${PREFIX}-preview-item-new-count`]}>
              {STRINGS.NEW_COUNT}{' '}
              <Tooltip title={STRINGS.TOOLTIP_TITLE}>
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    postPointBuried('922604570316')
                    cdeModalAPI.show({
                      tableId: tableId,
                      sheetId: activeSheetId,
                      initialValues: item.cdeFilter as CDEFormBizValues[],
                      onOk: (sheetInfos) => {// @ts-expect-error
                        addDataToCurrentSheet('bottom')(sheetInfos)
                        cdeModalAPI.hide()
                        dispatch(fetchPoints())
                      },
                    })
                  }}
                >
                  + {item.newCompanyCount}
                </span>
              </Tooltip>
            </div>
          ) : null}
        </div>
      ) : (
        STRINGS.TITLE(item.displayCdeFilter.length)
      ),
      children: <SubscribeItem filters={item.displayCdeFilter || []} />,
    }
  })

  return (
    <div>
      {cdeModalContextHolder}
      <ConfigProvider
        theme={{
          token: {
            borderRadiusLG: 12,
          },
        }}
      >
        <div className={styles[`${PREFIX}-container`]}>
          {getItems.map((item) => (
            <Collapse
              key={item.key}
              bordered={false}
              defaultActiveKey={['0', '1', '2']}
              // @ts-expect-error wind-ui
              expandIcon={({ isActive }) => <UpO rotate={isActive ? 180 : 0} />}
              items={[item]}
            />
          ))}
        </div>
      </ConfigProvider>
    </div>
  )
}

export default SubscribeList
