import { CorpTableCfg } from '@/types/corpDetail'
import { TCorpDetailSubModule } from 'gel-types'
import { ReactNode } from 'react'

export type MakeTableInCompanyBase = (
  table: CorpTableCfg,
  eachTableKey: TCorpDetailSubModule,
  idx?: number,
  smaller?: boolean
) => ReactNode
