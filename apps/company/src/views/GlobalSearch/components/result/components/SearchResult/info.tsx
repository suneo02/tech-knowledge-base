import { Links } from '@/components/common/links'
import InnerHtml from '@/components/InnerHtml'
import { LinksModule } from '@/handle/link'
import { formatCurrency } from '@/utils/common.ts'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils'
import { GSTabsEnum } from '@/views/GlobalSearch/types'
import { ProvidedByAI } from 'gel-ui'
import React from 'react'
import { CompanyInfoInSearchWithCollect } from '../../useResultList'
import { BaseInfoItemProps, OrgTypeEnum, TextProps } from './type'

// TODO 未来可以替换成和tableColumns同样的方法，看后续改造
const Text = <T extends Record<string, any>>({ type, item, field, unit, href }: TextProps<T>) => {
  if (type === 'currency' || type === 6) {
    if (item?.[field] === '0') {
      return '--'
    }
    return formatCurrency(item[field], unit, intl('20116', '万'))
  }
  if (type === 'date' || type === 7) {
    return wftCommon.formatTime(item[field])
  }
  if ((type === 'links' || type === 8) && href) {
    return (
      <a className="underline" href={href} target="_blank" rel="noreferrer" data-uc-id="roqBZgGgX" data-uc-ct="a">
        <InnerHtml html={item[field]}></InnerHtml>
      </a>
    )
  }
  if (typeof item?.[field] === 'string' && item?.[field].includes('<em>')) {
    return <InnerHtml html={item[field]}></InnerHtml>
  }
  return item?.[field] || '--'
}

const BaseInfoItem = <T extends Record<string, any>>({
  children,
  extraContent,
  field,
  item,
  label,
  renderType,
  type,
  unit,
  show,
  href,
  showCondition,
}: BaseInfoItemProps<T>) => {
  if (!show && (!item?.[field] || (showCondition && !showCondition(item, type)))) {
    return null
  }

  const renderChildren = () => {
    if (children) {
      return children
    }
    return (
      <Text
        item={item}
        field={field}
        type={renderType}
        unit={unit}
        href={href}
        data-uc-id="L_5FVWIz4G"
        data-uc-ct="text"
      />
    )
  }

  return label ? (
    <span>
      <label htmlFor="">
        {label}
        {intl('99999681', '：')}
      </label>
      {renderChildren()}
      {extraContent || null}
    </span>
  ) : (
    <>
      {renderChildren()}
      {extraContent || null}
    </>
  )
}

/** 公司名称 */
export const CompanyNameInfo = <T extends CompanyInfoInSearchWithCollect>({ item }: { item: T; type?: GSTabsEnum }) => {
  // 使用 corpName 作为原始名称
  const displayName = item?.corpName
  return (
    <Links
      module={LinksModule.COMPANY}
      id={item?.corpId || ''}
      title={
        <h4>
          <InnerHtml html={displayName}></InnerHtml>
        </h4>
      }
    ></Links>
  )
}

/** 翻译名称 */
export const ComapnyTransNameInfo = <T extends CompanyInfoInSearchWithCollect>({
  item,
  type,
}: {
  item: T
  type?: GSTabsEnum
}) => {
  if (!item?.corpNameTrans) {
    return null
  }
  return (
    <>
      <BaseInfoItem<T>
        item={item}
        type={type}
        field="corpNameTrans"
        extraContent={item?.corpNameAITransFlag ? <ProvidedByAI /> : null}
        data-uc-id="f4EKqRkP7E"
        data-uc-ct="baseinfoitem"
      />
    </>
  )
}

/** 国家地区 */
export const CountryInfo = <T extends CompanyInfoInSearchWithCollect>({
  item,
  type,
}: {
  item: T
  type?: GSTabsEnum
}) => (
  <BaseInfoItem<T>
    item={item}
    type={type}
    label={intl('6886', '国家/地区')}
    field="areaCn"
    // ToDo 所属省份
    showCondition={() => true}
    data-uc-id="C6xpHsqF1w"
    data-uc-ct="baseinfoitem"
  />
)

