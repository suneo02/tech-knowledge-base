export interface TranslateParams {
  cmd: 'apitranslates'
  s: string
}

export interface TranslatePayload {
  transText: string
  // 1: 中文 2: 英文
  sourceLang: 1
  targetLang: 2
  // 来源
  source: 'gel'
}

export interface TranslateResponse {
  message: string
  status: string
  translateResult: Record<string, string>
}
