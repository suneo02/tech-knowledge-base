import { getUrlSearchValue } from '@/common'
import { usedInClient } from '@/env'
import { HTTPS_Protocol } from '../constant'

export const isFromRime = () => {
  const linksource = getUrlSearchValue('linksource')
  return linksource === 'rime'
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

export const RimeHost = () => (usedInClient() ? RimeHostMap.terminal : RimeHostMap.web)

export const getRimeOrganizationUrl = ({
  id,
  isTerminal = usedInClient(),
  isTestSite = false,
  type,
}: {
  id?: string
  isTerminal?: boolean
  isTestSite?: boolean // 是否是测试站点
  type?: RimeTargetType
}) => {
  const hostname = isTerminal ? RimeHostMap.terminal : RimeHostMap.web
  if (type === RimeTargetType.VERTICAL_HOME) {
    return `${HTTPS_Protocol}//${hostname}/rime/frontend/web/vertical/all`
  }
  const pathname = isTerminal || isTestSite ? 'rime/frontend/web/profile' : 'profile'

  const url = new URL(pathname, `${HTTPS_Protocol}//${hostname}`)
  const searchParams = new URLSearchParams({
    id: id || '',
    type: type ? type : RimeTargetType.COMPANY,
  })
  url.search = searchParams.toString()
  return url.toString()
}
