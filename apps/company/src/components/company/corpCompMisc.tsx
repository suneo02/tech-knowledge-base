import { exportCorpModuleData, getshareholdertracedetail } from '@/api/companyApi.ts'
import { pointBuriedNew } from '@/api/configApi'
import { commonBuryList } from '@/api/pointBuried'
import { pointBuriedByModule } from '@/api/pointBuried/bury.ts'
import { RightGotoLink } from '@/components/common/RightGotoLink'
import { CHART_HASH } from '@/components/company/intro/charts'
import { VipPopup } from '@/lib/globalModal'
import { getVipInfo } from '@/lib/utils'
import { isDev, usedInClient } from '@/utils/env'
import { wftCommon } from '@/utils/utils.tsx'
import { wftCommonType } from '@/utils/WFTCommonWithType'
import { DownloadO } from '@wind/icons'
import { Button } from '@wind/wind-ui'
import { message } from 'antd'
import cn from 'classnames'
import React, { FC } from 'react'
import { intlNoNO } from 'src/utils/intl'
import { RimeIcon } from '../icons/rime'
import styles from './style/corpCompMisc.module.less'

export const showChain = (rate, row, header, apiParams, buryItem?) => {
  if (window.en_access_config) {
    return wftCommonType.displayPercent(rate) // FIXME 临时处理
  }
  if (row?.isShareRoute) {
    const shareRate = wftCommonType.displayPercent(rate)
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {/*@ts-expect-error ttt*/}
        <div style={{ width: 140 }}>{shareRate ? (shareRate == 0 ? '--' : shareRate) : '--'}</div>
        <div
          className="share-route"
          onClick={() => {
            if (buryItem?.moduleId) {
              // @ts-expect-error ttt
              pointBuriedByModule(buryItem?.moduleId, buryItem?.entity ? `-${buryItem.entity}` : '')
            }
            wftCommon.showRoute(row.shareRoute, header, apiParams)
          }}
          data-uc-id="LOnkBx39n7u"
          data-uc-ct="div"
        ></div>
      </div>
    )
  } else {
    return wftCommonType.displayPercent(rate)
  }
}
export const addChangeTag = function (data, afterData) {
  if (data && data.indexOf('text-insert') > -1) {
    data = data.replace(/<span class='text-insert'>/g, '')
    data = data.replace(/<\/span>/g, '')
  }
  if (data && data.indexOf('text-delete') > -1) {
    data = data.replace(/<span class='text-delete'>/g, '')
    data = data.replace(/<\/span>/g, '')
  }
  if (afterData && afterData.indexOf('text-insert') > -1) {
    afterData = afterData.replace(/<span class='text-insert'>/g, '')
    afterData = afterData.replace(/<\/span>/g, '')
  }
  if (afterData && afterData.indexOf('text-delete') > -1) {
    afterData = afterData.replace(/<span class='text-delete'>/g, '')
    afterData = afterData.replace(/<\/span>/g, '')
  }
  if (data.indexOf(',') > -1) {
    data = data.split(',')
  } else if (data.indexOf('，') > -1) {
    data = data.split('，')
  }
  if (afterData.indexOf(',') > -1) {
    afterData = afterData.split(',')
  } else if (afterData.indexOf('，') > -1) {
    afterData = afterData.split('，')
  }
  for (let i = 0; i < data.length; i++) {
    let flag = true
    for (let j = 0; j < afterData.length; j++) {
      if (data[i] == afterData[j]) {
        flag = false
        break
      }
    }
    if (flag) {
      data[i] = '<span class="text-insert">' + data[i] + '</span>'
    }
  }
  data = data.join('，')
  return data
}
export const DetailLink = (props) => {
  const { url, txt } = props
  if (!url) return <span>{txt}</span>
  return (
    <a
      style={props.style}
      onClick={() => {
        if (props.openFunc) {
          props.openFunc(url)
        } else {
          if (wftCommon.isDevDebugger()) {
            return window.open(url)
          }
          wftCommon.jumpJqueryPage(url)
        }
      }}
      data-uc-id="o-H-m_wEP8N"
      data-uc-ct="a"
    >
      {txt}
    </a>
  )
}
export const RimeDataLink: FC<{ url?: string; css?: string }> = (props) => {
  if (!usedInClient()) return null
  const url = props.url || '//RIME/rime/frontend/web/database/realm/pevc.event'
  const func = () => {
    window.open(url)
  }
  return (
    <div className={cn(styles['right-rime-tips'], props.css)} onClick={func} data-uc-id="97r8drEE-8_" data-uc-ct="div">
      <span className={styles['right-rime-tips-text']}>{intlNoNO('342096', '数据来源')}: </span>
      <RimeIcon width={68} height={14} />
    </div>
  )
}

//最终受益人图谱与导出按钮同行
export const downLoadExcel = (moduleType, tableTitle, companyName, companycode) => {
  const userVipInfo = getVipInfo()
  if (!userVipInfo.isSvip && !userVipInfo.isVip) {
    VipPopup()
    return
  }
  let cmd, exportParam, downloadUrlPath

  cmd = moduleType && moduleType.indexOf('/') > -1 ? `${moduleType}/${companycode}` : 'createdoctmpfile'
  exportParam = { companycode, type: moduleType }

  if (moduleType && moduleType.indexOf('/') > -1) {
    downloadUrlPath = '/Wind.WFC.Enterprise.Web/Enterprise/gel/download/getfile/downloadfilewithtempfilename'
  } else {
    downloadUrlPath = '/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx'
  }

  exportCorpModuleData(cmd, exportParam).then((res) => {
    if (res && res.Data) {
      const filename = `${companyName?.replace('.', '')?.replace(',', '')}-${tableTitle}-共${res.Data.total}条`
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
  })
}
export const benfitRender = (data) => {
  return (
    <div className={'benefitLink'}>
      <RightGotoLink
        txt={intlNoNO('265536', '最终受益人图谱')}
        func={() => {
          const { moduleId, opActive, describe } = commonBuryList.find((res) => res.moduleId === 922602100969)
          pointBuriedNew(moduleId, { opActive, opEntity: describe })
          const url = `index.html?isSeparate=1&nosearch=1&companycode=${data.companyCode}&companyname=${data.companyName}&activeKey=chart_qysyr#/${CHART_HASH}`
          wftCommon.jumpJqueryPage(url)
        }}
      ></RightGotoLink>
      <Button
        onClick={() => {
          downLoadExcel(
            'download/createtempfile/getbenefit',
            intlNoNO('138180', '最终受益人'),
            data.companyName,
            data.companyCode
          )
        }}
        icon={
          <DownloadO
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            data-uc-id="xfwClZW76v"
            data-uc-ct="downloado"
          />
        }
        data-uc-id="5AWf34S0RO"
        data-uc-ct="button"
      >
        {intlNoNO('4698', '导出数据')}
      </Button>
    </div>
  )
}
// 股东穿透，持股路径，展开请求数据
export const expandHandle = ({ code, id, callback }) => {
  getshareholdertracedetail(code, id).then((res) => {
    callback(res.Data)
  })
}
