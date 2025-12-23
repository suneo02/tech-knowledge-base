import { Button, Empty, List, message, Modal, Typography } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { CDESubscribeItem, TRequestToWFCSpacfic } from 'gel-api'
import { intl } from 'gel-util/intl'
import { isArray, isEmpty } from 'lodash'
import { FC } from 'react'
import { CDEUpdateSubButton } from '../components/UpdateSubBtn'
import styles from './style/subscriptionList.module.less'

interface SubscriptionItemEvent {
  className?: string
  delSubFunc: TRequestToWFCSpacfic<'operation/delete/deletesubcorpcriterion'>
  updateSubFunc: TRequestToWFCSpacfic<'operation/update/updatesubcorpcriterion'>
  onClickApply: (item: CDESubscribeItem) => void
  getCDESubscribeText: (item: CDESubscribeItem) => string
  onRefresh: () => void
}

interface SubscriptionItemProps extends SubscriptionItemEvent {
  item: CDESubscribeItem
}

export const SubscriptionItem: FC<SubscriptionItemProps> = ({
  item,
  delSubFunc,
  updateSubFunc,
  onClickApply,
  getCDESubscribeText,
  onRefresh,
}) => {
  const { run: delSub, loading: delLoading } = useRequest<
    Awaited<ReturnType<typeof delSubFunc>>,
    Parameters<typeof delSubFunc>
  >(delSubFunc, {
    manual: true,
    onSuccess: () => {
      message.success('删除成功')
      onRefresh?.()
    },
    onError: () => {
      message.error('删除失败')
    },
  })
  return (
    <List.Item className={styles['subscription-item__container']}>
      <div className={styles['subscription-item__header']}>
        {/* @ts-expect-error wind ui */}
        <Typography strong>{item.subName}</Typography>
        <div className={styles['subscription-item__actions']}>
          <Button onClick={() => delSub(item)} loading={delLoading}>
            {intl('19853', '删除')}
          </Button>
          <CDEUpdateSubButton
            item={item}
            updateSubFunc={updateSubFunc}
            onUpdateFinish={onRefresh}
            buttonText={intl('174265', '编辑')}
          />
          <Button
            onClick={() => {
              onClickApply(item)
            }}
          >
            {intl('16576', '应用')}
          </Button>
        </div>
      </div>
      <Typography>{getCDESubscribeText(item)}</Typography>
    </List.Item>
  )
}

export const CDESubscriptionListOverall: FC<
  SubscriptionItemEvent & {
    loading?: boolean
    subEmail: string | undefined
    subscribeList: CDESubscribeItem[]
    style?: React.CSSProperties
    emptyClassName?: string
  }
> = ({ className, loading, subEmail, subscribeList, style, emptyClassName, ...props }) => {
  if (!subscribeList || !isArray(subscribeList) || isEmpty(subscribeList))
    return <Empty className={emptyClassName} description="暂无保存内容" />
  return (
    <List
      style={style}
      className={className}
      dataSource={subscribeList}
      loading={loading}
      renderItem={(item: CDESubscribeItem) => {
        item.subEmail = subEmail
        return <SubscriptionItem item={item} {...props} />
      }}
    />
  )
}

export const CDESubscriptionListOverallModal: FC<
  SubscriptionItemEvent & {
    open: boolean
    setOpen: (open: boolean) => void
    subEmail: string
    subscribeList: CDESubscribeItem[]
  }
> = ({ open, setOpen, ...props }) => {
  return (
    <Modal title={intl(272478, '我的保存')} width={900} visible={open} onCancel={() => setOpen(false)} footer={false}>
      <CDESubscriptionListOverall {...props} />
    </Modal>
  )
}
