/**
 * 香港公司信息查询协议
 */

import { tipBtnClassNames } from '@/components/pay/tip'
import intl from '@/utils/intl'
import { Button, Modal } from '@wind/wind-ui'
import React, { FC, useState } from 'react'
import { Agreement } from '../agreement/Agreement'
import styles from './styles.module.less'

export const HKInfoQueryAggreBtn: FC<{ title?: React.ReactNode }> = ({ title }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const modalContent = <Agreement />

  return (
    <>
      <Button type="link" onClick={showModal} className={tipBtnClassNames} data-uc-id="ZWlh1jjKWB" data-uc-ct="button">
        {title ? title : `《${intl(478580, '企业信用信息查询委托协议')}》`}
      </Button>
      {isModalOpen && (
        <Modal
          visible={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          width={900}
          title={intl(478580, '企业信用信息查询委托协议')}
          wrapClassName={styles.modal}
          data-uc-id="YY3G_RzYCT"
          data-uc-ct="modalsafetype"
        >
          {modalContent}
        </Modal>
      )}
    </>
  )
}
