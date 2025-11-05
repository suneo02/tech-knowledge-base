import { PageModuleEnum } from '../../module'
import { IBuryPointConfig } from '../type'

export const dataExportReviewBuryList: IBuryPointConfig[] = [
  {
    moduleId: 922610400001,
    pageId: PageModuleEnum.DATA_EXPORT_REVIEW,
    pageName: '企业库',
    describe: '访问企业详情页',
    opActive: 'enter',
  },
  {
    moduleId: 922610400002,
    pageId: PageModuleEnum.DATA_EXPORT_REVIEW,
    pageName: '企业库',
    describe: '用户导出了哪家企业的报告',
    opActive: 'click',
  },
]
