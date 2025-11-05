import { corpInfoConfigHK } from '../rowsByCorpTypeId'

import { validateReportDetailNodeJson } from '@/validation'
import { CorpBasicInfo, ReportDetailNodeJson } from 'gel-types'
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

export const corpInfoConfigFCP = validateReportDetailNodeJson(corpInfoConfigFCPJson)
export const corpInfoConfigGOV = validateReportDetailNodeJson(corpInfoConfigGOVJson)
export const corpInfoConfigFPC = validateReportDetailNodeJson(corpInfoConfigFPCJson)
export const corpInfoConfigIIP = validateReportDetailNodeJson(corpInfoConfigIIPJson)
export const corpInfoConfigNGO = validateReportDetailNodeJson(corpInfoConfigNGOJson)
export const corpInfoConfigOE = validateReportDetailNodeJson(corpInfoConfigOEJson)
export const corpInfoConfigPE = validateReportDetailNodeJson(corpInfoConfigPEJson)
export const corpInfoConfigSOE = validateReportDetailNodeJson(corpInfoConfigSOEJson)
export const corpInfoConfigSPE = validateReportDetailNodeJson(corpInfoConfigSPEJson)

export const corpInfoConfigCO = validateReportDetailNodeJson(corpInfoConfigCOJson)

export const corpConfigMapByConfigType: Record<CorpBasicInfo['configType'], ReportDetailNodeJson | undefined> = {
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
