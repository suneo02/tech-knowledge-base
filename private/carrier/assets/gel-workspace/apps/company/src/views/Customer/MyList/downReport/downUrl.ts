export const getDownloadUrl = (id: string | number, filename: string, suffix?: string) => {
  return `/Wind.WFC.Enterprise.Web/Enterprise/ExcelDownload.aspx?taskId=${id}&filename=${filename}${suffix ? `&suffix=${suffix}` : ''}`
}

export const getDownloadUrlWithTaskId = (id: string | number, filename: string, suffix?: string) => {
  return `/Wind.WFC.Enterprise.Web/Enterprise//gel/download/getfile/downloadfilewithtaskid?taskId=${id}&filename=${filename}${suffix ? `&suffix=${suffix}` : ''}`
}
