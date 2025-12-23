/**
 * 初始化报告
 * 工厂函数，创建并初始化ReportRenderer实例
 */

import { corpBaseInfoStore, userPackageStore } from '@/store'
import { corpBaseNumStore } from '@/store/corpBaseNumStore'
import { corpOtherInfoStore } from '@/store/corpOtherInfoStore'

export function initCorpInit(finishCallback: () => void): void {
  // Create a counter to track when both API calls complete
  let completedCalls = 0
  const totalRequiredCalls = 4

  // Function to check if all API calls are complete
  const checkAllDataLoaded = () => {
    completedCalls++
    if (completedCalls === totalRequiredCalls) {
      try {
        finishCallback()
      } catch (e) {
        console.trace(e)
      }
    }
  }

  // Fetch data from corpBaseInfoStore
  corpBaseInfoStore.fetchData({}, () => {
    checkAllDataLoaded()
  })

  userPackageStore.fetchData({}, () => {
    checkAllDataLoaded()
  })

  corpBaseNumStore.fetchData({}, () => {
    checkAllDataLoaded()
  })

  corpOtherInfoStore.fetchData({}, () => {
    checkAllDataLoaded()
  })
}
