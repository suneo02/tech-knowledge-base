import React, { useMemo, useEffect, useState, useCallback } from 'react'
import { Layout } from '@wind/wind-ui'
import intl from '@/utils/intl'
import { pointBuriedByModule } from '@/api/pointBuried/bury'
import atlasCglj from '@/assets/imgs/atlas_cglj.png'
import atlasCgx from '@/assets/imgs/atlas_cgx.png'
import atlasDdycd from '@/assets/imgs/atlas_ddycd.png'
import atlasDwtz from '@/assets/imgs/atlas_dwtz.png'
import atlasGlftp from '@/assets/imgs/atlas_glftp.png'
import atlasGqct from '@/assets/imgs/atlas_gqct.png'
import atlasJztp from '@/assets/imgs/atlas_jztp.png'
import atlasQytp from '@/assets/imgs/atlas_qytp.png'
import atlasRzlc from '@/assets/imgs/atlas_rzlc.png'
import atlasRztp from '@/assets/imgs/atlas_rztp.png'
import atlasYsgx from '@/assets/imgs/atlas_ysgx.png'
import atlasYsskr from '@/assets/imgs/atlas_ysskr.png'
import atlasZzsyr from '@/assets/imgs/atlas_zzsyr.png'
import atlasSupplyChain from '@/assets/imgs/atlas_supplyChain.png'
import atlasCompetitors from '@/assets/imgs/atlas_competitors.png'
import atlasCustomers from '@/assets/imgs/atlas_customers.png'
import atlasExcel from '@/assets/imgs/atlas_excel.png'
import atlasMarkdown from '@/assets/imgs/atlas_markdown.png'

import { atlasTreeData } from '../chartMenu/altasMenus'
import { Sender } from '../../../AICharts/comp/AiChat/sender'
import { ChartModal } from '../chartModal'
import { getAIGraphLink } from '@/handle/link/module/KG'
import './index.less'

import { isDeveloper } from '@/utils/common'
import { localStorageManager } from '@/utils/storage'
import { AIGRAPH_SEND_TYPE_KEYS, AI_GRAPH_TYPE } from '../../../AICharts/contansts'
import { createAiGraphChat } from '@/api/ai-graph'
import { t } from 'gel-util/intl'
import { RightO } from '@wind/icons'

const { Content } = Layout

// 图片映射关系
const imgMap = {
  chart_gqct: atlasGqct, // 股权穿透图
  chart_newtzct: atlasDwtz, // 对外投资图
  chart_yskzr: atlasYsskr, // 实控人图谱
  chart_qysyr: atlasZzsyr, // 受益人图谱
  chart_glgx: atlasGlftp, // 关联方图谱
  chart_qytp: atlasQytp, // 企业图谱
  chart_ysgx: atlasYsgx, // 疑似关系
  chart_jztp: atlasJztp, // 竞争图谱
  chart_rztp: atlasRztp, // 融资图谱
  chart_rzlc: atlasRzlc, // 融资历程
  chart_cgx: atlasCgx, // 查关系
  chart_ddycd: atlasDdycd, // 多对一触达
  chart_cglj: atlasCglj, // 持股路径
  ai_graph_supply_chain: atlasSupplyChain,
  ai_graph_competitors: atlasCompetitors,
  ai_graph_customers: atlasCustomers,
  ai_graph_excel: atlasExcel,
  ai_graph_markdown: atlasMarkdown,
}

/**
 * @description 新版图谱平台首页
 * @author bcheng<bcheng@wind.com.cn>
 * @param {Function} onSelectMenu 选中菜单回调
 * @param {Function} onBuildGraph 构建图谱回调
 */
