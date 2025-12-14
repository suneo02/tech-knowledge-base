import { CheckCircleO, CloseCircleO } from '@wind/icons'
import { Progress } from '@wind/wind-ui'
import React from 'react'
import { FileStatus } from '../hooks/useFileData'

interface FileStatusDisplayProps {
  status: FileStatus
  progress?: number
}

const PREFIX = 'my-file-table'

export const FileStatusDisplay: React.FC<FileStatusDisplayProps> = ({ status, progress = 0 }) => {
  switch (status) {
    case FileStatus.PENDING:
    case FileStatus.RUNNING:
      return <Progress style={{ width: 100 }} percent={progress} status="active" showInfo={false} />
    case FileStatus.SUCCESS:
      return (
        <span className={`${PREFIX}-status-success`}>
          <CheckCircleO
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            style={{ marginRight: 4 }}
          />
          生成成功
        </span>
      )
    case FileStatus.FAILED:
      return (
        <span className={`${PREFIX}-status-failed`}>
          <CloseCircleO
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            style={{ marginRight: 4 }}
          />
          生成失败
        </span>
      )
    default:
      return null
  }
}

export default FileStatusDisplay
