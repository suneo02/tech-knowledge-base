import { getCorpModuleNum } from '@/handle/corp/basicNum/handle'
import { getCorpAreaByAreaCode } from '@/handle/corp/corpArea'
import { corpDetailShareholderCfg } from '@/handle/corpModuleCfg'
import { corpDetailMainMember } from '@/handle/corpModuleCfg/base/mainMember'
import { CorpBasicNumFront, CorpMenuModuleCfg } from '@/types/corpDetail'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { CorpBasicInfo } from 'gel-types'

/**
 * 创建工商信息/基础信息菜单（新格式）
 * 根据企业地区直接生成正确的配置
 *
 * @param corpBasicInfo 企业基本信息（可选，为空时使用默认配置）
 * @returns 工商信息菜单配置
 */
export function createOverviewMenu(
  corpBasicInfo?: CorpBasicInfo,
  basicNum?: Partial<CorpBasicNumFront>
): CorpMenuModuleCfg {
  const corpArea = getCorpAreaByAreaCode(corpBasicInfo?.areaCode)
  const isOverseas = !!corpArea

  // 海外企业显示"基本信息"，国内企业显示"工商信息"
  const firstMenuLabel = isOverseas ? intl('205468', '基本信息') : intl('138588', ' 工商信息 ')
  const includeHK = !!getCorpModuleNum('hkUnlisted', basicNum)

  const children: CorpMenuModuleCfg['children'] = [
    { countKey: true, showModule: 'showCompanyInfo', showName: firstMenuLabel },
  ]
  if (includeHK) {
    children.push({
      countKey: 'hkUnlisted',
      showModule: 'HKCorpInfo',
      showName: intl(414513, '公司资料'),
      hideMenuNum: true,
    })
  }
  children.push(
    {
      countKey: 'industryCount',
      showModule: 'showIndustry',
      showName: intl('449235', '所属行业/产业'),
      hideMenuNum: true,
    },
    {
      countKey: ['actualcontrollerPublishCount', 'actualcontrollerCalcCount'],
      showModule: 'showActualController',
      showName: intl('13270', '实际控制人'),
      hideMenuNum: true,
    },
    {
      countKey: corpDetailShareholderCfg.modelNum,
      showModule: 'showShareholder',
      showName: intl('138506', ' 股东信息 '),
      hideMenuNum: true,
    }
  )
  // 越南所属行业只有有值才展示，否则不展示为无数据节点
  if (getCorpModuleNum('vietnamCorpIndustryNum', basicNum)) {
    children.push({
      countKey: 'vietnamCorpIndustryNum',
      showModule: 'showVietnamIndustry',
      showName: intl('24413', '所属行业'),
    })
  }
  children.push(
    { countKey: true, showModule: 'showShareSearch', showName: intl('228894', ' 股东穿透 ') },
    { countKey: true, showModule: 'getShareAndInvest', showName: intl('138279', ' 股权穿透图 ') },
    { countKey: 'shareholder_change_num', showModule: 'showshareholderchange', showName: intl('451218', ' 股东变更 ') },
    { countKey: 'new_branch_num', showModule: 'showCompanyBranchInfo', showName: intl('138183', ' 分支机构 ') },
    {
      countKey: 'e_holdingEnterprise_count',
      showModule: 'showControllerCompany',
      showName: intl('451208', ' 控股企业 '),
      hideMenuNum: true,
    },
    { countKey: 'foreign_invest_num', showModule: 'showDirectInvestment', showName: intl('138724', ' 对外投资 ') },
    { countKey: 'structuralEntityCount', showModule: 'structuralEntities', showName: intl('410253', ' 结构性主体 ') },
    {
      countKey: ['beneficialOwner', 'beneficialNaturalPerson', 'beneficialInstitutions'],
      showModule: 'showFinalBeneficiary',
      showName: intl('138180', ' 最终受益人 '),
      hideMenuNum: true,
    },
    {
      countKey: corpDetailMainMember.modelNum,
      showModule: 'showMainMemberInfo',
      showName: intl('138503', ' 主要人员 '),
      hideMenuNum: true,
    }
  )

  if (!wftCommon.is_overseas_config) {
    children.push({ countKey: 'coreteam_num', showModule: 'showCoreTeam', showName: intl('204943', ' 核心团队') })
  }
  children.push(
    {
      countKey: ['group_main_num', 'group_membercorp_num'],
      showModule: 'showGroupSystem',
      showName: intl('148622', ' 集团系 '),
    },
    { countKey: 'headerquarters_num', showModule: 'showHeadOffice', showName: intl('204942', ' 总公司 ') },
    { countKey: 'competitor', showModule: 'getcomparable', showName: intl('138219', ' 竞争对手 ') },
    { countKey: 'change_record_num', showModule: 'showCompanyChange', showName: intl('451225', ' 工商变更 ') },
    { countKey: 'tax_payer_num', showModule: 'gettaxpayer', showName: intl('222479', '纳税人信息') },
    {
      countKey: ['share_change_num', 'shareholder_contribution_num'],
      showModule: 'showCompanyNotice',
      showName: intl('222474', '企业公示'),
    },
    { countKey: 'annual_num', showModule: 'showYearReport', showName: intl('138149', ' 企业年报 '), hideMenuNum: true }
  )

  return {
    title: intl('138663', '基础信息'),
    children,
  }
}
