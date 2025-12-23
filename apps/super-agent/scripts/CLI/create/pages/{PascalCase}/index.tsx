import React from 'react'
import styles from './index.module.less'
import { t } from 'gel-util/locales'
import { Button, Card } from '@wind/wind-ui'
import { MOCK_CONTENT, MOCK_COLUMNS, MOCK_DATA } from '@/mock/constant'
import { SmartTable } from 'gel-ui'

export interface {PascalCase}Props {
  name?: string
}

const PREFIX = '{kebab-case}'

const STRINGS = {
  TITLE: t('', '{PascalCase}'),
  BUTTON: t('', 'Click'),
}
export const {PascalCase}: React.FC<{PascalCase}Props> = (props) => {
  const { name } = props || {}
  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div className={styles[`${PREFIX}-title`]}>
        {STRINGS.TITLE} {name || ''}
      </div>
      <div className={styles[`${PREFIX}-content`]}>
        <Card bordered title={STRINGS.TITLE}>
          {MOCK_CONTENT}
        </Card>
        <div className={styles[`${PREFIX}-content-item`]}>{MOCK_CONTENT}</div>
        {/* <Table columns={MOCK_COLUMNS} dataSource={MOCK_DATA} /> */}
        <SmartTable columns={MOCK_COLUMNS} dataSource={MOCK_DATA} vip={['SVIP']} />
      </div>
      <Button className={styles[`${PREFIX}-button`]}>{STRINGS.BUTTON}</Button>
    </div>
  )
}
