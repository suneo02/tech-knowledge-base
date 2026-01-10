import { corpInfoCORows } from '@/components/company/info/rowsByOrgType/CO.tsx'
import { corpInfoFCPRows } from '@/components/company/info/rowsByOrgType/FCP.tsx'
import { corpInfoFPCRows } from '@/components/company/info/rowsByOrgType/FPC.tsx'
import { corpInfoGOVRows } from '@/components/company/info/rowsByOrgType/GOV.tsx'
import { getIndividualBusinessRows } from '@/components/company/info/rowsByOrgType/IIP.tsx'
import { corpInfoNGORows } from '@/components/company/info/rowsByOrgType/NGO.tsx'
import { corpInfoOERows } from '@/components/company/info/rowsByOrgType/OE.tsx'
import { corpInfoPERows } from '@/components/company/info/rowsByOrgType/PE.tsx'
import { corpInfoSOERows } from '@/components/company/info/rowsByOrgType/SOE.tsx'
import { corpInfoSPERows } from '@/components/company/info/rowsByOrgType/SPE.tsx'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import { CorpBasicInfo } from 'gel-types'

export const getCorpInfoRowsByOrg = (
  baseInfo: Partial<CorpBasicInfo>,
  onClickFeedback: () => void
): HorizontalTableColumns => {
  try {
    switch (baseInfo.configType) {
      case 'GOV':
        return corpInfoGOVRows(baseInfo)
      case 'SOE':
        return corpInfoSOERows(baseInfo)
      case 'NGO':
        return corpInfoNGORows(baseInfo)
      case 'PE':
        return corpInfoPERows(baseInfo, onClickFeedback)
      case 'FCP':
        return corpInfoFCPRows(baseInfo, onClickFeedback)
      case 'FPC':
        return corpInfoFPCRows(baseInfo, onClickFeedback)
      case 'OE':
        return corpInfoOERows(baseInfo, onClickFeedback)
      case 'SPE':
        return corpInfoSPERows(baseInfo, onClickFeedback)
      case 'IIP':
        return getIndividualBusinessRows(baseInfo, onClickFeedback)
      case 'CO':
        return corpInfoCORows(baseInfo, onClickFeedback)
    }
    return null
  } catch (e) {
    console.error(e)
    return null
  }
}
