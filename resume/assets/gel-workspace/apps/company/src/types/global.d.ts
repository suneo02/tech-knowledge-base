// 引入 jQuery 类型定义
import { CorpBasicNum } from '@/api/corp/basicNum.ts'

export {} // 确保文件被视为模块

declare global {
  interface External {
    ClientFunc?: (params: string, callback?: (res: string) => void) => void | string
  }

  interface Window {
    location: any
    // jQuery 对象类型，使用 @types/jquery 提供的类型定义
    $: JQuery.Static
    d3: any
    _CompanyChart: any
    /**
     * 是否英文访问
     * @deprecated 使用 isEn 代替
     */
    en_access_config: boolean
    /**
     * 是否海外配置
     */
    is_overseas_config: boolean
    /**
     * 是否在终端中访问
     */
    is_terminal: boolean
    external: External
    __GELCOMPANYCODE__: string
    company_name: string

    /**
     * 企业 id
     */
    __GELCORPID__: string
    COMPANY_TABLE_DETAIL_TIMER: boolean

    /**
     * 企业名称
     */
    __GELCOMPANYNAME__?: string
    __GELCOMPANYNAMEEN__?: string
    __GELCOMPANYID__?: string

    /**
     * 统计数字
     */
    __GELBASICNUM__?: CorpBasicNum

    __GELCOMPANYCODE__?: string

    __GELWINDCODE__?: string

    __GLOBAL__ZHKEYS__?: any
    global_wsid?: any
    aesDecrypt: any
    aesEncrypt: any
    layer?: any
    d3Zoom: any
    defaultOpen?: boolean
    bfqyjsInvoked?: boolean
    globaluserinfo4gel?: any
    /**
     * 南京政务平台sdk
     */
    lx: any

    /**
     * Development debug properties
     */
    noIntls?: string[]
    emptyIntls?: Array<Record<string, string>>
    emptyIntlsIds?: string[]
    emptyIntlsObj?: Record<string, string>
    toastEl: any
    layer?: any
  }
}
