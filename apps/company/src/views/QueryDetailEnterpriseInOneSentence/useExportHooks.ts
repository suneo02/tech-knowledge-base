import { VipPopup } from '@/lib/globalModal'
import { getVipInfo } from '@/lib/utils'
import { t } from 'gel-util/intl'
import React, { useMemo, useState } from 'react'
import { message } from 'antd'
import { pointBuriedGel } from '@/api/configApi'
import { postData } from '@/api/settingApi'
import { wftCommon } from '@/utils/utils'

export const useExport = () => {
  const [limitNoticeVisible, setLimitNoticeVisible] = useState(false)

  const changeLimitNoticeVisible = () => {
    const { isSvip } = getVipInfo()
    if (!isSvip) {
      VipPopup({ onlySvip: true })
      return
    }
    setLimitNoticeVisible(!limitNoticeVisible)
  }

  // 条件查询下载
  const exportFile = (from, size, to, total, ids, measures, largeSearch) => {
    pointBuriedGel('922602100839', '数据浏览器', 'cdeExport', undefined, '10KXD')
    postData({
      to,
      from,
      size,
      total,
      name: t('259750', '企业数据浏览器'),
      superQueryLogic: {
        measures,
        ids: ids,
      },
      order: null,
      largeSearch,
      noWarning: true,
    }).then(successFun)

    function successFun(res) {
      if (res.Data && res.Data.id) {
        fileDownload(res.Data.id)
        message.success(t('455043', '导出成功'))
        setLimitNoticeVisible(!limitNoticeVisible)
      } else if ([global.USE_OUT_LIMIT, global.USE_OUT_LIMIT_GATEWAY].includes(res.code)) {
        // 超限提示
        setLimitNoticeVisible(!limitNoticeVisible)
        // renderOverLimit()
      } else {
        message.error(`${t('419987', '导出失败')}${res.code}`)
      }
    }
  }

  const fileDownload = (id) => {
    let name = `${t('455044', '企业名单导出')}(${t('259750', '企业数据浏览器')})_${wftCommon.formatDate(Date.now())}`
    wftCommon.downExcelfile(id, name)
  }

  return {
    limitNoticeVisible,
    changeLimitNoticeVisible,
    exportFile,
  }
}
