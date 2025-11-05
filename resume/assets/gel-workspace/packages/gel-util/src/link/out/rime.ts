import { usedInClient } from '@/env'
import { HTTPS_Protocol } from '../constant'

export const RimeHostMap = {
  terminal: 'RIME', // 终端中
  web: location.host, // web 地址 2025.01.06 by 熊威，要求不用写死的域名，且对方保证企业库页面在rime同域
}

export enum RimeTargetType {
  COMPANY = 'ORGANIZATION', // rime 企业
  PERSON = 'PERSON', // rime 人物
}

export const RimeHost = () => (usedInClient() ? RimeHostMap.terminal : RimeHostMap.web)

export const getRimeOrganizationUrl = ({
  id,
  isTerminal: isTerminalProp,
  type,
}: {
  id: string
  isTerminal?: boolean
  type?: RimeTargetType
  isDev: boolean
}) => {
  const isTerminal = isTerminalProp != null ? isTerminalProp : usedInClient()

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
