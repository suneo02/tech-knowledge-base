/**
 * “多证合一”信息公示 - Combination of multiple certificates - 145871
 * Created by Calvin
 *
 * @format
 */

import { intlNoIndex } from '../../../../utils/intl'

const title = intlNoIndex('145871', '“多证合一”信息公示')
const toastTxt = intlNoIndex('348186')

export const combinationOfMultipleCertificates = {
  cmd: 'detail/company/getcompanycertificate_companyCertificate',
  title,
  moreLink: 'getmultiplecertificate',
  modelNum: 'company_certificate_num',
  thWidthRadio: ['4%', '27%', '69%'],
  thName: [intlNoIndex('138741', '序号'), intlNoIndex('145872', '备案事项名称'), intlNoIndex('203750', '备注')],
  align: [1, 0, 0],
  fields: ['NO.', 'item_name', 'remark'],
  rightLink: () =>
    window.en_access_config ? (
      <span
        style={{
          fontSize: '12px',
          fontWeight: 'normal',
          color: '#999',
          display: 'inline-block',
          width: '500px',
          marginTop: '-8px',
        }}
      >
        {toastTxt}
      </span>
    ) : (
      <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#999' }}>{toastTxt}</span>
    ),
}
