import { AxiosInstance } from 'axios'
import { BuryAction, postPointBuriedWithAxios, RAGItem, RAGType, WindSessionHeader } from 'gel-api'
import { usedInClient } from 'gel-util/env'
import { t } from 'gel-util/intl'
import { ETerminalCommandId, getTerminalCommandLink, handleJumpTerminalCompatible } from 'gel-util/link'
import { useCallback, useMemo, useState } from 'react'

/**
 * 生成独立web链接
 * @param hash
 * @returns
 */
const generateWebUrl = (hash: string, isDev: boolean, wsid: string): string => {
  return `https://wx.wind.com.cn${hash}&${WindSessionHeader}=${wsid}`
}

// Mock function for the original imports (same as in ChatReference)
const intl = (key: string): string => {
  const translations: Record<string, string> = {
    RefTagN: t('421501', '资讯'),
    RefTagA: t('421487', '公告'),
    RefTagR: t('421502', '研报'),
    RefTagRN: t('', '热点'),
    RefTagDPU: t('454654', '数据'),
    RefTagYQ: t('421503', '舆情'),
    RefTagL: t('', '法规'),
  }
  return translations[key] || key
}

type RefLinkResult = {
  refUrl: string // 跳转链接
  handleRefJump: () => void // 跳转方法
  showModal: boolean // 是否显示弹窗
  closeModal: () => void // 关闭弹窗方法
  tagText: string // 参考资料类型文本 如 研报，资讯，新闻，公告，舆情，3C会议
}

/**
 * 参考资料reg数据跳转相关的自定义Hook，仅提供跳转链接和跳转方法
 * @param data   QueryReferenceSuggest数据
 * @returns 返回refUrl, handleRefJump和Modal相关状态
 * 当是研报时，需要显示弹窗提示 用showModal和closeModal控制
 */
export const useRefLink = (
  data: RAGItem,
  isDev: boolean,
  wsid: string,
  entWebAxiosInstance: AxiosInstance
): RefLinkResult => {
  const { text = '', type = '', windcode, docIdEncry, chunk = {} } = data
  const [showModal, setShowModal] = useState(false)

  const url = chunk?.url || ''

  // 是否是终端内
  const isTerminal = useMemo(() => {
    return usedInClient()
  }, [])

  const refUrl = useMemo(() => {
    switch (type) {
      // 新闻 、热点
      case 'N':
      case 'RN':
        // 独立web
        if (!isTerminal) {
          return generateWebUrl(`/SmartReaderWeb/SmartReader/?type=1&id=${docIdEncry}`, isDev, wsid)
        }
        return getTerminalCommandLink(ETerminalCommandId.NEWS, {
          docIdEncry,
          title: text,
        })
      // 公告
      case 'A':
        // if (!isTerminal) {
        //   return generateWebUrl(`/AliceReaderWeb/index.html?type=2&id=${windcode}`, isDev, wsid)
        // }
        return getTerminalCommandLink(ETerminalCommandId.ANNOUNCEMENT, {
          windcode: docIdEncry || windcode,
          title: text,
        })
      // 研报
      case 'R':
        return getTerminalCommandLink(ETerminalCommandId.RESEARCH, {
          windcode: docIdEncry || windcode,
          title: text,
        })
      case 'L':
        return generateWebUrl(`/SmartReaderWeb/SmartReader/?type=5&id=${windcode}`, isDev, wsid)
      // 舆情
      case 'YQ':
        return url
      // 3C会议
      case '3C':
        return `https://peacallServer/RTCWeb/pc/index.html#/liveRoom?liveId=${windcode}`
      default:
        return ''
    }
  }, [isTerminal, text, windcode, docIdEncry, url, type])

  const handleRefJump = useCallback(() => {
    console.log('🚀 ~ handleRefJump ~ refUrl:', refUrl)
    postPointBuriedWithAxios(entWebAxiosInstance, BuryAction.VIEW_REFERENCE_DETAIL, {
      type: type as RAGType,
    })

    // 公告只让终端看
    if (type === 'A' && !isTerminal) {
      setShowModal(true)
      return
    }
    // 研报只让终端看
    if (type === 'R' && !isTerminal) {
      setShowModal(true)
      return
    }

    if (refUrl) {
      handleJumpTerminalCompatible(refUrl, false)
    }
  }, [refUrl, type, isTerminal])

  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])

  const tagText = useMemo(() => {
    return intl(`RefTag${type}`)
  }, [type])

  return {
    refUrl: refUrl || '',
    handleRefJump,
    showModal,
    closeModal,
    tagText,
  }
}
