import { AxiosInstance } from 'axios'
import { AIHeaderMsg, AIHeaderRolePropsMisc, AIMessageGEL, AntRoleType } from 'gel-ui'
import MarkdownIt from 'markdown-it'
import { createAIMessageRender } from './message'
import { creatAIRolePropsMisc } from './misc'

export const createAIRole: (
  isDev: boolean,
  md: MarkdownIt,
  wsid: string,
  entWebAxiosInstance: AxiosInstance,
  showAiHeader?: boolean
) => AntRoleType<AIMessageGEL['content']> = (isDev, md, wsid, entWebAxiosInstance, showAiHeader) => ({
  ...creatAIRolePropsMisc(showAiHeader || false),

  messageRender: createAIMessageRender(isDev, md, wsid, entWebAxiosInstance),
})

export const AIHeaderRole: AntRoleType<AIHeaderMsg['content']> = AIHeaderRolePropsMisc

export const AIHeaderRoleEmpty: AntRoleType<AIHeaderMsg['content']> = {
  style: {},
  messageRender: () => null,
}
