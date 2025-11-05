import { wfcCorpCollectApiPath } from './collect'
import { wfcCorpInfoApiPath } from './info'
import { wfcCorpIntellectualApiPath } from './intellectual'
import { wfcCorpNodeApiPath } from './node'

export interface wfcCorpApiPath
  extends wfcCorpInfoApiPath,
    wfcCorpCollectApiPath,
    wfcCorpNodeApiPath,
    wfcCorpIntellectualApiPath {}
