/**
 * 文件上传错误处理工具
 * 统一处理服务端返回的错误码，提供用户友好的提示
 */

// 错误码到用户提示的映射
export const ERROR_CODE_MESSAGES: Record<string | number, string> = {
  // 通用错误码
  400: '请求格式错误，请重试',
  413: '素材文件大小超过50MB限制',
  415: '请上传PDF、Word、Excel等格式文件',
  500: '服务器异常，请稍后重试',

  // 安全校验错误码
  4001: '文件存在安全风险，请检查后重新上传',
  4002: '文件包含不安全内容，禁止上传',
  4003: '文件已损坏或格式异常，请重新选择',
  4004: '文件类型验证失败，请确认文件格式',

  // 前端校验错误码
  FILE_TOO_LARGE: '素材文件大小不能超过50MB',
  FILENAME_TOO_LONG: '文件名过长，请重新命名',
  UNSUPPORTED_FORMAT: '请上传PDF、Word、Excel等报告素材',
  TYPE_MISMATCH: '文件类型与扩展名不匹配',
  TOO_MANY_FILES: '单次最多上传5个文件',
};

// 错误处理策略
export interface ErrorHandlingStrategy {
  message: string;
  allowRetry: boolean;
  suggestedAction?: string;
}

/**
 * 获取错误处理策略
 */
export const getErrorHandlingStrategy = (error: any): ErrorHandlingStrategy => {
  const errorCode = error?.response?.status || error?.code || error?.errorCode;
  const message = ERROR_CODE_MESSAGES[errorCode] || '上传失败，请重试';

  // 根据错误类型确定处理策略
  switch (errorCode) {
    case 413:
    case 'FILE_TOO_LARGE':
      return {
        message,
        allowRetry: true,
        suggestedAction: '请压缩文件或选择较小的文件',
      };

    case 415:
    case 'UNSUPPORTED_FORMAT':
      return {
        message,
        allowRetry: true,
        suggestedAction: '支持格式：PDF、Word、Excel、TXT文本、图片',
      };

    case 4001: // 病毒检测
      return {
        message,
        allowRetry: false,
        suggestedAction: '请检查文件来源，确保文件安全',
      };

    case 4002: // 恶意代码
      return {
        message,
        allowRetry: false,
        suggestedAction: '请更换其他文件',
      };

    case 4003: // 文件损坏
      return {
        message,
        allowRetry: true,
        suggestedAction: '请重新下载原文件',
      };

    case 4004: // 类型伪装
      return {
        message,
        allowRetry: true,
        suggestedAction: '请检查文件真实格式',
      };

    case 500:
      return {
        message,
        allowRetry: true,
        suggestedAction: '请稍后重试或联系技术支持',
      };

    default:
      return {
        message,
        allowRetry: true,
        suggestedAction: '请检查文件并重试',
      };
  }
};

/**
 * 统一的错误处理函数
 */
export const handleUploadError = (
  error: any,
  fileName?: string,
  onError?: (error: any) => void
): ErrorHandlingStrategy => {
  const strategy = getErrorHandlingStrategy(error);

  // 记录错误日志
  console.error('文件上传失败:', {
    fileName,
    error,
    strategy,
  });

  // 触发错误回调
  if (onError) {
    onError({
      ...error,
      strategy,
      fileName,
    });
  }

  return strategy;
};
