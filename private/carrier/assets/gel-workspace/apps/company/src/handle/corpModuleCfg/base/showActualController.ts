import { CorpSubModuleCfg } from '@/types/corpDetail'

export const corpDetailBaseActualCtrl: CorpSubModuleCfg = {
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
