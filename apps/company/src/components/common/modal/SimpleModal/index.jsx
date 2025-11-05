import { Modal, Button } from '@wind/wind-ui'
import { useState } from 'react'

/**
 *
 * @param {*} param.trigger
 * @returns
 */
const SimpleModal = ({ trigger, title, children, ...rest }) => {
  const [open, setOpen] = useState()
  return (
    <span>
      <span onClick={() => setOpen(!open)}>{trigger || <Button type="primary">打开</Button>}</span>
      <Modal {...rest} title={title || '提示'} visible={open} onCancel={() => setOpen(false)} footer={null}>
        {children}
      </Modal>
    </span>
  )
}

export default SimpleModal
