import { BellO } from '@wind/icons'
import { useSubscribeModal, useSubscribeNotification, useSubscribeStatus, useSubscribeUrlParams } from './hooks'
import { Button, Dropdown, Menu } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import { FC } from 'react'

const STRINGS = {
  SUBSCRIBE: t('257659', '订阅'),
  SETTING: t('416925', '设置'),
  NEWS: t('437413', '动态')
}

/**
 * 订阅按钮组件
 */
interface SubscribeButtonProps {
  tableId: string
  disabled?: boolean
}

const SubscribeButton: FC<SubscribeButtonProps> = ({ tableId, disabled }) => {
  // 订阅状态管理
  const { subscribeInfo, loading, updateSubscribeStatus } = useSubscribeStatus({ tableId })

  // 弹窗管理
  const { subscribeModalContextHolder, showSubscribeSetting, showSubscribePreview } = useSubscribeModal({
    tableId,
    onSubscribeSuccess: () => {
      updateSubscribeStatus(true)
    },
    onSubscribeCancel: () => {
      updateSubscribeStatus(false)
    },
  })

  // 通知管理
  useSubscribeNotification({
    tableId,
    subscribeInfo,
    onViewNews: showSubscribePreview,
  })

  // URL参数管理
  useSubscribeUrlParams({
    onViewNews: showSubscribePreview,
  })

  const menu = (
    //@ts-expect-error wind-ui
    <Menu>
      <Menu.Item key="1">
        <Button onClick={() => showSubscribeSetting()} type="text">
          {STRINGS.SETTING}
        </Button>
      </Menu.Item>
      <Menu.Item key="2">
        <Button onClick={() => showSubscribePreview()} disabled={!subscribeInfo.subPush} type="text">
          {STRINGS.NEWS}
        </Button>
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      {subscribeModalContextHolder}
      <Dropdown overlay={menu} placement="bottomLeft">
        <Button
          loading={loading}
          // @ts-expect-error wind-ui
          icon={<BellO />}
          disabled={disabled}
        >
          {STRINGS.SUBSCRIBE}
        </Button>
      </Dropdown>
    </>
  )
}

export default SubscribeButton
