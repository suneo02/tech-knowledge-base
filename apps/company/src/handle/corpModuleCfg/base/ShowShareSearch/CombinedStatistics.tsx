import { expandHandle } from '@/components/company/corpCompMisc'
import LongTxtMergenceLabel from '@/handle/corpModuleCfg/base/ShowShareSearch/LongTxtMergenceLabel'
import { ShareholderBreakthroughCombined } from 'gel-types'
import React from 'react'

/**
 * 股东穿透-合并统计-持股路径
 */
export const ShowShareSearchLayerByMergeSharePath: React.FC<{
  row: ShareholderBreakthroughCombined
}> = ({ row }) => {
  // type为2
  const data = row.shareRoute
  if (data && data.length > 0) {
    const id = row.shareholderId || row.shareholderName
    return <LongTxtMergenceLabel data={data} expand={expandHandle} id={id} code={row.windId} rowType={row.type} />
  } else {
    return '--'
  }
}
