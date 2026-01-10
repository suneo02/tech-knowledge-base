import { TCorpDetailSubModule } from 'gel-types'
import { ChatTypeEnum } from './enums'
import { ChatRawSentenceIdentifier, ChatRawSentenceIdIdentifier } from './identfiers'

export interface DPUTableHeader {
  DataType: 'string' | 'double' | 'composite' // 数据类型 composite为需要跳转的
  Id: string // 表头ID
  Name: string // 表头名称
  // Magnitudes?: string //没用到
}

export interface DPUItem extends ChatRawSentenceIdentifier {
  Headers: DPUTableHeader[] // 表头
  Content: (string | number | null)[][] // 表内容
  Total: number // 总条数
  NewName: string // 新名称
  moduleID?: TCorpDetailSubModule

  id: string
}

export interface WithDPUList {
  dpuList: DPUItem[]
}

// dpu数据显示图表类型 重复导致报错了
// export enum ChatTypeEnum {
//   BAR = 1, // 柱状图
//   LINE = 2, // 折线图
//   PIE = 3, // 饼图
//   // SPEED = 4, // 行情图
//   DOT = 5, // 散点图
// }

export interface ChatDPUResponse extends ChatRawSentenceIdIdentifier {
  data?: Array<DPUItem>
  datasource: string
  model: {
    Expression?: string
    ExpendTime: string
  }
  text: string
  chart?: ChatTypeEnum
}
