import { CDEFilterItemUser } from '@/types'
import { Button, Input, message, Popover } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { TRequestToWFCSpacfic } from 'gel-api'
import { FC, useState } from 'react'
import styles from './style/saveFilterBtn.module.less'

export const CDESaveFilterButton: FC<{
  filtersValid: CDEFilterItemUser[]
  saveSubFunc: TRequestToWFCSpacfic<'operation/insert/addsubcorpcriterion'>
  onSaveFilterFinish?: () => void
}> = ({ filtersValid, saveSubFunc, onSaveFilterFinish }) => {
  const { loading, run } = useRequest<Awaited<ReturnType<typeof saveSubFunc>>, Parameters<typeof saveSubFunc>>(
    saveSubFunc,
    {
      onSuccess: () => {
        message.success('保存成功')
        onSaveFilterFinish?.()
      },
      onError: () => {
        message.error('保存失败')
      },
      manual: true,
    }
  )
  const [popoverVisible, setPopoverVisible] = useState(false)
  const [filterName, setFilterName] = useState('')

  const handleSave = () => {
    if (filterName.trim()) {
      run({
        subName: filterName.trim(),
        subPush: 0,
        superQueryLogic: JSON.stringify({
          filters: filtersValid,
        }),
      })
      setFilterName('')
      setPopoverVisible(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setPopoverVisible(false)
    }
  }

  const saveContent = (
    <div className={styles['filter-popover']}>
      <Input
        autoFocus
        value={filterName}
        onChange={(e) => setFilterName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="请输入保存名称"
      />
      <div className={styles['filter-popover__button-group']}>
        <Button size="small" onClick={() => setPopoverVisible(false)}>
          取消
        </Button>
        <Button size="small" type="primary" onClick={handleSave} loading={loading} disabled={!filterName.trim()}>
          确认
        </Button>
      </div>
    </div>
  )

  return (
    <Popover
      content={saveContent}
      title="保存筛选条件"
      trigger="click"
      visible={popoverVisible}
      onVisibleChange={setPopoverVisible}
    >
      <Button type="primary" size="small">
        保存条件
      </Button>
    </Popover>
  )
}
