import { PatentLawStatusTitle } from '@/components/company/comp/intellectual/patent/patentLawStatusTitle.tsx'
import CompanyLink from '@/components/company/CompanyLink'
import { ICorpSubModuleCfg } from '@/components/company/type'
import { InfoCircleButton } from '@/components/icons/InfoCircle'
import { intlNoNO as intl } from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { Tooltip } from '@wind/wind-ui'
import React from 'react'
import { DetailLink } from '../components'

export const corpDetailPatent: ICorpSubModuleCfg = {
  title: intl('138749', '专利'),
  withTab: true,
  statisticalChart: 'patent',
  statisticalChartNum: 'patent_num_bgs',
  modelNum: undefined,
  children: [
    {
      cmd: 'detail/company/getPatentInfo_theCompanyV3',
      title: intl('74323', '本公司'),
      moreLink: 'getpatent',
      modelNum: 'patent_num_bgs',
      selName: ['patentCompanyType'],
      aggName: ['aggs_company_type'],
      thWidthRadio: ['5.2%', '27%', '12%', '14%', '14%', '14%', '17%'],
      thName: [
        intl('28846', '序号'),
        intl('138748', '专利名称'),
        intl('138430', '专利类型'),
        intl('149731', '公开公告号'),
        intl('138372', '法律状态'),
        intl('149732', '公开公告日'),
        intl('216390', '归属主体公司'),
      ],
      align: [1, 0, 0, 0, 0, 0, 0],
      fields: [
        'NO.',
        'patentName',
        'patentType|formatCont',
        'publicAnnouncementNumber',
        'lawStatus',
        'publicAnnouncementDate|formatTime',
        'corpName',
      ],
      notVipPageTurning: true,
      notVipPageTitle: intl('138749', '专利'),
      notVipPagedesc: intl('224212', '购买VIP/SVIP套餐，即可不限次查看企业更多专利信息'),
      columns: [
        null,
        {
          render: (txt, row) => {
            const detailid = row['dataId']
            const type = row['patentType']
            const url = `index.html#/patentDetail?nosearch=1&detailId=${detailid}&type=${type}`
            return detailid ? <DetailLink url={url} txt={txt} /> : txt || '--'
          },
        },
        null,
        null,
        {
          title: <PatentLawStatusTitle />,
          render: (txt, _row, _idx) => {
            return wftCommon.formatTime(txt)
          },
        },
        null,
        {
          render: (_txt, row, _idx) => {
            const list = row.mainBodyInfoList
            if (!list || !list.length) return '--'
            if (list.map) {
              return list.map((t, idx) => {
                return (
                  <CompanyLink
                    key={t.patentMainBodyId + idx}
                    name={t.patentMainBody}
                    id={t.patentMainBodyId}
                  ></CompanyLink>
                )
              })
            }
            return '--'
          },
        },
        null,
      ],
      dataCallback: (res) => {
        return res.list && res.list.length ? res.list : []
      },
      downDocType: 'download/createtempfile/getPatentInfo_theCompanyV3',
      extraParams: (param) => {
        return {
          ...param,
          __primaryKey: param.companycode,
        }
      },
      rightFilters: [
        {
          key4sel: 'agg_patentType',
          key4ajax: 'patentType',
          name: intl('297846', '全部专利类型'),
          key: '',
          typeOf: 'string',
          width: 120,
        },
        {
          key4sel: 'agg_lawStatusCode',
          key4ajax: 'lawStatusCode',
          name: intl('437182', '全部法律状态'),
          key: '',
          titleKey: 'key',
          typeOf: 'string',
          width: 120,
        },
        {
          key4sel: 'agg_publicAnnouncementDate',
          key4ajax: 'publicAnnouncementDateRange',
          name: intl('437403', '全部公开公告日期'),
          key: '',
          typeOf: 'string',
          width: 140,
        },
      ],
    },
    {
      cmd: 'detail/company/getPatentInfo_branchV3',
      title: intl('204320', '分支机构'),
      moreLink: 'getpatent',
      modelNum: 'patent_num_fzjg',
      selName: ['patentCompanyType'],
      aggName: ['aggs_company_type'],
      thWidthRadio: ['5.2%', '25%', '10%', '12%', '12%', '12%', '15%', '12%'],
      thName: [
        intl('28846', '序号'),
        intl('138748', '专利名称'),
        intl('138430', '专利类型'),
        intl('149731', '公开公告号'),
        intl('138372', '法律状态'),
        intl('149732', '公开公告日'),
        intl('216390', '归属主体公司'),
        intl('332353', '关联关系类型'),
      ],
      align: [1, 0, 0, 0, 0, 0, 0, 0],
      fields: [
        'NO.',
        'patentName',
        'patentType|formatCont',
        'publicAnnouncementNumber',
        'lawStatus',
        'publicAnnouncementDate|formatTime',
        'corpName',
        'relativeType|relativeType',
      ],
      notVipPageTurning: true,
      notVipPageTitle: intl('138749', '专利'),
      notVipPagedesc: intl('224212', '购买VIP/SVIP套餐，即可不限次查看企业更多专利信息'),
      columns: [
        null,
        {
          render: (txt, row) => {
            const detailid = row['dataId']
            const type = row['patentType']
            const url = `index.html#/patentDetail?nosearch=1&detailId=${detailid}&type=${type}`
            return detailid ? <DetailLink url={url} txt={txt} /> : txt
          },
        },
        null,
        null,
        {
          title: (
            <span>
              {intl('138372', '法律状态')}

              {
                <Tooltip
                  overlayClassName="corp-tooltip"
                  title={
                    <div>
                      {intl(
                        '285417',
                        '专利的法律状态一般有五个阶段：受理、初审、公布、实质审查与授权。</br>初审通过后可以公布，后进入实际审查阶段，即实质审查生效，在该阶段对专利申请是否具有新颖性、创造性、实用性及专利法规定的其他实质性条件进行全面审查，审查通过则授予专利权，不符合则驳回。'
                      )}
                    </div>
                  }
                >
                  <InfoCircleButton />
                </Tooltip>
              }
            </span>
          ),
          render: (txt, _row, _idx) => {
            return wftCommon.formatTime(txt)
          },
        },
        null,
        {
          render: (_txt, row, _idx) => {
            const list = row.mainBodyInfoList
            if (!list || !list.length) return '--'
            if (list.map) {
              return list.map((t) => {
                return <CompanyLink name={t.patentMainBody} id={t.patentMainBodyId}></CompanyLink>
              })
            }
            return '--'
          },
        },
        {
          render: () => {
            return intl('204320', '分支机构')
          },
        },
      ],
      dataCallback: (res) => {
        return res.list && res.list.length ? res.list : []
      },
      downDocType: 'download/createtempfile/getPatentInfo_branchV3',
      extraParams: (param) => {
        return {
          ...param,
          __primaryKey: param.companycode,
        }
      },
      rightFilters: [
        {
          key4sel: 'agg_patentType',
          key4ajax: 'patentType',
          name: intl('297846', '全部专利类型'),
          key: '',
          typeOf: 'string',
          width: 120,
        },
        {
          key4sel: 'agg_lawStatusCode',
          key4ajax: 'lawStatusCode',
          name: intl('437182', '全部法律状态'),
          key: '',
          typeOf: 'string',
          width: 120,
        },
        {
          key4sel: 'agg_publicAnnouncementDate',
          key4ajax: 'publicAnnouncementDateRange',
          name: intl('437403', '全部公开公告日期'),
          key: '',
          typeOf: 'string',
          width: 140,
        },
      ],
    },
    {
      cmd: 'detail/company/getPatentInfo_holdCompanyV3',
      title: intl('451208', '控股企业'),
      moreLink: 'getpatent',
      modelNum: 'patent_num_kgqy',
      selName: ['patentCompanyType'],
      aggName: ['aggs_company_type'],
      thWidthRadio: ['5.2%', '25%', '10%', '12%', '12%', '12%', '15%', '12%'],
      thName: [
        intl('28846', '序号'),
        intl('138748', '专利名称'),
        intl('138430', '专利类型'),
        intl('149731', '公开公告号'),
        intl('138372', '法律状态'),
        intl('149732', '公开公告日'),
        intl('216390', '归属主体公司'),
        intl('332353', '关联关系类型'),
      ],
      align: [1, 0, 0, 0, 0, 0, 0, 0],
      fields: [
        'NO.',
        'patentName',
        'patentType|formatCont',
        'publicAnnouncementNumber',
        'lawStatus',
        'publicAnnouncementDate|formatTime',
        'corpName',
        'relativeType|relativeType',
      ],
      notVipPageTurning: true,
      notVipPageTitle: intl('138749', '专利'),
      notVipPagedesc: intl('224212', '购买VIP/SVIP套餐，即可不限次查看企业更多专利信息'),
      columns: [
        null,
        {
          render: (txt, row) => {
            const detailid = row['dataId']
            const type = row['patentType']
            const url = `index.html#/patentDetail?nosearch=1&detailId=${detailid}&type=${type}`
            return detailid ? <DetailLink url={url} txt={txt} /> : txt
          },
        },
        null,
        null,
        {
          title: (
            <span>
              {intl('138372', '法律状态')}

              {
                <Tooltip
                  overlayClassName="corp-tooltip"
                  title={
                    <div>
                      {intl(
                        '285417',
                        '专利的法律状态一般有五个阶段：受理、初审、公布、实质审查与授权。</br>初审通过后可以公布，后进入实际审查阶段，即实质审查生效，在该阶段对专利申请是否具有新颖性、创造性、实用性及专利法规定的其他实质性条件进行全面审查，审查通过则授予专利权，不符合则驳回。'
                      )}
                    </div>
                  }
                >
                  <InfoCircleButton />
                </Tooltip>
              }
            </span>
          ),
          render: (txt, _row, _idx) => {
            return wftCommon.formatTime(txt)
          },
        },
        null,
        {
          render: (_txt, row, _idx) => {
            const list = row.mainBodyInfoList
            if (!list || !list.length) return '--'
            if (list.map) {
              return list.map((t) => {
                return <CompanyLink name={t.patentMainBody} id={t.patentMainBodyId}></CompanyLink>
              })
            }
            return '--'
          },
        },
        {
          render: () => {
            return intl('451208', '控股企业')
          },
        },
      ],
      dataCallback: (res) => {
        return res.list && res.list.length ? res.list : []
      },
      downDocType: 'download/createtempfile/getPatentInfo_holdCompanyV3',
      extraParams: (param) => {
        return {
          ...param,
          __primaryKey: param.companycode,
        }
      },
      rightFilters: [
        {
          key4sel: 'agg_patentType',
          key4ajax: 'patentType',
          name: intl('297846', '全部专利类型'),
          key: '',
          typeOf: 'string',
          width: 120,
        },
        {
          key4sel: 'agg_lawStatusCode',
          key4ajax: 'lawStatusCode',
          name: intl('437182', '全部法律状态'),
          key: '',
          typeOf: 'string',
          width: 120,
        },
        {
          key4sel: 'agg_publicAnnouncementDate',
          key4ajax: 'publicAnnouncementDateRange',
          name: intl('437403', '全部公开公告日期'),
          key: '',
          typeOf: 'string',
          width: 140,
        },
      ],
    },
    {
      cmd: 'detail/company/getPatentInfo_outboundInvestmentV3',
      title: intl('138724', '对外投资'),
      moreLink: 'getpatent',
      modelNum: 'patent_num_dwtz',
      selName: ['patentCompanyType'],
      aggName: ['aggs_company_type'],
      thWidthRadio: ['5.2%', '25%', '10%', '12%', '12%', '12%', '15%', '12%'],
      thName: [
        intl('28846', '序号'),
        intl('138748', '专利名称'),
        intl('138430', '专利类型'),
        intl('149731', '公开公告号'),
        intl('138372', '法律状态'),
        intl('149732', '公开公告日'),
        intl('216390', '归属主体公司'),
        intl('332353', '关联关系类型'),
      ],
      align: [1, 0, 0, 0, 0, 0, 0, 0],
      fields: [
        'NO.',
        'patentName',
        'patentType|formatCont',
        'publicAnnouncementNumber',
        'lawStatus',
        'publicAnnouncementDate|formatTime',
        'corpName',
        'relativeType|relativeType',
      ],
      notVipPageTurning: true,
      notVipPageTitle: intl('138749', '专利'),
      notVipPagedesc: intl('224212', '购买VIP/SVIP套餐，即可不限次查看企业更多专利信息'),
      columns: [
        null,
        {
          render: (txt, row) => {
            const detailid = row['dataId']
            const type = row['patentType']
            const url = `index.html#/patentDetail?nosearch=1&detailId=${detailid}&type=${type}`
            return detailid ? <DetailLink url={url} txt={txt} /> : txt
          },
        },
        null,
        null,
        {
          title: (
            <span>
              {intl('138372', '法律状态')}
              {
                <Tooltip
                  overlayClassName="corp-tooltip"
                  title={
                    <div>
                      {intl(
                        '285417',
                        '专利的法律状态一般有五个阶段：受理、初审、公布、实质审查与授权。</br>初审通过后可以公布，后进入实际审查阶段，即实质审查生效，在该阶段对专利申请是否具有新颖性、创造性、实用性及专利法规定的其他实质性条件进行全面审查，审查通过则授予专利权，不符合则驳回。'
                      )}
                    </div>
                  }
                >
                  <InfoCircleButton />
                </Tooltip>
              }
            </span>
          ),
          render: (txt, _row, _idx) => {
            return wftCommon.formatTime(txt)
          },
        },
        null,
        {
          render: (_txt, row, _idx) => {
            const list = row.mainBodyInfoList
            if (!list || !list.length) return '--'
            if (list.map) {
              return list.map((t) => {
                return <CompanyLink name={t.patentMainBody} id={t.patentMainBodyId}></CompanyLink>
              })
            }
            return '--'
          },
        },
        {
          render: () => {
            return intl('138724', '对外投资')
          },
        },
      ],
      dataCallback: (res) => {
        return res.list && res.list.length ? res.list : []
      },
      downDocType: 'download/createtempfile/getPatentInfo_outboundInvestmentV3',
      extraParams: (param) => {
        return {
          ...param,
          __primaryKey: param.companycode,
        }
      },
      rightFilters: [
        {
          key4sel: 'agg_patentType',
          key4ajax: 'patentType',
          name: intl('297846', '全部专利类型'),
          key: '',
          typeOf: 'string',
          width: 120,
        },
        {
          key4sel: 'agg_lawStatusCode',
          key4ajax: 'lawStatusCode',
          name: intl('437182', '全部法律状态'),
          key: '',
          typeOf: 'string',
          width: 120,
        },
        {
          key4sel: 'agg_publicAnnouncementDate',
          key4ajax: 'publicAnnouncementDateRange',
          name: intl('437403', '全部公开公告日期'),
          key: '',
          typeOf: 'string',
          width: 140,
        },
      ],
    },
  ],
}