const ChartHome = ({ onSelectMenu, onBuildGraph }) => {
  const [chatInputVal, setChatInputVal] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTabKey, setModalTabKey] = useState<string>(AIGRAPH_SEND_TYPE_KEYS.MARKDOWN)
  const [chatId, setChatId] = useState('')
  const tempHiddenSender = true // 第一版AI图谱暂时隐藏文本输入框

  // 导入Excel相关
  const [excelTaskId, setExcelTaskId] = useState('')
  const [excelFileList, setExcelFileList] = useState([])

  // 导入Markdown相关
  const [markdownTaskId, setMarkdownTaskId] = useState('')
  const [markdownTitle, setMarkdownTitle] = useState('')
  const [markdownText, setMarkdownText] = useState('')

  const tabs = useMemo(
    () => [
      {
        label: t('', 'MarkDown文本生成图谱'),
        key: AIGRAPH_SEND_TYPE_KEYS.MARKDOWN,
      },
      {
        label: t('437889', '文件导入'),
        key: AIGRAPH_SEND_TYPE_KEYS.EXCEL,
      },
    ],
    []
  )

  // 页面埋点
  useEffect(() => {
    pointBuriedByModule(922602100949)
  }, [])

  // 点击右侧卡片跳转
  const jumpPage = (item) => {
    // 跳转到AI图谱
    if (item.key.includes('ai_graph')) {
      const link = getAIGraphLink()
      localStorageManager.set('gel_ai_graph_content', JSON.stringify({ [item.key]: 'true' }))
      window.open(link)
      return
    }
    if (item.externalLink) {
      window.open(item.externalLink)
      return
    }

    if (item.children?.length > 0) {
      // 如果有子菜单，选择第一个子菜单
      onSelectMenu?.(item.children[0].key)
    } else {
      onSelectMenu?.(item.key)
    }
  }

  const handleBuildGraph = (item) => {
    onBuildGraph?.(item)
  }

  const gotoAIBuildGraph = useCallback(
    (val, type) => {
      const link = getAIGraphLink()
      const sendInfo = {
        chatInputVal: val,
        markdownTitle: '',
        markdownText: '',
        markdownTaskId: '',
        excelTaskId: '',
        excelFileList: [],
      }
      if (type === AIGRAPH_SEND_TYPE_KEYS.MARKDOWN) {
        sendInfo.markdownTitle = markdownTitle
        sendInfo.markdownText = markdownText
        sendInfo.markdownTaskId = markdownTaskId
      } else if (type === AIGRAPH_SEND_TYPE_KEYS.EXCEL) {
        sendInfo.excelTaskId = excelTaskId
        sendInfo.excelFileList = excelFileList
      }
      localStorageManager.set('gel_ai_graph_content', JSON.stringify({ ai_graph_sender: sendInfo }))
      window.open(link)
    },
    [markdownText, markdownTaskId, excelTaskId, excelFileList, markdownTitle]
  )

  async function createChat() {
    if (chatId) {
      return chatId
    }
    try {
      const res = await createAiGraphChat()
      res?.data?.id && setChatId(res.data?.id)
    } catch (err) {}
  }

  const openPopup = (key: string) => {
    setModalTabKey(key)
    setModalVisible(true)
    createChat()
  }

  const handleModalConfirm = useCallback((data) => {
    if (data.type === AIGRAPH_SEND_TYPE_KEYS.MARKDOWN) {
      setMarkdownTaskId(data.markdownTaskId || '')
      setMarkdownTitle(data.markdownTitle || '')
      setMarkdownText(data.markdownText || '')
      setChatInputVal('')
      setExcelTaskId('')
      setExcelFileList([])
    } else if (data.type === AIGRAPH_SEND_TYPE_KEYS.EXCEL) {
      setExcelTaskId(data.taskId || '')
      setExcelFileList(data.fileList || [])
      setChatInputVal('')
      setMarkdownTaskId('')
      setMarkdownTitle('')
      setMarkdownText('')
    }
    setModalVisible(false)
  }, [])

  const handleModalCancel = useCallback(() => {
    setModalVisible(false)
  }, [])

  const handleModalVisible = useCallback((bol) => {
    setModalVisible(bol)
  }, [])

  const handleHistoryChat = useCallback(() => {
    const link = getAIGraphLink()
    localStorageManager.set('gel_ai_graph_content', JSON.stringify({ ai_graph_history: 'true' }))
    window.open(link)
  }, [])

  return (
    // @ts-ignore
    <Content
      className={` ${isDeveloper ? 'chart-ai-home-content' : 'chart-home-content'} ${tempHiddenSender ? 'chart-ai-temp-hidden-sender' : ''}`}
    >
      <div className="ap-header">
        <div className="ap-header-left">
          <p className="title">
            <span>{intl('365067', '企业图谱平台')}</span>
            {/* {isDeveloper ? (
              <>
                <span className="history-chat" onClick={handleHistoryChat}>
                  {t('', '历史会话')}
                  <RightO size={16} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />
                </span>
              </>
            ) : null} */}
          </p>
          <p>
            {intl('367255', '一个深度洞察企业股权关系、关联关系的智能可视化平台')}，
            {isDeveloper ? intl('367273', '适用于企业尽调、营销获客、风险监控等多场景') : null}
          </p>
          {isDeveloper ? null : <p>{intl('367273', '适用于企业尽调、营销获客、风险监控等多场景')}</p>}
        </div>

        {!tempHiddenSender && isDeveloper && (
          <div className="ap-header-right">
            <Sender
              value={chatInputVal}
              onChange={setChatInputVal}
              onSend={() => {
                if (!chatInputVal?.trim() && !markdownTaskId && !excelTaskId) {
                  return
                }
                gotoAIBuildGraph(
                  chatInputVal,
                  excelTaskId
                    ? AIGRAPH_SEND_TYPE_KEYS.EXCEL
                    : markdownTaskId
                      ? AIGRAPH_SEND_TYPE_KEYS.MARKDOWN
                      : AIGRAPH_SEND_TYPE_KEYS.SENDER
                )
              }}
              onCancel={() => {}}
              fetching={false}
              excelTaskId={excelTaskId}
              excelFileList={excelFileList}
              markdownTaskId={markdownTaskId}
              markdownTitle={markdownTitle}
              disabled={!!markdownTitle || !!excelFileList?.length}
              onDeleteExcelFile={() => {
                setExcelTaskId('')
                setExcelFileList([])
              }}
              onDeleteMarkdown={() => {
                setMarkdownTaskId('')
                setMarkdownTitle('')
                setMarkdownText('')
              }}
              fileUpload={false}
              onModalConfirm={handleModalConfirm}
              onModalCancel={handleModalCancel}
              modalVisible={modalVisible}
              onModalVisible={handleModalVisible}
              initialModalTabKey={modalTabKey}
            />
            <div className="ap-header-right-item-box">
              <div
                className="ap-header-right-item-markdown"
                onClick={() => {
                  openPopup(tabs[0].key)
                }}
              >
                {t('', 'MarkDown文本生成图谱')}
              </div>
              <div
                className="ap-header-right-item-excel"
                onClick={() => {
                  openPopup(tabs[1].key)
                }}
              >
                {t('467836', '导入Excel生成图谱')}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="ap-content">
        {atlasTreeData.map((item) => {
          return (
            item.key !== 'atlasplatform' && (
              <div className="ap-card" key={item.key}>
                <p className="ap-card-title">{item.title}</p>
                <ul>
                  {item.children.map((childItem) => {
                    if (childItem.type === AI_GRAPH_TYPE.AI_GRAPH_HISTORY) {
                      return null
                    }
                    return (
                      <li
                        onClick={() => jumpPage(childItem)}
                        key={childItem.key}
                        data-uc-id="zsyKJ7TQm_"
                        data-uc-ct="li"
                        data-uc-x={childItem.key}
                      >
                        <p>{childItem.title}</p>
                        <img src={imgMap[childItem.key]} alt={childItem.title} />
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          )
        })}
      </div>

      {/* @ts-ignore */}
      {/* <ChartModal
        visible={modalVisible}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
        chatId={chatId}
        initialTabKey={modalTabKey}
      /> */}
    </Content>
  )
}

export default ChartHome
