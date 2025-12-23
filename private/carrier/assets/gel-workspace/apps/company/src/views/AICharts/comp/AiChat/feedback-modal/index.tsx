import React, { useState, useRef } from 'react'
import { Input, Modal, Radio } from '@wind/wind-ui'
import { t } from 'gel-util/intl'

const { TextArea } = Input
const RadioGroup = Radio.Group

const allErrType = [
  t('421495', '没有理解我的问题'),
  t('421496', '理解了我的问题，但是结果不准确'),
  t('421497', '答案是有害或者不安全的'),
  t('453651', '隐私相关'),
]

interface FeedbackModalProps {
  visible: boolean
  handleClose: () => void
  handleSubmit: (feedbackVal: string, feedbackType: string) => void
}

const FeedbackModal: React.FC<FeedbackModalProps> = (props) => {
  const { visible, handleClose, handleSubmit } = props
  const [errType, setErrType] = useState(allErrType[0])
  const textAreaRef = useRef(null)

  return (
    <>
      {/**@ts-ignore */}
      <Modal
        title={t('142975', '反馈')}
        visible={visible}
        destroyOnClose={true}
        onOk={() => handleSubmit(textAreaRef.current.state.value, errType)}
        onCancel={handleClose}
      >
        <RadioGroup
          onChange={(e: any) => {
            setErrType(e.target.value)
          }}
          value={errType}
        >
          {allErrType.map((i) => (
            <Radio
              style={{
                display: 'block',
                height: '34px',
                lineHeight: '34px',
              }}
              value={i}
              key={i}
            >
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
        />
      </Modal>
    </>
  )
}

export default FeedbackModal
