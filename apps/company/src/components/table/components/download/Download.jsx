/**
 * 导出数据
 * @format
 * */

import { DownloadO } from '@wind/icons'
import { Button } from '@wind/wind-ui'
import { exportCorpModuleData } from '../../../../api/companyApi'
import { VipPopup } from '../../../../lib/globalModal'
import { getVipInfo } from '../../../../lib/utils'
import { intlNoIndex } from '../../../../utils/intl'

const Download = (props) => {
  const { downDocType, title, companyName, companycode } = props
  const userVipInfo = getVipInfo()

  const downLoadExcel = (type, txt, name) => {
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
      window.location = downloadUrl
    })
  }

  return (
    <Button
      onClick={() => {
        downLoadExcel(downDocType, title, companyName)
      }}
      icon={<DownloadO />}
    >
      {intlNoIndex('4698', '导出数据')}
    </Button>
  )
}

export default Download
