export function compareApiKeys(objFront, objApi) {
  // 将两个对象的键转换为集合
  const keysObj1 = new Set(Object.keys(objFront))
  const keysObj2 = new Set(Object.keys(objApi))

  // 找出第一个对象有，而第二个对象没有的键
  const onlyInObj1 = Array.from(keysObj1).filter((key) => !keysObj2.has(key))
  // 找出第二个对象有，而第一个对象没有的键
  const onlyInObj2 = Array.from(keysObj2).filter((key) => !keysObj1.has(key))

  // 打印结果
  if (onlyInObj1.length === 0 && onlyInObj2.length === 0) {
    console.log('~ api data correct')
  } else {
    if (onlyInObj1.length > 0) {
      console.error(`~ key only in front\t${onlyInObj1.join(', ')}`)
    }
    if (onlyInObj2.length > 0) {
      console.error(`~ key only in api\t${onlyInObj2.join(', ')}`)
    }
  }
}
