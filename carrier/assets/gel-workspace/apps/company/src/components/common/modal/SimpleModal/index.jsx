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
      <span onClick={() => setOpen(!open)} data-uc-id="0aKf8xucV6" data-uc-ct="span">
        {trigger || (
          <Button type="primary" data-uc-id="Cy75hM-a3j" data-uc-ct="button">
            打开
          </Button>
        )}
      </span>
      <Modal
        {...rest}
        title={title || '提示'}
        visible={open}
        onCancel={() => setOpen(false)}
        footer={null}
        data-uc-id="US8TPw79V7"
        data-uc-ct="modal"
      >
        {children}
      </Modal>
    </span>
  )
}

export default SimpleModal
