import { getCompanyName } from '../../api/searchListApi'

/**
 * 处理公司名称获取和状态更新的工具函数
 * @author bcheng<bcheng@wind.com.cn>
 * @param companyCodes 公司代码数组
 * @param type 处理类型：participate | winner | purchaser
 * @param setState 组件的setState函数
 * @param refs 组件引用对象，包含清空方法
 */
export const processCompanyNames = (
  companyCodes: string[],
  type: 'participate' | 'winner' | 'purchaser',
  setState: (updater: (prevState: any) => any) => void,
  refs?: {
    participateInputRef?: any
    purchaserInputRef?: any
    winnerInputRef?: any
  }
) => {
  if (!companyCodes?.length) {
    if (type === 'participate') {
      setState((prevState) => ({
        participateInputInitialLabels: [],
        participateInputValues: [],
      }))
    } else if (type === 'winner') {
      setState((prevState) => ({
        winnerInputInitialLabels: [],
        winnerInputValues: [],
      }))
    } else if (type === 'purchaser') {
      setState((prevState) => ({
        purchaserInputInitialLabels: [],
        purchaserInputValues: [],
      }))
    }
    return
  }

  // 收集所有公司名称和值，然后一次性更新状态
  const companyPromises = companyCodes.map((companyCode) =>
    getCompanyName({ companycode: companyCode }).then((res) => {
      if (res?.Data?.companyName) {
        const name = res.Data.companyName
        return {
          name,
          value: `${name}|${companyCode}`,
        }
      }
      return null
    })
  )

  // 等待所有请求完成，然后统一更新状态
  Promise.all(companyPromises).then((results) => {
    // 过滤掉 null 值并去重
    const validResults = results.filter(Boolean)
    const uniqueNames = Array.from(new Set(validResults.map((item) => item.name)))
    const uniqueValues = Array.from(new Set(validResults.map((item) => item.value)))

    // 根据类型一次性更新对应的状态
    if (type === 'participate') {
      setState((prevState) => ({
        ...prevState,
        participateInputInitialLabels: uniqueNames,
        participateInputValues: uniqueValues,
      }))
    } else if (type === 'winner') {
      setState((prevState) => ({
        ...prevState,
        winnerInputInitialLabels: uniqueNames,
        winnerInputValues: uniqueValues,
      }))
    } else if (type === 'purchaser') {
      setState((prevState) => ({
        ...prevState,
        purchaserInputInitialLabels: uniqueNames,
        purchaserInputValues: uniqueValues,
      }))
    }
  })
}

/**
 * 并行处理所有类型的公司下拉搜索框数据
 * @author bcheng<bcheng@wind.com.cn>
 * @param newGive 参与单位代码数组
 * @param newWin 中标单位代码数组
 * @param newBuy 采购单位代码数组
 * @param setState 组件的setState函数
 * @param refs 组件引用对象，包含清空方法
 */
export const processAllCompanyNames = (
  newGive: string[],
  newWin: string[],
  newBuy: string[],
  setState: (updater: (prevState: any) => any) => void,
  refs?: {
    participateInputRef?: any
    purchaserInputRef?: any
    winnerInputRef?: any
  }
) => {
  processCompanyNames(newGive, 'participate', setState)
  processCompanyNames(newWin, 'winner', setState)
  processCompanyNames(newBuy, 'purchaser', setState)
}
