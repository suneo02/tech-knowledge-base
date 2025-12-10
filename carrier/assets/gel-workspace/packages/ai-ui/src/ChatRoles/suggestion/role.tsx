import { AxiosInstance } from 'axios'
import { AntRoleType, ChatRefCollapse, SuggestionMessage } from 'gel-ui'
import { SuggestionRolePropsMisc } from './misc'

export const createSuggestionRole: (
  isDev: boolean,
  wsid: string,
  entWebAxiosInstance: AxiosInstance
) => AntRoleType<SuggestionMessage['content']> = (isDev, wsid, entWebAxiosInstance) => ({
  ...SuggestionRolePropsMisc,
  messageRender: (content) => {
    return (
      <ChatRefCollapse
        ragList={content.ragList}
        dpuList={content.dpuList}
        isDev={isDev}
        wsid={wsid}
        entWebAxiosInstance={entWebAxiosInstance}
      />
    )
  },
})
