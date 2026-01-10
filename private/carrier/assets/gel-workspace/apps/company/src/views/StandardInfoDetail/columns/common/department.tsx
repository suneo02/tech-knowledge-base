import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { unitArrRender } from './UnitArr'

export const TechnicalOwnerUnit = {
  title: intl('400913', '技术归口单位'),
  dataIndex: 'technicalOwnerUnit',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: unitArrRender,
}
export const PutUnderUnit = {
  title: intl('478718', '归口单位'),
  dataIndex: 'putUnderUnit',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: unitArrRender,
}

export const ExecuteUnit = {
  title: intl('478719', '执行单位'),
  dataIndex: 'executeUnit',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: unitArrRender,
}
export const ManageUnit = {
  title: intl('478701', '主管部门'),
  dataIndex: 'managerUnit',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: unitArrRender,
}
export const TechnicalUnit = {
  title: intl('478720', '技术委员会'),
  dataIndex: 'technicalUnit',
  colSpan: 5,
  contentAlign: 'left',
  titleAlign: 'left',
  render: (text) => {
    const temp = text?.[0]?.name
    return wftCommon.formatCont(temp)
  },
}
