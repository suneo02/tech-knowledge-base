import { DislikeIcon, LikeIcon } from '@/assets'
import { copyTextAndMessage } from '@/common/message'
import { primaryActive, primaryHover } from '@/styles'
import { CopyO, RefreshO } from '@wind/icons'
import { Button, Input, message, Modal, Radio } from '@wind/wind-ui'
import Form from '@wind/wind-ui-form'
import type { ButtonProps } from '@wind/wind-ui/lib/button/button.d.ts'
import { AxiosInstance } from 'axios'
import { BuryAction, CreateRecordStampRequest, postPointBuriedWithAxios, requestToChatWithAxios } from 'gel-api'
import { stripMarkdownAndTraces } from 'gel-util/common'
import { t } from 'gel-util/intl'
import { FC, useState } from 'react'
import { AliceIcon } from '../AliceIcon'
import styles from './index.module.less'

const RadioGroup = Radio.Group

const intlMap = {
  copyright: t('41214', '内容由AI生成，请核查重要信息'),
  copy: t('421482', '复制'),
  retry: t('313393', '重试'),
  feedbackSuccess: t('421493', '反馈提交成功'),
  feedback: t('142975', '反馈'),
  submit: t('14108', '提交'),
  noUnderstand: t('421495', '没有理解我的问题'),
  noUnderstand2: t('421496', '理解了我的问题，但结果不准确'),
  noUnderstand3: t('421497', '答案是有害或者不安全的'),
  privacyRelated: t('453651', '隐私相关'),
  inputDetailedFeedback: t('386255', '输入详细反馈，例如缺失数据、数据有误、或优化建议等，便于我们进一步核实完善。'),
  support: t('453650', '谢谢您的支持'),

  dislike: t('454594', '踩一下'),
  like: t('454595', '点赞'),
  retryFailed: t('454596', '重试失败，请稍后再试'),
  cancel: t('421473', '取消'),
}

const DEFAULT_SOURCE = 'AIChat'

export const AICopyButton: FC<
  {
    axiosEntWeb: AxiosInstance
    content: string
    isBury?: boolean // 是否埋点
  } & ButtonProps
