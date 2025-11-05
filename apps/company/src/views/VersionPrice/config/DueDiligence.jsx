import { generateVIPFuncCfg, VIPFunctionOff, VIPFunctionOn } from './basic'
import intl from '../../../utils/intl'

const cfg0 = {
  function: {
    title: '批量查询导出',
    langKey: '208389',
  },
  ...generateVIPFuncCfg({
    free: VIPFunctionOff,
    vip: {
      title: (
        <>
          <span>{intl('424978', '每天10次')}</span>
          <div>{intl('424979', '累计2,000家/天')}</div>
        </>
      ),
    },
    svip: {
      title: (
        <>
          <span>{intl('424959', '每天30次')}</span>
          <div>{intl('424960', '累计5,000家/天')}</div>
        </>
      ),
    },
  }),
}
const cfg1 = {
  function: {
    title: '企业深度信用报告',
    langKey: '338873',
  },
  ...generateVIPFuncCfg({
    free: VIPFunctionOff,
    vip: {
      title: '每年5,000份',
      langKey: '424980',
    },
    svip: {
      title: (
        <>
          <span>{intl('424981', '所有报告导出合计')}</span>
          <div>{intl('424982', '每年10,000份')}</div>
        </>
      ),
      langKey: '',
      rowspan: 7,
    },
  }),
}
const cfg2 = {
  function: {
    title: '股权穿透分析报告',
    langKey: '224217',
  },
  ...generateVIPFuncCfg({
    free: VIPFunctionOff,
    vip: VIPFunctionOff,
    svip: {
      hide: true,
    },
  }),
}
const cfg3 = {
  function: {
    title: '尽职调查报告-在线编辑',
    langKey: '391693',
  },
  ...generateVIPFuncCfg({
    free: VIPFunctionOff,
    vip: VIPFunctionOff,
    svip: {
      hide: true,
    },
  }),
}

const cfg31 = {
  function: {
    title: '股权穿透报告Excel版',
    langKey: '437158',
  },
  ...generateVIPFuncCfg({
    free: VIPFunctionOff,
    vip: VIPFunctionOff,
    svip: {
      hide: true,
    },
  }),
}
const cfg32 = {
  function: {
    title: '投资穿透报告Excel版',
    langKey: '390315',
  },
  ...generateVIPFuncCfg({
    free: VIPFunctionOff,
    vip: VIPFunctionOff,
    svip: {
      hide: true,
    },
  }),
}

const cfg33 = {
  function: {
    title: '关联方认定报告',
    langKey: '390334',
  },
  ...generateVIPFuncCfg({
    free: VIPFunctionOff,
    vip: VIPFunctionOff,
    svip: {
      hide: true,
    },
  }),
}

const cfg4 = {
  function: {
    title: '企业科创能力报告',
    langKey: '391713',
  },
  ...generateVIPFuncCfg({
    free: VIPFunctionOff,
    vip: VIPFunctionOff,
    svip: {
      hide: true,
    },
  }),
}

const cfg5 = {
  function: {
    title: '股权穿透报告-无限穿透*',
    langKey: '437143',
  },
  other: {
    type: 'ContactManager',
    title: (
      <>
        <span>{intl('424961', '按份收费，联系客户经理定制报告')}</span>
      </>
    ),
  },
}

export const VIPDueDiligenceCfg = [cfg0, cfg1, cfg2, cfg3, cfg31, cfg32, cfg33, cfg4, cfg5]
export const VIPOverseaDueDiligenceCfg = [cfg1, cfg2, cfg3, cfg31, cfg32, cfg33, cfg4, cfg5]
