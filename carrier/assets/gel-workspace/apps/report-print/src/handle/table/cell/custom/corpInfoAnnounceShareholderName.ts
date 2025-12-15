import { createTag } from '@/comp/misc/Tag'
import { safeToStringRender } from '@/handle/table/cell/shared'
import { t } from '@/utils/lang'
import { getTagPropsByModule } from 'report-util/misc'
import styles from './shareholderName.module.less'

/**
 * 工商信息的股东信息
 * @param _txt
 * @param record
 * @param config
 * @returns
 */
export const corpInfoAnouncementShareholderNameRender = (txt: any, record: any) => {
  const $element = $('<div>').addClass(styles['corp-info-shareholder-name'])
  $element.append($('<span>').text(safeToStringRender(txt)))
  if (record.benifciary) {
    $element.append(
      createTag({
        text: t('138180', '最终受益人'),
        ...getTagPropsByModule('ultimateBeneficiary'),
      })
    )
  }
  if (record.act_ctrl) {
    let text = record.source === 'A0774' ? t('419991', '实际控制人') : t('261456', '疑似实控人')
    $element.append(
      createTag({
        text,
        ...getTagPropsByModule('actualController'),
      })
    )
  }
  if (record.nameChanged) {
    $element.append(
      createTag({
        text: t('349497', '已更名'),
        ...getTagPropsByModule('isChangeName'),
      })
    )
  }
  if (record.actor?.length) {
    record.actor.forEach(() => {
      $element.append(
        createTag({
          text: t('419963', '关联方/一致行动人'),
          ...getTagPropsByModule('relatedParties'),
        })
      )
    })
  }
  return $element
}
