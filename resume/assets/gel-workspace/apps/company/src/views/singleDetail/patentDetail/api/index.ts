import { request } from '@/api/request'
import { getPatentDetailIndustry } from '@/api/singleDetail'
import { wftCommon } from '@/utils/utils'
import { SetStateAction } from 'react'

function generateIndustry(node, currentPath = []) {
  if (!node.childNodeList || node.childNodeList.length === 0) {
    // 叶子节点，插入到数组中
    return [[...currentPath, node.industryName]]
  }
  // 遍历子节点递归
  const paths = []
  node.childNodeList.forEach((child) => {
    const childPaths = generateIndustry(child, [...currentPath, node.industryName])
    paths.push(...childPaths)
  })

  return paths
}
export const handlePatentDetailApi = (options: {
  detailId: string

  setPdfList: React.Dispatch<SetStateAction<any>>
  setDetailRight: React.Dispatch<SetStateAction<any>>
  setInstruction: React.Dispatch<SetStateAction<any>>
  setIndustryData: React.Dispatch<SetStateAction<any>>
}) => {
  const { detailId, setPdfList, setDetailRight, setInstruction, setIndustryData } = options

  request('detail/patentDetail/getPatentDetailPdf', { id: detailId }).then((res) => {
    if (res.Data && res.Data.length > 0) {
      setPdfList(res.Data)
      wftCommon.zh2enAlwaysCallback(res.Data, (newData) => {
        setPdfList(() => newData)
      })
    }
  })
  request('detail/patentDetail/getpatentdetailright', { id: detailId }).then(async (res) => {
    if (res.Data && res.Data.length > 0) {
      let data = res.Data[0]
      if (data && data.content && data.content.replace) {
        // 2024.03.15 数据部 img 未输入完整url，先前端拼接 todo
        data.content = data.content.replace(/src="/gi, 'src="http://news.windin.com/ns/imagebase/6261/')
        setDetailRight(data)
        const htmlStr = await wftCommon.translateHTML(data.content)
        data.content = htmlStr
        setDetailRight(() => data)
      } else if (data && data.patentUrl) {
        const is_terminal = wftCommon.usedInClient()
        const url = is_terminal ? data.patentUrl : data.patentUrl + '?wind.sessionid=' + wftCommon.getwsd()
        fetch(url)
          .then((res) => {
            if (res.ok) {
              return res.text()
            }
          })
          .then(async (con) => {
            let conNew = con.replace(/src="/gi, 'src="http://news.windin.com/ns/imagebase/6261/')
            setDetailRight({ content: conNew })
            const htmlStr = await wftCommon.translateHTML(conNew)
            setDetailRight(() => ({ content: htmlStr }))
          })
      }
    }
  })
  request('detail/patentDetail/getpatentdetailinstruction', { id: detailId }).then(async (res) => {
    if (res.Data && res.Data.length > 0) {
      let data = res.Data[0]
      if (data && data.content && data.content.replace) {
        // 2024.03.15 数据部 img 未输入完整url，先前端拼接 todo
        data.content = data.content.replace(/src="/gi, 'src="http://news.windin.com/ns/imagebase/6261/')
        setInstruction(data)
        const htmlStr = await wftCommon.translateHTML(data.content)
        data.content = htmlStr
        setInstruction(() => data)
      } else if (data && data.contentUrl) {
        const is_terminal = wftCommon.usedInClient()
        const url = is_terminal ? data.contentUrl : data.contentUrl + '?wind.sessionid=' + wftCommon.getwsd()
        fetch(url)
          .then((res) => {
            if (res.ok) {
              return res.text()
            }
          })
          .then(async (con) => {
            let conNew = con.replace(/src="/gi, 'src="http://news.windin.com/ns/imagebase/6261/')
            setInstruction({ content: conNew })
            const htmlStr = await wftCommon.translateHTML(conNew)
            setInstruction(() => ({ content: htmlStr }))
          })
      }
    }
  })
  getPatentDetailIndustry({ detailId }).then((res) => {
    if (res.ErrorCode == '0' && res.Data) {
      const digitalEconomyCoreIndustryLeaves = res.Data.digitalEconomyCoreIndustryLeaves
      const greenLowCarbonTechnologyLeaves = res.Data.greenLowCarbonTechnologyLeaves
      const notionalEconomyLeaves = res.Data.notionalEconomyLeaves
      const strategicEmergingLeaves = res.Data.strategicEmergingLeaves
      const digitalArr = []
      const greenLowArr = []
      const notionalArr = []
      const strategicArr = []
      digitalEconomyCoreIndustryLeaves?.forEach((node) => {
        const nodePaths = generateIndustry(node)
        digitalArr.push(...nodePaths)
      })
      greenLowCarbonTechnologyLeaves?.forEach((node) => {
        const nodePaths = generateIndustry(node)
        greenLowArr.push(...nodePaths)
      })
      notionalEconomyLeaves?.forEach((node) => {
        const nodePaths = generateIndustry(node)
        notionalArr.push(...nodePaths)
      })
      strategicEmergingLeaves?.forEach((node) => {
        const nodePaths = generateIndustry(node)
        strategicArr.push(...nodePaths)
      })
      if (digitalArr?.length) {
        // @ts-expect-error 类型错误
        digitalArr.clickFn = (arr) => {
          const t = [...arr]
          // @ts-expect-error 类型错误
          t.expanded = !arr.expanded
          // @ts-expect-error 类型错误
          t.clickFn = arr.clickFn
          setIndustryData({
            strategicArr,
            greenLowArr,
            digitalArr: t,
            notionalArr,
          })
        }
      }
      if (greenLowArr?.length) {
        // @ts-expect-error 类型错误
        greenLowArr.clickFn = (arr) => {
          const t = [...arr]
          // @ts-expect-error 类型错误
          t.expanded = !arr.expanded
          // @ts-expect-error 类型错误
          t.clickFn = arr.clickFn
          setIndustryData({
            strategicArr,
            greenLowArr: t,
            digitalArr,
            notionalArr,
          })
        }
      }
      if (notionalArr?.length) {
        // @ts-expect-error 类型错误
        notionalArr.clickFn = (arr) => {
          const t = [...arr]
          // @ts-expect-error 类型错误
          t.expanded = !arr.expanded
          // @ts-expect-error 类型错误
          t.clickFn = arr.clickFn
          setIndustryData({
            strategicArr,
            greenLowArr,
            digitalArr,
            notionalArr: t,
          })
        }
      }
      if (strategicArr?.length) {
        // @ts-expect-error 类型错误
        strategicArr.clickFn = (arr) => {
          const t = [...arr]
          // @ts-expect-error 类型错误
          t.expanded = !arr.expanded
          // @ts-expect-error 类型错误
          t.clickFn = arr.clickFn
          setIndustryData({
            strategicArr: t,
            greenLowArr,
            digitalArr,
            notionalArr,
          })
        }
      }
      setIndustryData({
        strategicArr,
        greenLowArr,
        digitalArr,
        notionalArr,
      })
    }
  })
}
