import { CDEFilterItemUser } from '@/types'
import { Button, Input, message, Popover } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { TRequestToWFCSpacfic } from 'gel-api'
import { t } from 'gel-util/intl'
import { FC, useState } from 'react'
import styles from './style/saveFilterBtn.module.less'

const STRINGS = {
  SAVE_SUCCESS: t('', '保存成功'),
  SAVE_FAIL: t('', '保存失败'),
  SAVE_NAME_PLACEHOLDER: t('', '请输入保存名称'),
  SAVE_NAME_TITLE: t('', '保存条件'),
  SAVE_NAME_CONFIRM: t('', '确认'),
  SAVE_NAME_CANCEL: t('', '取消'),
  SAVE_NAME_ENTER: t('', '请输入保存名称'),
}

type SaveSubFunc = TRequestToWFCSpacfic<'operation/insert/addsubcorpcriterion'>

export const CDESaveFilterButton: FC<{
  filtersValid: CDEFilterItemUser[]
  saveSubFunc: SaveSubFunc
  onSaveFilterFinish?: () => void
}> = ({ filtersValid, saveSubFunc, onSaveFilterFinish }) => {
  const { loading, run } = useRequest<Awaited<ReturnType<SaveSubFunc>>, Parameters<SaveSubFunc>>(saveSubFunc, {
    onSuccess: () => {
      message.success(STRINGS.SAVE_SUCCESS)
      onSaveFilterFinish?.()
    },
    onError: () => {
      message.error(STRINGS.SAVE_FAIL)
    },
    manual: true,
  })
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
        placeholder={STRINGS.SAVE_NAME_PLACEHOLDER}
      />
      <div className={styles['filter-popover__button-group']}>
        <Button size="small" onClick={() => setPopoverVisible(false)}>
          {STRINGS.SAVE_NAME_CANCEL}
        </Button>
        <Button size="small" type="primary" onClick={handleSave} loading={loading} disabled={!filterName.trim()}>
          {STRINGS.SAVE_NAME_CONFIRM}
        </Button>
      </div>
    </div>
  )

  return (
    <Popover
      content={saveContent}
      title={STRINGS.SAVE_NAME_TITLE}
      trigger="click"
      visible={popoverVisible}
      onVisibleChange={setPopoverVisible}
    >
      <Button type="primary" size="small">
        {STRINGS.SAVE_NAME_ENTER}
      </Button>
    </Popover>
  )
}
