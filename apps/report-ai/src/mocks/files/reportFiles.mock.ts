import { RPFileStatus, RPFileTraced } from 'gel-api';

/**
 * 基础文件 Mock 数据
 * 提供各种文件类型的示例数据，可在多个测试场景中复用
 */

// PDF 文件示例
export const mockPdfFile1: RPFileTraced = {
  fileId: 'pdf-file-001',
  fileName: '2024年市场分析报告.pdf',
  fileType: 'application/pdf',
  status: RPFileStatus.FINISHED,
  uploadTime: '2024-01-15T10:30:00Z',
};

export const mockPdfFile2: RPFileTraced = {
  fileId: 'pdf-file-002',
  fileName: '竞争对手研究.pdf',
  fileType: 'application/pdf',
  status: RPFileStatus.FINISHED,
  uploadTime: '2024-01-16T14:20:00Z',
};

export const mockPdfFile3: RPFileTraced = {
  fileId: 'pdf-file-003',
  fileName: '行业趋势分析.pdf',
  fileType: 'application/pdf',
  status: RPFileStatus.FINISHED,
  uploadTime: '2024-01-17T09:15:00Z',
};

// Word 文档示例
export const mockWordFile1: RPFileTraced = {
  fileId: 'word-file-001',
  fileName: '项目需求文档.docx',
  fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  status: RPFileStatus.FINISHED,
  uploadTime: '2024-01-18T11:45:00Z',
};

export const mockWordFile2: RPFileTraced = {
  fileId: 'word-file-002',
  fileName: '会议纪要.doc',
  fileType: 'application/msword',
  status: RPFileStatus.FINISHED,
  uploadTime: '2024-01-19T16:30:00Z',
};

// Excel 表格示例
export const mockExcelFile1: RPFileTraced = {
  fileId: 'excel-file-001',
  fileName: '销售数据统计.xlsx',
  fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  status: RPFileStatus.FINISHED,
  uploadTime: '2024-01-20T13:20:00Z',
};

export const mockExcelFile2: RPFileTraced = {
  fileId: 'excel-file-002',
  fileName: '财务报表.xls',
  fileType: 'application/vnd.ms-excel',
  status: RPFileStatus.FINISHED,
  uploadTime: '2024-01-21T10:00:00Z',
};

// 图片文件示例
export const mockImageFile1: RPFileTraced = {
  fileId: 'image-file-001',
  fileName: '产品截图.png',
  fileType: 'image/png',
  status: RPFileStatus.FINISHED,
  uploadTime: '2024-01-22T15:40:00Z',
};

export const mockImageFile2: RPFileTraced = {
  fileId: 'image-file-002',
  fileName: '流程图.jpg',
  fileType: 'image/jpeg',
  status: RPFileStatus.FINISHED,
  uploadTime: '2024-01-23T09:30:00Z',
};

// 文本文件示例
export const mockTextFile: RPFileTraced = {
  fileId: 'text-file-001',
  fileName: '数据说明.txt',
  fileType: 'text/plain',
  status: RPFileStatus.FINISHED,
  uploadTime: '2024-01-24T14:15:00Z',
};

// 不同状态的文件示例
export const mockUploadedFile: RPFileTraced = {
  fileId: 'uploaded-file-001',
  fileName: '正在处理的文件.pdf',
  fileType: 'application/pdf',
  status: RPFileStatus.UPLOADED,
  uploadTime: '2024-01-25T16:00:00Z',
};

export const mockOutlineParsedFile: RPFileTraced = {
  fileId: 'outline-parsed-file-001',
  fileName: '大纲已解析.pdf',
  fileType: 'application/pdf',
  status: RPFileStatus.OUTLINE_PARSED,
  uploadTime: '2024-01-25T16:10:00Z',
};

export const mockFailedFile: RPFileTraced = {
  fileId: 'failed-file-001',
  fileName: '解析失败的文件.pdf',
  fileType: 'application/pdf',
  status: RPFileStatus.FAILED,
  uploadTime: '2024-01-26T10:30:00Z',
};

