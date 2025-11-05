import { ICorpSubModuleVipCfg } from '@/components/company/type'
import { InfoCircleButton } from '@/components/icons/InfoCircle'
import { intlNoNO as intl } from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { Tooltip } from '@wind/wind-ui'
import React from 'react'
import { vipDescDefault } from '../common/vipDesc'

export const corpAdminLicenseChina: ICorpSubModuleVipCfg = {
  cmd: '/detail/company/getadminilicence',
  moreLink: 'getpermission02',
  title: intl('222481', '行政许可[信用中国]'),
  modelNum: 'admin_licence_num',
  thWidthRadio: ['5.2%', '30%', '12%', '20%', '28%', '6%'],
  notVipTitle: intl('222481', '行政许可[信用中国]'),
  notVipTips: vipDescDefault,
  thName: [
    intl('28846', '序号'),
    intl('222783', '许可证名称'),
    intl('222771', '许可决定日期'),
    intl('21235', '有效期'),
    intl('216395', '发证机关'),
    intl('36348', '操作'),
  ],
  align: [1, 0, 0, 0, 0, 0],
  fields: ['NO.', 'docName', 'licenceDate|formatTime', 'startDate', 'orgName', ''],
  notVipPageTurning: true,
  notVipPageTitle: intl('222481', '行政许可[信用中国]'),
  notVipPagedesc: '购买VIP/SVIP套餐，即可不限次查看企业行政许可信息',
  columns: [
    null,
    {
      title: (
        <span>
          {intl('222783', '许可证名称')}

          {
            <Tooltip
              overlayClassName="corp-tooltip"
              title={intl('353936', '如无许可证名称，则展示行政许可决定文书名称。')}
            >
              <InfoCircleButton />
            </Tooltip>
          }
        </span>
      ),
      render: (txt) => {
        return wftCommon.formatCont(txt)
      },
    },
    null,
    {
      render: (_txt, row) => {
        if (row.endDate == '9999/12/31' || row.endDate == '99991231') {
          return intl('40768', '长期')
        }
        const start = wftCommon.formatTime(row['startDate'])
        const end = wftCommon.formatTime(row['endDate'])
        return start + intl('271245', ' 至 ') + end
      },
    },
    null,
  ],
  extraParams: (param) => {
    param.__primaryKey = param.companycode
    return param
  },
  dataCallback: (res, _num, pageno) => {
    res.map((t, idx) => {
      t.key = t.key ? t.key : idx + pageno * 10
    })
    return res
  },
}
