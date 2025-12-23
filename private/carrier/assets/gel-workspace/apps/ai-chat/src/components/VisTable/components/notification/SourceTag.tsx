import { AIIcon } from '@/assets/icon'
import { Tag } from '@wind/wind-ui'
import { SourceTypeEnum } from 'gel-api'
import { t } from 'gel-util/intl'
import { ReactNode } from 'react'

interface SourceTagProps {
  sourceType?: SourceTypeEnum
}

const STRINGS = {
  UNKNOWN_SOURCE: t('464178', '未知来源'),
  CDE: t('406815', 'Wind全球企业库'),
  AI_GENERATE_COLUMN: t('464190', '生成列'),
  INDICATOR: t('406815', 'Wind全球企业库'),
  UPLOAD_FILE: t('464096', '上传文件'),
  AI_CHAT: t('', 'Chat')
}
export const SourceTag = ({ sourceType }: SourceTagProps): ReactNode => {
  if (!sourceType) return <Tag color="default">{STRINGS.UNKNOWN_SOURCE}</Tag>

  switch (sourceType) {
    case SourceTypeEnum.CDE:
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* <CompanyIcon style={{ width: 16, height: 16 }} /> */}
          <span style={{ fontWeight: '400' }}>{STRINGS.CDE}</span>
        </div>
      )
    case SourceTypeEnum.AI_GENERATE_COLUMN:
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AIIcon style={{ width: 16, height: 16 }} />
          <span style={{ fontWeight: '400' }}>{STRINGS.AI_GENERATE_COLUMN}</span>
        </div>
      )
    case SourceTypeEnum.INDICATOR:
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* <CompanyIcon style={{ width: 16, height: 16 }} /> */}
          <span style={{ fontWeight: '400' }}>{STRINGS.INDICATOR}</span>
        </div>
      )
    case SourceTypeEnum.UPLOAD_FILE:
      return <Tag color="orange">{STRINGS.UPLOAD_FILE}</Tag>
    case SourceTypeEnum.AI_CHAT:
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AIIcon style={{ width: 16, height: 16 }} />
          <span style={{ fontWeight: '400' }}>{STRINGS.AI_CHAT}</span>
        </div>
      )
    default:
      return <Tag color="default">{STRINGS.UNKNOWN_SOURCE}</Tag>
  }
}
