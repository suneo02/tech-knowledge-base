import { t } from 'gel-util/intl'
import React from 'react'
import FileTable from './FileTable'
import styles from './index.module.less'

export interface MyFileProps {
  name?: string
}

const PREFIX = 'my-file'

const STRINGS = {
  TITLE: t('464132', '我的下载'),
}
export const MyFile: React.FC<MyFileProps> = (props) => {
  const { name } = props || {}
  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div className={styles[`${PREFIX}-title`]}>
        {STRINGS.TITLE} {name || ''}
      </div>
      <div className={styles[`${PREFIX}-content`]}>
        <FileTable folderId="123" />
      </div>
    </div>
  )
}
