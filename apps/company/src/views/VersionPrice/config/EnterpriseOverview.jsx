import {
  VIPFirstPageOnly,
  VIPFunctionOn,
  VIPHundredCorpDay,
  VIPFiveHundredCorpDay,
  VIPTwoThousandCorpDay,
  VIPLimitedTime,
  generateVIPFuncCfg,
} from './basic'
import intl from '../../../utils/intl'

export const VIPEnterpriseOverviewCfg = [
  {
    function: {
      title: '基础信息',
      langKey: '134852',
    },
    ...generateVIPFuncCfg({
      free: VIPHundredCorpDay,
      vip: VIPFiveHundredCorpDay,
      svip: VIPTwoThousandCorpDay,
    }),
  },
  {
    function: {
      title: '业务数据',
      langKey: '64824',
    },
    ...generateVIPFuncCfg({
      free: VIPFirstPageOnly,
      vip: VIPFunctionOn,
    }),
  },
  {
    function: {
      title: '金融行为',
      langKey: '261899',
    },
    ...generateVIPFuncCfg({
      vip: VIPLimitedTime,
    }),
  },
  {
    function: {
      title: '经营信息',
      langKey: '451255',
    },
    ...generateVIPFuncCfg({
      free: VIPFirstPageOnly,
      vip: VIPFunctionOn,
    }),
  },
  {
    function: {
      title: '招投标',
      langKey: '271633',
    },
    ...generateVIPFuncCfg({
      free: VIPFirstPageOnly,
    }),
  },
  {
    function: {
      title: '资质荣誉',
      langKey: '284064',
    },
    ...generateVIPFuncCfg({
      vip: VIPLimitedTime,
    }),
  },
  {
    function: {
      title: '知识产权',
      langKey: '120665',
    },
    ...generateVIPFuncCfg({
      free: VIPFirstPageOnly,
    }),
  },
  {
    function: {
      title: '司法风险',
      langKey: '228331',
    },
    ...generateVIPFuncCfg({
      free: VIPFirstPageOnly,
    }),
  },
  {
    function: {
      title: '经营风险',
      langKey: '138415',
    },
    ...generateVIPFuncCfg({
      vip: VIPLimitedTime,
    }),
  },
  {
    function: {
      title: '历史数据',
      langKey: '33638',
    },
    ...generateVIPFuncCfg({
      vip: VIPFunctionOn,
    }),
  },
  {
    function: {
      title: '企业动态',
      langKey: '248131',
    },
    ...generateVIPFuncCfg({
      free: VIPLimitedTime,
      vip: VIPFunctionOn,
    }),
  },
  {
    other: {
      type: 'HKInfoQuery',
      title: (
        <>
          <div className="default">{intl('424953', '按次收费，提供部分国家深度数据的代查服务')} </div>
          <span className="link">{intl('424973', '点击查看详情')}</span>
        </>
      ),
      langKey: '',
    },
    function: {
      title: '企业深度信息',
      langKey: '437138',
    },
  },
]
