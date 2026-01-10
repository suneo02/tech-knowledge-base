export type TGelEnv =
  // 终端
  | 'terminal'
  // 本地
  | 'local'
  // web
  | 'web'
  // web 测试
  | 'webTest'

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
