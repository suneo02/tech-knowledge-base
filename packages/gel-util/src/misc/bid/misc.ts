import { t } from '../../intl'

export function bidType2Stage(type: string | undefined) {
  switch (type) {
    case '资格预审公告':
      return ' | ' + t('257809', '预审')
    case '公开招标公告':
      return ' | ' + t('100969', '招标')
    case '询价公告':
      return ' | ' + t('100969', '招标')
    case '竞争性谈判公告':
      return ' | ' + t('100969', '招标')
    case '单一来源公告':
      return ' | ' + t('100969', '招标')
    case '邀请招标公告':
      return ' | ' + t('100969', '招标')
    case '竞争性磋商公告':
      return ' | ' + t('100969', '招标')
    case '竞价招标公告':
      return ' | ' + t('100969', '招标')
    case '意向公告':
      return ' | ' + t('100969', '招标')
    case '中标公告':
      return ' | ' + t('315493', '结果')
    case '成交公告':
      return ' | ' + t('315493', '结果')
    case '竞价结果公告':
      return ' | ' + t('315493', '结果')
    case '废标流标公告':
      return ' | ' + t('315493', '结果')
    case '更正公告':
      return ''
    case '开标公告':
      return ' | ' + t('315493', '结果')
    case '合同及验收公告':
      return ' | ' + t('315493', '结果')
    default:
      return ' '
  }
}

export function bidType2EnStage(type: string | undefined) {
  switch (type) {
    case '资格预审公告':
      return t('228621', '资格预审公告')
    case '公开招标公告':
      return t('228622', '公开招标公告')
    case '询价公告':
      return t('228623', '询价公告')
    case '竞争性谈判公告':
      return t('228624', '竞争性谈判公告')
    case '单一来源公告':
      return t('228625', '单一来源公告')
    case '邀请招标公告':
      return t('228626', '邀请招标公告')
    case '竞争性磋商公告':
      return t('228627', '竞争性磋商公告')
    case '竞价招标公告':
      return t('228628', '竞价招标公告')
    case '中标公告':
      return t('228629', '中标公告')
    case '成交公告':
      return t('228630', '成交公告')
    case '竞价结果公告':
      return t('228631', '竞价结果公告')
    case '废标流标公告':
      return t('228632', '废标流标公告')
    case '更正公告':
      return t('271972', '更正公告')
    case '开标公告':
      return t('333033', '开标公告')
    case '意向公告':
      return t('333034', '意向公告')
    case '合同及验收公告':
      return t('336673', '合同及验收')
    default:
      return ''
  }
}
