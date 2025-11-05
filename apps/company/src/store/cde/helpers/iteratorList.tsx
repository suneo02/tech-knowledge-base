// 迭代config
export const iteratorList = (list = [], fn) => {
  return list.map((item) => {
    const itemList = item.newFilterItemList || item.extraConfig
    if (itemList) {
      iteratorList(itemList, fn)
    }
    fn(item)
    return item
  })
}
