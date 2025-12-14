import { Modal } from '@wind/wind-ui'
import { useState } from 'react'

const CModal = () => {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState(null)
  const showModal = (title, content) => {
    setTitle(title)
    setContent(content)
  }
  const handleOk = () => {
    setVisible(false)
  }
  const handleCancel = () => {
    setVisible(false)
  }
  return (
    <Modal
      title={title}
      visible={visible}
      onOk={handleOk}
      // confirmLoading={confirmLoading}
      onCancel={handleCancel}
      data-uc-id="NS1oS6fmTI"
      data-uc-ct="modal"
    >
      {content}
    </Modal>
  )
}

export default CModal
