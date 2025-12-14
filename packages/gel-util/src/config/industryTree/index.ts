export {
  convertTreeToOptions,
  digitalOptions,
  getIndustryCodeAncestors,
  industryOfNationalEconomyCfgFour,
  industryOfNationalEconomyCfgThree,
  industryOfNationalEconomyCfgTwo,
  translateIndustryCode,
} from './handle'
export { industryOfNationalEconomyCfg } from './industryTree'
export type { IndustryTreeNode } from './type'

import { isEn } from '@/intl'

import AgricultureRelatedIndustryTreeJson from './agricultureRelated.json'
import DigitalIndustryTreeJson from './digital.json'
import AgingCareIndustryTreeJson from './elderlyCare.json'
import GreenIndustryTreeJson from './green.json'
import HighTechManufacturingIndustryTreeJson from './highTechManufacturing.json'
import HighTechServiceIndustryTreeJson from './highTechService.json'
import IntellectualIndustryTreeJson from './intellectual.json'
import RimeTrackIndustryTreeCnJson from './rimeTrackCn.json'
import RimeTrackIndustryTreeEnJson from './rimeTrackEn.json'
import StrategicEmergingIndustryTreeJson from './strategicEmerging.json'
import { IndustryTreeNode } from './type'
import WindIndustryTreeJson from './wind.json'

const AgricultureRelatedIndustryTree: IndustryTreeNode[] = AgricultureRelatedIndustryTreeJson
const DigitalIndustryTree: IndustryTreeNode[] = DigitalIndustryTreeJson
const AgingCareIndustryTree: IndustryTreeNode[] = AgingCareIndustryTreeJson
const GreenIndustryTree: IndustryTreeNode[] = GreenIndustryTreeJson
const HighTechManufacturingIndustryTree: IndustryTreeNode[] = HighTechManufacturingIndustryTreeJson
const HighTechServiceIndustryTree: IndustryTreeNode[] = HighTechServiceIndustryTreeJson
const IntellectualIndustryTree: IndustryTreeNode[] = IntellectualIndustryTreeJson
const StrategicEmergingIndustryTree: IndustryTreeNode[] = StrategicEmergingIndustryTreeJson
const WindIndustryTree: IndustryTreeNode[] = WindIndustryTreeJson
const RimeTrackIndustryTreeEn: IndustryTreeNode[] = RimeTrackIndustryTreeEnJson
const RimeTrackIndustryTreeCn: IndustryTreeNode[] = RimeTrackIndustryTreeCnJson

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
