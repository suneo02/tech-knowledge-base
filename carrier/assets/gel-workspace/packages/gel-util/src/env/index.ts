export { type ClientFuncParams, type TerminalUserInfo, type TGelEnv } from './type'

export { getWsidProd, isFromF9, isTerminalTestSite, isWebTest, usedInClient, isLinkSourceF9 } from './misc'

export { callClientFunc, clientGetSessionId, clientGetTerminalUserInfo, clientInitWSID } from './clientFunc'

export { getCurrentEnv } from './getCurrentEnv'

export { WindSessionHeader } from './config'
