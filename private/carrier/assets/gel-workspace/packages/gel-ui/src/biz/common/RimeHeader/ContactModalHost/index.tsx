import React, { useEffect, useState } from 'react'
import { Modal } from '@wind/wind-ui'
import { ComputerO, MessageO } from '@wind/icons'
import styles from './index.module.less'

export const CONTACT_MODAL_EVENT = 'open-contact-modal'

const ContactModalHost: React.FC = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleOpen = () => setVisible(true)
    window.addEventListener(CONTACT_MODAL_EVENT, handleOpen)
    return () => window.removeEventListener(CONTACT_MODAL_EVENT, handleOpen)
  }, [])

  return (
    <Modal
      visible={visible}
      title="联系我们"
      onCancel={() => setVisible(false)}
      footer={null}
      width={420}
      className={styles.contactModal}
      maskClosable
      destroyOnClose
    >
      <div className={styles.contactContent}>
        <div className={styles.contactCard}>
          <div className={styles.contactIcon}>
            <ComputerO onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />
          </div>
          <div>
            <div className={styles.contactTitle}>专属客户经理：叶思思</div>
            <div className={styles.contactLine}>电话：15618900208</div>
            <div className={styles.contactLine}>邮箱：ssye@wind.com.cn</div>
          </div>
        </div>
        <div className={styles.contactCard}>
          <div className={styles.contactIcon}>
            <MessageO onPointerEnterCapture={() => {}} onPointerLeaveCapture={() => {}} />
          </div>
          <div>
            <div className={styles.contactTitle}>官方邮箱</div>
            <div className={styles.contactLine}>Service@rimedata.com</div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ContactModalHost
