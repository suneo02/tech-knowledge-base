import Markdown from '@/components/markdown'
import { Button, Divider, Tag } from '@wind/wind-ui'
import { ColumnDataTypeEnum, DPUItem, GetSourceDetailResponse, RAGItem, SourceTypeEnum } from 'gel-api'
import { t } from 'gel-util/intl'
import { ResearchSteps } from './ResearchSteps'
// import Section from './Section'
import { axiosInstance } from '@/api/axios'
import { entWebAxiosInstance } from '@/api/entWeb'
import { AICopyButton, AIDislikeButton, AILikeButton } from 'gel-ui'
import DataSourceSection from './DataSourceSection'
import PromptSection from './PromptSection'
import { SourceTag } from './SourceTag'
import SuggestSection from './SuggestSection'
import styles from './notificationDescription.module.less'

interface NotificationDescriptionProps {
  sourceType: SourceTypeEnum
  value?: string
  sourceId?: string
  isLoading?: boolean
  sourceDetail?: string
  progressSteps?: string[]
  columnDataType?: ColumnDataTypeEnum
  info?: GetSourceDetailResponse
  onModalOpen?: () => void
  onModalClose?: () => void
}

const PREFIX = 'notification-description'
const STRINGS = {
  AI_TIPS: t('464117', '内容由AI生成，请注意识别'),
  DATA_SOURCE: t('464158', '数据来源：'),
  GETTING_DATA_SOURCE: t('464165', '正在获取数据来源...'),
  NO_DATA_SOURCE: t('464150', '无数据来源'),
  AI_TIPS_COPY: t('453642', '内容由AI生成，请核查重要信息'),
  PROMPT: t('464143', '提示词'),
  STEPS: t('464191', '研究步骤'),
  REFERENCES: t('464121', '参考资料'),
}

// 已拆分为独立组件 SuggestSection

const AIColumnContent = ({
  sourceType,
  sourceDetail,
  info,
  progressSteps,
  onModalOpen,
  onModalClose,
}: NotificationDescriptionProps) => {
  const hasSteps = !!(progressSteps && progressSteps.length)
  const hasRefs = !!((info?.ragList && info.ragList.length) || (info?.dpuList && info.dpuList.length))
  const hasPrompt = !!sourceDetail

  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div style={{ marginBlockEnd: 12 }}>
        <div style={{ width: '100%' }}>
          {info?.answer ? <Markdown content={info.answer} /> : null}

          {info?.answer && (
            <div>
              <div
                style={{
                  marginBlockStart: 8,
                  color: 'var(--basic-8)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <AICopyButton axiosEntWeb={entWebAxiosInstance} content={info?.answer} isBury />
                <AILikeButton
                  axiosEntWeb={entWebAxiosInstance}
                  content={info?.answer}
                  question={info?.question || ''}
                  isBury
                />
                <AIDislikeButton
                  axiosChat={axiosInstance}
                  axiosEntWeb={entWebAxiosInstance}
                  content={info?.answer}
                  question={info?.question || ''}
                  // questionID={info?.questionID || ''}  等待坤元提供参数
                  isBury
                  source="SuperAI"
                />
                {/* <Button
                  // @ts-expect-error wind-icon
                  icon={<CopyIcon />}
                  type="text"
                  onClick={() => copyTextAndMessage(`${info?.answer}\n\n${STRINGS.AI_TIPS_COPY}`)}
                ></Button> */}
              </div>
              <Divider dashed style={{ marginBlockStart: 12, marginBlockEnd: 0 }} />
            </div>
          )}
        </div>

        <DataSourceSection
          leftContent={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h4 style={{ color: '#999', margin: 0 }}>{STRINGS.DATA_SOURCE}</h4>

              <div style={{ marginInlineEnd: 12 }}>
                <SourceTag sourceType={sourceType} />
              </div>

              {hasSteps && <Tag size="small">{STRINGS.STEPS}</Tag>}
              {hasRefs && <Tag size="small">{STRINGS.REFERENCES}</Tag>}
              {hasPrompt && <Tag size="small">{STRINGS.PROMPT}</Tag>}
            </div>
          }
        >
          <div style={{ marginBlockStart: 4 }}>
            {hasSteps && <ResearchSteps steps={progressSteps || []} />}

            {hasRefs && (
              <SuggestSection
                ragList={(info?.ragList || []) as RAGItem[]}
                dpuList={(info?.dpuList || []) as DPUItem[]}
                onModalClose={() => {
                  console.log('AIColumnContent：onModalClose')
                  onModalClose?.()
                }}
                onModalOpen={() => {
                  console.log('AIColumnContent：onModalOpen')
                  onModalOpen?.()
                }}
                defaultExpanded
              />
            )}

            {hasPrompt && <PromptSection content={sourceDetail || STRINGS.NO_DATA_SOURCE} defaultExpanded />}
          </div>
        </DataSourceSection>
      </div>
    </div>
  )
}

export const NotificationDescription = (props: NotificationDescriptionProps) => {
  const { sourceType, value, sourceId, sourceDetail, columnDataType } = props || {}
  if (sourceType === SourceTypeEnum.AI_GENERATE_COLUMN) {
    return <AIColumnContent {...props} />
  }
  return (
    <div className={styles[`${PREFIX}-container`]}>
      <div style={{ marginBlockEnd: 12 }}>
        <>
          {columnDataType === ColumnDataTypeEnum.WEB && value && value !== '--' ? (
            <Button
              type="link"
              onClick={() => window.open(`http://${value}`, '_blank')}
              style={{ paddingInlineStart: 0 }}
            >
              {value}
            </Button>
          ) : (
            value && <Markdown content={value} />
          )}
          {/* 产品说：数据来源暂时去除 */}
          {/* <Divider dashed style={{ marginBlockStart: 12, marginBlockEnd: 12 }} /> */}
        </>
        {/* 产品说：数据来源暂时去除 */}
        {/* <DataSourceSection
          leftContent={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h4 style={{ color: '#999' }}>{STRINGS.DATA_SOURCE}</h4>
              <SourceTag sourceType={sourceType} />
            </div>
          }
        >
          {!sourceId ? (
            <div style={{ border: '1px solid #ddd', borderRadius: 4, padding: 12, color: '#ddd' }}>
              {STRINGS.GETTING_DATA_SOURCE}
            </div>
          ) : (
            <div style={{ border: '1px solid #ddd', borderRadius: 4, padding: '4px 12px', color: 'var(--basic-8)' }}>
              <p>{sourceDetail || STRINGS.NO_DATA_SOURCE}</p>
            </div>
          )}
        </DataSourceSection> */}
      </div>
    </div>
  )
}