// 带位置信息的文件示例
export const mockFileWithPosition: RPFileTraced = {
  fileId: 'positioned-file-001',
  fileName: '带标注的报告.pdf',
  fileType: 'application/pdf',
  status: RPFileStatus.FINISHED,
  uploadTime: '2024-01-27T11:20:00Z',
  position: {
    startPoint: {
      x: 150,
      y: 200,
      page: 3,
    },
  },
};

/**
 * 场景化的文件 Mock 数据集合
 * 可根据不同的测试场景选择合适的数据集
 */
export const reportFilesMocks = {
  /**
   * 默认场景 - 包含多种文件类型
   */
  default: [mockPdfFile1, mockPdfFile2, mockWordFile1, mockExcelFile1, mockImageFile1] as RPFileTraced[],

  /**
   * 空场景 - 没有文件
   */
  empty: [] as RPFileTraced[],

  /**
   * 大量文件场景 - 用于测试列表性能
   */
  large: [
    mockPdfFile1,
    mockPdfFile2,
    mockPdfFile3,
    mockWordFile1,
    mockWordFile2,
    mockExcelFile1,
    mockExcelFile2,
    mockImageFile1,
    mockImageFile2,
    mockTextFile,
    // 生成更多文件以填充列表
    ...Array.from({ length: 15 }, (_, index) => ({
      fileId: `generated-file-${index + 1}`,
      fileName: `生成文件${index + 1}.pdf`,
      fileType: 'application/pdf',
      status: RPFileStatus.FINISHED,
      uploadTime: new Date(2024, 0, 28 + index, 10, 0, 0).toISOString(),
    })),
  ] as RPFileTraced[],

  /**
   * 包含失败文件的场景
   */
  withFailedFiles: [mockPdfFile1, mockFailedFile, mockWordFile1, mockUploadedFile, mockExcelFile1] as RPFileTraced[],

  /**
   * 处理中的文件场景
   */
  processing: [mockPdfFile1, mockUploadedFile, mockOutlineParsedFile, mockWordFile1] as RPFileTraced[],

  /**
   * 只有图片的场景
   */
  imagesOnly: [mockImageFile1, mockImageFile2] as RPFileTraced[],

  /**
   * 只有文档的场景
   */
  documentsOnly: [mockPdfFile1, mockPdfFile2, mockWordFile1, mockExcelFile1] as RPFileTraced[],

  /**
   * 带位置信息的场景
   */
  withPositions: [mockFileWithPosition, mockPdfFile1, mockImageFile1] as RPFileTraced[],

  /**
   * 混合状态场景 - 包含各种状态的文件
   */
  mixedStatus: [
    mockPdfFile1, // FINISHED
    mockUploadedFile, // UPLOADED
    mockOutlineParsedFile, // OUTLINE_PARSED
    mockFailedFile, // FAILED
    mockWordFile1, // FINISHED
  ] as RPFileTraced[],
};

/**
 * 获取指定场景的文件 Mock 数据
 * @param scenario 场景名称
 * @returns 文件数组
 */
export const getReportFilesMock = (scenario: keyof typeof reportFilesMocks = 'default'): RPFileTraced[] => {
  return reportFilesMocks[scenario] || reportFilesMocks.default;
};

/**
 * 单个文件导出，便于在测试中使用
 */
export const individualFileMocks = {
  pdf: [mockPdfFile1, mockPdfFile2, mockPdfFile3],
  word: [mockWordFile1, mockWordFile2],
  excel: [mockExcelFile1, mockExcelFile2],
  image: [mockImageFile1, mockImageFile2],
  text: [mockTextFile],
  withStatus: {
    finished: mockPdfFile1,
    uploaded: mockUploadedFile,
    outlineParsed: mockOutlineParsedFile,
    failed: mockFailedFile,
  },
  withPosition: mockFileWithPosition,
};
