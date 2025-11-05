/**
 * JQuery转换小工具，开发完成即可删除
 * Created by Calvin
 *
 * @format
 */

import { useEffect } from 'react'

const intl = (res) => {
  return res
}

export const Transform = () => {
  const list = {
    showList: [
      'showCompanyInfo',
      'showIndustry',
      'showActualController',
      'showShareholder',
      'showShareSearch',
      'getShareAndInvest',
      'showshareholderchange',
      //   "getrelation",
      'showCompanyBranchInfo',
      'showControllerCompany',
      'showDirectInvestment',
      'showFinalBeneficiary',
      'showMainMemberInfo',
      'showCoreTeam',
      'showGroupSystem',
      'showHeadOffice',
      'getcomparable',
      'showCompanyChange',
      'gettaxpayer',
      'showCompanyNotice',
      'showYearReport',
    ],
    showName: [
      intl('138588', ' 工商信息 '),
      intl('449235', '所属行业/产业'), // TODO 国际化
      intl('13270', '实际控制人'),
      intl('138506', ' 股东信息 '),
      intl('228894', ' 股东穿透 '),
      intl('138279', ' 股权穿透图 '),
      intl('451218', ' 股东变更 '),
      intl('138183', ' 分支机构 '),
      intl('451208', ' 控股企业 '),
      intl('138724', ' 对外投资 '),
      intl('138180', ' 最终受益人 '),
      intl('138503', ' 主要人员 '),
      intl('204943', ' 核心团队'),
      intl('148622', ' 集团系 '),
      intl('204942', ' 总公司 '),
      intl('138219', ' 竞争对手 '),
      intl('451225', ' 工商变更 '),
      intl('222479', '纳税人信息'),
      intl('222474', '企业公示'),
      intl('138149', ' 企业年报 '),
    ],
    numArr: [
      true,
      'act_controller_num', //   'actualcontrollerPublishCount|actualcontrollerCalcCount',
      true,
      true,
      true,
      'shareholder_change_num',
      //   true,
      'new_branch_num',
      true,
      'foreign_invest_num',
      'beneficiary_num',
      'lastNotice|industrialRegist',
      'coreteam_num',
      'group_membercorp_num|group_main_num',
      'headerquarters_num',
      true,
      'change_record_num',
      'tax_payer_num',
      'shareholder_contribution_num|share_change_num',
      'annual_num',
    ],
  } //集团系,需要在下面进行处理}

  useEffect(() => {
    const arr = []
    Object.entries(list).map(([key, value]) => {
      console.log(key, value)
      for (let index = 0; index < value.length; index++) {
        if (key === 'showName') {
        }
        if (arr[index]) {
          arr[index][key] = value[index]
        } else {
          const data = {
            [key]: value[index],
          }
          console.log(key, index)
          arr.push(data)
        }
      }
    })
    console.log(JSON.stringify(arr))
  }, [])

  return <div></div>
}
