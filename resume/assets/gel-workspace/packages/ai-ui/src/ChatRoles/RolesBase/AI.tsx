import { AxiosInstance } from 'axios'
import MarkdownIt from 'markdown-it'
import { createAIMessageRender } from '../components/AI/message'
import { creatAIRolePropsMisc } from '../components/AI/misc'
import { AIHeaderRolePropsMisc } from '../components/AIHeader'
import { RoleTypeBase } from './type'

export const createAIRole: (
  isDev: boolean,
  md: MarkdownIt,
  wsid: string,
  entWebAxiosInstance: AxiosInstance,
  showAiHeader?: boolean
) => RoleTypeBase = (isDev, md, wsid, entWebAxiosInstance, showAiHeader) => ({
  ...creatAIRolePropsMisc(showAiHeader || false),

  messageRender: createAIMessageRender(isDev, md, wsid, entWebAxiosInstance),
})

export const AIHeaderRole: RoleTypeBase = AIHeaderRolePropsMisc

export const AIHeaderRoleEmpty: RoleTypeBase = {
  style: {},
  messageRender: () => null,
}
