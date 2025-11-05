import { IBuryPointConfig } from '@/api/pointBuried/config/type.ts'

import { PageModuleEnum } from '@/api/pointBuried/module.ts'

export const corpOverseaBuryList: IBuryPointConfig[] = [
  {
    moduleId: 922602101020,
    pageId: PageModuleEnum.OVERSEAS_COMPANY_DETAILS,
    pageName: 'PC-海外企业详情页',
    describe: '海外企业详情-报告导出',
    opActive: 'click',
  },
]
