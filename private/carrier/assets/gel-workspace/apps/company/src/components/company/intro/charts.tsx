import intl from '@/utils/intl'

// 旧版图谱平台入口 先保留注释一段时间方便快捷回退
// import { isDeveloper } from '@/utils/common.ts'
// export const CHART_HASH = isDeveloper ? 'graph' : 'atlasplatform'

export const CHART_HASH = 'graph'

export const getCorpIntroChartsCfg = ({ companyCode, companyName }) => [
  {
    url: `index.html?isSeparate=1&nosearch=1&companycode=${companyCode}&companyname=${companyName}&activeKey=chart_gqct#/${CHART_HASH}`,
    txt: intl('138279', '股权穿透图'),
    bury: { id: 922602100876 },
  },
  {
    url: `index.html?isSeparate=1&nosearch=1&companycode=${companyCode}&companyname=${companyName}&activeKey=chart_newtzct#/${CHART_HASH}`,
    txt: window.en_access_config ? 'Invest Penetration' : intl('', '投资穿透图'),
    bury: { id: 922602100877 },
  },
  {
    url: `index.html?isSeparate=1&nosearch=1&companycode=${companyCode}&companyname=${companyName}&activeKey=chart_qysyr#/${CHART_HASH}`,
    txt: intl('138180', '最终受益人'),
    bury: { id: 922602100969 },
  },
  {
    url: `index.html?isSeparate=1&nosearch=1&companycode=${companyCode}&companyname=${companyName}&activeKey=chart_qytp#/${CHART_HASH}`,
    txt: intl('138676', '企业图谱'),
  },
  // {
  //   url: `index.html?isSeparate=1&nosearch=1&companycode=${companyCode}&companyname=${companyName}&activeKey=chart_ysgx#/atlasplatform`,
  //   txt: intl('138485', '疑似关系图'),
  // },
  {
    url: `index.html?isSeparate=1&nosearch=1&companycode=${companyCode}&companyname=${companyName}&activeKey=chart_ddycd#/${CHART_HASH}`,
    txt: intl('451197', '多对一触达'),
  },
  {
    url: `index.html?isSeparate=1&nosearch=1&companycode=${companyCode}&companyname=${companyName}&activeKey=chart_glgx#/${CHART_HASH}`,
    txt: intl('243685', '关联方图谱'),
  },
]
