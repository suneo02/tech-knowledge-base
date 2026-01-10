import intl from '@/utils/intl'
import { getUrlSearchValue } from 'gel-util/common'
import { isFromRimePEVC } from 'gel-util/link'

// 旧版图谱平台入口 先保留注释一段时间方便快捷回退
// import { isDeveloper } from '@/utils/common.ts'
// export const CHART_HASH = isDeveloper ? 'graph' : 'atlasplatform'

export const CHART_HASH = 'graph'

const getRimePEVCParams = () => {
  return isFromRimePEVC() ? '&linksource=rimepevc&wind.sessionid=' + getUrlSearchValue('wind.sessionid') : ''
}
export const getCorpIntroChartsCfg = ({ companyCode, companyName }) => [
  {
    url: `index.html?isSeparate=1&nosearch=1&companycode=${companyCode}&companyname=${companyName}&activeKey=chart_gqct${getRimePEVCParams()}#/${CHART_HASH}`,
    txt: intl('138279', '股权穿透图'),
    bury: { id: 922602100876 },
  },
  {
    url: `index.html?isSeparate=1&nosearch=1&companycode=${companyCode}&companyname=${companyName}&activeKey=chart_newtzct${getRimePEVCParams()}#/${CHART_HASH}`,
    txt: window.en_access_config ? 'Invest Penetration' : intl('345553', '投资穿透图'),
    bury: { id: 922602100877 },
  },
  {
    url: `index.html?isSeparate=1&nosearch=1&companycode=${companyCode}&companyname=${companyName}&activeKey=chart_qysyr${getRimePEVCParams()}#/${CHART_HASH}`,
    txt: intl('138180', '最终受益人'),
    bury: { id: 922602100969 },
  },
  {
    url: `index.html?isSeparate=1&nosearch=1&companycode=${companyCode}&companyname=${companyName}&activeKey=chart_qytp${getRimePEVCParams()}#/${CHART_HASH}`,
    txt: intl('138676', '企业图谱'),
  },
  // {
  //   url: `index.html?isSeparate=1&nosearch=1&companycode=${companyCode}&companyname=${companyName}&activeKey=chart_ysgx#/atlasplatform`,
  //   txt: intl('138485', '疑似关系图'),
  // },
  {
    url: `index.html?isSeparate=1&nosearch=1&companycode=${companyCode}&companyname=${companyName}&activeKey=chart_ddycd${getRimePEVCParams()}#/${CHART_HASH}`,
    txt: intl('451197', '多对一触达'),
  },
  {
    url: `index.html?isSeparate=1&nosearch=1&companycode=${companyCode}&companyname=${companyName}&activeKey=chart_glgx${getRimePEVCParams()}#/${CHART_HASH}`,
    txt: intl('243685', '关联方图谱'),
  },
]
