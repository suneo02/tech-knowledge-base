import { validateReportDetailNodeOrNodesJson } from '@/validation'
import { CorpBasicInfo, ReportDetailNodeOrNodesJson } from 'gel-types'
import corpInfoConfigCanadaJson from './canada.json' assert { type: 'json' }
import corpInfoConfigEnglandJson from './england.json' assert { type: 'json' }
import corpInfoConfigFranceJson from './france.json' assert { type: 'json' }
import corpInfoConfigGermanyJson from './germany.json' assert { type: 'json' }
import corpInfoConfigIndiaJson from './india.json' assert { type: 'json' }
import corpInfoConfigItalyJson from './italy.json' assert { type: 'json' }
import corpInfoConfigJapanJson from './japan.json' assert { type: 'json' }
import corpInfoConfigKoreaJson from './korea.json' assert { type: 'json' }
import corpInfoConfigLuxJson from './lux.json' assert { type: 'json' }
import corpInfoConfigMalaysiaJson from './malaysia.json' assert { type: 'json' }
import corpInfoConfigNZLJson from './nzl.json' assert { type: 'json' }
import corpInfoConfigRussiaJson from './russia.json' assert { type: 'json' }
import corpInfoConfigSingaporeJson from './singapore.json' assert { type: 'json' }
import corpInfoConfigThaJson from './tha.json' assert { type: 'json' }
import corpInfoConfigTWJson from './TW.json' assert { type: 'json' }
import corpInfoConfigVieJson from './vie.json' assert { type: 'json' }

export const corpInfoConfigCanada = validateReportDetailNodeOrNodesJson(corpInfoConfigCanadaJson)
export const corpInfoConfigSingapore = validateReportDetailNodeOrNodesJson(corpInfoConfigSingaporeJson)
export const corpInfoConfigVie = validateReportDetailNodeOrNodesJson(corpInfoConfigVieJson)
export const corpInfoConfigFrance = validateReportDetailNodeOrNodesJson(corpInfoConfigFranceJson)
export const corpInfoConfigJapan = validateReportDetailNodeOrNodesJson(corpInfoConfigJapanJson)
export const corpInfoConfigKorea = validateReportDetailNodeOrNodesJson(corpInfoConfigKoreaJson)
export const corpInfoConfigLux = validateReportDetailNodeOrNodesJson(corpInfoConfigLuxJson)
export const corpInfoConfigMalaysia = validateReportDetailNodeOrNodesJson(corpInfoConfigMalaysiaJson)
export const corpInfoConfigNZL = validateReportDetailNodeOrNodesJson(corpInfoConfigNZLJson)
export const corpInfoConfigRussia = validateReportDetailNodeOrNodesJson(corpInfoConfigRussiaJson)
export const corpInfoConfigTha = validateReportDetailNodeOrNodesJson(corpInfoConfigThaJson)
export const corpInfoConfigTW = validateReportDetailNodeOrNodesJson(corpInfoConfigTWJson)
export const corpInfoConfigGermany = validateReportDetailNodeOrNodesJson(corpInfoConfigGermanyJson)
export const corpInfoConfigItaly = validateReportDetailNodeOrNodesJson(corpInfoConfigItalyJson)
export const corpInfoConfigIndia = validateReportDetailNodeOrNodesJson(corpInfoConfigIndiaJson)
export const corpInfoConfigEngland = validateReportDetailNodeOrNodesJson(corpInfoConfigEnglandJson)

export const corpConfigMapByAreaCode: Record<CorpBasicInfo['areaCode'], ReportDetailNodeOrNodesJson> = {
  // America 美国和 加拿大相同
  '180401': corpInfoConfigCanada,
  // Canada
  '180402': corpInfoConfigCanada,
  // Singapore
  '180101': corpInfoConfigSingapore,
  // Japan
  '180102': corpInfoConfigJapan,
  // Korea
  '180114': corpInfoConfigKorea,
  // England
  '180201': corpInfoConfigEngland,
  // Germany
  '180202': corpInfoConfigGermany,
  // France
  '180203': corpInfoConfigFrance,
  // Italy
  '180204': corpInfoConfigItaly,
  // Thailand
  '180120': corpInfoConfigTha,
  // Vietnam
  '180104': corpInfoConfigVie,
  // New Zealand
  '180602': corpInfoConfigNZL,
  // Luxembourg
  '180205': corpInfoConfigLux,
  // India
  '180111': corpInfoConfigIndia,
  // Malaysia
  '180117': corpInfoConfigMalaysia,
  // Russia
  '180235': corpInfoConfigRussia,
  // Taiwan
  '030407': corpInfoConfigTW,
}
