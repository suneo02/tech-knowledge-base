const langkeys = ['345553', '358256', '358257', '358236', '286077', '358519', '358520', '358521', '358522', '358523']

/**
 * 批量查询词条
 * 在多语言管理系统中批量查询词条 在多语言管理系统控制台中使用！！！
 * @author xhliu <xhliu.liuxh@wind.com.cn>
 * @param {string|string[]} id 查询的id或ids
 * @returns {string} entry2json 方法的入参str
 * @example
 * getStrformLangkey(['22503','21321]);
 */
const getStrformLangkey = (lankey) => {
  if (window && window?.location?.host !== '10.200.3.123:11746') {
    return console.log('请在多语言管理系统http://10.200.3.123:11746/iml/webapp/index.html的控制台中使用！！！') // 多语言管理系统中才能用！！！
  }

  if (typeof lankey === 'string') {
    lankey = [lankey]
  }
  if (!lankey) return ''

  const getData = (lankey) => {
    return fetch('http://10.200.3.123:11746/iml/language/page', {
      headers: {
        accept: '*/*',
        'accept-language': 'zh-CN,zh;q=0.9',
        authorization:
          'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdGFyIiwiZG9tYWluQWNjb3VudCI6InhobGl1LmxpdXhoIiwiaXNzIjoibGVvIiwiZXhwIjoxNzIyNTYxMjQwLCJ1c2VyTmFtZSI6IuWImOWFtOWNjiIsInVzZXJSb2xlIjoiMiIsImlhdCI6MTcyMjUwMDI0MCwiZW1wbG95ZWVDb2RlIjoiMjM2MjIiLCJ0ZXJtaW5hbFR5cGUiOiIwIn0.TicJs0lnkOdL7FsaPB1p98Q_KNVTbdj50bV8XUqRj8w',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        pragma: 'no-cache',
      },
      referrer: 'http://10.200.3.123:11746/iml/webapp/index.html',
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: JSON.stringify({
        pageSize: 15,
        pageIndex: 1,
        status: 0,
        queryType: 1,
        languageSortField: 1,
        sortType: 0,
        moduleName: '',
        chFullName: '',
        enFullName: '',
        languageIds: lankey,
      }),
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    })
      .then((res) => {
        console.log('🚀 ~ getData ~ res:', res)
        return res.json()
      })
      .then((res) => {
        let len = res?.data?.items?.length
        if (len) {
          let arr = []
          for (let i = 0; i < len; i++) {
            let { id, chFullName, enFullName } = res?.data?.items[i]
            arr.push(`${id}\t${chFullName}\t${enFullName}`)
          }
          console.log(arr, arr.join('\n'))
        }
      })
  }
  getData(lankey)
}

// Example usage:
// getStrformLangkey(langkeys)

module.exports = {
  getStrformLangkey,
  langkeys
} 