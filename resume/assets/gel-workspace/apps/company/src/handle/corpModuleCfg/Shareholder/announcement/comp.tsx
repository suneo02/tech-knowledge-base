export const AnnouncementExtraParams= (param) => {
  delete param.windCode
  delete param.windcode
  return {
    ...param,
    expoVer: 1,
    __primaryKey: param.companycode,
  }
}
export const AnnouncementDataCallback= (res) => {
  // 数据返回后是否要做单独的逻辑处理
  res.map((t, idx) => {
    t.rowKey = idx
    t.key = idx
  })
  return res
}