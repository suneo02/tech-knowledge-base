import JSEncrypt from 'jsencrypt'
/**
 * 从 jQuery 项目中抄过来的，不知道干啥用
 * @param {Object} obj
 * @returns
 */
export function getAllPrpos(obj) {
  // 用来保存所有的属性名称和值
  var props = ''
  // 开始遍历
  for (var p in obj) {
    // 方法
    if (typeof obj[p] == ' function ') {
      obj[p]()
    } else {
      // p 为属性名称，obj[p]为对应属性的值
      props += p + '=' + encodeURIComponent(obj[p]) + '&'
    }
  }
  if (props != '' && props.substr(props.length - 1, 1) == '&') {
    props = props.substr(0, props.length - 1)
  }
  // 最后显示所有的属性
  return props
}

export function encryptData(json, publicKey) {
  var encrypt = new JSEncrypt()
  encrypt.setPublicKey(publicKey)
  var data = encrypt.encrypt(JSON.stringify(json))
  return data
}
