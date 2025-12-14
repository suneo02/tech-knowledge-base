/**
 * 后端也不知道 是字符串还是数字，这里统一用字符串，intercpter里做统一转换
 */
export enum ApiCodeForWfc {
  SUCCESS_NUMBER = 0,
  // 成功
  SUCCESS = '0',
  CORP_ERROR = '490011', // 脏 公司

  USE_FORBIDDEN_GATEWAY = '10012', // 网关提示 无权访问
  USE_OUT_LIMIT_GATEWAY = '20012', // 网关提示 访问超限

  GATEWAY_403 = '20006', // 网关提示403  假的403 需要抛出

  OVER_LIMIT = '200112', // 超出限制（模板超限）
  AUTH_OPENING = '200012',

  // 超限
  USE_OUT_LIMIT = '-9', // 普通功能使用超限
  VIP_OUT_LIMIT = '-13', // 部分高级功能使用次数超出限制
  USE_FORBIDDEN = '-10', // 无权使用

  VIP_MODEL_COUNT_NUMBER = 1,
  VIP_MODEL_COUNT = '1', //  递增

  // 积分不足，针对超级名单的
  INSUFFICIENT_POINTS = '300000',
  // 频繁访问，风控报警
  FREQUENT_ERROR = '400002',
  // 邮箱已经被其他用户绑定
  EMAIL_ALREADY_BINDING = '400005',
  // 邮箱格式错误
  MESSAGE_FORMAT_ERROR = '400007',
  // 电子表格插入超限
  INSERT_OUT_LIMIT = '400009',
  // 400022, "用户服务协议升级"
  USERAGREEMENT_UPDATE = '400022',
  // 400023, "隐私政策升级"
  PRIVACYPOLICY_UPDATE = '400023',

  // 文件上传失败，请重试，暂无场景
  FILE_ERROR = '400040',
  FILE_NOT_EXIST = '400041',
  FILE_OUT_OF_LIMIT = '400042',
  FILE_TYPE_ILLEGAL = '400043',

  // 操作频繁，请1小时后重试
  SMS_SEND_VERIFY_CODE_FREQUENT_ERROR = '400032',

  // 提示vip错误码
  TRY_VIP_ALERT = '400050',
  BUY_VIP_ALERT = '400051',
  OVER_VIP_ALERT = '400052',
  // token异常
  TOKEN_ERROR = '400100',
  // 登录信息已过期，请重新登录
  AUTH_JWT_INVALID = '400101',
  // 该用户不存在，请联系管理员
  USER_MISSING = '400102',
  // 该账号已在另一台设备登陆
  AUTH_REMOTE_LOGIN = '400103',
  // 账号不存在或密码错误
  VISA_USER_NOT_EXIST = '400400',
  // 账号不存在或密码错误
  VISA_INVALID_PASSWORD = '400401',
  // 封禁用户
  USER_LOCKED = '400402',
  // nlp查询失败
  NLP_SEARCH_NO_DATA = '400480',
  // 筛选项结果查询超过阈值
  SEARCH_RANGE_TOO_BIG = '400481',
  // 用户偏好设置
  NO_USER_SETTINGS = '400500',

  DEFAULT_ERROR = '999999',
  DATA_LIMIT = '999998',

  UNKNOWN_ERROR_1 = '200019',
  UNKNOWN_ERROR_2 = '200008',
  UNKNOWN_ERROR_3 = '200026',
}
