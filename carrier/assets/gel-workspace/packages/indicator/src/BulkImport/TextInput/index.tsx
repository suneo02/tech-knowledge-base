import { intlForIndicator, toThousandSeparator } from '@/util'

import { Input, message } from '@wind/wind-ui'
import cn from 'classnames'
import { t } from 'gel-util/intl'
import { useState } from 'react'
import { ButtonGroup } from '../ButtonGroup'
import styles from './style.module.less'

const { TextArea } = Input

// Text Input Tab Component
interface TextInputTabProps {
  className?: string
  handleChange: (idList: string[], excelData?: any[]) => void
  onCancel: () => void
  matchCount: number
}

export function TextInputTab({ handleChange, matchCount, onCancel, className }: TextInputTabProps) {
  const [textAreaValue, setTextAreaValue] = useState('')
  const handleTextImport = () => {
    if (!textAreaValue || !textAreaValue.trim()) {
      handleChange([])
      return
    }

    const idList = textAreaValue.trim().split('\n').filter(Boolean)
    if (idList.length > matchCount) {
      message.error(intlForIndicator('140084', { matchCount: toThousandSeparator(matchCount) }, t))
      return
    }

    // For text input, we only pass the ID list without Excel data
    handleChange(idList)
  }

  return (
    <div className={cn(styles['text-input__container'], className)}>
      <div className={styles['text-input__intro']}>
        <p>{t('370240', '第一步：粘贴企业名称或统一社会信用代码进行查询。')}</p>
        {/* 此处手动替换 , matchCount 被 {} 包裹 */}
        <p>{t('', '第二步：每个企业的名称或统一社会信用代码为1行，单次粘贴的文本数量不超过2,000行。')}</p>

        <br />
      </div>
      <TextArea
        className={styles['text-input__text-area']}
        rows={4}
        placeholder={t('370260', '粘贴企业名称或统一社会信用代码进行查询')}
        onChange={(e) => setTextAreaValue(e.target.value)}
      />
      <ButtonGroup onCancel={onCancel} onSubmit={handleTextImport} submitDisabled={!textAreaValue} />
    </div>
  )
}
