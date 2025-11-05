import { VIPFunctionOff, VIPFunctionOn, VIPLimitedTime, generateVIPFuncCfg, VIPGQCT, VIPCtrl } from './basic'

export const VIPInsightBusinessCfg = [
  {
    function: {
      title: '股权穿透图',
      langKey: '138279',
    },
    ...generateVIPFuncCfg({
      free: VIPFunctionOff,
      vip: VIPGQCT,
      svip: VIPGQCT,
    }),
  },
  {
    function: {
      title: '实际控制人',
      langKey: '13270',
    },
    ...generateVIPFuncCfg({
      free: VIPFunctionOff,
      vip: VIPFunctionOn,
    }),
  },
  {
    function: {
      title: '最终受益人',
      langKey: '138180',
    },
    ...generateVIPFuncCfg({
      free: VIPFunctionOff,
      vip: VIPFunctionOn,
    }),
  },
  {
    function: {
      title: '关联方图谱',
      langKey: '243685',
    },
    ...generateVIPFuncCfg({
      free: VIPFunctionOff,
      vip: VIPFunctionOn,
    }),
  },
  {
    function: {
      title: '融资历程图谱',
      langKey: '437140',
    },
    ...generateVIPFuncCfg({
      free: VIPFunctionOff,
      vip: VIPFunctionOn,
    }),
  },
  {
    function: {
      title: '对外投资图',
      langKey: '367274',
    },
    ...generateVIPFuncCfg({
      free: VIPFunctionOff,
      vip: VIPFunctionOn,
    }),
  },
  {
    function: {
      title: '控股企业',
      langKey: '451208',
    },
    ...generateVIPFuncCfg({
      free: VIPFunctionOff,
      vip: VIPCtrl,
      svip: VIPCtrl,
    }),
  },
  {
    function: {
      title: '查关系',
      langKey: '422046',
    },
    ...generateVIPFuncCfg({
      free: VIPFunctionOff,
      vip: VIPFunctionOn,
    }),
  },
  {
    function: {
      title: '多对一触达',
      langKey: '247485',
    },
    ...generateVIPFuncCfg({
      free: VIPFunctionOff,
      vip: VIPFunctionOff,
    }),
  },
  {
    function: {
      title: '查持股路径',
      langKey: '224295',
    },
    ...generateVIPFuncCfg({
      free: VIPFunctionOff,
      vip: VIPFunctionOn,
    }),
  },
  // {
  //   function: {
  //     title: '集团系',
  //     langKey: '148622',
  //   },
  //   ...generateVIPFuncCfg({
  //     free: VIPLimitedTime,
  //     vip: VIPFunctionOn,
  //   }),
  // },
]
