/** @format */

import { intlNoIndex } from '../../utils/intl'

export const tableTips = [
  {
    title: '存续',
    tips: intlNoIndex('419601', '存续一般指企业依法存在并继续正常营业'),
  },
  {
    title: '迁入',
    tips: intlNoIndex('419620', '企业登记主管机关的变更，迁入新主管机关'),
  },
  {
    title: '迁出',
    tips: intlNoIndex('419621', '企业登记主管机关的变更，迁离某主管机关'),
  },
  {
    title: '注销',
    tips: intlNoIndex('419602', '企业自行通过法定流程申请注销营业执照以终止公司法人资格'),
  },
  {
    title: '吊销',
    tips: intlNoIndex(
      '437890',
      '工商局对违法企业作出的行政处罚。企业被吊销执照后，应当依法进行清算，清算结束并办理工商注销登记。'
    ),
  },
  {
    title: '停业',
    tips: intlNoIndex('437891', '由某种原因，企业在期末处于停止生产经营活动待条件改变后仍恢复生产。'),
  },
  {
    title: '撤销',
    tips: intlNoIndex(
      '437892',
      '是指工商行政主管部门或者上级行政机关根据利害关系人的请求或者依据职权、作出的撤销行政行为的决定。'
    ),
  },
  {
    title: '吊销,未注销',
    tips: intlNoIndex('419623', '企业已被工商部门吊销营业执照，但尚未完成注销程序的状态'),
  },
  {
    title: '吊销,已注销',
    tips: intlNoIndex('419624', '企业营业执照被依法吊销，并且已经完成了注销登记'),
  },
  {
    title: '责令关闭',
    tips: intlNoIndex('437869', '是对企事业单位的行政处罚，即人民政府依法作出决定命令其关闭。'),
  },
]

export const tableSelectOptions = {
  level: [
    { key: 1, value: 1 },
    { key: 2, value: 2 },
    { key: 3, value: 3 },
    { key: 4, value: 4 },
    { key: 5, value: 5 },
    { key: 6, value: 6 },
  ],
}
