import { CorpArea } from '@/handle/corp/corpArea'
import { corpDetailHisEquityPledge } from '@/handle/corpModuleCfg'
import { CorpMenuModuleCfg } from '@/types/corpDetail'
import intl from '@/utils/intl'
import { isEn } from 'gel-util/intl'

/**
 * 创建历史数据菜单配置
 * 根据企业地区直接生成正确的配置
 *
 * @param corpArea 企业所属地区
 * @returns 历史数据菜单配置
 */
export function createHistoryMenuConfig(corpArea: CorpArea): CorpMenuModuleCfg {
  // 英国、新西兰：直接生成"主要人员"标签
  const isEnglandOrNzl = corpArea === 'england' || corpArea === 'nzl'
  const legalPersonLabel = isEnglandOrNzl ? intl('138503', ' 主要人员 ') : intl('138370', '法人和高管')

  // 只有日本和卢森堡地区才显示"变更历史"
  const showHistoryChange = corpArea === 'japan' || corpArea === 'lux'

  // 基础菜单项
  const children: CorpMenuModuleCfg['children'] = [
    {
      showModule: 'historycompany',
      showName: intl('257705', '工商信息'),
      countKey: 'his_business_info_num',
    },
  ]

  // 如果是日本或卢森堡，添加"变更历史"
  if (showHistoryChange) {
    children.push({
      showModule: 'showHistoryChange',
      showName: isEn() ? 'History Changes' : '变更历史',
      countKey: 'changeHistoryCount',
    })
  }

  // 添加其他菜单项
  children.push(
    {
      showModule: 'historyshareholder',
      showName: intl('138506', '股东信息'),
      countKey: 'his_shareholder_num',
    },
    {
      showModule: 'historylegalperson',
      showName: legalPersonLabel, // 根据地区使用正确的标签
      countKey: 'his_manager_num',
    },
    {
      showModule: 'historyinvest',
      showName: intl('138724', '对外投资'),
      countKey: 'his_invest_num',
    },
    {
      showModule: 'historydomainname',
      showName: intl('138804', '网站备案'),
      countKey: 'his_domain_num',
    },
    {
      showModule: 'historyshowPledgedstock',
      showName: intl('138281', '股权出质'),
      countKey: corpDetailHisEquityPledge.modelNum,
    },
    {
      showModule: 'getlandmortgage',
      showName: intl('205406', '土地抵押'),
      countKey: 'landmortgage_num',
    },
    {
      showModule: 'getmultiplecertificate',
      showName: intl('145871', '多证合一'),
      countKey: 'company_certificate_num',
    },
    {
      showModule: 'getvoidagestatement',
      showName: intl('145865', '作废声明'),
      countKey: 'license_abolish_num',
    },
    {
      showModule: 'beneficiary',
      showName: intl('439434', '历史最终受益人'),
      countKey: 'historicalbeneficiaryCount',
    },
    {
      showModule: 'ultimatecontroller',
      showName: intl('439454', '历史实际控制人'),
      countKey: 'historicalcontrollerCount',
    },
    {
      showModule: 'historypatent',
      showName: intl('390634', '历史专利'),
      countKey: 'hisPatentNum',
    }
  )

  return {
    title: intl('33638', '历史数据'),
    children,
  }
}
