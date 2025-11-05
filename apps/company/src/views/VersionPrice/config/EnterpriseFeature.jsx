import {
  VIPFirstPageOnly,
  VIPFunctionOff,
  VIPFunctionOn,
  VIPNotSupportExport,
  VIPSupportExport,
  generateVIPFuncCfg,
} from './basic'
import intl from '../../../utils/intl'

const cfg11 = {
  function: {
    title: '万寻地图',
    langKey: '422022',
  },
  ...generateVIPFuncCfg({
    free: VIPFunctionOff,
    vip: VIPFunctionOn,
  }),
}
const cfg12 = {
  function: {
    title: '重点园区',
    langKey: '294403',
  },
  ...generateVIPFuncCfg({
    free: VIPNotSupportExport,
    vip: VIPNotSupportExport,
    svip: {
      title: (
        <>
          <div> {intl('424954', '支持导出园区入驻企业')} </div>
          <span>{intl('424974', '每天5次，每次100条')} </span>
        </>
      ),
      langKey: '',
    },
  }),
}
const cfg1 = {
  function: {
    title: '新企发现',
    langKey: '235783',
  },
  ...generateVIPFuncCfg({
    free: VIPFunctionOff,
    vip: VIPFunctionOn,
  }),
}
const cfg2 = {
  function: {
    title: '战略性新兴产业',
    langKey: '361813',
  },
  ...generateVIPFuncCfg({
    free: VIPFirstPageOnly,
  }),
}
const cfg3 = {
  function: {
    title: '企业榜单名录',
    langKey: '259148',
  },
  ...generateVIPFuncCfg({
    free: VIPFirstPageOnly,
    vip: VIPFirstPageOnly,
    svip: {
      title: '每天10次，每次1,000条',
      langKey: '424975',
    },
  }),
}

const cfg31 = {
  function: {
    title: '资质大全',
    langKey: '364555',
  },
  ...generateVIPFuncCfg({
    free: VIPFirstPageOnly,
  }),
}

const cfg32 = {
  function: {
    title: '企业数据浏览器',
    langKey: '259750',
  },
  ...generateVIPFuncCfg({
    free: {
      title: (
        <>
          <div>{intl('424955', '筛选受限')}</div>
          <span>{intl('424956', '不支持导出')}</span>
        </>
      ),
    },
    vip: {
      title: (
        <>
          <div>{intl('424955', '筛选受限')}</div>
          <span>{intl('424956', '不支持导出')}</span>
        </>
      ),
    },
    svip: {
      title: (
        <>
          <div>{intl('424976', '筛选不受限')}</div>
          <span>{intl('424957', '每天导出5,000条')}</span>
        </>
      ),
    },
  }),
}

const cfg4 = {
  function: {
    title: '特色企业库：上市、发债',
    langKey: '391714',
  },
  ...generateVIPFuncCfg({
    free: VIPFirstPageOnly,
  }),
}
const cfg5 = {
  function: {
    title: '特色企业库：金融机构',
    langKey: '391715',
  },
  ...generateVIPFuncCfg({
    free: VIPFirstPageOnly,
  }),
}
const cfg6 = {
  function: {
    title: '特色企业库：央企国企',
    langKey: '391973',
  },
  ...generateVIPFuncCfg({
    free: VIPFirstPageOnly,
  }),
}

const cfg8 = {
  function: {
    title: '批量查询导出',
    langKey: '208389',
  },
  ...generateVIPFuncCfg({
    free: VIPFunctionOff,
    vip: VIPFunctionOn,
  }),
}
const cfg9 = {
  function: {
    title: '投资赛道',
    langKey: '223898',
  },
  ...generateVIPFuncCfg({
    free: VIPFunctionOff,
    vip: VIPFunctionOn,
  }),
}

export const VIPEnterpriseFeatureCfg = [cfg11, cfg12, cfg1, cfg2, cfg3, cfg31, cfg32]

export const VIPOverseaEnterpriseFeatureCfg = [cfg1, cfg3, cfg31, cfg32]
