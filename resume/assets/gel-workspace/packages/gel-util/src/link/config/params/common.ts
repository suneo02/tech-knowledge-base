import { WindSessionHeader } from '@/env'

export type CommonLinkParams = {
  nosearch?: '1'
  notoolbar?: '1'
  isSeparate?: 'true' | '1'
  [WindSessionHeader]?: string
}
