import { AIIcon, CompanyIcon } from '@/assets/icon'
import { Tag } from '@wind/wind-ui'
import { SourceTypeEnum } from 'gel-api'
import { ReactNode } from 'react'

interface SourceTagProps {
  sourceType?: SourceTypeEnum
}

export const SourceTag = ({ sourceType }: SourceTagProps): ReactNode => {
  // @ts-expect-error wind-ui tag 类型错误
  if (!sourceType) return <Tag color="default">未知来源</Tag>

  switch (sourceType) {
    case SourceTypeEnum.CDE:
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <CompanyIcon style={{ width: 16, height: 16 }} />
          <span style={{ fontWeight: '400' }}>找企业</span>
        </div>
      )
    case SourceTypeEnum.AI_GENERATE_COLUMN:
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <AIIcon style={{ width: 16, height: 16 }} />
          <span style={{ fontWeight: '400' }}>生成列</span>
        </div>
      )
    case SourceTypeEnum.INDICATOR:
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <CompanyIcon style={{ width: 16, height: 16 }} />
          <span style={{ fontWeight: '400' }}>找企业</span>
        </div>
      )
    case SourceTypeEnum.UPLOAD_FILE:
      // @ts-expect-error wind-ui tag 类型错误
      return <Tag color="orange">上传文件</Tag>
    case SourceTypeEnum.AI_CHAT:
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <AIIcon style={{ width: 16, height: 16 }} />
          <span style={{ fontWeight: '400' }}>Chat</span>
        </div>
      )
    default:
      // @ts-expect-error wind-ui tag 类型错误
      return <Tag color="default">未知来源</Tag>
  }
}
