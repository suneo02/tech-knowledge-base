import React, { FC } from 'react'
import { Modal } from '@wind/wind-ui'
import RestructFilter from './RestructFilter'
import styles from './RestructFilterModal.module.less'

const PREFIX = 'cde-filter-modal'

const RestructFilterModal: FC<{
  modal: boolean
  setModal: (modal: boolean) => void
  onSearch: () => void
}> = ({ modal = true, setModal = () => null, onSearch }) => {
  return (
    <>
      <Modal
        visible={modal}
        onCancel={() => setModal(false)}
        footer={null}
        destroyOnClose
        width={960}
        closable={false}
        padding={0}
        wrapClassName={styles[`${PREFIX}-modal-wrapper`]}
      >
        <RestructFilter
          onClose={() => setModal(false)}
          isShow={false}
          onSearch={onSearch}
          fromModal={true}
          data-uc-id="CAhZvVi_lDw"
          data-uc-ct="restructfilter"
          inModal
        />
      </Modal>
    </>
  )
}

export default RestructFilterModal
