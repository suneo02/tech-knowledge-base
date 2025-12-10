import { intlForIndicator } from '@/util'
import { useState } from 'react'

// Import styles
import { Upload, message } from '@wind/wind-ui'
import { DraggerProps } from '@wind/wind-ui/lib/upload/Dragger'
import { UploadFile } from '@wind/wind-ui/lib/upload/interface'
import cn from 'classnames'
import { t } from 'gel-util/intl'
import uploadImg from '../../assets/img/file-upload-placeholder.png'
import { ButtonGroup } from '../ButtonGroup'
import styles from './style.module.less'
import { IndicatorBulkImportData, parseExcelFile } from './utils'
export * from './utils'
const { Dragger } = Upload

// 模板文件路径 - 确保路径正确
// TODO: 需要根据应用运行环境确定正确的模板路径 或者转移到后端，前端处理太蠢了
const TEMPLATE_PATH = './templates/download.xlsx'

// File Upload Tab Component
interface FileUploadTabProps {
  handleChange: (idList: string[], excelData: IndicatorBulkImportData[], clueExcelName?: string) => void
  onCancel: () => void
  matchCount: number
  className?: string
}

export function FileUploadTab({ handleChange, onCancel, matchCount, className }: FileUploadTabProps) {
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handleFileUpload: DraggerProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options
    const reader = new FileReader()

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const content = e.target?.result
        if (!content || typeof content !== 'string') {
          throw new Error(t('140088'))
        }

        parseExcelFile(content, matchCount, (key, params) => intlForIndicator(key, params || {}, t))
        onSuccess()
      } catch (error) {
        onError(error instanceof Error ? error : new Error(t('140088')))
      }
    }

    reader.onerror = () => {
      onError(new Error(t('140088')))
    }

    reader.readAsBinaryString(file)
  }

  const handleUploadChange = (info: any) => {
    let newFileList = [...info.fileList].slice(-1)

    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url
      }
      return file
    })

    newFileList = newFileList.filter((file) => {
      if (file.response) {
        return file.response.status === 'success'
      }
      return true
    })

    setFileList(newFileList)
  }

  const handleFileImport = async (file: File) => {
    try {
      const reader = new FileReader()

      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const content = e.target?.result
          if (!content || typeof content !== 'string') {
            throw new Error(t('140088'))
          }

          const { filteredData, idList } = parseExcelFile(content, matchCount, (key, params) =>
            intlForIndicator(key, params || {}, t)
          )
          handleChange(idList, filteredData, file.name)
        } catch (error) {
          message.error(error instanceof Error ? error.message : t('140088'))
        }
      }

      reader.onerror = () => {
        message.error(t('140088'))
      }

      reader.readAsBinaryString(file)
    } catch (error) {
      message.error(error instanceof Error ? error.message : t('140088'))
    }
  }

  const handleFileCommit = () => {
    if (fileList.length < 1) return
    const file = fileList[0].originFileObj
    if (file) {
      handleFileImport(file)
    }
  }

  return (
    <div className={cn(styles['upload-form-file-upload'], className)}>
      <div className={styles['upload-form__intro']}>
        <p>
          {t('', '第一步：点击下载')}
          <a
            href={TEMPLATE_PATH}
            download={t('', '模板文件.xlsx')}
            target="_blank"
            onClick={(e) => {
              console.log('Downloading template from:', e.currentTarget.href)

              // 下载成功提示
              setTimeout(() => {
                message.success(t('', '下载成功'))
              }, 100)

              // 添加错误处理
              e.currentTarget.onerror = () => {
                message.error(t('', '下载失败'))
                console.error('Template download failed:', e.currentTarget.href)
              }
            }}
          >
            {t('', '模板文件.xlsx')}
          </a>
          {t('', '，并在此excel文件中补充企业全称、曾用名或统一社会信用代码。')}
        </p>
        <p>{t('', '第二步：保存文件后，点击下方按钮或拖拽文件到下方区域导入文件。')}</p>

        <br />
      </div>
      {/* @ts-expect-error wind-ui */}
      <Dragger
        className={styles['upload-form__upload-dragger']}
        multiple={false}
        customRequest={handleFileUpload}
        fileList={fileList}
        onChange={handleUploadChange}
      >
        <p className={styles['upload-form__upload-icon']}>
          <img src={uploadImg} />
        </p>
        <p>
          <span className={styles['upload-form__upload-click']}>{t('286682', '点击上传')}</span>
          <span className={styles['upload-form__upload-click-text']}>/{t('', '拖拽到此区域')}</span>
        </p>
        <p className={styles['upload-form__upload-desc']}>
          {t('370835', '请上传Excel文件，查询企业家数在2,000家以内')}
        </p>
      </Dragger>
      <ButtonGroup onCancel={onCancel} onSubmit={handleFileCommit} submitDisabled={fileList.length === 0} />
    </div>
  )
}
