import { ICorpSubModuleCfg } from '@/components/company/type'

export const corpDetailBaseActualCtrl: ICorpSubModuleCfg = {
  modelNum: ['actualcontrollerPublishCount', 'actualcontrollerCalcCount'],
  children: [
    {
      modelNum: 'actualcontrollerPublishCount',
    },
    {
      modelNum: 'actualcontrollerCalcCount',
    },
  ],
}
