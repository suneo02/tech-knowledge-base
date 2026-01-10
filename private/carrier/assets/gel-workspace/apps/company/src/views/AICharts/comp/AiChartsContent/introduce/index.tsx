import React, { useEffect, useState } from 'react'
import AiChartsExcelWelcome from './welcome'
import { ChartModal } from '@/views/Charts/comp/chartModal'
import { AIGRAPH_SEND_TYPE_KEYS, AI_GRAPH_TYPE } from '@/views/AICharts/contansts'
import useGenerateGraph from '@/views/AICharts/hooks/useGenerateGraph'
import { localStorageManager } from '@/utils/storage'
import { Button, Modal } from '@wind/wind-ui'
import { t } from 'gel-util/intl'
import { CorpPresearch } from '@/components/CorpPreSearch'
import { InfoCircleF } from '@wind/icons'
import { getUrlByLinkModule } from '@/handle/link/handle/generateOverall'
import { LinksModule } from '@/handle/link/module/linksModule'
import { AI_GRAPH_ENTITY_TYPE, AI_GRAPH_ENTITY_TYPE_QUESTION } from '@/views/AICharts/contansts'
import { exploreAiGraphAgent } from '@/api/ai-graph'
import { message } from '@wind/wind-ui'
import './modal.less'

interface IntroduceProps {}

const Introduce: React.FC<IntroduceProps> = (props) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [modalTabKey, setModalTabKey] = useState<string>(AIGRAPH_SEND_TYPE_KEYS.MARKDOWN)
  const { handleUploadModalConfirm } = useGenerateGraph()
  const [investigationModalVisible, setInvestigationModalVisible] = useState(false)
  const [investigationModalCorpId, setInvestigationModalCorpId] = useState<string>('')
  const [investigationModalCorpName, setInvestigationModalCorpName] = useState<string>('')

  function removeGelAiGraphContentInStorage() {
    localStorageManager.remove('gel_ai_graph_content')
  }

  // TODO 供应链生成图谱弹框
  function aiGraphSupplyChainModal() {
    setInvestigationModalVisible(true)
  }
  // TODO
  function aiGraphCustomersModal() {
    setInvestigationModalVisible(true)
  }
  // TODO
  function aiGraphCompetitorsModal() {
    setInvestigationModalVisible(true)
  }

  useEffect(() => {
    const localData = localStorageManager.get('gel_ai_graph_content')
    const parsedLocalData = localData ? JSON.parse(localData) : null

    // 入口页，供应链探查跳转过来
    if (parsedLocalData?.[AI_GRAPH_TYPE.AI_GRAPH_SUPPLY_CHAIN]) {
      aiGraphSupplyChainModal()
      removeGelAiGraphContentInStorage()
      return
    }
    if (parsedLocalData?.[AI_GRAPH_TYPE.AI_GRAPH_CUSTOMERS]) {
      aiGraphCustomersModal()
      removeGelAiGraphContentInStorage()
      return
    }
    if (parsedLocalData?.[AI_GRAPH_TYPE.AI_GRAPH_COMPETITORS]) {
      aiGraphCompetitorsModal()
      removeGelAiGraphContentInStorage()
      return
    }
    if (parsedLocalData?.[AI_GRAPH_TYPE.AI_GRAPH_EXCEL]) {
      setModalVisible(true)
      setModalTabKey(AIGRAPH_SEND_TYPE_KEYS.EXCEL)
      removeGelAiGraphContentInStorage()
      return
    }
    if (parsedLocalData?.[AI_GRAPH_TYPE.AI_GRAPH_MARKDOWN]) {
      setModalVisible(true)
      setModalTabKey(AIGRAPH_SEND_TYPE_KEYS.MARKDOWN)
      removeGelAiGraphContentInStorage()
      return
    }
  }, [])

  function handleCardClick(type: string) {
    switch (type) {
      case AI_GRAPH_TYPE.AI_GRAPH_MARKDOWN:
        setModalVisible(true)
        setModalTabKey(AIGRAPH_SEND_TYPE_KEYS.MARKDOWN)
        break
      case AI_GRAPH_TYPE.AI_GRAPH_EXCEL:
        setModalVisible(true)
        setModalTabKey(AIGRAPH_SEND_TYPE_KEYS.EXCEL)
        break
      case AI_GRAPH_TYPE.AI_GRAPH_SUPPLY_CHAIN:
        aiGraphSupplyChainModal()
        break
      case AI_GRAPH_TYPE.AI_GRAPH_CUSTOMERS:
        aiGraphCustomersModal()
        break
      case AI_GRAPH_TYPE.AI_GRAPH_COMPETITORS:
        aiGraphCompetitorsModal()
        break
      default:
        break
    }
  }

  // 文件上传，点击确定生成图谱
  function onModalConfirm(data) {
    handleUploadModalConfirm(data, true)
    setModalVisible(false)
  }

  async function handleExploreAiGraphAgent(entityType: string) {
    const res = await exploreAiGraphAgent({
      entityType,
      entityId: investigationModalCorpId,
      question: investigationModalCorpName + AI_GRAPH_ENTITY_TYPE_QUESTION[entityType],
    })
    // @ts-ignore
    const chatId = res?.snapshotId || ''
    if (chatId) {
      window.open(
        getUrlByLinkModule(LinksModule.GRAPH_AI, {
          params: { chatid: chatId },
        })
      )
      setInvestigationModalVisible(false)
    } else {
      message.error(t('', '生成图谱失败'))
    }
  }

  return (
    <div>
      <AiChartsExcelWelcome handleCardClick={handleCardClick} />
      {/* 导入文件弹窗 */}
      <ChartModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={onModalConfirm}
        initialTabKey={modalTabKey}
      />

      <Modal
        width={640}
        height={480}
        wrapClassName={'ai-graph-modal-container'}
        visible={investigationModalVisible}
        title={t('467795', '供应链探查')}
        onCancel={() => setInvestigationModalVisible(false)}
        footer={[
          <Button key="back" size="large">
            {t('19405', '取消')}
          </Button>,
          <Button
            key="submit"
            {...(investigationModalCorpId ? { type: 'primary' } : {})}
            disabled={!investigationModalCorpId}
            size="large"
            onClick={() => {
              handleExploreAiGraphAgent(AI_GRAPH_ENTITY_TYPE.SUPPLY)
            }}
          >
            {t('467841', '生成图谱')}
          </Button>,
        ]}
      >
        <div className={'ai-graph-modal-content'}>
          <div className={'ai-graph-modal-content-info'}>
            <InfoCircleF
              className={'info-circle-f'}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
            <div>
              {t(
                '',
                '一键洞悉企业供应链结构与流向，将复杂的供应链环节通过图谱直观展示，助力企业高效管理，提前识别潜在风险，优化上下游资源配置，提升协同效率，实现可持续发展'
              )}
            </div>
          </div>
          <div className="ai-graph-modal-content-corp-presearch">
            <span className="ai-graph-modal-content-corp-presearch-required">*</span>
            <span className="ai-graph-modal-content-corp-presearch-label">{t('32914', '公司名称')}:</span>
            <CorpPresearch
              minWidth={500}
              onClickItem={(item) => {
                setInvestigationModalCorpId(item?.corpId)
                setInvestigationModalCorpName(item?.corpName?.replace(/<em>|<\/em>/g, ''))
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Introduce
