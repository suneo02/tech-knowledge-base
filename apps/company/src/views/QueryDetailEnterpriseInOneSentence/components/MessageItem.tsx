import React, { useState, useRef, useCallback } from 'react'
import { USER_AVATAR, AI_AVATAR } from '../chat'
import CollapsibleInfo from './CollapsibleInfo'
import { SyncOutlined } from '@ant-design/icons'
import { Button, Modal, Radio, Input, message as messageApi } from '@wind/wind-ui'
import { LikeO, DisLikeO } from '@wind/icons'
import axios from '@/api'
import { pointBuriedGel } from '@/api/configApi'
import { t } from 'gel-util/intl'

const { TextArea } = Input
const RadioGroup = Radio.Group

const radioStyle = {
  display: 'block',
  height: '34px',
  lineHeight: '34px',
}

const allErrType = [
  t('421495', '没有理解我的问题'),
  t('421496', '理解了我的问题，但是结果不准确'),
  t('421497', '答案是有害或者不安全的'),
  t('453651', '隐私相关'),
]

interface MessageItemProps {
  message: {
    id: string
    role: string
    content: string
    extraInfo?: string
    error?: boolean
    data?: any[]
  }
  isLoading: boolean
  handleCopyMessage: (content: string) => void
  handleRetry: (id: string) => void
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isLoading, handleCopyMessage, handleRetry }) => {
  const [state, setState] = useState(0) //0:无状态 1：点赞 2：踩
  const [visible, setVisible] = useState(false)
  const [errType, setErrType] = useState(allErrType[0])
  const textAreaRef = useRef(null)

  const getExtraInfo = (extraInfo: string) => {
    if (!extraInfo) return null
    let data = extraInfo.split(',')
    return <CollapsibleInfo title="参考信息" data={data} />
  }

  const handleFeedback = useCallback(() => {
    if (state == 2) {
      setState(0)
      return
    }
    axios.request({
      url: '/wind.ent.chat/api/createRecordStamp',
      method: 'post',
      data: {
        problem: textAreaRef.current.state.value,
        problemType: errType,
        questionsID: message.id,
      },
      formType: 'payload',
    })
    setVisible(false)
    setState(2)
    messageApi.success(t('455063', '反馈成功'))
  }, [state, errType])

  return (
    <div className={`message ${message.role}`} style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      {message.role === 'user' ? (
        <div className="message-wrapper">
          <div
            className="message-content"
            onClick={() => handleCopyMessage(message.content)}
            style={{ cursor: 'pointer' }}
            data-uc-id="e2btM8izhNF"
            data-uc-ct="div"
          >
            {message.content}
          </div>
          <img className="avatar user-avatar" alt="" src={USER_AVATAR} />
        </div>
      ) : (
        <div className="message-wrapper">
          <img className="avatar ai-avatar" alt="" src={AI_AVATAR} />
          <div className="message-content">
            <div
              dangerouslySetInnerHTML={{
                __html: message.content,
              }}
            ></div>
            {message.extraInfo && <div className="message-extra-info">{getExtraInfo(message.extraInfo)}</div>}
            {message.error && (
              <div className="message-feedback">
                <Button onClick={() => handleRetry(message.id)} type="link" data-uc-id="d33Lz3vC7t" data-uc-ct="button">
                  <SyncOutlined /> {t('421474', '重新提问')}
                </Button>
              </div>
            )}
            {message.data && message.data.length > 0 && (
              <div style={{ marginTop: 4, marginBottom: -12 }}>
                <Button
                  onClick={() => {
                    if (state == 1) {
                      setState(0)
                    } else {
                      pointBuriedGel(
                        '922602101143',
                        '数据浏览器',
                        'cdeExport',
                        {
                          token: message.id,
                        },
                        '10KXD'
                      )
                      messageApi.success(t('455064', '感谢您的支持'))
                      //TODO
                      setState(1)
                    }
                  }}
                  type="text"
                  style={{ paddingLeft: 0 }}
                  icon={
                    state == 1 ? (
                      <LikeO
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                        style={{ color: '#0596b3' }}
                        data-uc-id="x9QoOZeQY5"
                        data-uc-ct="likeo"
                      />
                    ) : (
                      <LikeO
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                        data-uc-id="PPhKCCYPA5"
                        data-uc-ct="likeo"
                      />
                    )
                  }
                  data-uc-id="n7RJfFGdfm"
                  data-uc-ct="button"
                >
                  {state == 1 ? <span style={{ color: '#0596b3' }}>{t('454595', '点赞')}</span> : t('454595', '点赞')}
                </Button>
                <Button
                  onClick={() => {
                    setVisible(true)
                  }}
                  type="text"
                  icon={
                    state == 2 ? (
                      <DisLikeO
                        style={{ color: '#0596b3' }}
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                        data-uc-id="PipD7lVXXK"
                        data-uc-ct="dislikeo"
                      />
                    ) : (
                      <DisLikeO
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                        data-uc-id="zuTta_u8po"
                        data-uc-ct="dislikeo"
                      />
                    )
                  }
                  data-uc-id="8DSy3zMMSa"
                  data-uc-ct="button"
                >
                  {state == 2 ? (
                    <span style={{ color: '#0596b3' }}>{t('455065', '踩一下')}</span>
                  ) : (
                    t('455065', '踩一下')
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {/**@ts-ignore */}
      <Modal
        title={t('142975', '反馈')}
        visible={visible}
        destroyOnClose={true}
        onOk={handleFeedback}
        onCancel={() => setVisible(false)}
        data-uc-id="jMvPW6B1_M"
        data-uc-ct="modal"
      >
        <RadioGroup
          onChange={(e: any) => {
            setErrType(e.target.value)
          }}
          value={errType}
          data-uc-id="PIzn5ba_9q0"
          data-uc-ct="radiogroup"
        >
          {allErrType.map((i) => (
            <Radio style={radioStyle} value={i} key={i} data-uc-id="MXo0wV_iCr" data-uc-ct="radio" data-uc-x={i}>
              {i}
            </Radio>
          ))}
        </RadioGroup>
        <TextArea
          maxLength={300}
          ref={textAreaRef}
          style={{ marginTop: 10 }}
          rows={4}
          placeholder={t('386255', '输入详细反馈，例如缺失数据、数据有误、或优化建议等，便于我们进一步核实完善。')}
          data-uc-id="Z7c8e0hOfj"
          data-uc-ct="textarea"
        />
      </Modal>
    </div>
  )
}

export default MessageItem
