/**
 * 报告素材文件校验工具
 * 实现三层校验机制的前端部分
 */

// 支持的素材文件类型
export const SUPPORTED_FILE_TYPES = {
  // 文档类型
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],

  // 图片类型
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],

  // 表格类型
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
} as const;

// 文件大小限制 (50MB)
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

// 文件名长度限制
export const MAX_FILENAME_LENGTH = 100;

// 校验结果接口
export interface ValidationResult {
  valid: boolean;
  error?: string;
  errorCode?: string;
}

/**
 * 第一层：前端预校验
 * 检查文件大小、格式、文件名长度
 */
export const validateFileBasic = (file: File): ValidationResult => {
  // 检查文件大小
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: '素材文件大小不能超过50MB',
      errorCode: 'FILE_TOO_LARGE',
    };
  }

  // 检查文件名长度
  if (file.name.length > MAX_FILENAME_LENGTH) {
    return {
      valid: false,
      error: '文件名过长，请重新命名',
      errorCode: 'FILENAME_TOO_LONG',
    };
  }

  // 检查文件类型
  const mimeType = file.type;
  const fileExtension = getFileExtension(file.name);

  if (!mimeType || !SUPPORTED_FILE_TYPES[mimeType as keyof typeof SUPPORTED_FILE_TYPES]) {
    return {
      valid: false,
      error: '请上传PDF、Word、Excel等报告素材',
      errorCode: 'UNSUPPORTED_FORMAT',
    };
  }

  // 检查扩展名与MIME类型是否匹配
  const supportedExtensions = SUPPORTED_FILE_TYPES[mimeType as keyof typeof SUPPORTED_FILE_TYPES];
  const fileExt = fileExtension.toLowerCase();
  if (!supportedExtensions || !supportedExtensions.some((ext) => ext === fileExt)) {
    return {
      valid: false,
      error: '文件类型与扩展名不匹配',
      errorCode: 'TYPE_MISMATCH',
    };
  }

  return { valid: true };
};

/**
 * 批量文件校验
 */
export const validateFiles = (files: File[]): ValidationResult => {
  // 检查文件数量
  if (files.length > 5) {
    return {
      valid: false,
      error: '单次最多上传5个文件',
      errorCode: 'TOO_MANY_FILES',
    };
  }

  // 逐个检查每个文件
  for (const file of files) {
    const result = validateFileBasic(file);
    if (!result.valid) {
      return {
        valid: false,
        error: `${file.name}: ${result.error}`,
        errorCode: result.errorCode,
      };
    }
  }

  return { valid: true };
};

/**
 * 获取文件扩展名
 */
export const getFileExtension = (filename: string): string => {
  return filename.toLowerCase().substring(filename.lastIndexOf('.'));
};

/**
 * 获取用户友好的文件类型名称
 */
export const getFileTypeName = (mimeType: string): string => {
  const typeMap: Record<string, string> = {
    'application/pdf': 'PDF文档',
    'application/msword': 'Word文档',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word文档',
    'text/plain': '文本文件',
    'image/jpeg': '图片',
    'image/png': '图片',
    'application/vnd.ms-excel': 'Excel表格',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel表格',
  };

  return typeMap[mimeType] || '未知格式';
};

/**
 * 支持的文件格式列表（用于提示）
 */
export const getSupportedFormatsText = (): string => {
  return 'PDF、Word(DOC/DOCX)、Excel(XLS/XLSX)、TXT文本、图片(JPG/PNG)';
};
