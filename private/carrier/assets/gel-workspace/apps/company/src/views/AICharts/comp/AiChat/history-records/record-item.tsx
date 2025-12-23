import React, { useEffect, useRef, useState } from 'react'

import styles from './index.module.less'
import classNames from 'classnames'
import { t } from 'gel-util/intl'
import { Button, Input, Modal, Popover } from '@wind/wind-ui'
import { CheckO, CloseO, DeleteO, EditO, EllipsisO } from '@wind/icons'

interface RecordItemProps {
  chatId: string
  title: string
  source: string
  handleClick: (chatId: string) => void
  activeHistoryChatId: string
  handleSubmitEdit: (val: string) => void
  handleDeleteChat: () => void
}

const RecordItem: React.FC<RecordItemProps> = (props) => {
  const { chatId, source, handleClick, activeHistoryChatId, handleSubmitEdit, handleDeleteChat } = props
  const [visible, setVisible] = useState(false)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(props.title)
  const rootRef = useRef()
  const inputRef = useRef<any>(null)

  useEffect(() => {
    setTitle(props.title)
  }, [props.title])

  function handleDeleteClick() {
    Modal.info({
      title: '温馨提示',
      content: <div>请确认是否删除该条历史数据？</div>,
      okText: '确认',
      onOk: () => {
        setVisible(false)
        handleDeleteChat()
      },
    })
  }

  const renderContent = () => {
    return (
      <div className={styles.popoverPanel}>
        <Button
          type="text"
          icon={<EditO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setVisible(false)
            setEditing(true)
            if (inputRef.current) {
              inputRef.current.focus()
            }
          }}
        >
          重命名
        </Button>
        <Button
          type="text"
          icon={<DeleteO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            // setVisible(false)
            handleDeleteClick()
          }}
        >
          删除
        </Button>
        {/* <Popconfirm
          title="您确认要删除此条对话吗？"
          okText="删除"
          cancelText="取消"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        >
          <Button
            type="text"
            icon={<DeleteO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              // setVisible(false)
            }}
          >
            删除
          </Button>
        </Popconfirm> */}
      </div>
    )
  }

  return (
    <div
      className={classNames(styles.item, activeHistoryChatId === chatId && styles.active)}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        handleClick(chatId)
      }}
      onMouseEnter={() => {
        if (editing) {
          return
        }
        setVisible(true)
      }}
      onMouseLeave={() => {
        setVisible(false)
      }}
      ref={rootRef}
      data-uc-id="kbN8H_COpW"
      data-uc-ct="div"
      data-uc-x={chatId}
    >
      <div>
        {editing ? (
          <div>
            <Input
              placeholder="输入名称"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              ref={inputRef}
              suffix={
                <div>
                  <Button
                    type="text"
                    icon={<CheckO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      handleSubmitEdit(title)
                      setEditing(false)
                    }}
                  />
                  <Button
                    type="text"
                    icon={<CloseO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      setTitle(props.title)
                      setEditing(false)
                    }}
                  />
                </div>
              }
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
            />
          </div>
        ) : (
          <p className={styles.title} title={title}>
            {title}
          </p>
        )}
        <span className={styles.type}>
          {source}
          {t('', '构建图谱')}
        </span>
      </div>
      {visible && (
        <Popover
          placement="bottomRight"
          content={renderContent()}
          trigger="click"
          overlayClassName={styles.overlayClassName}
          // visible={visible}
          // onVisibleChange={(visible) => setVisible(visible)}
          getPopupContainer={() => rootRef.current}
        >
          <Button
            type="text"
            icon={<EllipsisO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          />
        </Popover>
      )}
    </div>
  )
}

export default RecordItem
