import { CorpSubModuleVipCfg } from '@/types/corpDetail'
import { intlNoNO as intl } from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { vipDescDefault } from '../common/vipDesc'

export const corpAdminLicenseBureau: CorpSubModuleVipCfg = {
  cmd: '/detail/company/getpermissionnew',
  moreLink: 'getpermissionnew',
  title: intl('222480', '行政许可[工商局]'), // 工商局
  modelNum: 'adminLicenceCount',
  thWidthRadio: ['5.2%', '30%', '19%', '22%', '15%', '30%'],
  notVipTitle: intl('222480', '行政许可[工商局]'),
  notVipTips: vipDescDefault,
  thName: [
    intl('28846', '序号'),
    intl('138376', '许可文件编号'),
    intl('138375', '许可文件名称'),
    intl('21235', '有效期'),
    intl('216395', '发证机关'),
    intl('138378', '许可内容'),
  ],
  align: [1, 0, 0, 0, 0],
  fields: [
    'NO.',
    'permissionFileNumber|formatCont',
    'permissionFileName|formatCont',
    'effectiveStartDate',
    'licenseDepartment|formatCont',
    'licenseContent|formatCont',
  ],
  notVipPageTurning: true,
  notVipPageTitle: intl('222480', '行政许可[工商局]'),
  notVipPagedesc: '购买VIP/SVIP套餐，即可不限次查看企业行政许可信息',
  columns: [
    null,
    null,
    null,
    {
      render: (_txt, row) => {
        if (row.effectiveExpirationDate == '9999/12/31' || row.effectiveExpirationDate == '99991231') {
          return intl('40768', '长期')
        }
        const start = wftCommon.formatTime(row['effectiveStartDate'])
        const end = wftCommon.formatTime(row['effectiveExpirationDate'])
        return start + intl('271245', ' 至 ') + end
      },
    },
    null,
  ],
  extraParams: (param) => {
    param.__primaryKey = param.companycode
    return param
  },
}
