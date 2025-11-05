// localStorage存储键常量
const ACTIVE_SHEET_STORAGE_KEY = 'visTable_activeSheet'

// 函数用于存储当前活跃的tableId和sheetId到localStorage
export const saveActiveSheet = (tableId: string, sheetId: number | string) => {
  try {
    localStorage.setItem(
      ACTIVE_SHEET_STORAGE_KEY,
      JSON.stringify({
        tableId,
        sheetId: String(sheetId),
        timestamp: Date.now(), // 添加时间戳以便后续可能的清理
      })
    )
  } catch (e) {
    console.error('保存活跃Sheet信息失败:', e)
  }
}

// 函数用于从localStorage获取之前存储的tableId和sheetId
export const getActiveSheet = (currentTableId: string) => {
  try {
    const storedData = localStorage.getItem(ACTIVE_SHEET_STORAGE_KEY)
    if (!storedData) return null

    const parsedData = JSON.parse(storedData)

    // 确保找到的数据与当前tableId匹配
    if (parsedData.tableId === currentTableId) {
      return {
        tableId: parsedData.tableId,
        sheetId: parsedData.sheetId,
      }
    }
    return null
  } catch (e) {
    console.error('获取活跃Sheet信息失败:', e)
    return null
  }
}
