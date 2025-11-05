export {} // Make this file a module

declare global {
  interface External {
    ClientFunc?: (params: string, callback: (data: string | null) => void) => void
  }
  interface Window {
    global_wsid?: string

    /**
     * @deprecated 不推荐使用
     */
    is_terminal?: boolean
  }
}
