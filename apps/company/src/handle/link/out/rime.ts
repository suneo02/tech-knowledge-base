import { Modal } from '@wind/wind-ui'
import { wftCommon } from '../../../utils/utils.tsx'
import { HTTPS_Protocol } from '@/handle/link/constant.ts'
import intl from '@/utils/intl/index.ts'

const STRINGS = {
  TIP: intl('31041', '提示'),
  MORE: intl('272167', '更多'),
  RIME_DATA_TOOLTIP: intl('449776', '该数据由合作方 RimeData 来觅数据提供，如需查看详情请前往来觅官网查看'),
  SEEK: intl('257641', '查看'),
}

export const RimeHostMap = {
  terminal: 'RIME', // 终端中
  web: location.host, // web 地址 2025.01.06 by 熊威，要求不用写死的域名，且对方保证企业库页面在rime同域
}

export enum RimeTargetType {
  COMPANY = 'ORGANIZATION', // rime 企业
  PERSON = 'PERSON', // rime 人物
  VERTICAL = 'VERTICAL', // rime 来觅赛道 added by Calvin
  VERTICAL_HOME = 'VERTICAL_HOME', // rime 来觅赛道首页 added by Calvin
}

export const RimeHost = () => (wftCommon.usedInClient() ? RimeHostMap.terminal : RimeHostMap.web)

export const getRimeOrganizationUrl = ({
  id,
  isTerminal: isTerminalProp,
  type,
}: {
  id: string
  isTerminal?: boolean
  type?: RimeTargetType
}) => {
  const isTerminal = isTerminalProp != null ? isTerminalProp : wftCommon.usedInClient()

  const hostname = isTerminal ? RimeHostMap.terminal : RimeHostMap.web
  const pathname = isTerminal ? 'rime/frontend/web/profile' : 'profile'

  const url = new URL(pathname, `${HTTPS_Protocol}//${hostname}`)
  const searchParams = new URLSearchParams({
    id,
    type: type ? type : RimeTargetType.COMPANY,
  })
  url.search = searchParams.toString()
  return url.toString()
}

export const jumpToRimeUrl = ({
  id,
  isTerminal: isTerminalProp,
  type,
}: {
  id?: string
  isTerminal?: boolean
  type: RimeTargetType
}) => {
  const isTerminal = isTerminalProp != null ? isTerminalProp : wftCommon.usedInClient()

  if (!isTerminal) {
    Modal.info({
      title: STRINGS.TIP,
      content: STRINGS.RIME_DATA_TOOLTIP,
      okText: STRINGS.SEEK,
      onOk: () => {
        window.open('https://www.rimedata.com/')
      },
    })
    return
  }
  if (type === RimeTargetType.VERTICAL_HOME) {
    window.open('//RIME/rime/frontend/web/vertical/all')
    return
  }
  const url = getRimeOrganizationUrl({ id, type })
  if (url) {
    window.open(url, '_blank')
  }
}
