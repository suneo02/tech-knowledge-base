export function getPrivacyAggrement() {
  const privacyPolicyUrl = 'wind.ent.web/gel/gelapp/gelprivacyplatform.html'
  const host = window.location.host
  const isTestEnvironment = host.indexOf('8.173') > -1 || host.indexOf('test.wind.') > -1
  const baseDomain = isTestEnvironment ? 'test' : 'gel'
  const url = `https://${baseDomain}.wind.com.cn/${privacyPolicyUrl}`
  return url
}
