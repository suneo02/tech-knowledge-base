import dayjs from 'dayjs'
import { DPUItem } from 'gel-api'
import { t } from 'gel-util/intl'
import React, { useState } from 'react'
import { ChatDPUTableModal } from '../ChatDPUTableModal'
import { ChatRefRow } from '../ChatRefRow'

const intlMsg = {
  data: t('454654', '数据'),
}

export const ChatDPUItem: React.FC<{
  className?: string
  data: DPUItem
  onModalClose?: () => void
  onModalOpen?: () => void
}> = ({ className, data, onModalClose, onModalOpen }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = () => {
    setIsModalOpen(true)
    onModalOpen?.()
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    onModalClose?.()
  }

  return (
    <>
      <ChatRefRow
        className={className}
        text={`查看数据：${data.rawSentence || ''}`}
        tagText={intlMsg.data}
        tagType="Data"
        publishdate={dayjs().format('YYYY-MM-DD')}
        canJump={true}
        onClick={handleClick}
      />
      <ChatDPUTableModal visible={isModalOpen} data={data} onClose={handleCloseModal} />
    </>
  )
}
