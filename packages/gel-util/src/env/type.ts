export type TGelEnv =
  // 终端
  | 'terminal'
  // 本地
  | 'local'
  // web
  | 'web'
  // web 测试
  | 'webTest'
  // 终端 web ，即通过浏览器访问
  | 'terminalWeb'

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
