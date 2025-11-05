// 判断父元素是否含有child
export const isParentHasChild = (parent, child) => {
  let hasChild = false

  const iteratorChild = (item) => {
    const itemList = item.newFilterItemList || item.extraConfig
    if (itemList) {
      itemList.forEach((_child) => {
        if (_child.itemId === child.itemId) hasChild = true
        iteratorChild(_child)
      })
    }
  }

  iteratorChild(parent)
  return hasChild
}
