import { RPFileStatus, RPFileTraced } from 'gel-api';

/**
 * 第四组 Mock 数据 - 边界场景和特殊情况测试
 *
 * 包含边界场景和特殊情况的文件，用于测试：
 * 1. 长文件名和特殊字符
 * 2. 批量上传场景
 * 3. 混合状态组合
 * 4. 时间顺序测试
 * 5. 不同文件类型组合
 */
export const rpFileMock4: RPFileTraced[] = [
  // === 长文件名测试 ===
  {
    fileId: 'mock4-long-name-1',
    fileName: '2024年度第一季度企业财务审计报告及资产负债表详细分析文档（最终版）.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-10T08:00:00Z',
    status: RPFileStatus.FINISHED,
  },
  {
    fileId: 'mock4-long-name-2',
    fileName: 'Annual_Financial_Report_2024_Q1_Q2_Q3_Comprehensive_Analysis_With_Appendix_Final_Version_v3.2.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadTime: '2024-01-10T08:05:00Z',
    status: RPFileStatus.UPLOADED,
  },

  // === 特殊字符文件名 ===
  {
    fileId: 'mock4-special-char-1',
    fileName: '财务报表【2024】(修订版)-最终稿.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-10T08:10:00Z',
    status: RPFileStatus.FINISHED,
  },
  {
    fileId: 'mock4-special-char-2',
    fileName: 'Report@2024#Q1&Q2_Analysis.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadTime: '2024-01-10T08:15:00Z',
    status: RPFileStatus.OUTLINE_PARSED,
  },

  // === 批量上传场景（同一时间段多个文件）===
  {
    fileId: 'mock4-batch-1',
    fileName: '合同文件01.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-10T09:00:00Z',
    status: RPFileStatus.UPLOADED,
  },
  {
    fileId: 'mock4-batch-2',
    fileName: '合同文件02.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-10T09:00:01Z',
    status: RPFileStatus.UPLOADED,
  },
  {
    fileId: 'mock4-batch-3',
    fileName: '合同文件03.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-10T09:00:02Z',
    status: RPFileStatus.UPLOADED,
  },
  {
    fileId: 'mock4-batch-4',
    fileName: '合同文件04.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-10T09:00:03Z',
    status: RPFileStatus.OUTLINE_PARSED,
  },
  {
    fileId: 'mock4-batch-5',
    fileName: '合同文件05.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-10T09:00:04Z',
    status: RPFileStatus.FINISHED,
  },

  // === 财报完整流程测试 ===
  {
    fileId: 'mock4-finance-flow-1',
    fileName: '财报数据表-待确认.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadTime: '2024-01-10T10:00:00Z',
    status: RPFileStatus.FINANCE_INFO_PENDING,
  },
  {
    fileId: 'mock4-finance-flow-2',
    fileName: '财报数据表-诊断中.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadTime: '2024-01-10T10:05:00Z',
    status: RPFileStatus.FINANCE_BALANCE_PENDING,
  },
  {
    fileId: 'mock4-finance-flow-3',
    fileName: '财报数据表-未配平.xlsx',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    uploadTime: '2024-01-10T10:10:00Z',
    status: RPFileStatus.FINANCE_NOT_BALANCED,
  },

  // === 多种文件类型混合 ===
  {
    fileId: 'mock4-mixed-type-1',
    fileName: '产品架构图.png',
    fileType: 'image/png',
    uploadTime: '2024-01-10T11:00:00Z',
    status: RPFileStatus.FINISHED,
  },
  {
    fileId: 'mock4-mixed-type-2',
    fileName: '系统流程图.jpg',
    fileType: 'image/jpeg',
    uploadTime: '2024-01-10T11:05:00Z',
    status: RPFileStatus.UPLOADED,
  },
  {
    fileId: 'mock4-mixed-type-3',
    fileName: '项目演示.pptx',
    fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    uploadTime: '2024-01-10T11:10:00Z',
    status: RPFileStatus.OUTLINE_PARSED,
  },
  {
    fileId: 'mock4-mixed-type-4',
    fileName: '数据统计.csv',
    fileType: 'text/csv',
    uploadTime: '2024-01-10T11:15:00Z',
    status: RPFileStatus.FAILED,
  },

  // === 失败场景测试 ===
  {
    fileId: 'mock4-failed-1',
    fileName: '加密文件.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-10T12:00:00Z',
    status: RPFileStatus.FAILED,
  },
  {
    fileId: 'mock4-failed-2',
    fileName: '超大文件.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-10T12:05:00Z',
    status: RPFileStatus.FAILED,
  },
  {
    fileId: 'mock4-failed-3',
    fileName: '空白文档.docx',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    uploadTime: '2024-01-10T12:10:00Z',
    status: RPFileStatus.FAILED,
  },

  // === 边界时间测试（跨天、跨月）===
  {
    fileId: 'mock4-time-1',
    fileName: '月末报告.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-01-31T23:59:59Z',
    status: RPFileStatus.FINISHED,
  },
  {
    fileId: 'mock4-time-2',
    fileName: '月初报告.pdf',
    fileType: 'application/pdf',
    uploadTime: '2024-02-01T00:00:00Z',
    status: RPFileStatus.UPLOADED,
  },
];
