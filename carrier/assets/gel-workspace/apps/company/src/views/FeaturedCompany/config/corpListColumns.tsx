import { Links } from '@/components/common/links'
import { getUrlByLinkModule, LinksModule } from '@/handle/link'
import { isTestSite } from '@/utils/env'
import { intl } from 'gel-util/intl'
import { getRimeOrganizationUrl, isFromRime } from 'gel-util/link'
import React from 'react'

export const getCorpListColumnsBase = (showOriginalName: boolean) => {
  return [
    {
      width: '76px',
      title: intl('30635', '排名'),
      dataIndex: 'rank',
      render: (txt) => {
        return txt || '--'
      },
    },

    {
      title: intl('437804', '排名对象'),
      dataIndex: 'rankItem',
      render: (txt) => {
        return txt || '--'
      },
    },
    {
      title: intl('138677', '企业名称'),
      dataIndex: showOriginalName ? 'originalCompName' : 'corpName',
      render: (txt, row) => {
        const id = String(row['corpId'])
        let link = ''
        if (isFromRime()) {
          link = getRimeOrganizationUrl({ id, isTestSite: isTestSite() })
        } else {
          link = getUrlByLinkModule(LinksModule.COMPANY, { id })
        }
        return <Links url={link} title={txt}></Links>
      },
    },
    {
      title: intl('32674', '地区'),
      dataIndex: 'province',
      render: (txt) => {
        return txt || '--'
      },
    },
    {
      title: intl('312254', '国民经济行业'),
      dataIndex: 'industryGb1',
      render: (txt) => {
        return txt || '--'
      },
    },
  ]
}

export const getCorpListColumnsBaseForPerson = () => {
  return [
    {
      width: '176px',
      title: intl('30635', '排名'),
      dataIndex: 'rank',
      // align:'center',
      render: (txt) => {
        return txt || '--'
      },
    },

    {
      title: intl('437804', '排名对象'),
      dataIndex: 'rankItem',
      render: (txt) => {
        return txt || '--'
      },
    },
  ]
}

export const getCorpListColumnsBaseForOversea = (showOriginalName: boolean) => {
  return [
    {
      width: '100px',
      title: intl('30635', '排名'),
      dataIndex: 'rank',
      // align:'center',
      render: (txt) => {
        return txt || '--'
      },
    },

    {
      title: intl('437804', '排名对象'),
      dataIndex: 'rankItem',
      render: (txt) => {
        return txt || '--'
      },
    },
    {
      title: intl('138677', '企业名称'),
      dataIndex: showOriginalName ? 'originalCompName' : 'corpName',
      render: (txt, row) => {
        const id = String(row['corpId'])
        let link = ''
        if (isFromRime()) {
          link = getRimeOrganizationUrl({ id, isTestSite: isTestSite() })
        } else {
          link = getUrlByLinkModule(LinksModule.COMPANY, { id })
        }
        return <Links url={link} title={txt}></Links>
      },
    },
    {
      title: intl('32674', '地区'),
      dataIndex: 'province',
      render: (txt) => {
        return txt || '--'
      },
    },
  ]
}
