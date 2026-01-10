import { pointBuriedNew } from '@/api/configApi.ts'
import { commonBuryList } from '@/api/pointBuried'
import { ShareRateWithRoute } from '@/components/common/shareHolder'
import { benfitRender } from '@/components/company/corpCompMisc.tsx'
import { LinkByRowCompatibleCorpPerson } from '@/components/company/link/CorpOrPersonLink.tsx'
import { CorpSubModuleCfg, CorpTableCfg } from '@/types/corpDetail'
import { formatShareRate } from '@/utils/format'
import { intlNoNO as intl } from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { BeneficiaryInstitution, BeneficiaryNaturalPerson, BeneficiaryOwner } from 'gel-types'
import { ActualControllerGroupTag } from 'gel-ui'
import { t } from 'gel-util/intl'
import React from 'react'

export const corpDetailFinalBeneficiary: CorpSubModuleCfg = {
  modelNum: ['beneficialOwner', 'beneficialInstitutions', 'beneficialNaturalPerson'],
}

/**
 * 股权出质人
 */
export const corpDetailFinalBeneficiaryOwner: CorpSubModuleCfg = {
  modelNum: 'beneficialOwner',
}

/**
 * 股权 质权人
 */
export const corpDetailFinalBeneficiaryInstitution: CorpSubModuleCfg = {
  modelNum: 'beneficialInstitutions',
}

/**
 * 出质标的
 */
export const corpDetailFinalBeneficiaryPerson: CorpSubModuleCfg = {
  modelNum: 'beneficialNaturalPerson',
}

const beneficiaryOwner: CorpTableCfg<BeneficiaryOwner> = {
  cmd: 'detail/company/getbeneficiary_owner',
  title: intl('326056', '受益所有人'),
  modelNum: corpDetailFinalBeneficiaryOwner.modelNum,
  thWidthRadio: ['5.2%', '20%', '15%', '25%', '36%'],
  thName: [
    intl('28846', '序号'),
    intl('326055', '受益所有人名称'),
    intl('261486', '最终受益股份'),
    intl('326073', '受益类型'),
    intl('326074', '判定理由'),
  ],
  align: [1, 0, 2, 0],
  fields: ['NO.', 'name', 'showShareRate', 'beneficType', 'judgeReason'],
  columns: [
    null,
    {
      render: (_txt, row) => {
        return (
          <>
            <LinkByRowCompatibleCorpPerson nameKey={'name'} idKey={'beneficiaryId'} row={row} />
            {row.actor?.length
              ? row.actor.map((num) => <ActualControllerGroupTag num={num as unknown as number} intl={t} />)
              : null}
          </>
        )
      },
    },
    {
      render: (txt, row, _idx) => {
        return (
          <ShareRateWithRoute
            value={formatShareRate(txt)}
            hasRoute={row.shareRoute && row.shareRoute.length > 0}
            onRouteClick={() => {
              const { moduleId, opActive, describe } = commonBuryList.find((res) => res.moduleId === 922602100968)
              pointBuriedNew(moduleId, { opActive, opEntity: describe })
              wftCommon.renderShareRouteModal(row.shareRoute)
            }}
          />
        )
      },
    },
    null,
    null,
  ],
  extraParams: (param) => {
    param.__primaryKey = param.companycode
    return param
  },
}

const beneficiaryPerson: CorpTableCfg<BeneficiaryNaturalPerson> = {
  cmd: 'detail/company/getbeneficiary_naturalpersion',
  title: intl('326053', '受益自然人'),
  modelNum: corpDetailFinalBeneficiaryPerson.modelNum,
  thWidthRadio: ['5.2%', '20%', '15%', '25%', '36%'],
  thName: [
    intl('28846', '序号'),
    intl('326054', '受益自然人名称'),
    intl('261486', '最终受益股份'),
    intl('326073', '受益类型'),
    intl('326093', '任职类型'),
  ],
  align: [1, 0, 2, 0, 0],
  fields: ['NO.', 'name', 'showShareRate', 'beneficType', 'jobType'],
  columns: [
    null,
    {
      render: (_txt, row) => {
        return (
          <>
            <LinkByRowCompatibleCorpPerson nameKey={'name'} idKey={'beneficiaryId'} row={row} />
            {row.actor?.length
              ? row.actor.map((num) => <ActualControllerGroupTag num={num as unknown as number} intl={t} />)
              : null}
          </>
        )
      },
    },
    {
      render: (txt, row, _idx) => {
        return (
          <ShareRateWithRoute
            value={formatShareRate(txt)}
            hasRoute={row.shareRoute && row.shareRoute.length > 0}
            onRouteClick={() => wftCommon.renderShareRouteModal(row.shareRoute)}
          />
        )
      },
    },
    null,
    null,
  ],
  extraParams: (param) => {
    param.__primaryKey = param.companycode
    return param
  },
}
const benefciaryOrg: CorpTableCfg<BeneficiaryInstitution> = {
  cmd: 'detail/company/getbeneficiary_org',
  title: intl('326075', '受益机构'),
  modelNum: corpDetailFinalBeneficiaryInstitution.modelNum,
  thWidthRadio: ['5.2%', '35%', '15%', '46%'],
  thName: [
    intl('28846', '序号'),
    intl('326076', '受益机构名称'),
    intl('261486', '最终受益股份'),
    intl('326073', '受益类型'),
  ],
  align: [1, 0, 2, 0],
  fields: ['NO.', 'name', 'shareRate|formatPercent' as keyof BeneficiaryOwner, 'beneficType'],
  columns: [
    null,
    {
      render: (txt, row) => {
        return (
          <>
            {txt}
            {row.actor?.length
              ? row.actor.map((num) => <ActualControllerGroupTag num={num as unknown as number} intl={t} />)
              : null}
          </>
        )
      },
    },
    null,
    null,
  ],
  extraParams: (param) => {
    param.__primaryKey = param.companycode
    return param
  },
}

export const corpFinalBeneficiary: CorpSubModuleCfg = {
  title: intl('138180', '最终受益人'),
  notVipTitle: intl('138180', '最终受益人'),
  notVipTips: intl('208263', '购买企业套餐，即可挖掘直接或间接拥有疑似超过25%公司股权的自然人或企业'),
  hint:
    '<i><div><span>' +
    intl('353933', '依据银发【2017】235号文件') +
    '</span><br/><br/><span>' +
    intl(
      '353953',
      '受益所有人为依据相关政策文件识别标准，层层深入并最终明确为掌握控制权或者获取收益的一个或多个自然人。'
    ) +
    '</span><br/><span>' +
    intl(
      '353934',
      '受益自然人为拥有25%（含）以上股权或疑似拥有合伙权益或收益权的自然人及对法人或非法人组织进行实际控制的多个自然人。'
    ) +
    '</span><br/><span>' +
    intl(
      '353954',
      '受益机构为拥有25%（含）以上股权或疑似拥有合伙权益或收益权的法人及对法人或非法人组织进行实际控制的多个法人。'
    ) +
    '</span><br/><br/><span style="color:#666666">' +
    intl('353935', '该结果仅供用户参考，并不代表万得的任何观点或保证。') +
    '</span></div></i>',
  modelNum: corpDetailFinalBeneficiary.modelNum,
  numHide: true,
  children: [beneficiaryOwner, beneficiaryPerson, benefciaryOrg],
  rightLink: (data) => {
    return benfitRender(data)
  },
}
