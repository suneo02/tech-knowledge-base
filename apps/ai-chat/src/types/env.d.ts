/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string | boolean>> {
  /** API 基础路径 */
  readonly VITE_API_URL: string
  /** 会话ID */
  readonly VITE_SESSION_ID: string
  /** 会话ID密钥 */
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
