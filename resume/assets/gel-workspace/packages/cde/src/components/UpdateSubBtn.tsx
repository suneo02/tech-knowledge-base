import { Button, Input, message, Popover } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { CDESubscribeItem, TRequestToWFCSpacfic } from 'gel-api'
import { FC, useState } from 'react'
import styles from './style/saveFilterBtn.module.less'

export const CDEUpdateSubButton: FC<{
  item: CDESubscribeItem
  updateSubFunc: TRequestToWFCSpacfic<'operation/update/updatesubcorpcriterion'>
  onUpdateFinish?: () => void
  buttonText?: string
  className?: string
}> = ({ item, updateSubFunc, onUpdateFinish, buttonText = '更新', className }) => {
  const { loading, run } = useRequest<Awaited<ReturnType<typeof updateSubFunc>>, Parameters<typeof updateSubFunc>>(
    updateSubFunc,
    {
      onSuccess: () => {
        message.success('更新成功')
        onUpdateFinish?.()
      },
      onError: () => {
        message.error('更新失败')
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
        placeholder="请输入订阅名称"
      />
      <div className={styles['filter-popover__button-group']}>
        <Button size="small" onClick={() => setPopoverVisible(false)}>
          取消
        </Button>
        <Button size="small" type="primary" onClick={handleUpdate} loading={loading} disabled={!subName.trim()}>
          确认
        </Button>
      </div>
    </div>
  )

  return (
    <Popover
      content={updateContent}
      title="更新订阅"
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
