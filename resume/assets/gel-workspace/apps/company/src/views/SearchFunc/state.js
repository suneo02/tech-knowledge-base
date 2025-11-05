export const getCompanyStateColor = (state) => {
  switch (state) {
    case '责令关闭':
    case '撤销':
    case '吊销':
    case '迁出':
    case '停业':
    case '吊销,未注销':
    case '吊销,已注销':
    case '注销':
    case '非正常户':
    case '已告解散':
    case '解散':
    case '廢止':
    case '已废止':
    case '歇業':
    case '破產':
    case '破產程序終結(終止)':
    case '合併解散':
    case '撤銷':
    case '已终止':
    case '解散已清算完結':
    case '该单位已注销':
    case '核准設立，但已命令解散':
      return 'color-4' // TODO
    case '成立':
    case '存续':
    case '在业':
    case '正常':
    case '其他':
      return 'color-7' // TODO
    default:
      return 'color-7' // TODO
  }
}
