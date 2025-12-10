import React, { useRef, useState } from 'react'
import { Input, Button } from '@wind/wind-ui'
import { StopCircleO, ArrowUpO, FileExcelC, CloseO, CloseCircleF, DocumentO, PaperClipO } from '@wind/icons'
import classNames from 'classnames'
import styles from './index.module.less'
import { useUpdateEffect } from 'ahooks'
import { ChartModal } from '../../../../Charts/comp/chartModal'
import { AIGRAPH_SEND_TYPE_KEYS } from '../../../contansts'

const { TextArea } = Input

interface SenderProps {
  /** 输入框的值 */
  value: string
  /** 输入框值变化回调 */
  onChange: (value: string) => void
  /** 发送消息回调 */
  onSend: () => void
  /** 取消请求回调 */
  onCancel: () => void
  /** 是否正在获取数据 */
  fetching?: boolean
  /** 输入框占位符 */
  placeholder?: string
  /** 输入框最小行数 */
  minRows?: number
  /** 输入框最大行数 */
  maxRows?: number
  /** 导入Excel任务ID */
  excelTaskId?: string
  /** 导入Excel文件列表 */
  excelFileList?: any[]
  /** 导入Markdown任务ID */
  markdownTaskId?: string
  /** 导入Markdown标题 */
  markdownTitle?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 删除Excel文件回调 */
  onDeleteExcelFile?: (file: any) => void
  /** 删除Markdown回调 */
  onDeleteMarkdown?: () => void
  /** 弹窗确认回调 */
  onModalConfirm?: (data: any) => void
  /** 弹窗取消回调 */
  onModalCancel?: () => void
  /** 弹窗是否可见 */
  modalVisible?: boolean
  /** 弹窗是否可见回调 */
  onModalVisible?: (bol: boolean) => void
  /** 弹窗初始选中标签页 */
  initialModalTabKey?: string
  /** 是否显示文件上传 */
  fileUpload?: boolean
}

/**
 * 聊天发送组件
 *
 * @description 包含输入框和发送/停止按钮的聊天发送组件
 * @since 1.0.0
 *
 * @param value - 输入框的值
 * @param onChange - 输入框值变化回调
 * @param onSend - 发送消息回调
 * @param onCancel - 取消请求回调
 * @param fetching - 是否正在获取数据，默认为 false
 * @param placeholder - 输入框占位符，默认为 "描述您想要生成的企业相关图片，支持上传数据生成图谱"
 * @param minRows - 输入框最小行数，默认为 1
 * @param maxRows - 输入框最大行数，默认为 5
 *
 * @returns JSX.Element 聊天发送组件
 */
const Sender: React.FC<SenderProps> = ({
  value,
  onChange,
  onSend,
  onCancel,
  fetching = false,
  placeholder = '描述您想要生成的企业相关图谱，支持上传数据生成图谱',
  minRows = 1,
  maxRows = 5,
  excelTaskId,
  excelFileList,
  markdownTaskId,
  markdownTitle,
  disabled,
  onDeleteExcelFile,
  onDeleteMarkdown,
  onModalConfirm,
  onModalCancel,
  modalVisible,
  onModalVisible,
  initialModalTabKey = AIGRAPH_SEND_TYPE_KEYS.MARKDOWN,
  fileUpload = false,
}) => {
  const inputRef = useRef<any>()
  const inputBoxRef = useRef<HTMLDivElement>()
  const [isFocus, setIsFocus] = useState(false)
  const isValueNotEmpty = !!value.trim() || excelFileList?.length || markdownTitle

  // 监听输入值变化，自动滚动输入框到底部
  useUpdateEffect(() => {
    const textareaDom = (inputRef.current as any)?.textAreaRef
    if (textareaDom) {
      // 获取 textarea 的滚动高度和可视高度
      const scrollHeight = textareaDom.scrollHeight
      const clientHeight = textareaDom.clientHeight
      if (clientHeight < scrollHeight) {
        return
      }
      textareaDom.scrollTop = scrollHeight
    }
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 检查是否按下Enter键，且没有同时按下Shift键
    if (isValueNotEmpty && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // 阻止默认换行行为
      onSend() // 触发发送
    }
  }

  return (
    <div className={`ai-graph-sender ${disabled ? 'ai-graph-sender-disabled' : ''}`}>
      <div className={classNames(styles.chatFooter, !fetching && value && styles.chatActiveFooter)}>
        <div className={classNames(styles.chatInputBox, isFocus && styles.chatInputBoxFocus)} ref={inputBoxRef}>
          {/* 导入Excel文件列表，现在仅支持一个文件 */}
          {excelFileList?.length ? (
            <div className={styles.chatFileBox}>
              {excelFileList.map((item) => (
                <div className={styles.chatFileItem}>
                  <FileExcelC
                    className={styles.chatFileIcon}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  />
                  <div className={styles.chatFileName}>{item?.name}</div>
                  <CloseCircleF
                    className={styles.chatFileClose}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                    onClick={() => {
                      onDeleteExcelFile && onDeleteExcelFile(item)
                    }}
                  />
                </div>
              ))}
            </div>
          ) : null}

          {/* 导入Markdown标题，现在仅支持一个Markdown */}
          {markdownTitle ? (
            <div className={styles.chatMarkdownBox}>
              <div className={styles.chatMarkdownItem}>
                <DocumentO
                  className={styles.chatMarkdownIcon}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                <div className={styles.chatMarkdownTitle}>{markdownTitle}</div>
                <CloseCircleF
                  className={styles.chatMarkdownClose}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  onClick={() => {
                    onDeleteMarkdown && onDeleteMarkdown()
                  }}
                />
              </div>
            </div>
          ) : null}

          <TextArea
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            value={value}
            className={styles.input}
            autosize={{ minRows, maxRows }}
            onFocus={() => {
              setIsFocus(true)
            }}
            onBlur={() => {
              setIsFocus(false)
            }}
            ref={inputRef}
            // disabled={disabled}
          />
        </div>

        {fileUpload && (
          <div className={styles.chatSendFileBtnBox}>
            <Button
              type="text"
              icon={<PaperClipO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              onClick={() => {
                onModalVisible && onModalVisible(true)
              }}
            />
          </div>
        )}

        <div
          className={classNames(styles.chatSendAndStopBtnBox, (fetching || isValueNotEmpty) && styles.activeSendBtn)}
        >
          {!fetching ? (
            <Button
              type="text"
              icon={<ArrowUpO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              onClick={() => {
                if (isValueNotEmpty) {
                  onSend()
                }
              }}
            />
          ) : (
            <Button
              type="text"
              icon={<StopCircleO onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />}
              onClick={onCancel}
            />
          )}
        </div>
      </div>

      {/* 导入文件弹窗 */}
      <ChartModal
        visible={modalVisible}
        onCancel={onModalCancel}
        onConfirm={onModalConfirm}
        initialTabKey={initialModalTabKey}
      />
    </div>
  )
}

export { Sender }
