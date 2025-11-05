import { VipPopup } from '@/lib/globalModal'
import { getVipInfo } from '@/lib/utils'
import { DownloadO, LoadingO } from '@wind/icons'
import { Button, Tooltip } from '@wind/wind-ui'
import React, { FC, useContext, useState } from 'react'
import { getGroupDataApi } from '../../../api/groupApi'
import { ACTION_DOWNLOAD, DOWNLOAD_FILE_URL, getServerApi, SERVER_URL } from '../../../api/serverApi'
import { TreeModuleName, useGroupStore } from '../../../store/group'
import intl from '../../../utils/intl'
import './exportDoc.less'
import { ConfigDetailContext } from '../../layout/ctx'
import { downLoadCorpExcel } from '@/handle/corp/download.ts'
import { CompanyDetailContext } from '@/views/Company/ctx.ts'

export const ExportDoc: FC<{
  downDocTypeApi?: string
  downDocType?: string
  searchFilter?: any
  titleId?: string | number
}> = (node) => {
  const moduleByCtx = useContext(ConfigDetailContext)
  const corpDetailCtx = useContext(CompanyDetailContext)
  const [loading, setLoading] = useState(false)
  const basicInfo = useGroupStore((state) => state.basicInfo)
  const moduleByZustand = useGroupStore((state) => state.module)
  const userVipInfo = getVipInfo()

  const downLoadExcel = () => {
    if (loading) return
    downLoadGroup()
  }

  const downLoadGroup = async () => {
    if (!userVipInfo.isSvip) {
      VipPopup({ onlySvip: true })
      return
    }
    setLoading(true)
    if (node.downDocTypeApi) {
      download()
    } else {
      downloadOldFunc()
    }
  }

  const download = async () => {
    try {
      if (moduleByCtx === 'company') {
        let api = `${ACTION_DOWNLOAD}/${node.downDocTypeApi}/${corpDetailCtx.corpCode}`
        if (api.startsWith('/')) {
          api = api.substring(1) // 去除路径的前导斜杠
        }
        await downLoadCorpExcel({
          downDocTypeApi: api,
          ajaxExtras: node?.searchFilter,
          companycode: corpDetailCtx.corpCode,
          companyName: corpDetailCtx.basicInfo?.corp_name,
          tableTitle: intl(node.titleId),
        })
        setLoading(false)
        return
      }
      const { Data } = await getServerApi({
        api: node.downDocTypeApi,
        actionUrl: ACTION_DOWNLOAD,
        params: node?.searchFilter,
      }).finally(() => setLoading(false))
      let filename = ''

      filename = basicInfo.groupSystemName.replace('.', '')

      const downloadUrl = `${SERVER_URL}${DOWNLOAD_FILE_URL}?tmpFile=${Data.tmpFileName}&filename=${filename}-${intl(node.titleId)}-${intl(
        138587
      )}${Data.total}${intl(149186)}`
      console.log(downloadUrl)
      window.open(downloadUrl)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const downloadOldFunc = async () => {
    const params = { type: node.downDocType, ...node?.searchFilter }
    if (moduleByZustand === TreeModuleName.Group) {
      params.groupId = basicInfo.id
    }
    const { Data } = await getGroupDataApi('creategroupdoctmpfile', params).finally(() => setLoading(false))
    if (!Data) {
      console.error('🚀 ~ downloadOldFunc ~ Data:', Data, params)
      return
    }
    const downloadUrl = `/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?tmpFile=${Data.tmpFileName}&filename=${basicInfo.groupSystemName.replace('.', '')}-${intl(
      node.titleId
    )}-${intl(138587)}${Data.total}${intl(149186)}`
    console.log(downloadUrl)

    // @ts-expect-error ttt
    window.location = downloadUrl
  }

  return (
    <div className="export-doc">
      <Tooltip>
        <div>
          <Button
            size="large"
            icon={
              !loading ? (
                <DownloadO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              ) : (
                <LoadingO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
              )
            }
            onClick={() => downLoadExcel()}
          >
            {intl('4698', '导出数据')}
          </Button>
        </div>
      </Tooltip>
    </div>
  )
}
