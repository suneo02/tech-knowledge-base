import { FC } from 'react'

export type PlaceholderPromptsComp = FC<{
  handleSendPresetMsg: (message: string) => void
  isFromIframe?: boolean
  isEmbedMode?: boolean
}>
