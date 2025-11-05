import { configDetailIntlHelper } from '@/corpConfigJson'
import { TIntl } from '@/types'
import { ReportPageJson } from 'gel-types'
import { getTodayIntl } from './common'

export const RP_PRINT_CONSTANTS = {
  CoverPageId: 'cover',
  CommentPageId: 'comment',
}

export const getCreditRPLocale = (t: TIntl) => {
  return {
    // 报告标题 暂时显示为尽调报告
    reportTitle: t('421605', '尽职调查报告'),
  }
}

/**
 * 信用报告说明
 *
 * Disclaimer:


 */
export const getCreditRPComment = (config: ReportPageJson, t: TIntl, isEn: boolean) => {
  const reportDate = getTodayIntl(isEn)

  const modules = config.map((item) => {
    return {
      title: configDetailIntlHelper(item, 'title', t),
      children: item.children?.map((child) => {
        return {
          title: configDetailIntlHelper(child, 'title', t),
        }
      }),
    }
  })
  return [
    isEn ? 'Disclaimer:' : '免责声明：',
    isEn
      ? `This report is a data snapshot as of ${reportDate}, compiled and analyzed based on public information disclosures and open data regarding the target enterprise by Wind. Wind does not verify the completeness, accuracy, or authenticity of this report, and assumes no legal responsibility. The content of this report does not constitute any explicit or implicit views or warranties towards any individual or enterprise; it is provided for reference only, and actual results should be based on official announcements from authoritative websites. In case of any dispute regarding this data service, or if any illegal or inappropriate information is found, please contact us at 400-820-9463 or email service@wind.com.cn, and we will address the issue promptly.`
      : `本报告内容为截至${reportDate}的数据快照内容，万得根据目标企业在相关信息公示、公开信息数据整理分析所得。万得不对本报告的全面、准确、真实性进行分辨和核验，不负相关法律责任，本报告内容不构成我们对任何人或企业之明示或暗示的观点或保证，仅为您提供参考，真实结果请以各官方网站的公布结果为准。如对该数据服务存在异议，或发现违法及不良信息，请拨打电话400-820-9463或发送邮件至service@wind.com.cn，我们将及时处理。`,
    isEn
      ? 'This report is for business decision-making purposes only and shall not be used as a basis for legal proceedings or other illegal purposes. Without the consent or authorization from Wind, no part of this report may be disclosed to any third party. Under no circumstances will Wind be liable for any losses resulting from the reference to this report.'
      : '本报告仅供商业决策参考之用，不得用作法律诉讼的依据或是其他非法用途。未经万得同意或授权，不得向第三人透露本报告任何内容。在任何情况下，对由于参考本报告所造成的损失，万得不承担任何责任。',
    t('451097', '本文档包含以下章节：'),
    ...modules.map((item, index) => {
      return `${index + 1}.${item.title}${isEn ? ':' : '：'}${item.children
        ?.map((child) => {
          return child.title
        })
        .join(isEn ? ',' : '、')}`
    }),
    `${modules.length + 1}.${t('451098', '附录')}`,
  ]
}

/**
 * 信用报告附录
 */
