import intl from '../../../../utils/intl'
import { wftCommon } from '../../../../utils/utils'

export const StandardName = {
  title: intl('326133', '标准名称'),
  dataIndex: 'standardName',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: (text) => {
    return wftCommon.formatCont(text)
  },
}

export const StandardNo = {
  title: intl('326134', '标准号'),
  dataIndex: 'standardNo',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: (text) => {
    return wftCommon.formatCont(text)
  },
}

export const StandardNature = {
  title: intl('326115', '标准性质'),
  dataIndex: 'standardNature',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: (text) => {
    return wftCommon.formatCont(text)
  },
}

/**
 * 此处为前端写死的 级别
 */
export const StandardLevel = {
  title: intl('326135', '标准级别'),
  dataIndex: 'standardLevel',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
}

export const StandardStatus = {
  title: intl('326114', '标准状态'),
  dataIndex: 'standardStatus',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: (text) => {
    return wftCommon.formatCont(text)
  },
}

export const StandardCategory = {
  title: intl('326136', '标准类别'),
  dataIndex: 'standardCategory',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: (text) => {
    return wftCommon.formatCont(text)
  },
}

export const PublishDate = {
  title: intl('138908', '发布日期'),
  dataIndex: 'releaseDate',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: (text) => {
    return wftCommon.formatTime(text)
  },
}

export const ImplementDate = {
  title: intl('478703', '实施日期'),
  dataIndex: 'implementationDate',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: (text) => {
    return wftCommon.formatTime(text)
  },
}

export const AbolishDate = {
  title: intl('328233', '废止日期'),
  dataIndex: 'abolishDate',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: (text) => {
    return wftCommon.formatTime(text)
  },
}

export const StandardClassifyCN = {
  title: intl('478704', '中国标准分类号'),
  dataIndex: 'standardClassify_chinese',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: (text) => {
    return wftCommon.formatCont(text)
  },
}
export const StandardClassifyInternational = {
  title: intl('478722', '国际标准分类号'),
  dataIndex: 'standardClassify_international',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',
  render: (text) => {
    return wftCommon.formatCont(text)
  },
}

export const ScopeOfUse = {
  title: intl('478705', '适用范围'),
  dataIndex: 'scopeOfApplication',
  colSpan: 5,
  render: (text) => {
    return wftCommon.formatCont(text)
  },
  contentAlign: 'left',
  titleAlign: 'left',
}

export const SubstitutedDate = {
  title: intl('395217', '被替代日期'),
  dataIndex: 'substitutedDate',
  colSpan: 2,
  contentAlign: 'left',
  titleAlign: 'left',

  render: (text) => {
    return wftCommon.formatTime(text)
  },
}
