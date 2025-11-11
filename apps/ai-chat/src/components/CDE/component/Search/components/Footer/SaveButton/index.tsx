import { Button, Input, message, Popover } from '@wind/wind-ui'
import { useRequest } from 'ahooks'
import { TRequestToWFCSpacfic } from 'gel-api'
import { t } from 'gel-util/intl'
import { FC, useState } from 'react'
import { CDEFormBizValues } from 'cde'
import styles from './index.module.less'
import { SaveO } from '@wind/icons'

const STRINGS = {
  SAVE_SUCCESS: t('464102', '保存成功'),
  SAVE_FAIL: t('215345', '保存失败'),
  SAVE_NAME_PLACEHOLDER: t('464216', '请输入保存名称'),
  SAVE_NAME_TITLE: t('261051', '保存条件'),
  SAVE_NAME_CONFIRM: t('19482', '确认'),
  SAVE_NAME_CANCEL: t('19405', '取消'),
  SAVE_NAME_ENTER: t('1655', '保存')
}

const PREFIX = 'cde-save-button'

export const CDESaveButton: FC<{
  filters: CDEFormBizValues[]
  saveSubFunc: TRequestToWFCSpacfic<'operation/insert/addsubcorpcriterion'>
  onFinish?: () => void
  onSave?: () => void
  loading?: boolean
}> = ({ filters, saveSubFunc, onFinish, onSave, loading: buttonLoading }) => {
  const { loading, run } = useRequest<Awaited<ReturnType<typeof saveSubFunc>>, Parameters<typeof saveSubFunc>>(
    saveSubFunc,
    {
      onSuccess: () => {
        message.success(STRINGS.SAVE_SUCCESS)
        setFilterName('')
        setPopoverVisible(false)
      },
      onError: () => {
        message.error(STRINGS.SAVE_FAIL)
      },
      onFinally: () => {
        onFinish?.()
      },
      manual: true,
    }
  )
  const [popoverVisible, setPopoverVisible] = useState(false)
  const [filterName, setFilterName] = useState('')

  const handleSave = () => {
    if (filterName.trim()) {
      onSave?.()
      run({
        subName: filterName.trim(),
        subPush: 0,
        superQueryLogic: JSON.stringify({
          filters,
        }),
      })
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
    <div className={styles[`${PREFIX}-content-container`]}>
      <Input
        autoFocus
        value={filterName}
        onChange={(e) => setFilterName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={STRINGS.SAVE_NAME_PLACEHOLDER}
      />

      <Button
        className={styles[`${PREFIX}-content-container-button`]}
        type="primary"
        onClick={handleSave}
        loading={loading}
        disabled={!filterName.trim()}
      >
        {!loading && STRINGS.SAVE_NAME_CONFIRM}
      </Button>
    </div>
  )

  return (
    <Popover
      content={saveContent}
      title={STRINGS.SAVE_NAME_TITLE}
      trigger="click"
      visible={popoverVisible}
      onVisibleChange={(visible) => {
        if (loading) return
        setPopoverVisible(visible)
      }}
    >
      {/* @ts-expect-error wind-ui 类型错误 */}
      <Button className={styles[`${PREFIX}-button`]} type="text" size="small" icon={<SaveO />} disabled={buttonLoading}>
        {STRINGS.SAVE_NAME_ENTER}
      </Button>
    </Popover>
  )
}
