//国家标准计划
import { cloneDeep } from 'lodash'
import intl from '../../../utils/intl'
import { wftCommon } from '../../../utils/utils'
import {
  DraftNum,
  DraftUnit,
  EstablishDate,
  RegisterCapital,
  StandardCategory,
  StandardClassifyCN,
  StandardClassifyInternational,
  StandardName,
  StandardNature,
  StandardNo,
} from './common'
import { ExecuteUnit, ManageUnit, PutUnderUnit } from './common/department'

const PlanName = cloneDeep(StandardName)
PlanName.title = intl('328203', '计划名称')

const PlanNo = cloneDeep(StandardNo)
PlanNo.title = intl('328204', '计划号')

const AssignDate = {
  title: intl('328207', '下达日期'),
  dataIndex: 'assignDate',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: (text) => {
    return wftCommon.formatTime(text)
  },
}

const ProjStatus = {
  title: intl('328205', '项目状态'),
  dataIndex: 'standardStatus',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: (text) => {
    return wftCommon.formatCont(text)
  },
}

const ProjCycle = {
  title: intl('328206', '项目周期'),
  dataIndex: 'projectCycle',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: (text) => {
    return wftCommon.formatCont(text) + (text?.length ? '个月' : '')
  },
}

const Revision = {
  title: intl('395200', '修制订'),
  dataIndex: 'revisionAndFormulation',
  colSpan: 5,
  contentAlign: 'left',
  titleAlign: 'left',
  render: wftCommon.formatCont,
}
export const standardPlan = {
  standard: {
    columns: [
      [StandardName, StandardNo],
      [StandardCategory, StandardNature],
      [AssignDate, StandardClassifyCN],
      [StandardClassifyInternational, PutUnderUnit],
      [ExecuteUnit, ManageUnit],
      [ProjCycle, ProjStatus],
      [Revision],
    ],
    horizontal: true,
    name: intl('328202', '计划信息详情'),
  },
  draft: {
    columns: [DraftUnit, DraftNum, RegisterCapital, EstablishDate],
    horizontal: false,
    name: intl('328188', '起草单位'),
  },
}
