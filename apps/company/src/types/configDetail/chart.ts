// chartOptions.ts
import { ICfgDetailNodeCommonJson, IConfigDetailApiJSON, IConfigDetailTitleJSON } from './common.ts'
import { ICfgDetailNodeType } from '@/types/configDetail/module.ts'

export interface IChartOption extends IConfigDetailApiJSON {
  type: 'pie' | 'bar' | 'map'
  height?: number
  position?: string
  shape?: 'ring'

  [key: string]: any
}

export type ICfgChartNodeJson = ICfgDetailNodeCommonJson &
  IConfigDetailTitleJSON &
  IConfigDetailApiJSON & {
    /**
     * ts 枚举2为table, 后续使用ts会有对应枚举，
     */
    type: ICfgDetailNodeType
    chartOptions?: IChartOption
  }
