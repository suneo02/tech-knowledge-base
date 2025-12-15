import { wftCommon } from '../../../utils/utils.tsx'
import { HTTPS_Protocol } from '@/handle/link/constant.ts'
import { Modal } from '@wind/wind-ui'
import { t } from 'gel-util/intl'

const STRINGS = {
  TIP: t('31041', '提示'),
  MORE: t('272167', '更多'),
  WIND_DATA_TOOLTIP: t('452774', '该数据由 万得金融终端 提供，如需查看详情请前往万得金融终端查看'),
  SEEK: t('257645', '知道了'),
}

export enum WindType {
  IndustrialChainHome = 'IndustrialChainHome', // 产业链首页
  IndustrialChainDetail = 'IndustrialChainDetail', // 产业链详情
}

const windUrlRegistry = {
  [WindType.IndustrialChainHome]: {
    description: 'Wind产业链首页',
    template: `${HTTPS_Protocol}//{host}/pdb.web/index.html`,
    requiresTerminal: true,
  },
  [WindType.IndustrialChainDetail]: {
    description: 'Wind产业链详情',
    template: `${HTTPS_Protocol}//{host}/pdb.web/index.html#/Detail?id={id}`,
    requiresTerminal: true,
  },
}

type WindUrlParams = {
  id?: string
  type: WindType
}

export const getWindUrl = ({ id, type }: WindUrlParams): string => {
  const config = windUrlRegistry[type]
  if (!config) {
    console.error(`未注册的 Wind 链接类型: ${type}`)
    return ''
  }

  let templateUrl = config.template.replace('{host}', location.host)

  let hashPart = ''
  const hashIndex = templateUrl.indexOf('#')
  if (hashIndex !== -1) {
    hashPart = templateUrl.substring(hashIndex)
    templateUrl = templateUrl.substring(0, hashIndex)
  }

  if (type === WindType.IndustrialChainDetail) {
    if (!id) {
      console.error(`链接类型 ${type} 需要 'id' 参数。`)
      return ''
    }
    hashPart = hashPart.replace('{id}', id)
  }

  const urlObject = new URL(templateUrl)
  const lan = (window as any).en_access_config ? 'en' : 'cn'
  urlObject.searchParams.append('lan', lan)

  return urlObject.toString() + hashPart
}

type JumpWindUrlParams = WindUrlParams & {
  isTerminal?: boolean
}

export const jumpToWindUrl = ({ id, isTerminal: isTerminalProp, type }: JumpWindUrlParams) => {
  const isTerminal = isTerminalProp != null ? isTerminalProp : wftCommon.usedInClient()
  const config = windUrlRegistry[type]

  if (!config) {
    console.error(`尝试跳转到未注册的 Wind 链接类型: ${type}`)
    return
  }

  if (config.requiresTerminal && !isTerminal) {
    Modal.info({
      title: STRINGS.TIP,
      content: STRINGS.WIND_DATA_TOOLTIP,
      okText: STRINGS.SEEK,
    })
    return
  }

  const url = getWindUrl({ id, type })
  if (url) {
    window.open(url, '_blank')
  }
}
