import { SuggestionMessage } from '@/types/message/parsed'

export const isRefContent = (content: any): content is SuggestionMessage['content'] => {
  return Array.isArray(content?.reference) || Array.isArray(content?.table)
}
