import React, { useState, useCallback, useEffect } from 'react'
import { Modal, Input, Button, message, Collapse } from '@wind/wind-ui'
import AIChartsUpload from '../../../AICharts/comp/AiChartsUpload'
import { localStorageManager } from '@/utils/storage'
import { AIGRAPH_SEND_TYPE_KEYS } from '../../../AICharts/contansts'
import { markdownGraph } from '@/api/ai-graph'
import { t } from 'gel-util/intl'
import './index.less'
import { DownO, UpO } from '@wind/icons'
import AIGraphMarkdown from '@/assets/imgs/ai_graph_markdown_example.png'

const Panel = Collapse.Panel
const { TextArea } = Input

const STRING = {
  STRING_MARKDOWN_EXAMPLE_PLACEHOLDER: `通过#区分层级，#代表中心节点，##代表子节点，###代表二级子节点，您可以根据实际需求调整节点层级`,
  STRING_MARKDOWN_EXAMPLE: `
#人物A
  ##控股
    ###星云控股有限公司
    ###云启资本投资有限公司
    ###智慧创投集团
  ##合作
    ###微云物联网技术有限公司
    ###新纪元自动化有限公司
    ###光速机器人厂商
  ##任职
    ###星云控股有限公司
    ###蓝海科技有限公司
    ###云启资本投资有限公司`,
  STRING_MARKDOWN_EXAMPLE_TITLE: '您可以直接在输入框内粘贴您的MarkDown文本',
}

interface ChartModalProps {
  visible: boolean
  onCancel: () => void
  onConfirm: (data: {
    type: string
    taskId?: string
    fileList?: any[]
    markdownText?: string
    markdownTaskId?: string
    markdownTitle?: string
  }) => void
  initialTabKey?: string
}

/**
 * @description 图谱生成弹窗组件
 * @author bcheng<bcheng@wind.com.cn>
 * @param {boolean} visible 弹窗是否可见
 * @param {Function} onCancel 取消回调
 * @param {Function} onConfirm 确认回调
 * @param {string} initialTabKey 初始选中的标签页
 */