> = ({ axiosEntWeb, content, style, isBury, ...props }) => {
  const [hover, setHover] = useState(false)

  return (
    <Button
      type="text"
      size="small"
      icon={<CopyO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
      className={styles.AIButton}
      style={{
        color: hover ? primaryHover : '#8b8b8b',
        ...style,
      }}
      onClick={() => {
        if (isBury) {
          postPointBuriedWithAxios(axiosEntWeb, BuryAction.COPY, {
            text: content,
          })
        }
        // [追觅科技](ner:company:1196547801) 替换成 追觅科技
        copyTextAndMessage(`${stripMarkdownAndTraces(content)}\n\n${intlMap.copyright}`)
      }}
      onMouseEnter={() => {
        setHover(true)
      }}
      // @ts-expect-error wind-ui
      onMouseLeave={() => {
        setHover(false)
      }}
      {...props}
    >
      {intlMap.copy}
    </Button>
  )
}

export const AIRetryButton: FC<
  {
    content: string
    isBury?: boolean // 是否埋点
    onRetry?: () => void // 重试回调函数
    rawSentenceID?: string // 问题ID
    /// 翼神使，另一个全身黑衣，黑发黑瞳，有着恶

    rawSentence?: string // 原始问题
  } & ButtonProps
> = ({ style, isBury, onRetry, ...props }) => {
  const [isRetrying, setIsRetrying] = useState(false)
  const [hover, setHover] = useState(false)

  // 使用hover状态控制按钮样式
  const buttonStyle = {
    paddingLeft: 0,
    color: hover ? primaryHover : isRetrying ? primaryActive : '#8b8b8b',
    ...style,
  }

  const handleRetry = () => {
    setIsRetrying(true)

    // 调用父组件提供的重试函数
    if (onRetry) {
      try {
        onRetry()
      } catch (error) {
        console.error('重试失败:', error)
        message.error(intlMap.retryFailed)
        return
      } finally {
        setIsRetrying(false)
      }
    }
  }

  return (
    <Button
      type="text"
      size="small"
      icon={<RefreshO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
      className={styles.AIButton}
      style={buttonStyle}
      onMouseEnter={() => {
        setHover(true)
      }}
      // @ts-expect-error wind-ui
      onMouseLeave={() => {
        setHover(false)
      }}
      onClick={handleRetry}
      loading={isRetrying}
      {...props}
    >
      {intlMap.retry}
    </Button>
  )
}

export const AILikeButton: FC<
  ButtonProps & {
    axiosEntWeb: AxiosInstance
    content: string // AI 回答
    question: string | undefined // 用户问句
    isBury?: boolean // 是否埋点
  }
> = ({ axiosEntWeb, content, question, style, isBury, ...props }) => {
  const [liked, setLiked] = useState(false)
  const [hover, setHover] = useState(false)
  const isHover = hover || liked
  const handleLike = () => {
    setLiked(!liked)
    if (!liked) {
      if (isBury) {
        postPointBuriedWithAxios(axiosEntWeb, BuryAction.LIKE, {
          question: question || '',
          answer: content,
          intention: '',
          feedbackType: '无',
          detailedFeedback: '无',
        })
        console.log('🚀 ~ handleLike ~ question:', question)
      }

      message.success(intlMap.support)
    }
  }

  return (
    <>
      <Button
        type="text"
        size="small"
        className={styles.AIButton}
        icon={
          <AliceIcon hover={isHover}>
            <LikeIcon />
          </AliceIcon>
        }
        style={{
          color: liked ? primaryActive : hover ? primaryHover : '#8b8b8b',
          ...style,
        }}
        onMouseEnter={() => {
          setHover(true)
        }}
        // @ts-expect-error wind-ui
        onMouseLeave={() => {
          setHover(false)
        }}
        onClick={handleLike}
        {...props}
      >
        {intlMap.like}
      </Button>
    </>
  )
}

export const AIDislikeButton: FC<
  ButtonProps & {
    axiosChat: AxiosInstance
    axiosEntWeb: AxiosInstance
    content: string // AI 回答
    question: string | undefined // 用户问句
    questionID?: string
    isBury?: boolean // 是否埋点
    source?: CreateRecordStampRequest['source']
  }
> = ({ axiosChat, axiosEntWeb, content, question, questionID, style, isBury, source = DEFAULT_SOURCE, ...props }) => {
  const [hover, setHover] = useState(false)
  const [visible, setVisible] = useState(false)

  const [form] = Form.useForm()
  const handleDislike = ({ feedbackType, detailedFeedback }: { feedbackType: string; detailedFeedback: string }) => {
    if (isBury) {
      if (questionID) {
        requestToChatWithAxios(axiosChat, 'createRecordStamp', {
          questionsID: questionID,
          problem: detailedFeedback,
          problemType: feedbackType,
          source,
        })
      }
      postPointBuriedWithAxios(axiosEntWeb, BuryAction.DISLIKE, {
        question: question || '',
        answer: content,
        intention: '',
        feedbackType: feedbackType,
        detailedFeedback: detailedFeedback,
      })
    }

    message.success(intlMap.feedbackSuccess)
    setVisible(false)
  }
  const radioStyle = {
    display: 'block',
    height: '34px',
    lineHeight: '34px',
  }

  const handleClose = () => {
    form.resetFields()
    setVisible(false)
  }
  return (
    <>
      <Button
        type="text"
        size="small"
        className={styles.AIButton}
        icon={
          <AliceIcon hover={hover}>
            <DislikeIcon />
          </AliceIcon>
        }
        onMouseEnter={() => {
          setHover(true)
        }}
        // @ts-expect-error wind-ui
        onMouseLeave={() => {
          setHover(false)
        }}
        style={{
          color: hover ? primaryHover : '#8b8b8b',
          ...style,
        }}
        onClick={() => {
          setVisible(true)
        }}
        {...props}
      >
        {intlMap.dislike}
      </Button>
      <Modal
        title={intlMap.feedback}
        visible={visible}
        destroyOnClose
        forceRender
        onOk={() => {
          form.validateFields().then((values) => {
            console.log('🚀 ~ values:', values)
            handleDislike({
              feedbackType: values.feedbackType,
              detailedFeedback: values.detailedFeedback,
            })
            setTimeout(() => {
              handleClose()
            }, 1000)
          })
        }}
        onCancel={handleClose}
        okText={intlMap.submit}
        cancelText={intlMap.cancel}
      >
        <Form form={form}>
          <Form.Item name="feedbackType" initialValue={'没有理解我的问题'}>
            <RadioGroup>
              <Radio style={radioStyle} value="没有理解我的问题">
                {intlMap.noUnderstand}
              </Radio>
              <Radio style={radioStyle} value="理解了我的问题，但结果不准确">
                {intlMap.noUnderstand2}
              </Radio>
              <Radio style={radioStyle} value="答案是有害或者不安全的">
                {intlMap.noUnderstand3}
              </Radio>
              <Radio style={radioStyle} value="隐私相关">
                {intlMap.privacyRelated}
              </Radio>
            </RadioGroup>
          </Form.Item>
          <Form.Item name="detailedFeedback">
            <Input.TextArea rows={4} maxLength={300} placeholder={intlMap.inputDetailedFeedback} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
