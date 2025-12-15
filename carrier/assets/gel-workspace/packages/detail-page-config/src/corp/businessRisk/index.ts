import { validateReportDetailNodeOrNodesJson } from '@/validation'
import corpBondDefaultJson from './BondDefault.json' assert { type: 'json' }
import corpCancellationRecordJson from './CancellationRecord.json' assert { type: 'json' }
import corpDoubleRandomInspectionJson from './DoubleRandomInspection.json' assert { type: 'json' }
import corpEquityPledgeJson from './EquityPledge.json' assert { type: 'json' }
import corpInspectionCheckJson from './InspectionCheck.json' assert { type: 'json' }
import corpIntellectualPropertyPledgeJson from './IntellectualPropertyPledge.json' assert { type: 'json' }
import corpLiquidationInfoJson from './LiquidationInfo.json' assert { type: 'json' }
import corpManageAbnormalJson from './ManageAbnormal.json' assert { type: 'json' }
import corpProductRecallJson from './ProductRecall.json' assert { type: 'json' }
import corpSeriousViolationJson from './SeriousViolation.json' assert { type: 'json' }
import corpStockPledgeJson from './StockPledge.json' assert { type: 'json' }

import corpIntegrityInformationJson from './IntegrityInformation.json' assert { type: 'json' }
import corpTaxDebtJson from './TaxDebt.json' assert { type: 'json' }
import corpTaxViolationJson from './TaxViolation.json' assert { type: 'json' }
import corpWarrantyInformationJson from './WarrantyInformation.json' assert { type: 'json' }

export const corpBondDefault = validateReportDetailNodeOrNodesJson(corpBondDefaultJson)

export const corpCancellationRecord = validateReportDetailNodeOrNodesJson(corpCancellationRecordJson)

export const corpProductRecall = validateReportDetailNodeOrNodesJson(corpProductRecallJson)

export const corpWarrantyInformation = validateReportDetailNodeOrNodesJson(corpWarrantyInformationJson)

export const corpIntegrityInformation = validateReportDetailNodeOrNodesJson(corpIntegrityInformationJson)

export const corpTaxViolation = validateReportDetailNodeOrNodesJson(corpTaxViolationJson)

export const corpTaxDebt = validateReportDetailNodeOrNodesJson(corpTaxDebtJson)

export const corpManageAbnormal = validateReportDetailNodeOrNodesJson(corpManageAbnormalJson)

export const corpSeriousViolation = validateReportDetailNodeOrNodesJson(corpSeriousViolationJson)

export const corpStockPledge = validateReportDetailNodeOrNodesJson(corpStockPledgeJson)

export const corpEquityPledge = validateReportDetailNodeOrNodesJson(corpEquityPledgeJson)

export const corpIntellectualPropertyPledge = validateReportDetailNodeOrNodesJson(corpIntellectualPropertyPledgeJson)

export const corpInspectionCheck = validateReportDetailNodeOrNodesJson(corpInspectionCheckJson)

export const corpLiquidationInfo = validateReportDetailNodeOrNodesJson(corpLiquidationInfoJson)

export const corpDoubleRandomInspection = validateReportDetailNodeOrNodesJson(corpDoubleRandomInspectionJson)
