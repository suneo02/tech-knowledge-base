import React from 'react'
import { Links } from '@/components/common/links'
import { LinksModule, UserLinkEnum } from '@/handle/link'

export const AntiAbusePolicyEn = () => (
  <>
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
      This policy, together with the{' '}
      <Links
        className="user-link"
        title="《Privacy Policy》"
        module={LinksModule.USER}
        subModule={UserLinkEnum.UserPolicy}
      />
      {', '}
      <Links
        className="user-link"
        title="《User Agreement》"
        module={LinksModule.USER}
        subModule={UserLinkEnum.UserNote}
      />
      {', '}
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
  </>
)
