import React from 'react'
import { FormInstance } from 'antd'
import styles from './index.module.less'
import { CreditsDisplay } from './components/CreditsDisplay'
import { ActionButtons } from './components/ActionButtons'
import { useFooterLogic } from './hooks/useFooterLogic'
import { useSuperChatRoomContext } from '@/contexts/SuperChat'

const PREFIX = 'generate-ai-column-home-footer'

interface FooterProps {
  credits: number
  form: FormInstance
  columns: { value: string; label: string; field: string }[]
  onClose: () => void
  updateChecked: (checked: boolean) => void
  checked: boolean
}

const Footer: React.FC<FooterProps> = ({ credits, form, columns, onClose, updateChecked, checked }) => {
  const { sheetRefs, activeSheetId } = useSuperChatRoomContext()

  const { saveLoading, runAllLoading, displayCredits, handleSaveNoRun, handleRunAll } = useFooterLogic({
    credits,
    form,
    columns,
    onClose,
    updateChecked,
    checked,
  })

  return (
    <div className={styles[`${PREFIX}`]}>
      <CreditsDisplay
        credits={credits}
        recordsCount={sheetRefs?.[activeSheetId]?.recordsCount ?? 0}
        displayCredits={displayCredits}
      />
      <ActionButtons
        saveLoading={saveLoading}
        runAllLoading={runAllLoading}
        onSaveNoRun={handleSaveNoRun}
        onRunAll={handleRunAll}
      />
    </div>
  )
}

export default Footer
