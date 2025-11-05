import { validateReportDetailNodeJson } from '@/validation'
import corpBondDefaultJson from './BondDefault.json' assert { type: 'json' }
import corpCancellationRecordJson from './CancellationRecord.json' assert { type: 'json' }
import corpEquityPledgeJson from './EquityPledge.json' assert { type: 'json' }
import corpInspectionCheckJson from './InspectionCheck.json' assert { type: 'json' }
import corpIntellectualPropertyPledgeJson from './IntellectualPropertyPledge.json' assert { type: 'json' }
import corpLiquidationInfoJson from './LiquidationInfo.json' assert { type: 'json' }
import corpManageAbnormalJson from './ManageAbnormal.json' assert { type: 'json' }
import corpProductRecallJson from './ProductRecall.json' assert { type: 'json' }
import corpSeriousViolationJson from './SeriousViolation.json' assert { type: 'json' }
import corpStockPledgeJson from './StockPledge.json' assert { type: 'json' }

import corpTaxDebtJson from './TaxDebt.json' assert { type: 'json' }
import corpTaxViolationJson from './TaxViolation.json' assert { type: 'json' }
import corpViolationPunishmentJson from './ViolationPunishment.json' assert { type: 'json' }
import corpWarrantyInformationJson from './WarrantyInformation.json' assert { type: 'json' }

export const corpBondDefault = validateReportDetailNodeJson(corpBondDefaultJson)

export const corpCancellationRecord = validateReportDetailNodeJson(corpCancellationRecordJson)

export const corpProductRecall = validateReportDetailNodeJson(corpProductRecallJson)

export const corpWarrantyInformation = validateReportDetailNodeJson(corpWarrantyInformationJson)

export const corpViolationPunishment = validateReportDetailNodeJson(corpViolationPunishmentJson)

export const corpTaxViolation = validateReportDetailNodeJson(corpTaxViolationJson)

export const corpTaxDebt = validateReportDetailNodeJson(corpTaxDebtJson)

export const corpManageAbnormal = validateReportDetailNodeJson(corpManageAbnormalJson)

export const corpSeriousViolation = validateReportDetailNodeJson(corpSeriousViolationJson)

export const corpStockPledge = validateReportDetailNodeJson(corpStockPledgeJson)

export const corpEquityPledge = validateReportDetailNodeJson(corpEquityPledgeJson)

export const corpIntellectualPropertyPledge = validateReportDetailNodeJson(corpIntellectualPropertyPledgeJson)

export const corpInspectionCheck = validateReportDetailNodeJson(corpInspectionCheckJson)

export const corpLiquidationInfo = validateReportDetailNodeJson(corpLiquidationInfoJson)
