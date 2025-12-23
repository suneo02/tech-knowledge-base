import areaTreeCNMainlandJson from './areaTreeCNMainland.json'
import areaTreeForeignJson from './areaTreeForeign.json'
import areaTreeHKJson from './areaTreeHK.json'
import areaTreeMacaoJson from './areaTreeMacao.json'
import areaTreeTwJson from './areaTreeTw.json'
import { AreaTreeNode } from './type'

export { areaTreeMapOversea } from './areaTreeMapOversea'

const areaTreeForeign: AreaTreeNode[] = areaTreeForeignJson
const areaTreeGlobalCn: AreaTreeNode = areaTreeCNMainlandJson
const areaTreeHK: AreaTreeNode = areaTreeHKJson
const areaTreeMaco: AreaTreeNode = areaTreeMacaoJson
const areaTreeTw: AreaTreeNode = areaTreeTwJson

export const globalAreaTreeCn: AreaTreeNode[] = areaTreeGlobalCn.node || []
export const globalAreaTree = [...globalAreaTreeCn, areaTreeHK, areaTreeMaco, areaTreeTw]

export const areaTreeGlobalForSearch: AreaTreeNode[] = [
  areaTreeGlobalCn,
  areaTreeHK,
  areaTreeMaco,
  areaTreeTw,
  ...areaTreeForeign,
]
