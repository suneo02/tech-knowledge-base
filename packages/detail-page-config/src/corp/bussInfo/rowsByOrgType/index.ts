import { corpInfoConfigHK } from '../rowsByCorpTypeId'

import { validateReportDetailNodeOrNodesJson } from '@/validation'
import { CorpBasicInfo, ReportDetailNodeOrNodesJson } from 'gel-types'
import corpInfoConfigCOJson from '../CO.json' assert { type: 'json' }
import corpInfoConfigFCPJson from './FCP.json' assert { type: 'json' }
import corpInfoConfigFPCJson from './FPC.json' assert { type: 'json' }
import corpInfoConfigGOVJson from './GOV.json' assert { type: 'json' }
import corpInfoConfigIIPJson from './IIP.json' assert { type: 'json' }
import corpInfoConfigNGOJson from './NGO.json' assert { type: 'json' }
import corpInfoConfigOEJson from './OE.json' assert { type: 'json' }
import corpInfoConfigPEJson from './PE.json' assert { type: 'json' }
import corpInfoConfigSOEJson from './SOE.json' assert { type: 'json' }
import corpInfoConfigSPEJson from './SPE.json' assert { type: 'json' }

export const corpInfoConfigFCP = validateReportDetailNodeOrNodesJson(corpInfoConfigFCPJson)
export const corpInfoConfigGOV = validateReportDetailNodeOrNodesJson(corpInfoConfigGOVJson)
export const corpInfoConfigFPC = validateReportDetailNodeOrNodesJson(corpInfoConfigFPCJson)
export const corpInfoConfigIIP = validateReportDetailNodeOrNodesJson(corpInfoConfigIIPJson)
export const corpInfoConfigNGO = validateReportDetailNodeOrNodesJson(corpInfoConfigNGOJson)
export const corpInfoConfigOE = validateReportDetailNodeOrNodesJson(corpInfoConfigOEJson)
export const corpInfoConfigPE = validateReportDetailNodeOrNodesJson(corpInfoConfigPEJson)
export const corpInfoConfigSOE = validateReportDetailNodeOrNodesJson(corpInfoConfigSOEJson)
export const corpInfoConfigSPE = validateReportDetailNodeOrNodesJson(corpInfoConfigSPEJson)

export const corpInfoConfigCO = validateReportDetailNodeOrNodesJson(corpInfoConfigCOJson)

export const corpConfigMapByConfigType: Record<CorpBasicInfo['configType'], ReportDetailNodeOrNodesJson | undefined> = {
  CO: corpInfoConfigCO,
  FCP: corpInfoConfigFCP,
  GOV: corpInfoConfigGOV,
  FPC: corpInfoConfigFPC,
  IIP: corpInfoConfigIIP,
  NGO: corpInfoConfigNGO,
  OE: corpInfoConfigOE,
  PE: corpInfoConfigPE,
  HK: corpInfoConfigHK,
  SOE: corpInfoConfigSOE,
  SPE: corpInfoConfigSPE,
  '00': undefined,
}
