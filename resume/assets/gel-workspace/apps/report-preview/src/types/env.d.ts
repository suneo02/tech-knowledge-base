/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string | boolean>> {
  /** API 基础路径 */
  readonly VITE_API_PREFIX: string
  /** 会话ID */
  readonly DEV_WSID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