const ChartModal: React.FC<ChartModalProps> = ({
  visible,
  onCancel,
  onConfirm,
  initialTabKey = AIGRAPH_SEND_TYPE_KEYS.MARKDOWN,
}) => {
  const [modalTabKey, setModalTabKey] = useState<string>(initialTabKey)
  const [markdownText, setMarkdownText] = useState('')
  const [tmpExcelTaskId, setTmpExcelTaskId] = useState('')
  const [tmpExcelFileList, setTmpExcelFileList] = useState([])
  const [exampleCollapse, setExampleCollapse] = useState(false)

  // 监听 initialTabKey 变化，更新 modalTabKey
  useEffect(() => {
    setModalTabKey(initialTabKey)
  }, [initialTabKey])

  const tabs = [
    {
      label: 'MarkDown文本生成图谱',
      key: AIGRAPH_SEND_TYPE_KEYS.MARKDOWN,
    },
    {
      label: '文件导入',
      key: AIGRAPH_SEND_TYPE_KEYS.EXCEL,
    },
  ]

  const createMarkdownTask = useCallback(async () => {
    if (!markdownText?.trim()) {
      return
    }

    try {
      const res = await markdownGraph({
        content: markdownText,
      })
      const markdownTaskId = res?.data?.taskId
      const markdownTitle = markdownText.length > 3 ? markdownText.slice(0, 3) + '...' : markdownText
      onConfirm({
        type: AIGRAPH_SEND_TYPE_KEYS.MARKDOWN,
        markdownText,
        markdownTaskId,
        markdownTitle,
      })
    } catch (error) {
      console.error('创建Markdown任务失败:', error)
      message.error(t('', '创建Markdown任务失败，请稍后重试'))
    }
  }, [markdownText, onConfirm])

  const handleConfirm = useCallback(() => {
    if (modalTabKey === AIGRAPH_SEND_TYPE_KEYS.MARKDOWN) {
      createMarkdownTask()
    } else {
      if (tmpExcelTaskId && tmpExcelFileList) {
        onConfirm({
          type: AIGRAPH_SEND_TYPE_KEYS.EXCEL,
          taskId: tmpExcelTaskId,
          fileList: tmpExcelFileList,
        })
      }
    }
  }, [modalTabKey, tmpExcelTaskId, tmpExcelFileList, createMarkdownTask, onConfirm])

  const handleCancel = useCallback(() => {
    setMarkdownText('')
    setTmpExcelTaskId('')
    setTmpExcelFileList([])
    onCancel()
  }, [onCancel])

  const isConfirmDisabled = () => {
    if (modalTabKey === AIGRAPH_SEND_TYPE_KEYS.MARKDOWN) {
      return !markdownText?.trim()
    } else {
      return !tmpExcelTaskId
    }
  }

  const handleCollapseChange = (val) => {
    console.log(val)
    setExampleCollapse((prev) => !prev)
  }

  return (
    <Modal
      width={1013}
      wrapClassName={'ai-graph-modal-container'}
      visible={visible}
      title={
        <div className="ai-graph-modal-tab-container">
          {tabs.map((item) => {
            return (
              <div
                className={`ai-graph-modal-tab-item ${modalTabKey === item.key ? 'active' : ''}`}
                key={item.key}
                onClick={() => setModalTabKey(item.key)}
              >
                {item.label}
              </div>
            )
          })}
        </div>
      }
      onCancel={handleCancel}
      footer={[
        <Button key="back" size="large" onClick={handleCancel}>
          {t('421473', '取消')}
        </Button>,
        <Button
          key="submit"
          size="large"
          disabled={isConfirmDisabled()}
          onClick={handleConfirm}
          {...(!isConfirmDisabled() && { type: 'primary' })}
        >
          {t('215505', '确定')}
        </Button>,
      ]}
    >
      {/* excel文件上传 */}
      {modalTabKey === AIGRAPH_SEND_TYPE_KEYS.EXCEL && (
        <AIChartsUpload
          onUpload={(taskId, fileList) => {
            setTmpExcelTaskId(taskId)
            setTmpExcelFileList(fileList)
          }}
          onCancel={handleCancel}
          footer={false}
        />
      )}

      {/* markdown文本上传 */}
      {modalTabKey === AIGRAPH_SEND_TYPE_KEYS.MARKDOWN && (
        <div>
          <div
            className="ai-graph-modal-markdown-example-collapse"
            style={{ paddingBottom: !exampleCollapse ? 6 : 20 }}
          >
            <div className="ai-graph-modal-markdown-example-collapse-header">
              <p className="ai-graph-modal-markdown-example-collapse-header-tips">{`${exampleCollapse ? '以下' : '展开'}为Markdown文本生成图谱样例，仅供参考`}</p>
              <div>
                <Button
                  type="text"
                  // @ts-expect-error wind-ui-icons
                  icon={exampleCollapse ? <UpO /> : <DownO />}
                  onClick={() => setExampleCollapse((prev) => !prev)}
                >
                  {exampleCollapse ? '收起样例' : '查看样例'}
                </Button>
              </div>
            </div>
            {exampleCollapse && (
              <div className="ai-graph-modal-markdown-example-content">
                <pre className="ai-graph-modal-markdown-example-content-left">{STRING.STRING_MARKDOWN_EXAMPLE}</pre>
                <div className="ai-graph-modal-markdown-example-content-right">
                  <img src={AIGraphMarkdown} alt="" />
                </div>
              </div>
            )}
          </div>

          {!exampleCollapse && (
            <>
              <p className="ai-graph-modal-markdown-example-title">{STRING.STRING_MARKDOWN_EXAMPLE_TITLE}</p>
              <TextArea
                placeholder={STRING.STRING_MARKDOWN_EXAMPLE_PLACEHOLDER}
                autosize={{ minRows: 15, maxRows: 20 }}
                value={markdownText}
                onChange={(e) => setMarkdownText(e.target.value)}
              />
            </>
          )}
        </div>
      )}
    </Modal>
  )
}

export { ChartModal }
