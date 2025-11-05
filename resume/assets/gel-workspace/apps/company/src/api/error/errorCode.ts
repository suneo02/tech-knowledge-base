import { t } from 'gel-util/intl'

export const ERROR_TYPE = {
  DEFAULT: t('421457', '似乎遇到了点问题，请稍后再试。'),
  ErrorAbort: t('421477', '已按您要求停止回答。如有需要可随时重新提问。'),
  ErrorAudit: t(
    '421476',
    '根据有关政策法规要求，我无法回答此问题，请尝试换个问题。我是您的商业查询智能助手，我将竭尽全力为您提供有效信息。'
  ),
  ErrorFuse: t('421460', '今日提问已达上限，请明日再来。'),
  VersionError: t('', '当前无法同步，请刷新重试'),
  BizError: t('', '当前无法同步，请联系管理员'),
  InufficientPoints: t(
    '',
    '很遗憾，您当前积分不足，本次操作需 {{consumptionPoint}} 积分，您现有的 {{residualPoint}} 积分不足。\n如需充值请联系客户经理，继续享受 AI 的乐趣！'
  ),
}
/**
 * 问题状态码与错误文本的映射
 */

export const ERROR_TEXT: { [key: string]: string } = {
  DEFAULT: ERROR_TYPE.DEFAULT /** 感谢您的提问！您可以尝试重新提问或更改问题的方式，以获得更好的回答 */,

  undefined: ERROR_TYPE.DEFAULT,
  '-2': ERROR_TYPE.DEFAULT, // 默认
  '-1': ERROR_TYPE.ErrorAbort, // 取消
  0: ERROR_TYPE.DEFAULT, //

  1: '', // 成功

  //  FUSE超限熔断
  2: ERROR_TYPE.ErrorFuse, // ("ErrorFuse" /** 今日的使用次数已达上限，请明日再试 */),

  // 业务逻辑错误
  200002: ERROR_TYPE.DEFAULT,

  // 意图审计不通过
  70001: ERROR_TYPE.ErrorAudit, //  ("ErrorAudit" /** 很抱歉，我目前无法回答这个问题。我最擅长金融与经济领域的问题，您可以询问相关的内容，我将竭诚为您服务 */),
  // http error 504
  504: ERROR_TYPE.DEFAULT, //  ("ErrorTimeout" /** 似乎出了点问题，请您再试一次向我提问 */),

  // 错误码 2002
  2002: ERROR_TYPE.VersionError,
  200008: ERROR_TYPE.BizError,
  300000: ERROR_TYPE.InufficientPoints,
}
