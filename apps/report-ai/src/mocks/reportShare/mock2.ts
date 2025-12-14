import { RPFileStatus, RPFileTraced } from 'gel-api';

/**
 * 第二组 Mock 数据 - 简化版本
 *
 * 包含常见状态的文件，用于基本功能测试
 */
export const rpFileMock2: RPFileTraced[] = [
  // 已完成的文件
  {
    fileId: 'mock2-finished-1',
    fileName: '项目方案.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadTime: '2024-01-04T10:00:00Z',
    status: RPFileStatus.FINISHED,
  },
  {
    fileId: 'mock2-finished-2',
    fileName: '数据分析.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadTime: '2024-01-05T11:00:00Z',
    status: RPFileStatus.FINISHED,
  },

  // 正在解析的文件
  {
    fileId: 'mock2-uploading-1',
    fileName: '研究报告.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-06T14:30:00Z',
    status: RPFileStatus.UPLOADED,
  },
  {
    fileId: 'mock2-uploading-2',
    fileName: '会议纪要.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadTime: '2024-01-06T14:35:00Z',
    status: RPFileStatus.UPLOADED,
  },

  // 大纲已解析
  {
    fileId: 'mock2-outline-parsed',
    fileName: '技术文档.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-07T09:00:00Z',
    status: RPFileStatus.OUTLINE_PARSED,
  },

  // 解析失败
  {
    fileId: 'mock2-failed',
    fileName: '损坏文件.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-08T15:00:00Z',
    status: RPFileStatus.FAILED,
  },

  // 财报相关
  {
    fileId: 'mock2-info-confirmed',
    fileName: '财务报表Q1.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadTime: '2024-01-09T10:00:00Z',
    status: RPFileStatus.FINANCE_INFO_PENDING,
  },

  // 图片文件
  {
    fileId: 'mock2-image',
    fileName: '流程图.png',
    fileType: 'image/png',
    uploadTime: '2024-01-10T11:00:00Z',
    status: RPFileStatus.FINANCE_BALANCE_PENDING,
  },
];
