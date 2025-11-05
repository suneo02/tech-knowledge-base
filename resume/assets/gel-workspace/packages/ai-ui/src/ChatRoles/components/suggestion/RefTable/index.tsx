import { Modal } from '@wind/wind-ui'
import dayjs from 'dayjs'
import { RefTableData } from 'gel-api'
import { t } from 'gel-util/intl'
import React, { useState } from 'react'
import { RefItemCommon } from '../comp/RefItemCommon'
import { RefTable } from './tableComp'

export const RefItemTable: React.FC<{
  className?: string
  data: RefTableData
}> = ({ className, data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <RefItemCommon
        className={className}
        text={`查看数据：${data.rawSentence || ''}`}
        tagText={t('454654', '数据')}
        // @ts-expect-error 类型错误
        tagType="Data"
        publishdate={dayjs().format('YYYY-MM-DD')}
        canJump={true}
        onItemClick={handleClick}
      />
      {/* @ts-expect-error Modal组件类型声明与实际使用方式不一致，但功能正常 */}
      <Modal
        title={data.rawSentence || ''}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={'70%'}
        style={{ minWidth: 900, maxWidth: 1920 }}
        destroyOnClose
      >
        <RefTable data={data} />
      </Modal>
    </>
  )
}
