import React from 'react'
import { Button } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import { FOOTER_CONSTANTS } from '../constants'

const STRINGS = {
  SAVE_NO_RUN_BUTTON: t('464101', '保存不运行'),
  RUN_ALL_BUTTON: t('464207', '运行全部')
}

interface ActionButtonsProps {
  saveLoading: boolean
  runAllLoading: boolean
  onSaveNoRun: () => void
  onRunAll: () => void
  disabled?: boolean
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  saveLoading,
  runAllLoading,
  onSaveNoRun,
  onRunAll,
  disabled,
}) => {
  return (
    <>
      <Button onClick={onSaveNoRun} loading={saveLoading} disabled={disabled || saveLoading || runAllLoading}>
        {STRINGS.SAVE_NO_RUN_BUTTON}
      </Button>
      <Button
        type="primary"
        onClick={onRunAll}
        variant="alice"
        style={{ height: FOOTER_CONSTANTS.UI.BUTTON_HEIGHT }}
        loading={runAllLoading}
        disabled={disabled || saveLoading || runAllLoading}
      >
        {STRINGS.RUN_ALL_BUTTON}
      </Button>
    </>
  )
}
