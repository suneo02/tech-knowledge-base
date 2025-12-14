import { ApiRequestPage, ApiResponseForWFC, PaginationParams } from '@/types'
import { AxiosRequestConfig } from 'axios'
import { ReportIdIdentifier } from '../types'
import { RPFileDepre, RPFileIdIdentifier, RPFileIdIdentifierDepre, RPFileListItem } from '../types/report/file'

/**
 * 文件管理查询列表接口请求参数
 */
interface FileListQueryParams extends ApiRequestPage {
  fileName?: string
  companyName?: string
  startDate?: string // yyyyMMdd 格式
  endDate?: string // yyyyMMdd 格式
  tags?: string[] // 多个标签用逗号拼接
}

/**
 * 文件管理-编辑接口请求参数
 */
interface FileUpdateParams extends RPFileIdIdentifierDepre {
  fileRelateName?: string // 关联企业
  fileRelateCode?: string // 关联企业 code
  fileTags?: string[] // 标签，多个用逗号拼接
}

export interface reportAIFileApiPathMap {
  'report/fileUpload': {
    /**
     * file 文件
     */
    data: FormData // FormData containing file
    response: ApiResponseForWFC<RPFileIdIdentifierDepre>
  }
  'report/reportFileUpload': {
    /**
     * file 文件
     * reportId 组id
     */
    data: FormData // FormData containing file
    response: ApiResponseForWFC<RPFileIdIdentifierDepre>
  }
  'report/fileDownload': {
    params: RPFileIdIdentifierDepre
    response: Blob // 文件流
  }
  'report/filePreview': {
    params: RPFileIdIdentifierDepre
    response: ApiResponseForWFC<{
      fileName: string
      /**
       * 文件字节流
       */
      fileByte: string
    }>
  }
  'report/getTaskStatus': {
    data: {
      fileIds?: string[] // 文件id数组
    } & Partial<RPFileIdIdentifierDepre> &
      PaginationParams
    response: ApiResponseForWFC<Pick<RPFileDepre, 'fileID' | 'fileName' | 'status'>>
  }
  'report/createReportFile': {
    data: {
      html: string
    } & ReportIdIdentifier
    response: ApiResponseForWFC<{
      id: string
      createDate: string
    }>
  }
  'report/files': {
    response: ApiResponseForWFC<RPFileDepre[]>
  }
  // 素材删除接口
  'report/fileDelete': {
    data: RPFileIdIdentifier
    response: ApiResponseForWFC<boolean>
  }
  // 文件管理查询列表接口
  'report/fileList': {
    data: FileListQueryParams
    response: ApiResponseForWFC<RPFileListItem[]>
  }
  // 文件管理-编辑接口
  'report/fileUpdate': {
    data: FileUpdateParams
    response: ApiResponseForWFC<boolean>
  }
}

export const reportFileApiConfigMap: Partial<Record<keyof reportAIFileApiPathMap, AxiosRequestConfig>> = {
  'report/files': {
    method: 'GET',
  },
  'report/fileDownload': {
    method: 'GET',
  },
  'report/fileUpload': {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  },
  'report/reportFileUpload': {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  },
}
