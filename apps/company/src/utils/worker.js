const messageOnGroup = (message) => {
  setTimeout(() => {
    console.timeEnd('处理线程耗时')
    postMessage(message)
  }, 1000)
}

const handleMessageType = (message) => {
  switch (message.type) {
    case 'group':
      console.log('   module: group')
      messageOnGroup(message)
      break

    default:
      break
  }
}
const fetchData = async (sessionId) => {
  const formData = new FormData()
  formData.append('sourceLang', 1)
  formData.append('targetLang', 2)
  formData.append('source', 'gel')
  formData.append(
    'transText',
    JSON.stringify({
      '0$$companyLevel': '核心成员公司',
      '0$$companyName': '上海市航运有限公司',
      '1$$companyLevel': '一般成员公司',
      '1$$companyName': '上海交运汽车精密冲压件有限公司武汉分公司',
      '2$$companyLevel': '核心成员公司',
      '2$$companyName': '上海通华不锈钢压力容器工程有限公司',
      '3$$companyLevel': '核心成员公司',
      '3$$companyName': '上海巴士第五公共交通有限公司',
      '4$$companyLevel': '核心成员公司',
      '4$$companyName': '上海久通融资租赁有限公司',
      '5$$companyLevel': '一般成员公司',
      '5$$companyName': '上海中国青年旅行社有限公司',
      '6$$companyLevel': '一般成员公司',
      '6$$companyName': '上海交运起申汽车销售服务有限公司',
      '7$$companyLevel': '核心主体公司',
      '8$$companyLevel': '核心成员公司',
      '8$$companyName': '上海市汽车修理有限公司',
      '9$$companyLevel': '一般成员公司',
      '9$$companyName': '上海交运起腾汽车销售服务有限公司',
      1: '上海交运起腾汽车销售服务有限公司',
      2: '上海交运起腾汽车销售服务有限公司',
      3: '上海交运起腾汽车销售服务有限公司',
      4: '上海交运起腾汽车销售服务有限公司',
      5: '上海交运起腾汽车销售服务有限公司',
      6: '上海交运起腾汽车销售服务有限公司',
      7: '上海交运起腾汽车销售服务有限公司',
    })
  )
  const res = await fetch('/Wind.WFC.Enterprise.Web/Enterprise/WindSecureApi.aspx?cmd=apitranslates', {
    headers: {
      'Wind.Sessionid': sessionId,
    },
    method: 'POST',
    body: formData,
  })
  const data = await res.json()
  // console.timeEnd('处理线程耗时')
  // console.log(data)
  postMessage(data)
}

onmessage = (event) => {
  // console.log('🚀 ~launch multi process ~ ')
  // console.time('处理线程耗时')
  const message = event.data
  console.log('   message:', message)
  fetchData(event.sessionId)
  // handleMessageType(message)
}
