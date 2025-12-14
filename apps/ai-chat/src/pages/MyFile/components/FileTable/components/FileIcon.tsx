import React from 'react'
import { ExcelIcon, PdfIcon, PptIcon, WordIcon } from '@/assets/icon'

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
      return ExcelIcon
    case 'pdf':
      return PdfIcon
    case 'ppt':
    case 'pptx':
      return PptIcon
    case 'doc':
    case 'docx':
      return WordIcon
    default:
      return ExcelIcon // 默认图标
  }
}

export const FileIcon: React.FC<FileIconProps> = ({ fileName }) => {
  const iconSrc = getFileIcon(fileName)

  return <img width={20} height={20} src={iconSrc} alt="文件图标" />
}

export default FileIcon
