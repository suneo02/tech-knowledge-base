import React from 'react'
import { Button, Divider } from '@wind/wind-ui'
import { HomeO } from '@wind/icons'
import styles from './index.module.less'
import { t } from 'gel-util/intl'

interface ProspectHeaderProps {
  onBack: () => void
}

export const ProspectHeader: React.FC<ProspectHeaderProps> = ({ onBack }) => {
  const STRINGS = {
    TITLE: t('481526', '正在挖掘客户...'),
    BACK: t('273158', '返回首页'),
  } as const
  return (
    <div className={styles[`${'prospect'}-title`]}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button icon={<HomeO />} onClick={onBack} size="small">
          {STRINGS.BACK}
        </Button>
        <Divider type="vertical" />
        <h2 style={{ margin: 0 }}>{STRINGS.TITLE}</h2>
      </div>
    </div>
  )
}
