/**
 * 判断是否是海外用户
 * @param {*} userInfo
 * @returns
 */
export const getIfOverseaByUserInfo = (userInfo) => {
  if (!userInfo) {
    return false
  }
  let res = userInfo.isForeign || false //是否是海外用户
  if (Number(userInfo.region) !== 0) {
    // ip 境外
    res = true
  }
  return res
}
