import { Tag } from '@wind/wind-ui'
import { ConfigTableCellRenderConfig } from 'gel-types'
import { getTagPropsByModule } from 'report-util/misc'
import { safeToStringRender } from 'report-util/table'
import { TIntl } from 'report-util/types'
import styles from './shareholderName.module.less'

/**
 * 工商信息的 股东信息
 * @param _txt
 * @param _record
 * @param config
 * @returns
 */
export const corpInfoBussInfoShareholderNameRender = (
  t: TIntl,
  txt: any,
  record: any,
  config: ConfigTableCellRenderConfig
) => {
  return (
    <div className={styles['corp-info-shareholder-name']}>
      <span>{safeToStringRender(t, txt, config?.renderConfig)}</span>
      {record.benifciary && <Tag {...getTagPropsByModule('ultimateBeneficiary')}>{t('138180', '最终受益人')}</Tag>}
      {record.actContrl && (
        <Tag {...getTagPropsByModule('actualController')}>
          {record.source === 'publish' ? t('419991', '实际控制人') : t('261456', '疑似实控人')}
        </Tag>
      )}
      {record.nameChanged && <Tag {...getTagPropsByModule('isChangeName')}>{t('349497', '已更名')}</Tag>}
    </div>
  )
}
