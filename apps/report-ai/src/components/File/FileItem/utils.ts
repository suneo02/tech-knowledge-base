/**
 * 根据 MIME 类型推断文件类型
 */
export const getFileTypeFromMimeType = (mimeType?: string): 'word' | 'excel' | 'pdf' | 'other' => {
  if (!mimeType) return 'other';

  const normalizedMimeType = mimeType.toLowerCase();

  // Word 文档 MIME 类型
  if (
    normalizedMimeType === 'application/msword' ||
    normalizedMimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return 'word';
  }

  // Excel 文档 MIME 类型
  if (
    normalizedMimeType === 'application/vnd.ms-excel' ||
    normalizedMimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return 'excel';
  }

  // PDF 文档 MIME 类型
  if (normalizedMimeType === 'application/pdf') {
    return 'pdf';
  }

  return 'other';
};

/**
 * 根据文件名推断文件类型
 */
export const getFileTypeFromName = (fileName?: string): 'word' | 'excel' | 'pdf' | 'other' => {
  if (!fileName) return 'other';

  const extension = fileName.toLowerCase().split('.').pop();

  switch (extension) {
    case 'doc':
    case 'docx':
      return 'word';
    case 'xls':
    case 'xlsx':
      return 'excel';
    case 'pdf':
      return 'pdf';
    default:
      return 'other';
  }
};

/**
 * 智能检测文件类型
 * 优先使用 MIME 类型，如果不是标准的简化类型，则尝试作为 MIME 类型解析，最后回退到文件名解析
 */
export const detectFileType = (fileType?: string, fileName?: string): 'word' | 'excel' | 'pdf' | 'other' => {
  // 如果 fileType 已经是我们支持的简化类型，直接返回
  if (fileType === 'word' || fileType === 'excel' || fileType === 'pdf' || fileType === 'other') {
    return fileType;
  }

  // 如果 fileType 看起来像 MIME 类型，尝试解析
  if (fileType && fileType.includes('/')) {
    const typeFromMime = getFileTypeFromMimeType(fileType);
    if (typeFromMime !== 'other') {
      return typeFromMime;
    }
  }

  // 最后回退到文件名解析
  return getFileTypeFromName(fileName);
};

/**
 * 获取文件类型对应的颜色
 * 使用设计系统中的颜色变量
 */
export const getFileTypeColor = (fileType: 'word' | 'excel' | 'pdf' | 'other'): string => {
  switch (fileType) {
    case 'word':
      return '#2277a2'; // Word 蓝色 - 使用 @color-1
    case 'excel':
      return '#63a074'; // Excel 绿色 - 使用 @color-7
    case 'pdf':
      return '#e05d5d'; // PDF 红色 - 使用 @color-4
    default:
      return '#9da9b4'; // 默认灰色 - 使用 @color-9
  }
};
