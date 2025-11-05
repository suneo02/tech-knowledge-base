import Markdown from '@/components/markdown'
import { CopyOutlined } from '@ant-design/icons'
import { Divider } from '@wind/wind-ui'
import { copyTextAndMessage } from 'ai-ui'
import { SourceTypeEnum } from 'gel-api'
import { ResearchSteps } from './ResearchSteps'
import { SourceTag } from './SourceTag'

interface NotificationDescriptionProps {
  sourceType: SourceTypeEnum
  value?: string
  sourceId?: string
  isLoading?: boolean
  sourceDetail?: string
  progressSteps?: string[]
}

export const NotificationDescription = ({
  sourceType,
  value,
  sourceId,
  isLoading,
  sourceDetail,
  progressSteps = [],
}: NotificationDescriptionProps) => {
  return (
    <div style={{ overflow: 'auto', maxHeight: '80vh' }}>
      <div style={{ marginBlock: 12 }}>
        {sourceType === SourceTypeEnum.AI_GENERATE_COLUMN ? (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ width: '100%' }}>
              <div style={{ width: '100%' }}>{value ? <Markdown content={value} /> : ''}</div>
              {value && (
                <div
                  style={{
                    marginBlockStart: 8,
                    color: '#8E8E8E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  内容由AI生成，请注意识别
                  <CopyOutlined onClick={() => copyTextAndMessage(value)} />
                </div>
              )}
              <ResearchSteps steps={progressSteps} />
            </div>
          </div>
        ) : (
          <>
            {value && <Markdown content={value} />}
            <Divider dashed style={{ marginBlock: 12 }} />
          </>
        )}

        <div
          style={{
            width: '100%',
            marginBlock: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h4 style={{ color: '#999' }}>数据来源：</h4>
            <SourceTag sourceType={sourceType} />
          </div>
        </div>
        {!sourceId ? (
          <div style={{ border: '1px solid #ddd', borderRadius: 4, padding: 12, color: '#ddd' }}>
            正在获取数据来源...
          </div>
        ) : sourceType !== SourceTypeEnum.AI_GENERATE_COLUMN ? (
          <div style={{ border: '1px solid #ddd', borderRadius: 4, padding: 12 }}>
            {isLoading ? (
              <div style={{ color: '#999' }}>正在获取详细信息...</div>
            ) : (
              <Markdown content={sourceDetail || '无数据来源'} />
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}
