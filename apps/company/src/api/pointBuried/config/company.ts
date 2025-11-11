import { PageModuleEnum } from '../module'
import { IBuryPointConfig } from './type'

export const CorpBuryIdMap = {
  OverseaCorp: 922602100860,
}
export const companyTracker: IBuryPointConfig[] = [
  {
    moduleId: 922602101140,
    pageId: PageModuleEnum.COMPANY_DETAILS,
    pageName: '企业详情',
    describe: '所属行业/产业-展开更多',
    opActive: 'click',
  },
  {
    moduleId: 922602101141,
    pageId: PageModuleEnum.COMPANY_DETAILS,
    pageName: '企业详情',
    describe: '所属行业/产业-复制',
    opActive: 'click',
  },
  {
    moduleId: 922602101142,
    pageId: PageModuleEnum.PORTABLE_TOOLS,
    pageName: '企业数据浏览器',
    describe: '所属行业/产业',
    opActive: 'click',
  },
]
