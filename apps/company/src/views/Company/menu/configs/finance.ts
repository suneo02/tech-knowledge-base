import { corpDetailChattelMortgage } from '@/handle/corpModuleCfg'
import intl from '@/utils/intl'
import { ICorpMenuModuleCfgNew } from '../type'

export const corpDetailFinanceMenu: ICorpMenuModuleCfgNew = {
  title: intl('138296', '金融行为'),
  children: [
    {
      countKey: 'sharedstock_num_new',
      showModule: 'showShares',
      showName: intl('138791', '发行股票'),
    },
    {
      countKey: 'listedSubjectSharesCount',
      showModule: 'showSharesOther',
      showName: intl('138791', '发行股票'),
    },
    {
      countKey: 'declarcompany_num',
      showModule: 'showDeclarcompany',
      showName: intl('138590', '待上市信息'),
    },
    {
      countKey: 'sharedbonds_num',
      showModule: 'showBond',
      showName: intl('138664', '发行债券'),
    },
    {
      countKey: 'cbrcreditratingreport_num',
      showModule: 'showComBondRate',
      showName: intl('348181', '发债主体评级'),
    },
    {
      countKey: 'invest_orgs_num',
      showModule: 'showInvestmentAgency',
      showName: intl('138727', '投资机构'),
    },
    {
      countKey: 'invest_events_num',
      showModule: 'showInvestmentEvent',
      showName: intl('40559', '投资事件'),
    },
    {
      countKey: 'pevc_num_new',
      showModule: 'showPVEC',
      showName: intl('138924', 'PEVC融资'),
    },
    {
      countKey: 'pevcquit_num',
      showModule: 'pvecOut',
      showName: intl('437444', 'PEVC退出'),
    },
    {
      countKey: 'merge_num',
      showModule: 'showMerge',
      showName: intl('138381', '并购信息'),
    },
    {
      countKey: 'banktrust_num',
      showModule: 'showGrantcredit',
      showName: intl('138684', '银行授信'),
    },
    {
      countKey: 'companyabs_num',
      showModule: 'absinfo',
      showName: intl('138122', 'ABS信息'),
    },
    {
      countKey: 'chattle_financing_num',
      showModule: 'showChattleFinancing',
      showName: intl('243422', '动产融资'),
    },
    {
      countKey: corpDetailChattelMortgage.modelNum,
      showModule: 'showChattelmortgage',
      showName: intl('138207', '动产抵押'),
    },
    {
      countKey: 'insuranceNum',
      showModule: 'showInsurance',
      showName: intl('370002', '保险产品'),
    },
  ],
}
