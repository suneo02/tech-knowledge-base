import { IBuryPointConfig } from './type'
import { PageModuleEnum } from '@/api/pointBuried/module.ts'

export const vipTracker: IBuryPointConfig[] = [
  {
    moduleId: 922602101081,
    pageId: PageModuleEnum.VIP_SERVICE,
    pageName: 'VIP服务',
    describe: 'VIP服务页-点击切换套餐',
    opActive: 'click',
  },
  {
    moduleId: 922602101082,
    pageId: PageModuleEnum.VIP_SERVICE,
    pageName: 'VIP服务',
    describe: 'VIP服务页-点击支付',
    opActive: 'click',
  },
]
