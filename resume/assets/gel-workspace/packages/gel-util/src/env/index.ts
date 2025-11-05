export { type ClientFuncParams, type TerminalUserInfo, type TGelEnv } from './type'

export { getWSID, getWsidProd, isWebTest, usedInClient, isFromF9 } from './misc'

export * from './clientFunc'

export { getCurrentEnv } from './getCurrentEnv'

export const WindSessionHeader = 'wind.sessionid'
