/**
 * @deprecated 这种方法非常不好，应该根据 配置获取path
 */
export const getAreaCodeAncestors = (code: string) => {
  const codeArr = []
  const spec = ['03010101', '03020101', '03030101', '03030201', '03040801', '03040901']
  const spec2 = ['030407']
  if (code === '0000') {
    // 全国
    codeArr.push('0000')
  } else if (spec.includes(code.substring(0, 8))) {
    // 直辖市及香港澳门，一级8位，二级10位
    code.length >= 8 && codeArr.push(code.substring(0, 8))
    code.length >= 10 && codeArr.push(code.substring(0, 10))
  } else if (spec2.includes(code.substring(0, 6))) {
    // 台湾，一级6位，二级10位
    code.length >= 6 && codeArr.push(code.substring(0, 6))
    code.length >= 6 && codeArr.push(code.substring(0, 10))
  } else {
    // 一级6位，二级8位，三级10位
    code.length >= 6 && codeArr.push(code.substring(0, 6))
    code.length >= 8 && codeArr.push(code.substring(0, 8))
    code.length >= 10 && codeArr.push(code.substring(0, 10))
  }
  return codeArr
}
