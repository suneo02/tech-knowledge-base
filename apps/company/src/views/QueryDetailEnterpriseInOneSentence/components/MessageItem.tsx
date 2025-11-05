import React, { useState, useRef, useCallback } from 'react'
import { USER_AVATAR, AI_AVATAR } from '../chat'
import CollapsibleInfo from './CollapsibleInfo'
import { SyncOutlined } from '@ant-design/icons'
import { Button, Modal, Radio, Input, message as messageApi } from '@wind/wind-ui'
import { LikeO, DisLikeO } from '@wind/icons'
import axios from '@/api'
import { pointBuriedGel } from '@/api/configApi'

const { TextArea } = Input
const RadioGroup = Radio.Group

const radioStyle = {
  display: 'block',
  height: '34px',
  lineHeight: '34px',
}

const allErrType = ['没有理解我的问题', '理解了我的问题，但是结果不准确', '答案是有害或者不安全的', '隐私相关']

interface MessageItemProps {
  message: {
    id: string;
    role: string;
    content: string;
    extraInfo?: string;
    error?: boolean;
    data?: any[];
  };
  isLoading: boolean;
  handleCopyMessage: (content: string) => void;
  handleRetry: (id: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, isLoading, handleCopyMessage, handleRetry }) => {
  const [state, setState] = useState(0) //0:无状态 1：点赞 2：踩
  const [visible, setVisible] = useState(false)
  const [errType, setErrType] = useState('没有理解我的问题')
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
    messageApi.success('反馈成功')
  }, [state, errType])

  return (
    <div className={`message ${message.role}`} style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      {message.role === 'user' ? (
        <div className="message-wrapper">
          <div
            className="message-content"
            onClick={() => handleCopyMessage(message.content)}
            style={{ cursor: 'pointer' }}
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
                <Button onClick={() => handleRetry(message.id)} type="link">
                  <SyncOutlined /> 重新提问
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
                      pointBuriedGel('922602101143', '数据浏览器', 'cdeExport', {
                        token: message.id,
                      }, '10KXD')
                      messageApi.success('感谢您的支持')
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
                      />
                    ) : (
                      <LikeO onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />
                    )
                  }
                >
                  {state == 1 ? <span style={{ color: '#0596b3' }}>点赞</span> : '点赞'}
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
                      />
                    ) : (
                      <DisLikeO onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />
                    )
                  }
                >
                  {state == 2 ? <span style={{ color: '#0596b3' }}>踩一下</span> : '踩一下'}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {/**@ts-ignore */}
      <Modal
        title="反馈"
        visible={visible}
        destroyOnClose={true}
        onOk={handleFeedback}
        onCancel={() => setVisible(false)}
      >
        <RadioGroup
          onChange={(e: any) => {
            setErrType(e.target.value)
          }}
          value={errType}
        >
          {allErrType.map((i) => (
            <Radio style={radioStyle} value={i} key={i}>
              {i}
            </Radio>
          ))}
        </RadioGroup>
        <TextArea
          maxLength={300}
          ref={textAreaRef}
          style={{ marginTop: 10 }}
          rows={4}
          placeholder="输入详细反馈，例如缺失数据、数据有误、或优化建议等，便于我们进一步核实完善。"
        />
      </Modal>
    </div>
  )
}

export default MessageItem 