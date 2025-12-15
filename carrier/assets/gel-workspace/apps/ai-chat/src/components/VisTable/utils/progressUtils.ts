/**
 * 解析进度字符串为步骤数组
 * @param progressStr 进度字符串，格式如 "\n1. 观察到公司名称，考虑翻译需求\n2. 分析名称结构，准备翻译\n"
 * @returns 步骤数组
 */
export const parseProgressSteps = (progressStr: string): string[] => {
  if (!progressStr) return []

  // 分割字符串并过滤空行
  return progressStr
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && /^\d+\./.test(line)) // 只保留以数字和点开头的行
    .map((line) => line.replace(/^\d+\.\s*/, '').trim()) // 移除行首的数字和点
}
