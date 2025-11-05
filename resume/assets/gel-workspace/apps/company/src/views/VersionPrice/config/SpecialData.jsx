import { VIPFirstPageOnly, VIPFunctionOff, VIPFunctionOn, generateVIPFuncCfg } from './basic'

const cfg2 = {
  function: {
    title: '查海外企业',
    langKey: '223896',
  },
  ...generateVIPFuncCfg({
    free: VIPFirstPageOnly,
    vip: VIPFunctionOn,
  }),
}

const cfg21 = {
  function: {
    title: '查人物',
    langKey: '138432',
  },
  ...generateVIPFuncCfg({
    free: VIPFirstPageOnly,
    vip: {
      title: '每天500位',
      langKey: '424977',
    },
    svip: {
      title: '每天2,000位',
      langKey: '424958',
    },
  }),
}

const cfg3 = {
  function: {
    title: '查招投标',
    langKey: '303419',
  },
  ...generateVIPFuncCfg({
    free: VIPFirstPageOnly,
  }),
}
const cfg4 = {
  function: {
    title: '查招聘',
    langKey: '379753',
  },
  ...generateVIPFuncCfg({
    free: VIPFirstPageOnly,
  }),
}
const cfg5 = {
  function: {
    title: '查专利',
    langKey: '203989',
  },
  ...generateVIPFuncCfg({
    free: VIPFirstPageOnly,
    vip: VIPFunctionOn,
  }),
}

const cfg6 = {
  function: {
    title: '查商标',
    langKey: '303413',
  },
  ...generateVIPFuncCfg({
    free: VIPFirstPageOnly,
  }),
  vip: VIPFunctionOn,
}

const cfg7 = {
  function: {
    title: '查软件著作权',
    langKey: '437141',
  },
  ...generateVIPFuncCfg({
    free: VIPFirstPageOnly,
  }),
  vip: VIPFunctionOn,
}

const cfg8 = {
  function: {
    title: '查作品著作权',
    langKey: '437142',
  },
  ...generateVIPFuncCfg({
    free: VIPFirstPageOnly,
  }),
  vip: VIPFunctionOn,
}

export const VIPSpecialDataCfg = [cfg2, cfg21, cfg3, cfg4, cfg5, cfg6, cfg7, cfg8]
export const VIPOverseaSpecialDataCfg = [cfg2, cfg3, cfg5, cfg6, cfg7, cfg8]
