import {
  getAnnouncementReportComment,
  getAnnouncementUnRegularComment,
  getBJEEReportComment,
  getMajorReportComment,
} from 'gel-util/corp'
import { CompanyDetailBJEEShareholderCfg } from '../bjee.tsx'
import { CompanyDetailMajorShareholderCfg } from '../major'
import { CompanyDetailShareholderAnnouncementReportCfg } from './report.tsx'
import { CompanyDetailShareholderAnnouncementUnRegularCfg } from './unregular.tsx'
/**
 * 处理公告披露 定期和非定期的 comment 和 统计数字
 * @param {*} eachTable
 * @param {Object} resultFirst api 请求得到的数据的第一条
 * @returns
 */
export const handleAnnouncementCommentAndCountNum = (eachTable, resultFirst) => {
  switch (eachTable.cmd) {
    case CompanyDetailShareholderAnnouncementReportCfg.cmd: {
      eachTable.comment = getAnnouncementReportComment(resultFirst?.annance_date)
      return
    }
    case CompanyDetailShareholderAnnouncementUnRegularCfg.cmd: {
      eachTable.comment = getAnnouncementUnRegularComment(resultFirst?.annance_date)
      return
    }
    case CompanyDetailMajorShareholderCfg.cmd: {
      eachTable.comment = getMajorReportComment(resultFirst?.annance_date)
      return
    }
    case CompanyDetailBJEEShareholderCfg.cmd: {
      eachTable.comment = getBJEEReportComment(resultFirst?.participation)
      return
    }
  }
}
