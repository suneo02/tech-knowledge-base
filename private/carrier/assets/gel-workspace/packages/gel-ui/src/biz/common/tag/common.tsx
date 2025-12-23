import { BidNoticeHold, TenderNoticeHold } from 'gel-types'
import { TagsModule } from 'gel-util/biz'
import { bidType2Stage } from 'gel-util/misc'
import { CSSProperties, FC } from 'react'
import { TagWithModule, TagWithModuleProps } from './TagWithModule'

const tagStyleDefault = { margin: 0, marginInlineStart: 6 }

export const ActCtrlTag: FC<{
  ctrlType: 'actual' | 'uncertain'
  styles?: CSSProperties
  intl: (key: string, defaultValue: string) => string
}> = ({ ctrlType, styles = tagStyleDefault, intl }) => {
  return (
    <TagWithModule module={TagsModule.ACTUAL_CONTROLLER} styles={styles} intl={intl}>
      {ctrlType == 'actual'
        ? intl
          ? intl('13270', '实际控制人')
          : '实际控制人'
        : intl
          ? intl('261456', '疑似实控人')
          : '疑似实控人'}
    </TagWithModule>
  )
}

export const BeneficiaryTag: FC<{ styles?: CSSProperties; intl: (key: string, defaultValue: string) => string }> = ({
  styles = tagStyleDefault,
  intl,
}) => {
  return <TagWithModule module={TagsModule.ULTIMATE_BENEFICIARY} styles={styles} intl={intl} />
}

export const ChangeNameTag: FC<{ styles?: CSSProperties; intl: (key: string, defaultValue: string) => string }> = ({
  styles = tagStyleDefault,
  intl,
}) => {
  return <TagWithModule module={TagsModule.IS_CHANGE_NAME} styles={styles} intl={intl} />
}
/**
 * 一致行动人
 * @param param0
 * @returns
 */
export const ActualControllerGroupTag: FC<{
  styles?: CSSProperties
  num?: number
  intl: (key: string, defaultValue: string) => string
}> = ({ styles = tagStyleDefault, num, intl }) => {
  return (
    <TagWithModule module={TagsModule.ACTUAL_CONTROLLER_GROUP} styles={styles} intl={intl}>
      {intl ? intl('417210', '一致行动人') : '一致行动人'}
      {num ? num : null}
    </TagWithModule>
  )
}

export const RelatedPartyTag: FC<{
  styles?: CSSProperties
  num?: number
  intl: (key: string, defaultValue: string) => string
}> = ({ styles = tagStyleDefault, num, intl }) => {
  return (
    <TagWithModule module={TagsModule.RELATED_PARTY} styles={styles} intl={intl}>
      {intl ? intl('419963', '关联方/一致行动人') : '关联方/一致行动人'}
      {num ? num : null}
    </TagWithModule>
  )
}

/**
 * 招投标-招标类型
 */
export const BidTypeTag: FC<
  { bidType: string; intl: (key: string, defaultValue: string) => string } & Omit<TagWithModuleProps, 'module'>
> = ({ bidType, intl, ...props }) => {
  return (
    <TagWithModule module={TagsModule.BID_TYPE} value={bidType} intl={intl} {...props}>
      {bidType ? `${bidType}${bidType2Stage(bidType)}` : `--`}
    </TagWithModule>
  )
}

/**
 * 招投标 中标 未中标 tag
 *
 * 如果公告类型为结果阶段的公告（包括废标流标、中标、成交、竞价结果、开标公告、合同及验收），则需要在投标单位列进行打标
 */
export const TenderWinnerTag: FC<{
  styles?: CSSProperties
  unit: BidNoticeHold['tenderUnits'][number]
  projectStage: TenderNoticeHold['project_stage']
  intl: (key: string, defaultValue: string) => string
}> = ({ styles = tagStyleDefault, unit, projectStage, intl }) => {
  if (projectStage === '结果阶段') {
    let module: TagsModule
    if (unit.roleName === '中标') {
      module = TagsModule.TENDER_WINNER
    } else {
      module = TagsModule.TENDER_LOSER
    }
    return <TagWithModule module={module} styles={styles} intl={intl} />
  }
  return null
}
