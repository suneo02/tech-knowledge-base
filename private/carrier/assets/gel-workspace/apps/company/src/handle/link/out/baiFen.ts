import { getUrlByLinkModule } from '@/handle/link/handle/generateOverall.ts'
import { isDev, usedInClient } from '@/utils/env'
import { wftCommon } from '@/utils/utils'
import { Modal } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import { BaiFenPathConstants, BaiFenSites as BaiFenSitesUtil, getBaiFenHost } from 'gel-util/link'
import { LinksModule, UserLinkEnum } from '../module'
export { BaiFenPathConstants, getBaiFenHost, getBaiFenHostMap } from 'gel-util/link'

const STRINGS = {
  jumpToBaiFenUrl: t('452754', '该数据由合作方 百分企业 提供，如需查看详情请前往百分企业官网查看'),
  jumpToBaiFenUrlTitle: t('31041', '提示'),
  jumpToBaiFenUrlOkText: t('257641', '查看'),
}

export const BaiFenHashConstants = {
  strategicIndustries: '/strategy',
}

export const BaiFenSites = () => {
  const isTerminal = usedInClient()
  const isBaiFenTerminal = wftCommon.isBaiFenTerminal()

  // 使用 gel-util 的 BaiFenSites 作为基础，传入 isBaiFenTerminal 配置
  const baseSites = BaiFenSitesUtil({ isDev, isBaiFenTerminal })

  // 跳转百分链接的方法 - company 特有功能
  const jumpToBaiFenUrl = (url: string, params?: Record<string, string>) => {
    if (!isBaiFenTerminal && !isTerminal) {
      const host = getBaiFenHost({ isDev })
      const protocol = window.location.protocol
      const baseUrl = `${protocol}//${host}`

      Modal.info({
        title: STRINGS.jumpToBaiFenUrlTitle,
        content: STRINGS.jumpToBaiFenUrl,
        okText: STRINGS.jumpToBaiFenUrlOkText,
        onOk: () => {
          window.open(`${baseUrl}${BaiFenPathConstants.baifenweb}/`)
        },
      })
      return
    }
    window.open(`${url}${params ? `?${new URLSearchParams(params).toString()}` : ''}`)
  }

  return {
    ...baseSites,
    // 添加 company 特有的 jumpToBaiFenUrl 方法
    jumpToBaiFenUrl,
  }
}

/**
 * 获得百分或者企业库报告下载页面
 */
export const getCompanyReportDownPage = () => {
  let url: string | undefined
  if (wftCommon.isBaiFenTerminal()) {
    url = BaiFenSites().download
  } else {
    url = getUrlByLinkModule(LinksModule.USER, {
      subModule: UserLinkEnum.MyData,
    })
  }
  return url
}
