import { BidNoticeHold, TenderNoticeHold } from 'gel-types'
import { t } from 'gel-util/intl'
import { TagsModule } from 'gel-util/misc'
import { CSSProperties, FC } from 'react'
import { TagWithModule } from './TagWithModule'

const tagStyleDefault = { margin: 0, marginInlineStart: 6 }

export const ActCtrlTag: FC<{ ctrlType: 'actual' | 'uncertain'; styles?: CSSProperties }> = ({
  ctrlType,
  styles = tagStyleDefault,
}) => {
  return (
    <TagWithModule module={TagsModule.ACTUAL_CONTROLLER} styles={styles}>
      {ctrlType == 'actual' ? t('13270', '实际控制人') : t('261456', '疑似实控人')}
    </TagWithModule>
  )
}

export const BeneficiaryTag: FC<{ styles?: CSSProperties }> = ({ styles = tagStyleDefault }) => {
  return <TagWithModule module={TagsModule.ULTIMATE_BENEFICIARY} styles={styles} />
}

export const ChangeNameTag: FC<{ styles?: CSSProperties }> = ({ styles = tagStyleDefault }) => {
  return <TagWithModule module={TagsModule.IS_CHANGE_NAME} styles={styles} />
}

export const RelatedPartyTag: FC<{ styles?: CSSProperties; num?: number }> = ({ styles = tagStyleDefault, num }) => {
  return (
    <TagWithModule module={TagsModule.RELATED_PARTY} styles={styles}>
      {t('419963', '关联方/一致行动人')}
      {num ? num : null}
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
}> = ({ styles = tagStyleDefault, unit, projectStage }) => {
  if (projectStage === '结果阶段') {
    let module: TagsModule
    if (unit.roleName === '中标') {
      module = TagsModule.TENDER_WINNER
    } else {
      module = TagsModule.TENDER_LOSER
    }
    return <TagWithModule module={module} styles={styles} />
  }
  return null
}
