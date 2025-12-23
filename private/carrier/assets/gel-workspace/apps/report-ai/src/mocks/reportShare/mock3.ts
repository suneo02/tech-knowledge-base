import { RPFileStatus, RPFileTraced } from 'gel-api';

/**
 * 文件状态测试 Mock 数据
 *
 * 包含各种状态的文件，用于测试：
 * 1. 已完成的文件（FINISHED）
 * 2. 正在解析的文件（UPLOADED）
 * 3. 大纲已解析的文件（OUTLINE_PARSED）
 * 4. 解析失败的文件（FAILED）
 * 5. 财报相关状态（INFO_CONFIRMED, BALANCE_DIAGNOSED, NOT_BALANCED）
 */
export const rpFileMock3: RPFileTraced[] = [
  // === 已完成的文件 ===
  {
    fileId: 'file-finished-1',
    fileName: '年度财务报表.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-01T10:00:00Z',
    status: RPFileStatus.FINISHED,
  },
  {
    fileId: 'file-finished-2',
    fileName: '审计报告2023.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadTime: '2024-01-02T11:30:00Z',
    status: RPFileStatus.FINISHED,
  },
  {
    fileId: 'file-finished-3',
    fileName: '财务分析表.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadTime: '2024-01-03T09:15:00Z',
    status: RPFileStatus.FINISHED,
  },

  // === 正在解析的文件 ===
  {
    fileId: 'file-uploading-1',
    fileName: '公司章程.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-04T14:20:00Z',
    status: RPFileStatus.UPLOADED,
  },
  {
    fileId: 'file-uploading-2',
    fileName: '营业执照.jpg',
    fileType: 'image/jpeg',
    uploadTime: '2024-01-04T14:25:00Z',
    status: RPFileStatus.UPLOADED,
  },
  {
    fileId: 'file-uploading-3',
    fileName: '合同文件.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-04T14:30:00Z',
    status: RPFileStatus.UPLOADED,
  },

  // === 大纲已解析的文件 ===
  {
    fileId: 'file-outline-parsed-1',
    fileName: '项目计划书.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadTime: '2024-01-05T10:00:00Z',
    status: RPFileStatus.OUTLINE_PARSED,
  },
  {
    fileId: 'file-outline-parsed-2',
    fileName: '产品说明书.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-05T10:10:00Z',
    status: RPFileStatus.OUTLINE_PARSED,
  },

  // === 解析失败的文件 ===
  {
    fileId: 'file-failed-1',
    fileName: '损坏的文件.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-06T15:00:00Z',
    status: RPFileStatus.FAILED,
  },
  {
    fileId: 'file-failed-2',
    fileName: '无法识别的格式.xyz',
    fileType: 'application/octet-stream',
    uploadTime: '2024-01-06T15:05:00Z',
    status: RPFileStatus.FAILED,
  },

  // === 财报相关状态 ===
  {
    fileId: 'file-info-confirmed',
    fileName: '财务报表2023Q4.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadTime: '2024-01-07T09:00:00Z',
    status: RPFileStatus.FINANCE_INFO_PENDING,
  },
  {
    fileId: 'file-balance-diagnosed',
    fileName: '资产负债表.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadTime: '2024-01-07T09:30:00Z',
    status: RPFileStatus.FINANCE_BALANCE_PENDING,
  },
  {
    fileId: 'file-not-balanced',
    fileName: '未配平财报.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadTime: '2024-01-07T10:00:00Z',
    status: RPFileStatus.FINANCE_NOT_BALANCED,
  },

  // === 混合文件类型 ===
  {
    fileId: 'file-image-finished',
    fileName: '产品图片.png',
    fileType: 'image/png',
    uploadTime: '2024-01-08T11:00:00Z',
    status: RPFileStatus.FINISHED,
  },
  {
    fileId: 'file-ppt-uploading',
    fileName: '汇报PPT.pptx',
    fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    uploadTime: '2024-01-08T11:30:00Z',
    status: RPFileStatus.UPLOADED,
  },
];
