import React, { FC, useState } from 'react'
import intl from '../../../utils/intl'
import './footer.less'
import { ModalSafeType } from '@/components/modal/ModalSafeType'
import { Links } from '@/components/common/links'
import { LinksModule, UserLinkEnum } from '@/handle/link'
import { isEn } from 'gel-util/intl'
import { AntiAbusePolicyZh } from './antiAbusePolicyZh'
import { AntiAbusePolicyEn } from './antiAbusePolicyEn'

const modalContent = (
  <div className="modal-content-anti-abuse">
    <h3 className="">防滥用规则说明</h3>
    <div className="">
      万得企业库（以下简称"本平台"）所有现有及未来提供的服务、功能及数据，均须严格遵守以下使用规范，禁止行为包括但不限于：
    </div>
    <div>（1）技术滥用：禁止通过自动化工具、程序化脚本或其他非人工方式提取、抓取或复制平台数据；</div>
    <div>（2）账号违规：禁止与他人共享账户登录凭证，或允许第三方使用您的个人账户； </div>
    <div>（3）商业滥用：禁止转售、出租本平台访问权限，或利用万得企业库数据直接支持第三方商业服务。 </div>
    <h4>执行措施</h4>
    <div>• 本平台设有实时监测系统与技术防护机制，持续优化反滥用策略； </div>
    <div>• 若系统检测到异常行为，可能临时限制账户功能，并通过注册邮箱或绑定的联系方式通知用户； </div>
    <div>• 经核查无违规行为的账户，将在5个工作日内恢复全部访问权限。 </div>
    <h4>反馈渠道</h4>
    <div>
      如对本规则存在疑问或需申诉，请发送邮件至GELSupport@wind.com.cn。我们将在核实用户身份后的15个工作日内予以答复。
    </div>
    <h4>法律文件完整性声明</h4>
    <div>
      本规则与
      <Links className="user-link" title="《隐私政策》" module={LinksModule.USER} subModule={UserLinkEnum.UserPolicy} />
      、
      <Links className="user-link" title="《用户协议》" module={LinksModule.USER} subModule={UserLinkEnum.UserNote} />
      、
      <Links className="user-link" title="《免责声明》" module={LinksModule.USER} subModule={UserLinkEnum.Exceptions} />
      共同构成具有法律约束力的完整协议，用户使用本平台即视为同意全部条款。
    </div>
  </div>
)

const modalContentEN = (
  <div className="modal-content-anti-abuse">
    <h3 className="">Anti-Abuse Policy</h3>
    <div className="">
      All current and future services, features, and data provided by "Global Enterprise Library" (also known as "Wind
      Enterprise Library") must strictly comply with the following usage guidelines. Prohibited activities include but
      are not limited to:
    </div>
    <div>
      （1）Technical abuse: Prohibited use of automated tools, programmatic scripts, or other non-human methods to
      extract, scrape, or copy data from Global Enterprise Library;
    </div>
    <div>
      （2）Account violations: Prohibited sharing of account credentials with others or allowing third parties to use
      your personal account;
    </div>
    <div>
      （3）Commercial abuse: Prohibited resale or rental of platform access rights, or use of platform data to directly
      support third-party commercial services.{' '}
    </div>
    <h4>Enforcement Measures</h4>
    <div>
      • The Platform employs real-time monitoring systems and technical protection mechanisms, continuously optimizing
      anti-abuse strategies;
    </div>
    <div>
      • If the system detects abnormal behavior, account functions may be temporarily restricted, and users will be
      notified via registered email or bound contact information;
    </div>
    <div>• Accounts verified to have no violations will have full access restored within 5 business days.</div>
    <h4>Feedback</h4>
    <div>
      For questions about this policy or to file an appeal, please send an email to GELSupport@wind.com.cn. We will
      respond within 15 business days after verifying user identity.
    </div>
    <h4>Legal Document Integrity Statement</h4>
    <div>
      This policy, together with the Privacy Policy, User Agreement, and Disclaimers, constitutes a complete and legally
      binding agreement. Use of Global Enterprise Library constitutes acceptance of all terms.
      <Links
        className="user-link"
        title="《Privacy Policy》"
        module={LinksModule.USER}
        subModule={UserLinkEnum.UserPolicy}
      />
      、
      <Links
        className="user-link"
        title="《User Agreement》"
        module={LinksModule.USER}
        subModule={UserLinkEnum.UserNote}
      />{' '}
      and{' '}
      <Links
        className="user-link"
        title="《Disclaimers》"
        module={LinksModule.USER}
        subModule={UserLinkEnum.Exceptions}
      />
      , constitutes a complete and legally binding agreement. Use of Global Enterprise Library constitutes acceptance of
      all terms.
    </div>
  </div>
)

export const VersionPriceFooter = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <div className="version-price-footer">
      * {intl('424962', '增值服务，非账号所含权益，需额外支付费用，请特别注意。')}
      <br />
      {intl(
        '391720',
        '以上会员账号权益可能根据法律法规要求、数据源要求或功能服务升级进行更改，上海万得征信服务有限公司会在全球企业库网站及相关软件产品中公告相关的更改，请您随时予以关注。'
      )}
      <br />
      {intl(
        '391696',
        '全球企业库所有数据来源于公开渠道和第三方提供，万得尊重并倡导保护知识产权，本产品所引用数据及其他信息仅作参考，不代表万得赞同或证实其描述。如对该数据服务存在异议，或发现违法及不良信息，请拨打电话400-820-9463或发送邮件至GELSupport@wind.com.cn，我们将及时处理。'
      )}
      <br />
      <div>
        {intl('457654', '未明确说明用量的所有功能和模块须遵守防滥用规则。')}
        <a onClick={showModal} data-uc-id="d3GQd9Zno" data-uc-ct="a">
          {intl('457635', '了解更多')}
        </a>
      </div>
      {isModalOpen && (
        <ModalSafeType
          visible={isModalOpen}
          onCancel={handleCancel}
          footer={null}
          width={900}
          title={isEn() ? intl('', 'Anti-Abuse Policy') : intl('', '防滥用规则')}
          data-uc-id="BYBZ1zP0nZ"
          data-uc-ct="modalsafetype"
        >
          <div className="modal-content-anti-abuse">{isEn() ? <AntiAbusePolicyEn /> : <AntiAbusePolicyZh />}</div>
        </ModalSafeType>
      )}
    </div>
  )
}
