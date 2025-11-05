import CompanyLink from '@/components/company/CompanyLink.tsx'
import { ICorpSubModuleVipCfg } from '@/components/company/type'
import { InfoCircleButton } from '@/components/icons/InfoCircle'
import intl from '@/utils/intl'
import { wftCommon } from '@/utils/utils.tsx'
import { Tooltip } from '@wind/wind-ui'
import React from 'react'
import { vipDescDefault } from '../common/vipDesc'
import { DetailLink } from '../components'

export const CompanyHistoryPatentCfg: ICorpSubModuleVipCfg = {
  cmd: 'detail/company/historyPatent',
  downDocType: 'download/createtempfile/historyPatent', // 导出暂时关闭 待后端升级后上线
  title: intl('390634', '历史专利'),
  notVipTitle: intl('390634', '历史专利'),
  notVipTips: vipDescDefault,
  modelNum: 'hisPatentNum',
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
  notVipPageTitle: intl('390634', '历史专利'),
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
      render: (txt) => {
        return wftCommon.formatTime(txt)
      },
    },
    null,
    {
      render: (_txt, row) => {
        const list = row.mainBodyInfoList
        if (!list || !list.length) return '--'
        if (list.map) {
          return list.map((t, idx) => {
            return (
              <CompanyLink key={t.patentMainBodyId + idx} name={t.patentMainBody} id={t.patentMainBodyId}></CompanyLink>
            )
          })
        }
        return '--'
      },
    },
    null,
  ],
  extraParams: (param) => {
    return {
      ...param,
      __primaryKey: param.companycode,
    }
  },
}
