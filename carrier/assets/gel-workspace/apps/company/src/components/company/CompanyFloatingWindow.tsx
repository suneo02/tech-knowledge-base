import { CorpState, FeedBackPara } from '@/reducers/company'
import { Input, Radio } from '@wind/wind-ui'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as companyActions from '../../actions/company'
import intl from '../../utils/intl'
import { CompanyObjectionHandling } from './feedback'
import './style/CompanyFloatingWindow.less'

const RadioGroup = Radio.Group
const { TextArea } = Input

interface CompanyFloatingWindowProps {
  initialCompanyName?: string
}

// 企业详情页-头部卡片
const CompanyFloatingWindow: React.FC<CompanyFloatingWindowProps> = ({ initialCompanyName }) => {
  const dispatch = useDispatch()
  const feedParam = useSelector((state: { company: CorpState }) => state.company?.feedBackPara)

  // 状态管理
  const [feedType, setFeedType] = useState<FeedBackPara['type']>('数据纠错')
  const [companyName, setCompanyName] = useState<FeedBackPara['companyname']>(initialCompanyName || '')
  const [message, setMessage] = useState<FeedBackPara['message']>('')
  const [tel, setTel] = useState<FeedBackPara['tel']>('')
  const [showMessageError, setShowMessageError] = useState(false)

  // 监听 name prop 变化
  useEffect(() => {
    setCompanyName(initialCompanyName || '')
  }, [initialCompanyName])

  // 监听 feedParam 变化，初始化状态
  useEffect(() => {
    if (feedParam) {
      setMessage(feedParam.message || '')
      setTel(feedParam.tel || '')
    }
  }, [feedParam])

  // 统一监听状态变化，更新 Redux
  useEffect(() => {
    dispatch(
      companyActions.setFeedBack({
        type: feedType,
        companyname: companyName,
        message: message,
        tel: tel,
      })
    )
  }, [dispatch, feedType, companyName, message, tel])

  // 处理反馈类型变化
  const onTypeChange = (e) => {
    const newFeedType = e.target.value
    setFeedType(newFeedType)
  }

  // 处理公司名称变化
  const onCompanyNameChange = (e) => {
    setCompanyName(e.target.value)
  }

  // 处理消息变化
  const onMessageChange = (e) => {
    const newMessage = e.target.value
    const trimmedMessage = newMessage.trimStart()

    setMessage(newMessage)
    setShowMessageError(trimmedMessage.length === 0)
  }

  // 处理电话变化
  const onTelChange = (e) => {
    setTel(e.target.value)
  }

  const isObjectionHandling = feedType === '异议处理'

  return (
    <div>
      <div className="feedback-nav">
        <div className="feedback-nav-type-title">{intl('283797', '反馈类型')}</div>
        <RadioGroup onChange={onTypeChange} value={feedType} data-uc-id="HJiI7SWUvN" data-uc-ct="radiogroup">
          <Radio value={'数据纠错'} data-uc-id="P3qo76M-6c" data-uc-ct="radio">
            {intl('138235', '数据纠错')}
          </Radio>
          <Radio value={'功能提升'} data-uc-id="hlS5-UgT3y" data-uc-ct="radio">
            {intl('138311', '功能提升')}
          </Radio>
          <Radio value={'其他建议'} data-uc-id="WOmwryPf7J" data-uc-ct="radio">
            {intl('138421', '其他建议')}
          </Radio>
          <Radio value={'异议处理'} data-uc-id="DFEPdEmx-8" data-uc-ct="radio">
            {intl('366153', '异议处理')}
          </Radio>
        </RadioGroup>
      </div>
      <div className="feedback-content">
        {isObjectionHandling ? (
          <CompanyObjectionHandling />
        ) : (
          <>
            <div className="feedback-nav">
              <div className="feedback-nav-company-title">{intl('32914', '公司名称')}</div>
              <Input
                placeholder={intl('225183', '请输入公司名称')}
                value={companyName}
                onChange={onCompanyNameChange}
                data-uc-id="n7sNKcSFNa"
                data-uc-ct="input"
              />
            </div>
            <div className="feedback-nav">
              <div className="feedback-nav-desc-title">{intl('138258', '反馈描述')}</div>
              <TextArea
                rows={4}
                value={message}
                placeholder={intl('138574', '我们期待您的反馈')}
                onChange={onMessageChange}
                style={{
                  marginBottom: '5px',
                  borderColor: showMessageError ? 'rgba(223, 38, 44, 1)' : 'var(--basic-8)',
                }}
                data-uc-id="y4IblsU9bU"
                data-uc-ct="textarea"
              />
              <span className="feedback-warning" style={{ display: showMessageError ? 'block' : 'none' }}>
                {intl('438476', '请填写反馈描述')}
              </span>
            </div>
            <div className="feedback-nav">
              <div className="feedback-nav-company-title">{intl('257643', '联系方式')}</div>
              <Input
                placeholder={intl('138444', '请留下您的联系方式，以便我们与您联系')}
                value={tel}
                onChange={onTelChange}
                data-uc-id="fp04i8CoqU"
                data-uc-ct="input"
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CompanyFloatingWindow
