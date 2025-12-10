import React from 'react'
import { Links } from '@/components/common/links'
import { LinksModule, UserLinkEnum } from '@/handle/link'

export const AntiAbusePolicyZh = () => (
  <>
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
  </>
)
