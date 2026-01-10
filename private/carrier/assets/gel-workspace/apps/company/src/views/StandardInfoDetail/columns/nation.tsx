//国家标准
import intl from '../../../utils/intl'
import { wftCommon } from '../../../utils/utils'
import {
  AbolishDate,
  DraftNum,
  DraftUnit,
  EstablishDate,
  ImplementDate,
  PublishDate,
  RegisterCapital,
  StandardCategory,
  StandardClassifyCN,
  StandardClassifyInternational,
  StandardName,
  StandardNature,
  StandardNo,
  StandardStatus,
  SubstitutedDate,
} from './common'
import { ExecuteUnit, ManageUnit, PutUnderUnit, TechnicalUnit } from './common/department'

const ApplicantCNName = {
  title: intl('478723', '替代情况'),
  dataIndex: 'alternativeSituation',
  colSpan: 5,
  contentAlign: 'left',
  titleAlign: 'left',
  render: wftCommon.formatCont,
}

const StandardAcquisition = {
  title: intl('478707', '采标情况'),
  dataIndex: 'standardAcquisition',
  colSpan: 5,
  render: (text) => {
    return wftCommon.formatCont(text)
  },
  contentAlign: 'left',
  titleAlign: 'left',
}
export const standardDataCountry = {
  standard: {
    columns: [
      [StandardName, StandardNo],
      [StandardStatus, StandardCategory],
      [StandardNature, PublishDate],
      [ImplementDate, AbolishDate],
      [SubstitutedDate, StandardClassifyCN],
      [StandardClassifyInternational, PutUnderUnit],
      [ExecuteUnit, ManageUnit],
      [TechnicalUnit],
      [ApplicantCNName],
      [StandardAcquisition],
    ],
    horizontal: true,
    name: intl('478706', '标准信息详情'),
  },
  draft: {
    columns: [DraftUnit, DraftNum, RegisterCapital, EstablishDate],
    horizontal: false,
    name: intl('478702', '起草单位'),
  },
}
