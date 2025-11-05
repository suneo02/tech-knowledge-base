export type TGelEnv = 'terminal' | 'local' | 'web' | 'webTest' | 'terminalWeb'

export type ClientFunc = (params: Record<string, unknown>) => Promise<string>

export interface ClientFuncParams {
  func: string
  isGlobal?: number
  name: string
  [key: string]: unknown
}

export interface TerminalUserInfo {
  userid: string
}