export const getCreditRPAppendix = (objection: string | undefined, _t: TIntl, isEn: boolean) => {
  return [
    isEn ? 'Data Source Explanation' : '数据来源说明',
    isEn
      ? `Wind Credit's data originates from public sources such as the National Enterprise Credit Information Publicity System, the official website of the National Financial Regulatory Administration, the National Construction Market Supervision Public Service Platform, the China Securities Regulatory Commission's website, the National Public Resources Trading Service Platform, the Ministry of Industry and Information Technology of the People's Republic of China website, the China Customs Enterprise Import and Export Credit Information Management Platform, the Trademark Office under the State Administration for Industry and Commerce of the People's Republic of China, the National Intellectual Property Administration of the People's Republic of China, the China Copyright Registration Portal, the China Judgments Online, the China Execution Information Public Network, the Supreme People's Court of the People's Republic of China, the People's Court Announcement Network, the China Court Trials Public Network, and various local people's courts. Wind Credit assumes no responsibility for any losses incurred from the reference or use of this information.`
      : '万得征信数据来自国家企业信用信息公示系统、国家金融监管总局官网、全国建筑市场监管公共服务平台、巨潮资讯网、全国公共资源交易服务平台、中华人民共和国工业和信息化部网站、中国海关企业进出口信用信息管理平台、国家工商行政管理总局商标局、中华人民共和国国家知识产权局、中国版权登记门户网、中国裁判文书网、中国执行信息公开网、中华人民共和国最高人民法院、人民法院公告网、中国庭审公开网、各地方人民法院等公开数据来源，因参考、使用该信息造成的损失，万得征信不承担任何责任。',
    objection ? `${isEn ? 'Dissension Processing:' : '异议处理：'}${objection}` : undefined,
    isEn ? 'Proper Nouns:' : '专有名词：',
    isEn
      ? `(1) Judgments: These are records of the trial process and outcomes of the People's Court. They serve as the sole evidence for determining and allocating the substantive rights and obligations of parties involved in litigation. A well-structured, complete, and logically rigorous judgment document is not only evidence of the rights and obligations of the parties but also an important basis for higher-level People's Courts to supervise the civil trial activities of lower-level People's Courts.`
      : '(1) 裁判文书：是记载人民法院审理过程和结果，它是诉讼活动结果的载体，也是人民法院确定和分配当事人实体权利义务的唯一凭证。一份结构完整、要素齐全、逻辑严谨的裁判文书，既是当事人享有权利和负担义务的凭证，也是上级人民法院监督下级人民法院民事审判活动的重要依据。',
    isEn
      ? `(2) Filing Information: Refers to the formal initiation of judicial proceedings by investigative authorities. Case filing information confirms that a case has been officially registered with the court.`
      : '(2) 立案信息：是指进入司法程序,由侦查机关将案件进入正式的程序。立案信息证明案件已经在法院进行立案。',
    isEn
      ? `(3) Announcements of Court Session: These are public notices required when the court is hearing civil cases, which include the names of the parties, the cause of action, and the time and venue of the hearing.`
      : '(3) 开庭公告：是指法院在审理民事案件的时候，公开审理的，需要公告当事人姓名、案由和开庭的时间、地点。',
    isEn
      ? `(4) Service Announcements: A special method of service used by the People's Court to inform the recipient of the content of litigation documents when the recipient cannot be located or when other methods of service are unavailable.`
      : '(4) 送达公告：是在受送达人下落不明或者用其他方式无法送达的情况下,人民法院通过公告将诉讼文书有关内容告知受送达人的一种特殊的送达方式。',
    isEn
      ? `(5) Court Announcements: Legal documents published by state organs exercising independent adjudicative power to the public.`
      : '(5) 法院公告：是由独立行使审判权的国家机关向社会公众公布的法律文书。',
    isEn
      ? `(6) Execution Person: A party who has not fulfilled a court judgment or arbitration award after the expiration of the statutory appeal period or after a final judgment has been rendered and has entered the enforcement procedure.`
      : '(6) 被执行人：是指在法定的上诉期满后，或终审判决作出后，未履行法院判决或仲裁裁决，并进入执行程序的当事人。',
    isEn
      ? `(7) Enforcee: A person who has failed to perform obligations determined by effective legal documents and has circumstances such as "having the ability to perform but not doing so," "resisting enforcement," etc., as prescribed by law, and has been included in the list of defaulting judgment debtors by the People's Court according to the law.`
      : '(7) 失信被执行人：是指未履行生效法律文书确定的义务并具有“有履行能力而不履行”、“抗拒执行”等法定情形，从而被人民法院依法纳入失信被执行人名单的人。',
    isEn
      ? `(8) Final Case: Refers to an enforcement case of the court that is terminated due to the judgment debtor having no property available for enforcement, thus ending the current enforcement procedure. A final case does not withdraw the enforcement application nor indicate that the enforcement has been completed; it is a temporary suspension of enforcement.`
      : '(8) 终本案件，是指法院的执行案件，由于被执行人没有可供执行的财产，而裁定终止本次执行程序。终本不撤回执行申请，也不是已经执行完毕，而是暂时中止执行。',
    isEn
      ? `(9) High Consumption Restriction: When a judgment debtor fails to fulfill the payment obligations determined by effective legal documents within the period specified in the execution notice, the People's Court may take restrictive consumption measures to limit high-end consumption and related expenditures that are not necessary for living or operating.`
      : '(9) 限制高消费:是指被执行人未按执行通知书指定的期间履行生效法律文书确定的给付义务的，人民法院可以采取限制消费措施，限制其高消费及非生活或者经营必需的有关消费。',
    isEn
      ? `(10) Judicial Sale: The People's Court, in the compulsory execution procedure of civil cases, conducts or commissions an auction company to publicly dispose of the debtor's property to satisfy the creditor's rights. The court should notify the parties before the auction.`
      : '(10) 司法拍卖，即人民法院在民事案件强制执行程序中，按程序自行进行或委托拍卖公司公开处理债务人的财产，以清偿债权人债权。法院拍卖前应当通知当事人。',
    isEn
      ? `(11) Inquiry Assessment: The court inquires about and appraises the assets of the judgment debtor by engaging professionals for valuation.`
      : '(11) 询价评估：是法院对被执行人的资产进行询价并且请专人来评估。',
  ].filter(Boolean)
}
