import { CorpState } from './company.types'
import { HomeState } from './home.types.ts'

export interface IState {
  company: CorpState
  home: HomeState
}
