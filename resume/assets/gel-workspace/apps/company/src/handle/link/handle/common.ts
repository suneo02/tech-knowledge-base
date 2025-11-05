import { GelHashMap, HTMLPath, LinksModule, TLinkOptions } from '@/handle/link'
import { getPrefixUrl } from '@/handle/link/handle/prefixUrl.ts'

/**
 * 拼接 url 路径
 * 主要是用来拼接 index.html 路径
 * @param pathname
 * @param append
 * @returns {`${*}/index.html`}
 */
export const handleAppendUrlPath = (pathname, append = HTMLPath.index) => {
  return `${pathname.replace(/\/$/, '')}/${append}`
}
/**
 * 通用 gel 应用 链接生成函数
 * @param hash - 路由哈希值
 * @param params - URL参数
 * @param options - 额外配置项
 */
export const generateCommonLink = ({
  module,
  params = {},
  env,
  options = {},
}: {
  module: LinksModule
  params?: TLinkOptions['params']
  env?: TLinkOptions['env']
  options?: {
    skipPathAppend?: boolean
  }
}) => {
  try {
    const baseUrl = new URL(
      getPrefixUrl({
        envParam: env,
      })
    )

    if (!options.skipPathAppend) {
      baseUrl.pathname = handleAppendUrlPath(baseUrl.pathname)
    }

    const hash = GelHashMap[module] ?? ''
    // 公司模块特殊处理 无hash值
    if (!hash && module !== LinksModule.COMPANY) {
      console.error(`未找到模块${module}对应的hash值`)
    }
    baseUrl.hash = hash
    baseUrl.search = new URLSearchParams(
      Object.fromEntries(Object.entries(params).map(([key, value]) => [key, String(value)]))
    ).toString()

    return baseUrl.toString()
  } catch (e) {
    console.error(e)
  }
}
