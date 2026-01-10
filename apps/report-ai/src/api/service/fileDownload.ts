import { requestToChatWithAxios, RPFileListItem } from 'gel-api';
import { axiosInstanceWithoutIntercepter } from '../axios';

/**
 * 下载文件
 *
 * @param _fileId 文件ID
 * @param fileName 文件名
 * @returns Promise<void>
 */
export const downloadFile = async (fileId: string, fileName: string): Promise<void> => {
  try {
    // 使用gel-api中的文件下载接口
    const response = await requestToChatWithAxios(axiosInstanceWithoutIntercepter, 'report/fileDownload', undefined, {
      params: {
        fileID: fileId,
        fileId,
      },
    });

    // 创建下载链接
    const blob = new Blob([response]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download file error:', error);
    throw error;
  }
};

/**
 * 下载文件（通过文件对象）
 *
 * @param file 文件对象
 * @returns Promise<void>
 */
export const downloadFileByItem = async (file: RPFileListItem): Promise<void> => {
  return downloadFile(file.fileID, file.fileName);
};
