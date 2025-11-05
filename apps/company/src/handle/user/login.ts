import { sessionStorageManager } from '@/utils/storage'
import { getUrlByLinkModule, LinksModule } from '../link'
/**
 * web 登出
 */
export const handleWebLogout = () => {
  // web 登出
  sessionStorageManager.remove('GEL-wsid')
  setTimeout(() => {
    window.location.href = getUrlByLinkModule(LinksModule.WEB, {
      url: 'windLogin.html',
    })
  }, 200)
}