/** 所属省份 */
export const ProvinceInfo = <T extends CompanyInfoInSearchWithCollect>({
  item,
  type,
}: {
  item: T
  type?: GSTabsEnum
}) => <BaseInfoItem<T> item={item} type={type} label={intl('437319', '所属省份')} field="province" />

/** 成立日期 */
export const EstablishDateInfo = <T extends CompanyInfoInSearchWithCollect>({
  item,
  type,
}: {
  item: T
  type?: GSTabsEnum
}) => (
  <BaseInfoItem<T>
    item={item}
    type={type}
    label={intl('138860', '成立日期')}
    field="establishDate"
    renderType="date"
    show
  />
)

/** 注册资本 */
export const RegisterCapitalInfo = <T extends CompanyInfoInSearchWithCollect>({
  item,
  type,
}: {
  item: T
  type?: GSTabsEnum
}) => (
  <BaseInfoItem<T>
    item={item}
    type={type}
    label={item?.orgType === OrgTypeEnum.IIP ? intl(406814, '资金数额') : intl('35779', '注册资本')}
    field="registerCapital"
    renderType="currency"
    unit={item?.capitalUnit}
    show={type === GSTabsEnum.CHINA}
  />
)

/** 所属行业 */
export const IndustryInfo = <T extends CompanyInfoInSearchWithCollect>({
  item,
  type,
}: {
  item: T
  type?: GSTabsEnum
}) => <BaseInfoItem<T> item={item} type={type} label={intl('246676', '国标行业')} field="industryName" />

/** 法人 */
export const LegalPersonInfo = <T extends CompanyInfoInSearchWithCollect>({
  item,
  type,
}: {
  item: T
  type?: GSTabsEnum
}) => {
  const linksParams = {
    id: item?.artificialPersonId,
    title: item?.artificialPersonName,
    module: item?.artificialPersonType === 'person' ? LinksModule.CHARACTER : LinksModule.COMPANY,
  }
  return (
    <BaseInfoItem<T>
      item={item}
      type={type}
      label={item?.orgType === OrgTypeEnum.IIP ? intl('406833', '经营者') : intl('138733', '法人')}
      field="artificialPersonName"
      renderType="links"
      href={wftCommon.jumpMap(item.corpId)}
      data-uc-id="fWvAa39wNg"
      data-uc-ct="baseinfoitem"
    >
      <Links {...linksParams} useUnderline />
    </BaseInfoItem>
  )
}

/** 地址 */
export const AddressInfo = <T extends CompanyInfoInSearchWithCollect>({
  item,
  type,
}: {
  item: T
  type?: GSTabsEnum
}) => (
  <BaseInfoItem<T>
    item={item}
    type={type}
    label={intl('19414', '地址')}
    field="registerAddress"
    renderType="links"
    href={wftCommon.jumpMap(item.corpId)}
    data-uc-id="61Z4YlP70f"
    data-uc-ct="baseinfoitem"
  />
)

/** 高亮 */
export const HighlightInfo = <T extends CompanyInfoInSearchWithCollect>({ item }: { item: T }) =>
  item.highlight.length && item.highlight.filter((res) => res?.isDisplayedInList === 1)?.length ? (
    <div style={{ marginBlockStart: 4 }}>
      {item.highlight.map((res, index) => (
        <span key={index} style={{ marginInlineEnd: 20 }}>
          <label htmlFor="">{res.label}：</label>
          <InnerHtml html={res.value}></InnerHtml>
        </span>
      ))}
    </div>
  ) : null

export const DomesticEntity = <T extends CompanyInfoInSearchWithCollect>({
  item,
  type,
}: {
  item: T
  type?: GSTabsEnum
}) => {
  return (
    <BaseInfoItem<T> item={item} type={type} label={intl('437189', '境内运营实体')} field="domesticEntity">
      <Links module={LinksModule.COMPANY} id={item.domesticEntityId} title={item.domesticEntity} useUnderline />
    </BaseInfoItem>
  )
}
