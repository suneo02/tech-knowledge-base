import React, { useState, useEffect, useCallback } from 'react'
import styles from './index.module.less'
import { Upload, message, Button } from '@wind/wind-ui'
import { FileUploadC, FileExcelC } from '@wind/icons'
import { t } from 'gel-util/intl'
import { getBaseUrl } from '@/api/ai-graph'
import { getWsid } from '@/utils/env'

const Dragger = Upload.Dragger

const AIChartsUpload = ({ onUpload = (taskId: string, fileList: any[]) => {}, onCancel = () => {}, footer = true }) => {
  const [taskId, setTaskId] = useState('')
  const [fileName, setFileName] = useState('')
  const [fileList, setFileList] = useState([])
  const [count, setCount] = useState(0)
  const [size, setSize] = useState(0)

  const handleBeforeUpload = useCallback((file: any, fileList: any[]) => {
    setCount((prevCount) => {
      const newCount = prevCount + 1
      if (fileList.length > 1) {
        if (newCount === fileList.length) {
          message.warn('只支持导入一个Excel文件')
          return 0 // 最后重置
        }
      }
      return newCount
    })

    if (fileList.length > 1) {
      return false
    } else {
      setCount(0)
      return true
    }
  }, [])

  const props = {
    name: 'file',
    multiple: true,
    showUploadList: false,
    action: `${getBaseUrl()}/upload-excel`,
    headers: {
      'wind.sessionid': getWsid(),
    },
    beforeUpload: handleBeforeUpload,
    defaultFileList: fileList,
    onChange(info) {
      if (!info || !info.file) {
        return
      }
      const filelist = [info.file]
      const status = info.file.status
      const name = info.file.name
      if (status === 'done') {
        const response = info.file.response
        const responseCode = response.code
        if (responseCode === 200) {
          setFileName(name)
          const fileSize = (info.file.size / 1024).toFixed(2)
          setSize(Number(fileSize))
          setFileList(filelist)
          const data = response.data
          if (data?.taskId) {
            setFileList([info.file])
            data?.taskId && setTaskId(data?.taskId)
            onUpload && onUpload(data?.taskId, filelist)
          }
        } else if (responseCode === 415) {
          message.error('不支持的文件类型，请上传Excel文件')
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`)
      }
    },
  }

  return (
    <div className={styles.aiChartsUpload}>
      <div className={styles.aiChartsUploadContent}>
        <div className={styles.aiChartsUploadContentTitle}>
          <div>
            {t('', '第一步：点击下载')}
            <a
              href="https://wx.wind.com.cn/Wind.WFC.Enterprise.Web/PC.Front/resource/static/AiGraphTemplate.xlsx"
              download={'模版文件.xlsx'}
            >
              {t('437790', '模板文件')}
            </a>
            ，{t('', '并在此Excel文件中补充数据')}
          </div>
          <div>{t('', '第二步：保存文件后，点击下方按钮或拖拽文件到下方区域导入文件')}</div>
        </div>
        <div className={styles.aiChartsUploadContentBody}>
          {/* @ts-expect-error ttt */}
          <Dragger {...props} data-uc-id="_HNhAuzfiVB" data-uc-ct="dragger">
            {fileList.length > 0 ? (
              <div className={styles.aiChartsUploadContentFile}>
                <FileExcelC
                  className={styles.aiChartsUploadContentFileIcon}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                />
                <div>
                  {fileName}({size}KB)
                </div>
              </div>
            ) : (
              <>
                {/* @ts-ignore */}
                <FileUploadC style={{ fontSize: 80 }} data-uc-id="91KwfaHAT-N" data-uc-ct="fileuploadc" />
                <p
                  className={styles.aiChartsUploadContentButtonUploadText}
                  onClick={(e) => {
                    // console.log('click， 可以用户重新上传文件')
                    // e.stopPropagation()
                    // e.preventDefault()
                  }}
                >
                  * {t('', '点击或拖拽上传文件到此处上传，支持Excel')}
                </p>
              </>
            )}

            {/* @ts-ignore */}
            <Button
              className={styles.aiChartsUploadContentButtonUpload}
              variant="alice"
              data-uc-id="k27AOw0R9bT"
              data-uc-ct="button"
            >
              {fileList.length > 0 ? t('', '重新上传文件') : t('437622', '点击或拖拽上传文件')}
            </Button>
          </Dragger>
        </div>
        {footer && (
          <div className={styles.aiChartsUploadContentButton}>
            <Button
              className={styles.aiChartsUploadContentButtonCancel}
              onClick={onCancel}
              data-uc-id="fBiymIpu9Bn"
              data-uc-ct="button"
            >
              {t('421473', '取消')}
            </Button>
            <Button
              disabled={!fileList.length}
              className={styles.aiChartsUploadContentButtonOK}
              onClick={() => {
                onUpload(taskId, fileList)
              }}
              data-uc-id="fBiymIpu9Bn"
              data-uc-ct="button"
            >
              {t('', '生成图谱')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AIChartsUpload
