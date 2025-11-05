import intl from '../../../utils/intl'
import './footer.less'
export const VersionPriceFooter = () => {
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
    </div>
  )
}
