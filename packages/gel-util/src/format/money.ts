import { t } from 'i18next'

/**
 *
 * @param money 金额
 * @param arr 单位
 *  •	这是一个数组，用于传递一些单位和标志。具体来说，arr 可能包含以下信息：
 *  •	arr[0] 是标志，可能是 'All2'，此时将会设置 k = 1。
 *  •	arr[k] 是用于控制小数点位数的值，默认情况下是 4。
 *  •	arr[k+1] 是用于表示单位的字符串，默认情况下是 '万'。
 *  •	arr[k+2] 是一个值，用于决定是否对金额进行除以1000的操作，默认是 1。
 *  •	arr[k+3] 是一个自定义的数量级，可能是 1000，用于控制格式化的数量级（例如，*10000）。
 *  •	arr[k+4] 如果存在，表示不要附加单位。
 *
 * @param data 最长截止几位小数
 * 可能包含 InvestRegUnit 属性。它的存在会覆盖默认单位 '万'，并将其替换为 '万' + data.InvestRegUnit。
 *
 * @param nounit
 * 用来决定是否在结果中附加单位。如果为 true，则返回格式化后的金额字符串，不带单位。
 *
 * @deprecated 从 wft common 中粘贴过来的，谨慎使用
 */
export const formatMoneyFromWftCommon = (money: number, arr?: any, data?: any, nounit?: boolean) => {
  //格式化数据
  if (!money || money + ''.toLowerCase() == 'undefined') {
    return '--'
  }
  let k = 0
  if (arr && arr[0] == 'All2') {
    k = 1
  }
  let num = arr && arr[k] ? arr[k] : 4
  if (arr && arr[k] === 0) num = 0
  let unit = arr && arr[k + 1] ? arr[k + 1] : t('20116', '万')
  let isDivide = arr && arr[k + 2] ? 1000 : 1
  if (data && data.InvestRegUnit) {
    unit = '万' + data.InvestRegUnit //暂时还没有带
  }
  if (arr && arr[k + 3]) {
    isDivide = arr[k + 3] //处理数量的数量级如*10000可为0.0001
  }
  let moneyStr = String(parseFloat((parseFloat(String(money)) / isDivide).toFixed(num)))
  if (arr && arr[k + 4]) {
    unit = ''
    moneyStr = String((parseFloat(String(money)) / isDivide).toFixed(num))
  }
  let moneySymbol = ''
  if (moneyStr.indexOf('-') == 0) {
    moneySymbol = '-'
    moneyStr = moneyStr.replace('-', '')
  }
  const moneyInt = moneyStr.split('.')[0]
  const moneyFloat = moneyStr.split('.')[1]
  const len = moneyInt.length
  let lennum = parseInt(String(len / 3))
  let moneyOut = ''
  let i = 1
  if (len % 3 == 0) {
    lennum--
  }
  for (; i <= lennum; i++) {
    const mstr = moneyInt.substring(len - i * 3, len - (i - 1) * 3)
    moneyOut = ',' + mstr + moneyOut
  }
  if (moneyFloat == undefined) {
    moneyOut = moneySymbol + moneyInt.substring(0, len - (i - 1) * 3) + moneyOut
  } else {
    moneyOut = moneySymbol + moneyInt.substring(0, len - (i - 1) * 3) + moneyOut + '.' + moneyFloat
  }
  if (nounit) {
    return moneyOut
  }
  return moneyOut + unit
}

/**
 * @deprecated 从 wft common 中粘贴过来的，谨慎使用
 * @param money
 * @param arr
 * @param data
 * @param nounit
 * @returns
 */
export const formatMoneyTempFromWftCommon = (money: number, arr?: any, data?: any, nounit?: boolean) => {
  // 整数也带两位小数,之后可能替换formatMoney//格式化数据
  if (!money || money + ''.toLowerCase() == 'undefined') {
    return '--'
  }
  let k = 0
  if (arr && arr[0] == 'All2') {
    k = 1
  }
  let num = arr && arr[k] ? arr[k] : 4
  if (arr && arr[k] === 0) num = 0
  let unit = arr && arr[k + 1] ? arr[k + 1] : '万'
  let isDivide = arr && arr[k + 2] ? 1000 : 1
  if (data && data.InvestRegUnit) {
    unit = '万' + data.InvestRegUnit //暂时还没有带
  }
  if (arr && arr[k + 3]) {
    isDivide = arr[k + 3] //处理数量的数量级如*10000可为0.0001
  }
  let moneyStr = String(parseFloat((parseFloat(String(money)) / isDivide).toFixed(num)))
  if (arr && arr[k + 4]) {
    unit = ''
    moneyStr = String((parseFloat(String(money)) / isDivide).toFixed(num))
  }
  let moneySymbol = ''
  if (moneyStr.indexOf('-') == 0) {
    moneySymbol = '-'
    moneyStr = moneyStr.replace('-', '')
  }
  const moneyInt = moneyStr.split('.')[0]
  let moneyFloat = moneyStr.split('.')[1]
  const len = moneyInt.length
  // @ts-expect-error ttt
  let lennum = parseInt(len / 3)
  let moneyOut = ''
  let i = 1
  if (len % 3 == 0) {
    lennum--
  }
  for (; i <= lennum; i++) {
    const mstr = moneyInt.substring(len - i * 3, len - (i - 1) * 3)
    moneyOut = ',' + mstr + moneyOut
  }
  if (moneyFloat == undefined) {
    moneyOut = moneySymbol + moneyInt.substring(0, len - (i - 1) * 3) + moneyOut + '.00'
  } else {
    // @ts-expect-error ttt
    moneyFloat = moneyFloat > 99 ? String(moneyFloat).substring(0, 2) : moneyFloat
    // @ts-expect-error ttt
    if (moneyFloat[0] != 0) {
      moneyFloat = Number(moneyFloat) < 10 ? moneyFloat + '0' : moneyFloat
    }
    moneyOut = moneySymbol + moneyInt.substring(0, len - (i - 1) * 3) + moneyOut + '.' + moneyFloat
  }
  if (nounit) {
    return moneyOut
  }
  return moneyOut + unit
}
