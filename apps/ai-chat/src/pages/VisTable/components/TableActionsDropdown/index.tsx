// done
import { requestToDownloadFcs } from '@/api'
import { useSuperChatRoomContext } from '@/contexts/SuperChat'
import { FOLDER_IDS } from '@/pages/MyFile/utils/navigation'
import { selectVipStatus, useAppSelector, VipStatusEnum } from '@/store'
import { isDev } from '@/utils/env'
import { showMessage } from '@/utils/message'
import { DownloadO } from '@wind/icons'
import { Button, message } from '@wind/wind-ui'
import { usedInClient } from 'gel-util/env'
import { t } from 'gel-util/intl'
import { generateUrl, INNER_LINK_PARAM_KEYS, LinkModule } from 'gel-util/link'
import { useState } from 'react'

const STRINGS = {
  DOWNLOAD: t('4675', '导出到Excel'),
  DOWNLOAD_FILE_SUCCESS: t('464159', '文件已开始下载，正在前往我的下载查看...'),
  DEFAULT_TABLE_NAME: t('464173', '表格数据'),
  DOWNLOAD_FILE_ERROR_MESSAGE: t('464097', '下载文件失败:'),
  TOAST_MESSAGE: t('472292', '需要升级 VIP/SVIP 才能使用该功能。'),
  TOAST_MESSAGE_BUTTON: t('464909', '立即开通'),
}

interface TableActionsDropdownProps {
  tableId: string
  onDataImported?: (sheetId: number | string) => void
  disabled?: boolean
}

// const addDataToSheetFunc = createWFCSuperlistRequestFcs('superlist/excel/addDataToSheet')

export const TableActionsDropdown = ({ tableId, disabled }: TableActionsDropdownProps) => {
  const { tableInfo } = useSuperChatRoomContext()
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false)

  const vipStatus = useAppSelector(selectVipStatus)
  // 处理下载文件
  const handleDownloadFile = async () => {
    if (vipStatus !== VipStatusEnum.SVIP && vipStatus !== VipStatusEnum.VIP) {
      showMessage({
        content: STRINGS.TOAST_MESSAGE,
        duration: 5,
        showActionButton: true,
        okText: STRINGS.TOAST_MESSAGE_BUTTON,
        onOk: () =>
          window.open(
            'https://wx.wind.com.cn/Wind.WFC.Enterprise.Web/PC.Front/Company/index.html?nosearch=1#/versionPrice'
          ),
      })
      return
    }
    if (!tableId) {
      message.error('table id not exist')
      return
    }
    try {
      setDownloadLoading(true)
      await requestToDownloadFcs(
        'download/createtask/superlistexcel',
        { tableName: tableInfo?.tableName || STRINGS.DEFAULT_TABLE_NAME },
        { appendUrl: tableId, headers: { 'Content-Type': 'multipart/form-data' } }
      )
      message.success(STRINGS.DOWNLOAD_FILE_SUCCESS)
      setTimeout(() => {
        // const myDownloadUrl = `#/super/my-file?folder=${FOLDER_IDS.DOWNLOADS}`
        if (window.location.ancestorOrigins[0]) {
          let baseUrl: URL
          if (usedInClient()) {
            baseUrl = new URL(
              `${window.location.ancestorOrigins[0]}/Wind.WFC.Enterprise.Web/PC.Front/Company/index.html#/innerlinks`
            )
          } else if (isDev) {
            baseUrl = new URL(`${window.location.ancestorOrigins[0]}/index.html#/innerlinks`)
          } else {
            baseUrl = new URL(`${window.location.ancestorOrigins[0]}/web/ai/index.html#/innerlinks`)
          }
          baseUrl.searchParams.set(INNER_LINK_PARAM_KEYS.TARGET, 'super')
          baseUrl.searchParams.set('folder', FOLDER_IDS.DOWNLOADS)
          baseUrl.searchParams.set('path', 'super/my-file')
          // const finalUrl = appendLangSourceToUrl(myDownloadUrl)
          window.open(baseUrl.toString(), '_blank')
        } else {
          // const myDownloadUrl = `#/super/my-file?folder=${FOLDER_IDS.DOWNLOADS}`
          // const finalUrl = appendLangSourceToUrl(myDownloadUrl)
          // console.log('🚀 ~ handleDownloadFile ~ finalUrl:', finalUrl)
          const finalUrl = generateUrl({
            target: 'module',
            module: LinkModule.SUPER_DOWNLOAD,
            params: { folder: FOLDER_IDS.DOWNLOADS },
            isDev,
          })
          window.open(finalUrl, '_blank')
        }
      }, 1000) // 后端要求1s后跳转至我的下载, 避免跳转太快导致后端没有生成对应的下载列表
    } catch (error: unknown) {
      console.error('download file error:', error)
      if (error instanceof Error) {
        message.error(error.message)
      } else {
        message.error(STRINGS.DOWNLOAD_FILE_ERROR_MESSAGE)
      }
    } finally {
      setDownloadLoading(false)
    }
  }

  return (
    // @ts-expect-error windUI
    <Button onClick={handleDownloadFile} icon={<DownloadO />} loading={downloadLoading} disabled={disabled}>
      {STRINGS.DOWNLOAD}
    </Button>
  )
}
