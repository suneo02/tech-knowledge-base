import { validateReportDetailNodeJson } from '@/validation'
import { CorpBasicInfo, ReportDetailNodeJson } from 'gel-types'
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

export const corpInfoConfigCanada = validateReportDetailNodeJson(corpInfoConfigCanadaJson)
export const corpInfoConfigSingapore = validateReportDetailNodeJson(corpInfoConfigSingaporeJson)
export const corpInfoConfigVie = validateReportDetailNodeJson(corpInfoConfigVieJson)
export const corpInfoConfigFrance = validateReportDetailNodeJson(corpInfoConfigFranceJson)
export const corpInfoConfigJapan = validateReportDetailNodeJson(corpInfoConfigJapanJson)
export const corpInfoConfigKorea = validateReportDetailNodeJson(corpInfoConfigKoreaJson)
export const corpInfoConfigLux = validateReportDetailNodeJson(corpInfoConfigLuxJson)
export const corpInfoConfigMalaysia = validateReportDetailNodeJson(corpInfoConfigMalaysiaJson)
export const corpInfoConfigNZL = validateReportDetailNodeJson(corpInfoConfigNZLJson)
export const corpInfoConfigRussia = validateReportDetailNodeJson(corpInfoConfigRussiaJson)
export const corpInfoConfigTha = validateReportDetailNodeJson(corpInfoConfigThaJson)
export const corpInfoConfigTW = validateReportDetailNodeJson(corpInfoConfigTWJson)
export const corpInfoConfigGermany = validateReportDetailNodeJson(corpInfoConfigGermanyJson)
export const corpInfoConfigItaly = validateReportDetailNodeJson(corpInfoConfigItalyJson)
export const corpInfoConfigIndia = validateReportDetailNodeJson(corpInfoConfigIndiaJson)
export const corpInfoConfigEngland = validateReportDetailNodeJson(corpInfoConfigEnglandJson)

export const corpConfigMapByAreaCode: Record<CorpBasicInfo['areaCode'], ReportDetailNodeJson> = {
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
