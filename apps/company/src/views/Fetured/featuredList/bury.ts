import { hashParams } from '@/utils/links'
import { commonBuryList } from '@/api/pointBuried/config/index'
import { pointBuriedNew } from '@/api/configApi'

/**
 * 榜单名录列表 需要专门埋点的项
 */
export const featuredListBuryArr = [
  {
    name: '科技型企业名录',
    feturedCode: '01010100',
    buryPoint: 922602100790,
  },
  {
    name: '特色企业名录',
    feturedCode: '01010300',
    buryPoint: 922602100791,
  },
  {
    name: '国企名录',
    feturedCode: '01010200',
    buryPoint: 922602100792,
  },
  {
    name: '高校名录',
    feturedCode: '01010400',
    buryPoint: 922602100788,
  },
  {
    name: '绿色名录',
    feturedCode: '01010500',
    buryPoint: 922602100971,
  },
  {
    name: '符合行业规范条件企业',
    feturedCode: '01010600',
    buryPoint: 922602100972,
  },
]
/**
 * 点击具体名录时埋点
 */
export const handleBuryFeatureCard = (rankName) => {
  try {
    const { getParamValue } = hashParams()
    const featuredListId = getParamValue('id')
    // 如果是需要特殊埋点的名录列表
    const buryConfig = featuredListBuryArr.find((item) => item.feturedCode === featuredListId)
    if (buryConfig) {
      const {
        moduleId: buryModuleId,
        opActive,
        describe,
      } = commonBuryList.find((res) => res.moduleId === buryConfig.buryPoint)
      pointBuriedNew(buryModuleId, { opActive, opEntity: describe, listName: rankName })
    } else {
      // 统一埋点
      const { moduleId: buryModuleId, opActive, describe } = commonBuryList.find((res) => res.moduleId === 922602100973)
      pointBuriedNew(buryModuleId, { opActive, opEntity: describe, listName: rankName })
    }
  } catch (e) {
    console.error(e)
  }
}
