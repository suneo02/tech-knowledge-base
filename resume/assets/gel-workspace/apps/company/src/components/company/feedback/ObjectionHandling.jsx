import { Link } from '@wind/wind-ui'
import intl from '../../../utils/intl'
import React from 'react'

const DocDownloadLink = ({ docPath, docName, docDesc }) => {
  return (
    <p>
      <Link
        type="text"
        href={`/Wind.WFC.Enterprise.Web/PC.Front/resource/static/${docPath}`}
        download={docName}
        underline
      >
        {docDesc}
      </Link>
    </p>
  )
}

const DocToDownloadList = [
  {
    docPath: 'Objection-Application-form-legal-entity.docx',
    docName: '《异议申请表（法人或其他组织）》.docx',
    docDesc: intl('391164', '《异议申请表（法人或其他组织）》'),
  },
  {
    docPath: 'Power-of-Attorney-for-legal-entities.docx',
    docName: '《授权委托书（法人或其他组织）》.docx',
    docDesc: intl('391175', '《授权委托书（法人或其他组织）》'),
  },
  {
    docPath: 'Objection-Application-form-natural-person).docx',
    docName: '《异议申请表（自然人）》.docx',
    docDesc: intl('391176', '《异议申请表（自然人）》'),
  },
]
export const CompanyObjectionHandling = () => {
  const DocToSubmit1 = intl('391154', '完整填写的《异议申请表（法人或其他组织）》（加盖公章）扫描件')
  const DocToSubmit2 = intl('366175', '企业营业执照（加盖公章）扫描件')
  const DocToSubmit3 = intl('366177', '其他补充资料（若有）')
  return (
    <>
      <p>
        {intl(
          '391173',
          '信息主体认为其信息存在错误、遗漏的，企业法人及其他组织可以由法定代表人亲自或委托经办人向我司提出异议申请；自然人可以由本人向我司提出异议申请。'
        )}
      </p>
      <p>
        {window.en_access_config ? ( // TODO
          <>
            Apply for objections, please send an email to{' '}
            <Link underline href="mailto://GELSUPPORT@wind.com.cn">
              GELSUPPORT@wind.com.cn
            </Link>
            .After understanding the matters you have filed for objections, our company will arrange a dedicated person
            to contact you within three working days. Subsequently, please prepare all the information and send it to
            our company by email based on the following different situations:
          </>
        ) : (
          <>
            提出异议申请的信息主体，请发送异议申请邮件至
            <Link underline href="mailto://GELSUPPORT@wind.com.cn">
              GELSUPPORT@wind.com.cn
            </Link>
            ，提交材料模板及清单见下，您也可以在邮件中简述异议信息及证据，并预约线下办理。我司在接收您的异议申请后三个工作日内，将安排专人与您联系核实并处理异议申请。
          </>
        )}
      </p>
      <br />

      <p>{intl('391153', '信息主体为企业法人或其他组织，由法人亲自办理的，请提交：')}</p>
      <p>1. {DocToSubmit1}</p>
      <p>2. {DocToSubmit2}</p>
      <p>3. {intl('391157', '法定代表人的有效身份证正反面扫描件（法人亲自办理）')}</p>
      <p>4. {DocToSubmit3}</p>
      <br />

      <p>{intl('391158', '信息主体为企业法人或其他组织，委托经办人办理的，请提交：')}</p>
      <p>1. {DocToSubmit1}</p>
      <p>2. {DocToSubmit2}</p>
      <p>3. {intl('391159', '经办人的有效身份证正反面扫描件')}</p>
      <p>4. {intl('391160', '完整填写的《授权委托书（法人或其他组织）》（加盖公章）扫描件')}</p>
      <p>5. {DocToSubmit3}</p>
      <br />

      <p>{intl('391161', '信息主体为自然人，请本人提交：')}</p>
      <p>1. {intl('391174', '完整填写的《异议申请表（自然人）》（加盖公章）扫描件')}</p>
      <p>2. {intl('391162', '申请人的有效身份证正反面扫描件')}</p>
      <p>3. {DocToSubmit3}</p>
      <br />

      <p>{intl('391163', '相关材料模板下载')}</p>
      {DocToDownloadList.map((item) => (
        <DocDownloadLink docPath={item.docPath} docName={item.docName} docDesc={item.docDesc} />
      ))}
    </>
  )
}
