import { AxiosInstance } from 'axios'
import { isRefContent } from '../components/suggestion/handle'
import { SuggestionRolePropsMisc } from '../components/suggestion/misc'
import { ChatRefList } from '../components/suggestion/RefList'
import { RoleTypeBase } from './type'

export const createSuggestionRole: (
  isDev: boolean,
  wsid: string,
  entWebAxiosInstance: AxiosInstance
) => RoleTypeBase = (isDev, wsid, entWebAxiosInstance) => ({
  ...SuggestionRolePropsMisc,
  messageRender: (content) => {
    if (!isRefContent(content)) return null
    return (
      <ChatRefList
        suggest={content.reference}
        table={content.table}
        isDev={isDev}
        wsid={wsid}
        entWebAxiosInstance={entWebAxiosInstance}
      />
    )
  },
})
