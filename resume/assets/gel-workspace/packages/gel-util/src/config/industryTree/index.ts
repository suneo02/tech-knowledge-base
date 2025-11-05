export * from './handle'
export * from './industryTree'
export * from './type'

import { isEn } from '@/intl'

import AgricultureRelatedIndustryTree from './agricultureRelated.json'
import DigitalIndustryTree from './digital.json'
import AgingCareIndustryTree from './elderlyCare.json'
import GreenIndustryTree from './green.json'
import HighTechManufacturingIndustryTree from './highTechManufacturing.json'
import HighTechServiceIndustryTree from './highTechService.json'
import IntellectualIndustryTree from './intellectual.json'
import RimeTrackIndustryTreeCn from './rimeTrackCn.json'
import RimeTrackIndustryTreeEn from './rimeTrackEn.json'
import StrategicEmergingIndustryTree from './strategicEmerging.json'
import WindIndustryTree from './wind.json'

export { globalElectronEconomy } from './electronEconomyTree'
export { globalLowCarbon } from './lowCarbonTree'
export { globalStrategicEmergingIndustry } from './strategicEmergingIndustryTree'

const RimeTrackIndustryTree = isEn() ? RimeTrackIndustryTreeEn : RimeTrackIndustryTreeCn

export const industryTree = {
  AgricultureRelatedIndustryTree,
  DigitalIndustryTree,
  AgingCareIndustryTree,
  GreenIndustryTree,
  HighTechManufacturingIndustryTree,
  HighTechServiceIndustryTree,
  IntellectualIndustryTree,
  StrategicEmergingIndustryTree,
  WindIndustryTree,
  RimeTrackIndustryTree,
}
