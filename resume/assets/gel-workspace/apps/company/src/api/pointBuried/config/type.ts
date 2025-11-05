import { PageModuleEnum } from '@/api/pointBuried/module.ts'

export interface IBuryPointConfig {
  moduleId: number
  pageId: PageModuleEnum
  pageName: string
  describe: string
  opActive?: 'enter' | 'click' | 'filter' | 'switch' | 'scroll' | 'hover' | 'select' | 'view' | 'export' | 'clear'
}
