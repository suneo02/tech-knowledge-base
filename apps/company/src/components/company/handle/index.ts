import { CorpBasicInfo } from '@/api/corp/info/basicInfo.ts'
import { listRowConfig } from '@/components/company/listRowConfig.tsx'
import { getIfIndividualBusiness } from '@/handle/corp/corpType'
import { bussRisk } from '@/handle/corpModuleCfg/bussRisk/bussRisk.tsx'
import { risk } from '@/handle/corpModuleCfg/risk/risk.tsx'
import { corpModuleCfgIIP } from '@/handle/corpModuleCfgSpecial/IIP.tsx'
import { getVipInfo } from '@/lib/utils.tsx'
import { wftCommon } from '@/utils/utils.tsx'
import { useMemo } from 'react'
import { ICorpPrimaryModuleCfg } from '../type/index.ts'

export * from './miscT.ts'

/**
 * 获得各个类型企业详情的配置
 *
 * TODO 待将国外企业的详情配置放在此处
 * @author suneo
 * @param corpType
 * @param corpTypeId
 */
export const useCorpModuleCfg = (corpType: CorpBasicInfo['corp_type'], corpTypeId?: CorpBasicInfo['corp_type_id']) => {
  const userVipInfo = getVipInfo()
  return useMemo(() => {
    let res: ICorpPrimaryModuleCfg[]
    if (getIfIndividualBusiness(corpType, corpTypeId)) {
      res = corpModuleCfgIIP
    } else {
      res = listRowConfig
    }
    // 如果是海外用户，那么去除司法风险和经营风险，这两个模块是一级模块，需要手动去除，其余模块由后端统计数字控制
    if (wftCommon.is_overseas_config) {
      res = res.filter((module) => {
        if (!module.moduleTitle) {
          return true
        }
        return ![bussRisk.moduleTitle.moduleKey, risk.moduleTitle.moduleKey].includes(module.moduleTitle.moduleKey)
      })
    }
    return res
  }, [corpType, corpTypeId, userVipInfo])
}
