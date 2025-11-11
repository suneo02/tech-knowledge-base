import { FileExcelC, FilePdfC, FilePptC, FileWordC } from '@wind/icons'
import React from 'react'

interface FileIconProps {
  fileName: string
}

// 根据文件扩展名获取对应的图标
const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''

  switch (extension) {
    case 'xlsx':
    case 'xls':
    case 'csv':
      return <FileExcelC style={{ fontSize: 20 }} />
    case 'pdf':
      return <FilePdfC style={{ fontSize: 20 }} />
    case 'ppt':
    case 'pptx':
      return <FilePptC style={{ fontSize: 20 }} />
    case 'doc':
    case 'docx':
      return <FileWordC style={{ fontSize: 20 }} />
    default:
      return <FileExcelC style={{ fontSize: 20 }} /> // 默认图标
  }
}

export const FileIcon: React.FC<FileIconProps> = ({ fileName }) => {
  return getFileIcon(fileName)
}

export default FileIcon
