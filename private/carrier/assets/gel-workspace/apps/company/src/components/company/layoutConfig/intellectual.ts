import { CorpMenuModuleCfg } from '@/types/corpDetail'
import intl from '@/utils/intl'

export const corpDetailIntellectualMenu: CorpMenuModuleCfg = {
  title: intl('120665', '知识产权'),
  children: [
    {
      countKey: 'technologicalInnovationCount',
      showModule: 'gettechscore',
      showName: intl('451195', '科创分'),
      hideMenuNum: true,
    },
    {
      countKey: true,
      showModule: 'getbrand',
      showName: intl('138799', '商标'),
    },
    {
      countKey: true,
      showModule: 'getpatent',
      showName: intl('124585', '专利'),
    },
    {
      countKey: 'ic_layout_num',
      showModule: 'getIntegratedCircuitLayout',
      showName: intl('452482', '集成电路布图'),
    },
    {
      countKey: 'workcopyr_num',
      showModule: 'getproductioncopyright',
      showName: intl('138756', '作品著作权'),
    },
    {
      countKey: 'softwarecopyright_num',
      showModule: 'getsoftwarecopyright',
      showName: intl('138788', '软件著作权'),
    },
    {
      countKey: 'standardInfo',
      showModule: 'getStandardPlan',
      showName: intl('326113', '标准信息'),
    },
    {
      countKey: 'domain_num',
      showModule: 'getdomainname',
      showName: intl('138804', '网站备案'),
    },
    {
      countKey: 'webchat_public_num',
      showModule: 'getweixin',
      showName: intl('138581', '微信公众号'),
    },
    {
      countKey: 'micro_blog_num',
      showModule: 'getweibo',
      showName: intl('138579', '微博账号'),
    },
    {
      countKey: 'today_headline_num',
      showModule: 'gettoutiao',
      showName: intl('138559', '头条号'),
    },
  ],
}
