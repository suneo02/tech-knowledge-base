import { Button, Input, message, Popover } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { CDESubscribeItem, TRequestToWFCSpacfic } from 'gel-api'
import { t } from 'gel-util/intl'
import { FC, useState } from 'react'
import styles from './style/saveFilterBtn.module.less'

const STRINGS = {
  UPDATE_SUCCESS: t('', '更新成功'),
  UPDATE_FAIL: t('', '更新失败'),
  UPDATE_NAME_PLACEHOLDER: t('', '请输入订阅名称'),
  UPDATE_NAME_TITLE: t('', '更新条件'),
  UPDATE_NAME_CONFIRM: t('', '确认'),
  UPDATE_NAME_CANCEL: t('', '取消'),
  BUTTON_TEXT: t('', '更新'),
}

export const CDEUpdateSubButton: FC<{
  item: CDESubscribeItem
  updateSubFunc: TRequestToWFCSpacfic<'operation/update/updatesubcorpcriterion'>
  onUpdateFinish?: () => void
  buttonText?: string
  className?: string
}> = ({ item, updateSubFunc, onUpdateFinish, buttonText = STRINGS.BUTTON_TEXT, className }) => {
  const { loading, run } = useRequest<Awaited<ReturnType<typeof updateSubFunc>>, Parameters<typeof updateSubFunc>>(
    updateSubFunc,
    {
      onSuccess: () => {
        message.success(STRINGS.UPDATE_SUCCESS)
        onUpdateFinish?.()
      },
      onError: () => {
        message.error(STRINGS.UPDATE_FAIL)
      },
      manual: true,
    }
  )
  const [popoverVisible, setPopoverVisible] = useState(false)
  const [subName, setSubName] = useState(item.subName || '')

  const handleUpdate = () => {
    if (subName.trim()) {
      run({
        id: item.id,
        subName: subName.trim(),
        subPush: item.subPush ? 1 : 0,
        superQueryLogic: item.superQueryLogic,
        mail: item.subEmail,
      })
      setPopoverVisible(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUpdate()
    } else if (e.key === 'Escape') {
      setPopoverVisible(false)
    }
  }

  const updateContent = (
    <div className={styles['filter-popover']}>
      <Input
        autoFocus
        value={subName}
        onChange={(e) => setSubName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={STRINGS.UPDATE_NAME_PLACEHOLDER}
      />
      <div className={styles['filter-popover__button-group']}>
        <Button size="small" onClick={() => setPopoverVisible(false)}>
          {STRINGS.UPDATE_NAME_CANCEL}
        </Button>
        <Button size="small" type="primary" onClick={handleUpdate} loading={loading} disabled={!subName.trim()}>
          {STRINGS.UPDATE_NAME_CONFIRM}
        </Button>
      </div>
    </div>
  )

  return (
    <Popover
      content={updateContent}
      title={STRINGS.UPDATE_NAME_TITLE}
      trigger="click"
      visible={popoverVisible}
      onVisibleChange={setPopoverVisible}
    >
      <Button type="primary" size="small" className={className}>
        {buttonText}
      </Button>
    </Popover>
  )
}
