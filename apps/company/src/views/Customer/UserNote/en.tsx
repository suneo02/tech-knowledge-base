import { HKInfoQueryAggreBtn } from '@/components/company/HKCorp/info/modal/HKInfoQueryAggre'
import intl from '@/utils/intl'
import { getUrlSearchValue } from 'gel-util/common'
import React from 'react'
import { getDisclaimerLinkBySource, getPrivacyPolicyLinkBySource } from './handle'
import styles from './index.module.less'
import { SourceTypeEnum } from './sourceTypeEnum'

const noteTitle = <div className={styles['customer-title']}>{intl('452995', '用户协议')} </div>

const NoteBody = ({ source }: { source: SourceTypeEnum }) => {
  return (
    <>
      <div className={styles['user-note-page']}>
        <h1>Global Enterprise Library User Agreement</h1>
        <p>
          Welcome to the "Global Enterprise Library" (also known as "Wind Enterprise Library") software and related
          services!
        </p>
        <p>
          The Global Enterprise Library User Agreement (hereinafter referred to as "this Agreement") is a contract
          between you and the Company regarding your downloading, installation, registration, login and use (hereinafter
          collectively referred to as "use") of the Global Enterprise Library ("Global Enterprise Library") software and
          related services.
        </p>
        <p>
          {
            'This agreement shall come into legal effect from the beginning of use of Wind Enterprise Library or become a registered user of Global Enterprise Library. Shanghai Wind Credit Service Co., Ltd. (hereinafter referred to as "Wind Credit") may update the agreement content, and contact you through email, mobile phone, APP and notices on the website and related software products. The updated results will take effect from the date of notification of Global Enterprise Library. The agreement includes the usage policy and privacy policy of the content of the Global Enterprise Library website and related software products. Before using the various services provided by Global Enterprise Library, you should read this Agreement carefully. If you do not agree with this Agreement or any changes to it at any time, you can actively cancel the services provided by Global Enterprise Library. If you voluntarily choose to agree to or use the Global Enterprise Library and related services, you are deemed to have fully understood this Agreement and agree to be bound by this Agreement and other agreements and rules relating to the Global Enterprise Library and related services (including but not limited to the Privacy Policy) as a party to this Agreement and become a user of Wind Enterprise Library (hereinafter referred to as "user").'
          }
        </p>
        <h2>1. Introduction</h2>
        <p>1.1 Purpose</p>
        Global Enterprise Library is a tool for business credit information inquiry, which aims to facilitate users to
        access information related to shareholders, legal representatives, enterprises' investment, credit information
        of enterprises. It provides business registration information, credit inquiry services, enterprise litigation,
        trademark and patent information from enterprises in cities like Beijing, Shanghai, Guangzhou, Wuhan, Henan,
        Hebei, Zhejiang, Anhui, Shandong, and Hunan across the country.
        <br />
        1.2 Agreement
        <br />
        This agreement shall come into legal effect from the beginning of use of Wind Enterprise Library or become a
        registered user of Global Enterprise Library. Shanghai Wind Credit Service Co., Ltd. (hereinafter referred to as
        "Wind Credit") may update the agreement content, and contact you through email, mobile phone, APP and notices on
        the website and related software products. The updated results will take effect from the date of notification of
        Global Enterprise Library. The agreement includes the usage policy and privacy policy of the content of the
        Global Enterprise Library website and related software products. Before using the various services provided by
        Global Enterprise Library, you should read this Agreement carefully. If you do not agree with this Agreement or
        any changes to it at any time, you can actively cancel the services provided by Global Enterprise Library. If
        you voluntarily choose to agree to or use the Global Enterprise Library and related services, you are deemed to
        have fully understood this Agreement and agree to be bound by this Agreement and other agreements and rules
        relating to the Global Enterprise Library and related services (including but not limited to the Privacy Policy)
        as a party to this Agreement and become a user of Wind Enterprise Library (hereinafter referred to as "user").
        <br />
        Global Enterprise Library has the right to modify the user agreement when necessary, and the changes to the
        agreement will be notified to users through email or internal website messages, and the modified content will be
        indicated. If you do not agree with the changed content, you have the right to stop using the online service. If
        you continue to use the online service, it shall be deemed that you accept the changes to the service terms.
        Wind Credit reserves the right to modify or interrupt the service. Wind Credit shall not be liable to users or
        third parties for any loss caused by any modification, interruption, or termination of any network service.
        <br />
        <h2>2. Obligations</h2>
        2.1 Eligibility for Services
        <br />
        In order to use the "Services", you agree:
        <br />
        (1) You must be 18 years old or above. Please do not provide any personal information or use the Services for
        minors (under 18 years old);
        <br />
        (2) You can only have one Global Enterprise Library account;
        <br />
        (3) Global Enterprise Library has the right to restrict your use of the "Services" in accordance with laws and
        regulations or in reasonable circumstances.
        <br />
        2.2 Membership and Obligations
        <br />
        Upon completion of the registration process for the Global Enterprise Library service, you will get a password
        and account. It is your responsibility to maintain the confidentiality and security of your password and
        account. You agree to be fully responsible for all activities that occur under your password or account. You
        agree:
        <br />
        When your password or account is accessed without authorization or when other security issues arise, you will
        notify Wind Credit immediately;
        <br />
        A single account can log in to only one device of the same type at a time (for example, the same account can
        only log in to one computer at a time, but you can also log in to your mobile phone). Otherwise, you will be
        forced to log out, and we will not be liable for any damages. Users are not allowed to have continuous and
        frequent query operations. Otherwise, we will automatically block your account without any liability to you. You
        should log out and close their accounts when you have finished using them. If you fail to comply with the above
        requirements, you will be fully responsible for any actions taken by anyone using your password and account, and
        Wind Credit will not be liable for any losses or damages;
        <br />
        Users are not allowed to modify, adapt, translate, or create derivative works of our series of products and
        services, or obtain the source code of our series of products and services through reverse compilation, reverse
        engineering, reverse assembly, or other means. If you engage in the above activities, we have the right to
        terminate our service and reserve the right to claim losses from you. If user behavior is suspected of being
        criminal, it will be handled by the judicial authorities.
        <br />
        2.3 Notices and Service Information
        <br />
        Wind Credit will contact you through email, mobile phone, APP message, and notices on the website and related
        software products, including introducing the various functions of this service to new users through email,
        mobile phone, and APP message. You will receive emails, short messages, and APP message from Wind Credit related
        to your account, including notifications issued by other users in your personal network. Wind Credit may send
        you promotional information, unless you choose not to receive similar information.
        <br />
        2.4 Information and Sharing
        <br />
        The Global Enterprise Library service provides multiple ways to send and share information. The information and
        content you share or publish may be viewed by other "members" and, if it is public information, may also be
        viewed by "visitors." You can set up the above information and content, and we respect your choice of who can
        view your personal content or information. We are not obligated to publish all the relevant information or
        content about your use of the Global Enterprise Library service, but we may delete information or content at our
        discretion in accordance with laws and regulations or in reasonable circumstances without sending a notice.
        <br />
        <h2>3.Disclaimer and No Warranties</h2>
        3.1.Disclaimer <br />
        (1) Wind Credit shall not be liable for any delay, stagnation, or error in the information and data provided by
        this website due to any unforeseeable, inevitable, insurmountable, and uncontrollable events (such as government
        acts, changes in applicable laws and regulations, fires, earthquakes, riots, wars, power outages, communication
        line interruptions, hacker attacks, computer virus infections or occurrences, technical adjustments by
        telecommunications departments, temporary shutdown of the website due to government control, etc.) and other
        force majeure events, as well as deliberate destruction by others, negligence or improper use by staff, normal
        system maintenance, system upgrades, or network congestion that causes this website to be inaccessible and
        results in any losses suffered by users. <br />
        (2) When using the "Services", you may encounter inaccurate, incomplete, outdated, misleading, illegal,
        offensive, or harmful content or information. It is difficult for Wind Credit to review each user's content or
        information to determine whether it falls into the above categories. Our platform only responds to
        user-submitted query requests for identification and does not verify the authenticity of the identified content
        or information. The platform does not have an obligation to verify the accuracy of the identified results
        themselves. The data results returned by the platform do not constitute any express or implied opinions or
        guarantees by us. Please refer to the official website for the accurate results. Therefore, you agree that we
        are not responsible for the content or information provided by third parties (including other users) and are not
        responsible for any losses you may suffer due to the use or reference of such content or information. If you
        believe that there is such content or information, please notify Wind Credit in accordance with the procedures
        prescribed by laws and regulations so that prompt processing can be carried out. <br />
        (3) Wind Credit may ask for personal information in accordance with legal requirements or relevant policies of
        the government. <br />
        (4) Due to any reason, such as network conditions, communication lines, third-party websites, etc., you cannot
        normally use the Global Enterprise Library. <br />
        (5) Wind Credit lists the usage methods and exemption clauses in the various service terms and statements. (6)
        All content uploaded by customers (including company profiles, jobs, reviews, financial data, and other data,
        etc.) are created by users and serve as a platform for users to introduce and comment on the things and
        phenomena referred to by the company name. The content uploaded by customers only represents the author's views
        and is not related to Wind Credit. Except as otherwise provided by law, all liabilities arising from the
        authenticity of user comments shall be borne by the users themselves, and Wind Credit shall not bear any
        responsibility. <br />
        3.2.No Warranties <br />
        (1) "Wind Credit " cannot guarantee the following: <br />
        . That the service fully meets your requirements; <br />
        . That the service is interference-free, timely, secure, or error-free; <br />
        . That the results are correct and reliable; <br />
        . That any products, services, information, or other information purchased or obtained through the service meets
        your expectations; <br />
        . That any errors in the software will be corrected. <br />
        (2) Whether to download or obtain any information using the service should be considered and risked by you
        yourself. Any consequences, such as damage to your computer system or data loss, caused by downloading any
        information, shall be borne by you. <br />
        (3) Any suggestions or information obtained by you from Wind Credit or through the service, in any form, unless
        specifically provided in the service terms, shall not constitute any guarantee other than the service terms.{' '}
        <br />
        When you agree to the agreement, you are deemed to have agreed to the above-mentioned provisions. <br />
        <h2>4.Intellectual Property</h2>
        Unless otherwise stated by Wind Credit, all products, technology, software, programs, data and other information
        (including but not limited to text, images, charts, page design, electronic documents) in the Global Enterprise
        Library, and all intellectual property rights (including but not limited to copyright, trademark rights, patent
        rights, trade secrets) and related rights thereof, shall belong to Wind Credit.
        <br />
        No one may use (including but not limited to unlawfully or unreasonably monitoring, copying, transmitting,
        displaying, mirroring, uploading, downloading, or purchasing through channels other than Wind Credit) the Global
        Enterprise Library and related services (including but not limited to data, information, and materials) without
        the permission of the Company, or automatically obtain data from the Global Enterprise Library through any
        robot, "spider" or other programs. Otherwise, Wind Credit will investigate and pursue legal responsibilities.
        <h2>5.Service Termination</h2>
        Users or Wind Credit may interrupt the service according to the actual situation. Wind Credit does not need to
        be responsible to any individual or third party for interrupting the service. If users object to any proposed
        changes to the service terms or have objections to later terms, or are dissatisfied with the Wind Credit
        service, users may have the following remedies:
        <br />
        (1) No longer use the Wind Credit service;
        <br />
        (2) Notify Wind Credit to stop the user's service.
        <br />
        After the user service is terminated, the user's right to use the Wind Credit service immediately ceases. At the
        same time, Wind Credit no longer has any obligations to the user.
        <h2>6. Member Service</h2>
        6.1 Become a VIP Member
        <br />
        (1) You can become a VIP member through various existing and future channels. When you use a specific method to
        become a VIP member, you must read and confirm acceptance of the relevant service terms and usage methods. Wind
        Credit hereby declares that any VIP accounts purchased through non-Global Enterprise Library channels may be
        recovered by Global Enterprise Library, and Global Enterprise Library reserves the right to pursue legal
        liabilities. <br />
        (2) You should pay the VIP membership service fee through the designated payment channel of Global Enterprise
        Library (including but not limited to third-party payment methods), and before paying the VIP membership service
        fee, you must acknowledge the price of the service, confirm acceptance of the relevant service terms and payment
        terms, strictly follow the payment process, and pay attention to and ensure the security of the payment
        environment. Otherwise, you shall bear all the adverse consequences on your own. <br />
        (3) The service price of shall be based on the detailed fee schedule displayed on the website and related
        software products. Global Enterprise Library has the right to modify prices, upgrade services, add or reduce
        service content for its members. The standard of value-added services for VIP members shall be based on the
        detailed fee schedule displayed by Global Enterprise Library. You can log in to the Global Enterprise Library
        user center to check your account information details. <br />
        (4) When you pay the service fee through the designated or explicitly recognized purchase channels and payment
        channels of Global Enterprise Library and complete the service in accordance with the service standards, and
        Global Enterprise Library completes the activation of the VIP membership service through the system, you become
        a VIP member of Global Enterprise Library. The VIP membership service of Global Enterprise Library is effective
        immediately and starts to calculate the service period. <br />
        6.2 Instructions <br />
        (1) When VIP members use various services of the Global Enterprise Library, their use shall be deemed as consent
        to the service terms and various announcements made by the Global Enterprise Library in the respective services.{' '}
        <br />
        (2) You should properly and correctly keep, use, and maintain the account, account information, and password you
        obtain when applying for the Global Enterprise Library. If your account password is leaked due to reasons not
        attributable to Global Enterprise Library or if losses are caused by your poor custody, use, and maintenance,
        Global Enterprise Library has no obligation to bear any responsibility related to this. <br />
        (3) Global Enterprise Library is not responsible for any losses caused by your actions or inactions of third
        parties, including but not limited to payment services and network access services, and any infringement actions
        by third parties. <br />
        (4) The ownership of the VIP membership account of the Global Enterprise Library belongs to the Global
        Enterprise Library. VIP members only have the limited right to use the account. <br />
        (5) The content and fees of the membership services are based on the rights and fee schedule displayed in the
        Global Enterprise Library. Global Enterprise Library has the right to modify or improve the existing services
        and fee schedule based on legal and regulatory requirements, business strategies, and other reasons. Once the
        membership service is started, it cannot be refunded. <br />
        6.3 Obligations <br />
        (1) The VIP membership service has a fixed service period. Once you become a VIP member, you shall be deemed to
        have accepted its service period. The VIP membership service is only for the account holder's personal use;
        during the VIP membership service period, it cannot be transferred between accounts in the Global Enterprise
        Library, and is prohibited from being donated, lent, transferred, or sold. Otherwise, Global Enterprise Library
        has the right to cancel the VIP membership service qualifications of the transferred accounts and the acquiring
        accounts without notice, and the resulting losses shall be borne by the VIP members themselves. <br />
        (2) If the behavior of the VIP member continues to violate this agreement or violates national relevant laws and
        regulations, or Global Enterprise Library believes that the behavior of the VIP member is harmful to the
        reputation and interests of Global Enterprise Library or others, we have the right to cancel the VIP membership
        qualification of the VIP member without any compensation. (3) All business contact information in the Global
        Enterprise Library comes from public channels and is provided for user reference only. VIP users who export
        business-related information must not be used for trading, exchange, etc., and any disputes arising therefrom
        shall be borne by the user，Global Enterprise Library shall not bear any responsibility. <br />
        {source === SourceTypeEnum.APP ? (
          <p>6.4 Anti-Abuse Policy</p>
        ) : (
          <>
            <p>6.4 Entrusted Inquiries</p>
            <div>
              Should you entrust GEL to inquire about enterprise information, you shall comply with the
              <br />
              <HKInfoQueryAggreBtn title={'Enterprise Information Inquiry Authorization Agreement'} />. This User
              Agreement, together with the aforementioned Authorization Agreement, the{' '}
              {getPrivacyPolicyLinkBySource(source, 'en-US')}, the {getDisclaimerLinkBySource(source, 'en-US')}, other
              agreements/instructions related to this product, and the Platform Terms and Conditions(including any
              amended versions of the aforementioned agreements, disclaimers, policies, and other instructions from time
              to time), shall be inseparable from and shall have the same legal effect as the main text of this User
              Agreement.
            </div>
            <p>6.5 Anti-Abuse Policy</p>
          </>
        )}
        <div>
          All current and future services, features, and data provided by "Global Enterprise Library" (also known as
          "Wind Enterprise Library") must strictly comply with the following usage guidelines. Prohibited activities
          include but are not limited to:
        </div>
        <div>
          (1) Technical abuse: Prohibited use of automated tools, programmatic scripts, or other non-human methods to
          extract, scrape, or copy data from Global Enterprise Library;
        </div>
        <div>
          (2) Account violations: Prohibited sharing of account credentials with others or allowing third parties to use
          your personal account;
        </div>
        <div>
          (3) Commercial abuse: Prohibited resale or rental of platform access rights, or use of platform data to
          directly support third-party commercial services.
        </div>
        <div>Enforcement Measures</div>
        <div>
          • The Platform employs real-time monitoring systems and technical protection mechanisms, continuously
          optimizing anti-abuse strategies;
        </div>
        <div>
          • If the system detects abnormal behavior, account functions may be temporarily restricted, and users will be
          notified via registered email or bound contact information;
        </div>
        <div>• Accounts verified to have no violations will have full access restored within 5 business days. </div>
        <h2>7. Member Disputes</h2>
        Wind Credit reserves the right but has no responsibility to monitor and resolve disputes between you and other
        members.
        <h2>8. User Code of Conduct</h2>
        8.1.Things to Do <br />
        If you agree to this agreement, you will be deemed to comply with the following: <br />
        (1) Compliance with laws, regulations and relevant departmental rules; <br />
        (2) Provide accurate information and update it in a timely manner; <br />
        (3) Use your real name when using the "Service"; <br />
        (4) Use the "Service" in a professional manner. <br />
        8.2 Prohibited items <br />
        Except as permitted by law or with the prior written permission of the Company, you shall not use the Global
        Enterprise Library and related services in a manner that. <br />
        8.2.1 The information you produce, comment on, upload, publish and disseminate shall consciously comply with
        laws and regulations, abide by public order, respect social morality, socialist system, national interests,
        legitimate rights and interests of citizens, social public order, morality and authenticity of information and
        other "seven bottom line" requirements, otherwise the company has the right to immediately take appropriate The
        company has the right to take appropriate measures immediately. You agree and promise not to produce, copy,
        publish or disseminate the following information. <br />
        (1) Those who oppose the fundamental principles established by the Constitution. <br />
        (2) Endangering national security and leaking state secrets. <br />
        (3) Subverting state power, overthrowing the socialist system, inciting secession and undermining national unity{' '}
        <br />
        (4) Damage to national honor and interests. <br />
        (5) Promoting terrorism, extremism. <br />
        (6) Promoting ethnic hatred, ethnic discrimination and undermining national unity. <br />
        (7) Incitement to regional discrimination, regional hatred. <br />
        (8) Undermine the state's religious policy and promote evil cults and feudal superstitions <br />
        (9) Fabrication, dissemination of rumors, false information, disrupting the economic and social order and
        undermining social stability. <br />
        (10) Dissemination, dissemination of obscenity, pornography, gambling, violence, murder, terrorism or abetting
        crime. <br />
        (11) Insulting or defaming others and infringing on their legitimate rights and interests. <br />
        (12) Intimidate and threaten others with violence and implement human flesh search. <br />
        (13) Involving the privacy, personal information or data of others. <br />
        (14) Spreading obscene language that undermines the public order and morals. <br />
        (15) Infringement of others' privacy, reputation, portrait rights, intellectual property rights and other
        legitimate rights and interests of the content. <br />
        (16) Dissemination of commercial advertising, or similar commercial solicitation information, excessive
        marketing information and spam. <br />
        (17) Comments in languages other than those commonly used on this website. <br />
        (18) Which have no relevance to the information being commented on. <br />
        (19) Where the published information is meaningless or where the combination of characters is deliberately used
        to avoid technical review. <br />
        (20) Without the permission of others, secretly filming, secretly recording others, infringing on the legal
        rights of others. <br />
        (21) Contains terrorist, violent and bloody, high-risk, hazardous to the performer's own or others' physical and
        mental health content, including but not limited to the following circumstances. <br />
        i. Any content of violent and/or self-harming behavior. <br />
        ii. Any content that threatens life and health, endangers one's own or others' personal and/or property rights
        by performing with dangerous instruments such as knives. <br />
        iii. Content that encourages or induces others to engage in dangerous or illegal activities that may cause
        personal injury or result in death. <br />
        (22) Other information that violates laws, regulations, policies and public order and morals, interferes with
        the normal operation of "Wind Financial Terminal" or violates the legitimate rights and interests of other users
        or third parties. <br />
        (23) Other information that disrupts the financial market order <br />
        8.2.2 Use any plug-ins, plug-ins, systems or third-party tools not authorized or licensed by the Company to
        interfere with, disrupt, modify or otherwise affect the normal operation of the Wind Financial Terminal software
        and related services. <br />
        8.2.3 Use or target the Wind Financial Terminal software and related services for any acts that endanger the
        security of the computer network, including but not limited to. <br />
        (1) illegal intrusion into the network, interference with the normal function of the network, theft of network
        data and other activities that endanger network security. <br />
        (2) provide programs and tools specifically designed to engage in network intrusion, interference with normal
        network functions and protective measures, theft of network data and other activities that endanger network
        security. <br />
        (3) Knowing that others are engaged in activities that endanger network security, to provide technical support,
        advertising and promotion, payment settlement and other assistance. <br />
        (4) Use of unauthorized data or access to unauthorized servers/accounts. <br />
        (5) unauthorized access to public computer networks or other people's computer systems and delete, modify, add
        stored information. <br />
        (6) Unauthorized attempts to probe, scan, test the vulnerability of the Wind Financial Terminal system or
        network or other acts that undermine network security. <br />
        (7) Attempting to interfere with or disrupt the normal operation of the "Wind Financial Terminal" system or
        website, intentionally spreading malicious programs or viruses, and other acts that disrupt normal network
        information services. <br />
        (8) Forging of TCP/IP packet names or partial names. <br />
        (9) reverse engineering, disassembling, compiling or otherwise attempting to discover the source code of the
        Wind Financial Terminal software and related services. <br />
        (10) Maliciously registering accounts for the Wind Financial Terminal software and related services, including
        but not limited to frequent and bulk account registration. <br />
        (11) Violation of laws and regulations, this Agreement, the Company's relevant rules and other acts that
        infringe on the legitimate rights and interests of others. <br />
        8.2.4 Other activities that endanger the security of computer information networks. <br />
        (1) Without written permission, using the Global Enterprise Library to engage in advertising, disguised
        advertising, word-of-mouth marketing, product sales, pyramid selling, etc. <br />
        (2) Copying, copying, selling, reselling, or using for any other commercial purpose any part of the Global
        Enterprise Library related services or this service. <br />
        (3) Unauthorized printing, copying, disseminating, selling, or otherwise using any personal information or
        business information of employees or employers. <br />
        (4) Without the consent of the Global Enterprise Library, sending emails, making phone calls, sending letters,
        or otherwise contacting individuals or companies that publish information. <br />
        8.2.5 If the Company has reason to believe that your behavior violates or may violate the above agreement, the
        Company may independently judge and deal with it, and has the right to terminate the provision of services to
        you without prior notice and pursue relevant legal responsibilities. <br />
        <h2>9.Source statement</h2>
        The Global Enterprise Library, a big data software developed and operated by Wind Credit, is a corporate
        business data and other public information inquiry system (referred to as "Global Enterprise Library").
        According to user instructions, the search engine system of the Global Enterprise Library will automatically
        generate the user's search for legally disclosed corporate information in an non-manual search manner, so that
        users can find and use the disclosed information.
        <br />
        As of now, the data source for the Global Enterprise Library is from the following websites, and a brief
        introduction to the data source and its compliance is as follows:
        <br />
        9.1. National Enterprise Credit Information Publicity System (http://gsxt.saic.gov.cn)
        <br />
        (1) Publicity basis
        <br />
        The information publicity of this system is based on the relevant provisions of laws, regulations, and rules
        such as the "Regulation on the Openness of Government Information" and the "Interim Measures for the Disclosure
        of Enterprise Information". According to the "Interim Measures for the Disclosure of Enterprise Information
        (State Council Decree No. 654)" implemented on October 1, 2014, the relevant provisions are as follows:
        <br />
        "Article 6: The industrial and commercial administrative departments shall, through the enterprise credit
        information publicity system, disclose the following enterprise information generated in the process of
        performing their duties:
        <br />
        (1) Registration and Recordation information;
        <br />
        (2) Chattel mortgage registration information;
        <br />
        (3) Equity pledge registration information;
        <br />
        (4) Administrative punishment information;
        <br />
        (5) Other information that should be disclosed in accordance with the law. The enterprise information referred
        to in the preceding paragraph shall be disclosed within 20 working days from the date of its generation."
        <br />
        "Article 7: Other government departments (hereinafter referred to as other government departments) shall
        disclose the following enterprise information generated in the process of performing their duties:
        <br />
        (1) Administrative permission information for granting, modification, and continuation;
        <br />
        (2) Administrative punishment information;
        <br />
        (3) Other information that should be disclosed in accordance with the law. Other government departments may
        disclose the enterprise information referred to in the preceding paragraph through the enterprise credit
        information publicity system or through other systems. The industrial and commercial administrative departments
        and other government departments shall, in accordance with the overall requirements of the national social
        credit information platform construction, achieve the interconnection and sharing of enterprise information."
        <br />
        "Article 9: The content of the annual report of a enterprise includes:
        <br />
        (1) Information such as the enterprise's communication address, postal code, contact phone number, and email
        address;
        <br />
        (2) Information on the existence status of the enterprise, including opening, closing, and liquidation;
        <br />
        (3) Information on the establishment of enterprises and the purchase of equity;
        <br />
        (4) Information on the subscribed and actual capital, investment time, and investment method of the shareholders
        or initiators of a limited liability company or a joint-stock company;
        <br />
        (5) Information on the transfer of shares and other equity changes of the shareholders of a limited liability
        company;
        <br />
        (6) Information on the name and URL of the enterprise's website and online stores engaged in network business;
        <br />
        (7) Information on the number of employees, total assets, total liabilities, external guarantee liabilities,
        total owner's equity, total operating income, main business income, profit, net profit, and total tax payment.
        The information specified in the first to sixth items shall be publicly disclosed, and the information specified
        in the seventh item shall be chosen by the enterprise whether to be publicly disclosed. With the consent of the
        enterprise, citizens, legal persons, or other organizations may inquire into the information that the enterprise
        chooses not to disclose."
        <br />
        "Article 10: Enterprises shall, within 20 working days from the date the following information is formed,
        disclose it to the public through the enterprise credit information publicity system:
        <br />
        (1) Information on the subscribed and actual capital, investment time, and investment method of the shareholders
        of a limited liability company or the initiators of a joint-stock company;
        <br />
        (2) Information on the transfer of shares and other equity changes of the shareholders of a limited liability
        company;
        <br />
        (3) Information on the grant, modification, and continuation of administrative permissions;
        <br />
        (4) Information on the registration of intellectual property rights pledge;
        <br />
        (5) Information on administrative penalties;
        <br />
        (6) Other information that should be disclosed in accordance with the law.
        <br />
        If the industrial and commercial administrative department finds that the enterprise has not performed the
        disclosure obligation in accordance with the provisions of the preceding paragraph, it shall order the
        enterprise to perform the obligation within a time limit."
        <br />
        (2) The information disclosed in this system comes from the industrial and commercial administrative
        departments, other government departments, and market entities. The government departments and market entities
        are responsible for the authenticity of the information they disclose.
        <br />
        (3) If there are any issues during the use of this system, you can consult the business consultation hotline or
        technical support hotline under the homepage of the enterprise credit information disclosure system in the
        province, autonomous region, or municipality where the market entity is located.
        <br />
        In summary, the disclosure of enterprise information is a mandatory provision of administrative regulations. It
        can be inferred that the information disclosed on this website is public information and does not constitute
        trade secrets or personal privacy.
        <br />
        9.2. China Judgment Document Network (http://wenshu.court.gov.cn/Index)
        <br />
        (1) Publicity basis
        <br />
        According to the "Provisions of the Supreme People's Court on the Internet Publication of Judgment Documents by
        People's Courts" implemented on October 1, 2016 (Fa Shi [2016] No. 19), the relevant provisions are as follows:
        "Article 2: China Judgment Document Network is the unified platform for all courts to publish judgment
        documents. Courts at all levels shall set up links to China Judgment Document Network on their official websites
        and judicial open platforms."
        <br />
        "Article 3: The following judgment documents of the people's courts shall be published on the Internet: (1)
        Criminal, civil, administrative judgments; (2) Criminal, civil, administrative, execution rulings; (3) Payment
        orders; (4) Criminal, civil, administrative, execution rejection of appeal notices; (5) State compensation
        decisions; (6) Forced medical decision or rejection of forced medical application decisions; (7) Criminal
        execution and change decisions; (8) For the disturbance of litigation and execution, the decision of detention
        and fine, the decision of early release from detention, and the decision of appeal for review of the detention
        and fine and other sanctions; (9) Administrative mediation and civil public interest litigation mediation; (10)
        Other judgment documents that have a suspending or terminating effect on the litigation process or have an
        impact on the parties' substantive rights and interests or significantly affect the parties' procedural rights
        and interests."
        <br />
        "Article 4: Judgment documents of the people's courts that meet any of the following circumstances shall not be
        published on the Internet: (1) Involving state secrets; (2) Involving juvenile crimes; (3) Settled by mediation
        or confirmed the effectiveness of people's mediation agreements, but it is necessary to publicly disclose for
        the protection of national interests, social public interests, or the rights and interests of others; (4)
        Divorce lawsuits or involving the custody and upbringing of minors; (5) Other circumstances in which the
        people's court believes it is inappropriate to publish on the Internet."
        <br />
        In summary, the content disclosed on China Judgment Document Network is legally public content and does not
        exist any inapplicability for public disclosure.
        <br />
        9.3. Supreme People's Court of the People's Republic of China National Court Execution Information Query (China
        Execution Information Publicity Network) (http://zhixing.court.gov.cn/search)
        <br />
        (1) Publicity basis: According to the "Provisions of the Supreme People's Court on the Publication of the List
        of Defaulters in Execution Proceedings" implemented on October 1, 2013 (Fa Shi [2013] No. 17), the relevant
        provisions are as follows:
        <br />
        "Article 4: The list of defaulters in execution proceedings published and recorded shall include: (1) The name,
        organization code, legal representative or principal name of the legal person or other organization as the
        defendant; (2) The name, gender, age, and ID number of the natural person as the defendant; (3) The obligations
        and performance of the defendant as stipulated in the effective legal instruments; (4) The specific
        circumstances of the defendant's defaulter behavior; (5) The production unit and number of the legal instrument,
        execution case number, date of filing, and execution court; (6) Other matters that the people's court believes
        should be recorded and published, which do not involve state secrets, business secrets, or personal privacy."
        (2) According to the "Use Declaration of National Court Execution Information Query": "In order to promote the
        construction of social credit system, effectively solve the problem of execution difficulty, promote the
        automatic performance of the obligations of the execution by the defendants, ensure the citizens, legal persons,
        and other organizations to obtain the information of the execution cases, give full play to the service role of
        the execution case information in people's daily life, production, and social economic activities, and refer to
        the 'Regulation on the Openness of Government Information of the People's Republic of China', the Supreme
        People's Court has opened the 'National Court Execution Information Query' platform to the public since March
        30, 2009. The public can query the information of the defendants in the execution cases of all courts (excluding
        military courts) that were newly received and not yet concluded since January 1, 2007, and before that.
        Regarding the following matters, the declaration is as follows:
        <br />
        "(1) The information of the execution defaulters is entered and verified by the execution court. If the relevant
        parties have objections to the content of the information, they can apply for correction to the execution court
        in writing according to the "Provisions of the Supreme People's Court on the Handling of Information Dispute
        Cases in the National Court Execution Information Query Platform".
        <br />
        (2) The information provided on this website is for reference only for the query person. If there is any
        dispute, the relevant legal documents of the execution court shall prevail. The people's court will not bear any
        responsibility for any adverse consequences caused by the use of the information on this website.
        <br />
        (3) The query person must use the query information in accordance with the law and may not be used for illegal
        purposes or inappropriate purposes. If the illegal use of the information on this website causes damage to
        others, the person responsible for the use shall bear the corresponding responsibility.
        <br />
        (4) The query of information on this website is free, and it is strictly forbidden for any individual or unit to
        use the information on this website to seek illegal profits. ...“
        <br />
        In summary, the content disclosed by the court system is that which the people's courts believe should be made
        public in accordance with the law.
        <br />
        9.4. Official Website of the State Intellectual Property Office of the People's Republic of China
        (http://www.sipo.gov.cn)
        <br />
        (1) Basis for patent information disclosure: According to the relevant provisions of the "Patent Law of the
        People's Republic of China" which came into effect on October 1, 2009: "Article 21 The State Intellectual
        Property Office and the Patent Re-examination Board shall, in accordance with the requirements of objectivity,
        impartiality, accuracy, and timeliness, handle the applications and requests for patents in accordance with the
        law. The State Intellectual Property Office shall publish patent information completely, accurately, and timely,
        and regularly publish the Patent Gazette. Before the patent application is disclosed or announced, the staff
        members and relevant personnel of the State Intellectual Property Office shall be responsible for keeping the
        contents confidential." The patent information and other contents disclosed by the State Intellectual Property
        Office in accordance with the law are based on the Patent Law and are the contents that should be made public in
        accordance with the law.
        <br />
        9.5. Official Website of the Trademark Office of the State Administration for Industry and Commerce of the
        People's Republic of China (http://sbj.saic.gov.cn)
        <br />
        (1) Basis for disclosure:
        <br />
        According to the relevant provisions of the "Trademark Law of the People's Republic of China" which came into
        effect on May 1, 2014:
        <br />
        "Article 28 For trademark applications, the Trademark Office shall, within nine months from the date of receipt
        of the application for trademark registration, review and decide whether to preliminarily approve the
        application. If it meets the relevant provisions of this Law, it shall be preliminarily approved and announced."
        "Article 35 If an objection is made to a preliminarily approved trademark, the Trademark Office shall hear the
        facts and reasons of the objector and the respondent, and, after investigation and verification, make a decision
        within twelve months from the date of the announcement, whether to allow the registration, and shall notify the
        objector and the respondent in writing. If there are special circumstances that require an extension, with the
        approval of the State Administration for Industry and Commerce of the People's Republic of China, it may be
        extended for six months. If the Trademark Office decides to allow the registration, it shall issue the trademark
        registration certificate and announce it."
        <br />
        "Article 40 If the registered trademark expires and needs to be continued, the trademark registrant shall,
        within twelve months before the expiration, handle the renewal procedures in accordance with the provisions.
        During this period, if it is not handled, a six-month grace period may be granted. The effective period of each
        renewal registration is ten years, calculated from the next day after the expiration of the previous
        registration period. If the renewal procedures are not completed within the expiration, the registered trademark
        shall be canceled. The Trademark Office shall announce the renewal registration of the trademark." "Article 42
        In the case of transferring a registered trademark, the transferor and the transferee shall sign a transfer
        agreement and jointly apply to the Trademark Office. The transferee shall guarantee the quality of the goods in
        which the registered trademark is used. When transferring a registered trademark, the trademark registrant shall
        transfer any similar trademarks registered for the same or similar goods. The Trademark Office shall not approve
        the transfer if it is likely to cause confusion or has other adverse effects, and shall notify the applicant in
        writing, stating the reasons. After the transfer of the registered trademark is approved, it shall be announced.
        The transferee shall enjoy the exclusive right to use the trademark from the date of announcement."
        <br />
        "Article 43 The trademark registrant may authorize others to use its registered trademark by signing a trademark
        use license agreement. The licensor shall supervise the quality of the goods in which the licensed trademark is
        used. The licensee shall guarantee the quality of the goods in which the registered trademark is used. In the
        case of using another's registered trademark with permission, the name of the licensee and the place of origin
        of the goods must be indicated on the goods. The licensor shall report the trademark use license to the
        Trademark Office for record, and the Trademark Office shall announce it. A trademark use license that has not
        been filed for recordation shall not be effective against a bona fide third party."
        <br />
        "Article 47 In accordance with Article 44 and Article 45 of this Law, the registration trademark declared
        invalid shall be announced by the Trademark Office, and the exclusive right to use the registered trademark
        shall be deemed not to exist from the beginning."
        <br />
        "Article 55 If the parties do not apply for review of the Trademark Office's decision to cancel the registered
        trademark or do not appeal to the people's court for the review decision of the Trademark Review and
        Adjudication Committee within the statutory time limit, the decision to cancel the registered trademark and the
        review decision shall take effect. The registered trademark that has been cancelled shall be announced by the
        Trademark Office, and the exclusive right to use the registered trademark shall expire from the date of
        announcement."
        <br />
        In summary, the information on the initial review, approval, renewal, transfer, licensing, declaration of
        invalidity, and cancellation of trademarks is the content that should be made public in accordance with the law.
        <br />
        9.6. Official Website of the National Copyright Administration of the People's Republic of China
        (http://www.ncac.gov.cn)
        <br />
        (1) Basis for disclosure: According to the relevant provisions of the "Voluntary Registration of Works Trial
        Measures" which came into effect on January 1, 1995:
        <br />
        "Article 12 The registration of works shall be implemented by computer database management and be open to the
        public. ..."
        <br />
        Therefore, copyright registration is voluntary in nature. The registration of copyright at the same time
        acknowledges the public disclosure of the copyright registration, and its content is the content that should be
        made public in accordance with the law.
        <br />
        9.7. User confirms that he/she is aware that all information displayed in Global Enterprise Library comes from
        public channels. For the data services provided by the Global Enterprise Library system, if the content involves
        data query or use by users that requires authorization from the rights holders in accordance with laws,
        regulations or norms, users and users' related system personnel should obtain the necessary authorization from
        the relevant rights holders before conducting data queries and usage. If users or users' related system
        personnel access or use information without obtaining the necessary authorization from the relevant rights
        holders, they shall bear all the adverse consequences caused by such access or use.
        <br />
        <h2>10.User Privacy</h2>
        Global Enterprise Library absolutely respects the personal privacy rights of users. Global Enterprise Library
        will not publicly, edit, or disclose any user's information to third parties unless there is a legal and
        government-compelled requirement or the user's consent. The specific details can be found in the Privacy Policy.
        <h2>11.Legal Jurisdiction and Applicability</h2>
        11.1 This agreement shall be effective, implemented, interpreted, and disputes resolved in accordance with the
        laws of the People's Republic of China. You agree that any disputes arising from the agreement and the use of
        the Global Enterprise Library shall be submitted to the local court of Shanghai Wind Credit Service Co., Ltd.
        for resolution by litigation.
        <br />
        11.2 You understand and agree that we have the right to modify this agreement according to the upgrade of the
        service. We will announce the relevant modifications on our website and related software products. Please pay
        attention to them at any time. Your continued use of the Global Enterprise Library and related services after
        the modification of this agreement shall be deemed to have agreed and accepted the modification of this
        agreement.
        <h2>12. The final interpretation right of this agreement belongs to Shanghai Wind Credit Service Co., Ltd.</h2>
        You confirm that you have carefully read the above terms and fully accept the content of the above terms.
      </div>
    </>
  )
}

/**
 * 用户协议  */
export const UserNoteTextEN = (
  <>
    {noteTitle}
    <NoteBody source={SourceTypeEnum.GEL}></NoteBody>
  </>
)

/**
 * 支持导出纯正文页面
 * @returns
 */
const UserNoteTextPageEn = () => {
  const source = getUrlSearchValue('source') // 后续区分来源 app、windzx、web 等
  const pure = getUrlSearchValue('pure')
  // 根据 pure 参数决定是否应用全局样式
  if (pure) {
    return (
      <div className={styles['user-note-page--pure']}>
        <NoteBody source={source as SourceTypeEnum}></NoteBody>
      </div>
    )
  }
  return <div>{UserNoteTextEN}</div>
}

export default UserNoteTextPageEn
