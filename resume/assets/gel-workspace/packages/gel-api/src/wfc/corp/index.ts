import { wfcCorpCollectApiPath } from './collect'
import { wfcCorpInfoApiPath } from './info'
import { wfcCorpIntellectualApiPath } from './intellectual'
import { wfcCorpMiscApiPath } from './misc'
import { wfcCorpNodeApiPath } from './node'
export * from './base'
export * from './misc'
export * from './user'

export interface wfcCorpApiPath
  extends wfcCorpInfoApiPath,
    wfcCorpCollectApiPath,
    wfcCorpNodeApiPath,
    wfcCorpIntellectualApiPath,
    wfcCorpMiscApiPath {}
