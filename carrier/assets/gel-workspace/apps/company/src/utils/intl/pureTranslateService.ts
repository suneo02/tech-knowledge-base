import { cloneDeep } from 'lodash'
import { translateService } from './translateService'

export function pureTranslateService(param, successFun) {
  function errCallback() {
    if (successFun) {
      return successFun(param)
    }
    return param
  }

  if (!param) return
  if (!window.en_access_config || window.$.isEmptyObject(param)) {
    // 中文模式不翻译，直接返回
    errCallback()
    return
  }
  const newpPram = cloneDeep(param)
  translateService(newpPram, successFun)
}
