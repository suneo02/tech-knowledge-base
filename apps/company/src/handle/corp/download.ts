import { exportCorpModuleData } from '@/api/companyApi.ts'
import { VipPopup } from '@/lib/globalModal'
import { getVipInfo } from '@/lib/utils'
import { isDev } from '@/utils/env'
import intl from '@/utils/intl'
import { message } from '@wind/wind-ui'

//最终受益人图谱与导出按钮同行
export const downLoadCorpExcel = async ({
  downDocTypeApi,
  tableTitle = '',
  companyName = '',
  companycode,
  ajaxExtras,
}: {
  downDocTypeApi: string
  tableTitle?: string
  companyName?: string
  companycode: string
  ajaxExtras?: any
}) => {
  try {
    const userVipInfo = getVipInfo()
    if (!userVipInfo.isSvip && !userVipInfo.isVip) {
      VipPopup()
      return
    }
    const cmd: string = downDocTypeApi?.indexOf('/') > -1 ? downDocTypeApi : 'createdoctmpfile'
    let exportParam = { companycode: companycode, type: downDocTypeApi }
    const downloadUrlPath =
      downDocTypeApi && downDocTypeApi.indexOf('/') > -1
        ? '/Wind.WFC.Enterprise.Web/Enterprise/gel/download/getfile/downloadfilewithtempfilename'
        : '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx'
    switch (downDocTypeApi) {
      /**
       * @deprecated
       * 招投标搜索参数需要pageSize
       */
      case 'download/createtempfile/bidTenderSearch': {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { pageNo, ...params } = ajaxExtras || {}
        exportParam = params
        break
      }
      case 'download/createtempfile/get_equityPledged': {
        tableTitle = intl('138281', '股权出质')
      }
      /**
       * @deprecated
       * 招投标搜索参数需要pageSize
       */
      default: {
        if (downDocTypeApi == 'corp_tendering' || cmd.indexOf('/') > -1) {
          // TODO Calvin 适配曹国胜的招投标写这里 ！！！ 招投标穿透导出
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { pageNo, pageSize, ...params } = ajaxExtras || {}
          exportParam = params
        }
      }
    }
    const res = await exportCorpModuleData(cmd, exportParam)
    if (res && res.Data) {
      let filename = `${companyName?.replace('.', '')?.replace(',', '')}-${tableTitle}-共${res.Data.total}条`
      if (!companyName) {
        filename = `${tableTitle}-共${res.Data.total}条`
      }
      const downloadUrl = downloadUrlPath + '?tmpFile=' + res.Data.tmpFileName + '&filename=' + filename
      console.log(downloadUrl)

      if (isDev) {
        window.open(downloadUrl)
      } else {
        // @ts-expect-error ttt
        window.location = downloadUrl
      }
    } else {
      message.error('导出出错！')
    }
  } catch (e) {
    message.error('导出出错！')
    console.error('🚀 ~ exportCorpModuleData ~ err:', e)
  }
}

export const downLoadExcelInCompanyBase = (type, txt, name, companycode) => {
  const userVipInfo = getVipInfo()
  if (!userVipInfo.isSvip && !userVipInfo.isVip) {
    VipPopup()
    return
  }
  exportCorpModuleData('createdoctmpfile', { companycode, type }).then((res) => {
    name = name + '-' + txt
    const downloadUrl =
      '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?tmpFile=' +
      res.Data.tmpFileName +
      '&filename=' +
      name.replace('.', '') +
      '-共' +
      res.Data.total +
      '条'
    if (isDev) {
      window.open(downloadUrl)
    } else {
      // @ts-expect-error ttt
      window.location = downloadUrl
    }
  })
}
