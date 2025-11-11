import { canadaRows } from '@/components/company/info/rowsByNation/canada.tsx'
import { englandRows } from '@/components/company/info/rowsByNation/england.tsx'
import { franceRows } from '@/components/company/info/rowsByNation/france.tsx'
import { germanyRows } from '@/components/company/info/rowsByNation/germany.tsx'
import { indiaRows } from '@/components/company/info/rowsByNation/india.tsx'
import { italyRows } from '@/components/company/info/rowsByNation/italy.tsx'
import { japanRows } from '@/components/company/info/rowsByNation/japan.tsx'
import { koreaRows } from '@/components/company/info/rowsByNation/korea.tsx'
import { luxRows } from '@/components/company/info/rowsByNation/lux.tsx'
import { malaysiaRows } from '@/components/company/info/rowsByNation/malaysia.tsx'
import { nzlRows } from '@/components/company/info/rowsByNation/nzl.tsx'
import { otherRows } from '@/components/company/info/rowsByNation/other.tsx'
import { russiaRows } from '@/components/company/info/rowsByNation/russia.tsx'
import { singaporeRows } from '@/components/company/info/rowsByNation/singapore.tsx'
import { thaRows } from '@/components/company/info/rowsByNation/tha.tsx'
import { vieRows } from '@/components/company/info/rowsByNation/vie.tsx'
import { TCorpArea } from '@/handle/corp/corpArea'
import { HorizontalTableColumns } from '@/types/WindUI/horizontalTable.ts'
import intl from '@/utils/intl'
import React, { ReactNode } from 'react'
import { ICorpBasicInfoFront } from '../handle'

export const getCorpInfoRowsByArea = (corpArea: TCorpArea) => {
  let updateDiv: ReactNode, rows: HorizontalTableColumns<ICorpBasicInfoFront>
  switch (corpArea) {
    case 'lux': {
      updateDiv = <span className="itemTitle"> {intl('342096', '数据来源')}：卢森堡商业登记处（LBR）</span>
      rows = luxRows
      break
    }
    case 'singapore': {
      updateDiv = <span className="itemTitle"> {intl('342096', '数据来源')}：新加坡会计与企业管理局(ACRA) </span>
      rows = singaporeRows
      break
    }
    case 'japan':
      updateDiv = <span className="itemTitle"> {intl('342096', '数据来源')}：日本国税厅 </span>
      rows = japanRows
      break
    case 'korea':
      rows = koreaRows
      break
    case 'england':
      updateDiv = <span className="itemTitle"> {intl('342096', '数据来源')}：英国公司注册处（GOV.UK）</span>
      rows = englandRows
      break
    case 'Germany':
      updateDiv = <span className="itemTitle"> {intl('342096', '数据来源')}：UNTERNENMENSREGISTER</span>
      rows = germanyRows
      break
    case 'France':
      updateDiv = <span className="itemTitle"> {intl('342096', '数据来源')}：法国企业查询处</span>
      rows = franceRows
      break
    case 'Italy':
      rows = italyRows
      break
    case 'other':
      rows = otherRows
      break
    case 'tha':
      updateDiv = <span className="itemTitle"> {intl('342096', '数据来源')}：泰国DBD政府数据库 </span>
      rows = thaRows
      break
    case 'vie':
      updateDiv = <span className="itemTitle"> {intl('342096', '数据来源')}：越南商业登记管理局 </span>
      rows = vieRows
      break
    case 'nzl':
      updateDiv = <span className="itemTitle"> {intl('342096', '数据来源')}：新西兰商业编号(NZBN)</span>
      rows = nzlRows
      break
    case 'india':
      updateDiv = <span className="itemTitle"> {intl('342096', '数据来源')}：印度公司事务部</span>
      rows = indiaRows
      break
    case 'malaysia':
      updateDiv = <span className="itemTitle"> {intl('342096', '数据来源')}：马来西亚公司委员会</span>
      rows = malaysiaRows
      break
    case 'russia':
      updateDiv = <span className="itemTitle"> {intl('342096', '数据来源')}：俄罗斯联邦税务局</span>
      rows = russiaRows
      break
    default:
      // 美 加
      rows = canadaRows
      break
  }
  return { updateDiv, rows }
}
