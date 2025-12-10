import { validateReportDetailNodeOrNodesJson } from '@/validation'
import { CorpBasicInfo, ReportDetailNodeOrNodesJson } from 'gel-types'
import corpInfoConfigHKJson from './HK.json' assert { type: 'json' }
import corpInfoConfigLSJson from './LS.json' assert { type: 'json' }
import corpInfoConfigSHJson from './SH.json' assert { type: 'json' }

export const corpInfoConfigHK = validateReportDetailNodeOrNodesJson(corpInfoConfigHKJson)

/**
 * 企业工商信息配置 律所
 */
export const corpInfoConfigLS = validateReportDetailNodeOrNodesJson(corpInfoConfigLSJson)

/**
 * 企业工商信息配置 社会组织
 */
export const corpInfoConfigSH = validateReportDetailNodeOrNodesJson(corpInfoConfigSHJson)

export const corpTypeIdMap: Record<number, string> = {
  298010000: '企业',
  298020000: '农民专业合作社',
  298030000: '个体工商户',
  298040000: '其他机构',
  298050000: '海外上市公司',
  298060000: '香港注册企业',
  298070000: '美国',
  298080000: '英国',
  2980890000: '海外公司',
  160100000: '党',
  160200000: '军',
  160300000: '政府机构',
  160400000: '人大',
  160500000: '政协',
  160600000: '法院',
  160700000: '检察院',
  160800000: '共青团',
  160900000: '社会组织',
  161000000: '主席',
  161100000: '民主党派',
  161600000: '人民团体',
  1609020100: '社会团体',
  1609020200: '民办非企业单位',
  1609020300: '基金会',
  1609020400: '境外基金会代表机构',
  1609020500: '国际性社团',
  1609020600: '外国商会',
  1609020700: '涉外基金会',
  1609010100: '社会团体',
  1609010200: '民办非企业单位',
  1609010300: '基金会',
  1609010400: '境外基金会代表机构',
  1609010500: '国际性社团',
  1609010600: '外国商会',
  1609010700: '涉外基金会',
  160307000: '事业单位',
  912034101: '律所',
}

export const corpStateSHList = [
  '社会组织',
  '社会团体',
  '民办非企业单位',
  '基金会',
  '境外基金会代表机构',
  '国际性社团',
  '外国商会',
  '涉外基金会',
  '社会团体',
  '民办非企业单位',
  '基金会',
  '境外基金会代表机构',
  '国际性社团',
  '外国商会',
  '涉外基金会',
]
export const getCorpConfigMapByCorpTypeId = (
  corpTypeId: CorpBasicInfo['corp_type_id']
): ReportDetailNodeOrNodesJson | undefined => {
  if (corpStateSHList.indexOf(corpTypeIdMap[corpTypeId]) !== -1) {
    return corpInfoConfigSH
  }
  if (corpTypeId == 912034101) {
    return corpInfoConfigLS
  }
  return undefined
}
