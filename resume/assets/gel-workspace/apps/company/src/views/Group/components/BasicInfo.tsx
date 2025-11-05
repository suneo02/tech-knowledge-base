import TextExpandable from '@/components/common/expandable/textExpandable/TextExpandable'
import Links from '@/components/common/links/Links'
import { TagSafe } from '@/components/windUISafe'
import { LinksModule } from '@/handle/link'
import intl from '@/utils/intl'
import { Card, Col, Row, Skeleton } from '@wind/wind-ui'
import { isArray } from 'lodash'
import React from 'react'
import default_company from '../../../assets/imgs/default_company.png'
import { TreeModuleName, useGroupStore } from '../../../store/group'
import { intlNoIndex } from '../../../utils/intl'
import { wftCommon } from '../../../utils/utils'
import './basicInfo.less'

const GroupInfo = ({ basicInfo }) => {
  if (!basicInfo?.groupSystemName) {
    return <Skeleton animation />
  }

  const GroupTag = () => {
    if (!isArray(basicInfo?.coreMainCompanyTagList) || basicInfo.coreMainCompanyTagList.length <= 0) {
      return null
    }
    return (
      <span>
        {basicInfo.coreMainCompanyTagList.join().indexOf('国有') > -1 ? (
          <TagSafe size="small" style={{ marginBlockEnd: 4 }} color="color-2" type="primary">
            {intl('33052', '国有')}
          </TagSafe>
        ) : basicInfo.coreMainCompanyTagList.join().indexOf('民营') > -1 ? (
          <TagSafe size="small" style={{ marginBlockEnd: 4 }} color="color-2" type="primary">
            {intl('152722', '民营')}
          </TagSafe>
        ) : null}
      </span>
    )
  }
  return (
    <Card className="basic-info-container">
      <div className="card-content" style={{ width: '100%' }}>
        <div className="img-container">
          <img
            src={basicInfo.groupLogUrl}
            alt=""
            onError={(e) => {
              // @ts-expect-error ttt
              e.target.src = default_company
            }}
          />
        </div>

        <div style={{ width: '100%' }}>
          <div className="title">
            {basicInfo?.groupSystemName}
            <GroupTag />
          </div>
          <Row gutter={[6, 6]}>
            <Col span={12}>
              <label htmlFor="">{intlNoIndex('216412', '核心主体公司')}：</label>
              <Links
                title={basicInfo.coreMainCompanyName}
                module={LinksModule.COMPANY}
                id={basicInfo.coreMainCompanyCode}
              ></Links>
            </Col>
            <Col span={12}>
              <label htmlFor="">{intlNoIndex('224506', '集团企业数量')}：</label>
              {wftCommon.formatMoneyComma(basicInfo.groupCompanyNum)}
            </Col>
            <Col span={12}>
              <label htmlFor="">{intlNoIndex('13270', '实际控制人')}：</label>
              <Links
                module={basicInfo?.actualControllerType === '1' ? LinksModule.CHARACTER : LinksModule.COMPANY}
                id={basicInfo.actualControllerCode}
                title={basicInfo.actualController}
              />
            </Col>
            <Col span={12}>
              <label htmlFor="">{intlNoIndex('437714', '集团员工数量')}：</label>
              {wftCommon.formatMoneyComma(basicInfo.groupEmployeeNum)}
            </Col>
            <Col span={24}>
              <label htmlFor="">{intlNoIndex('260613', '核心主体公司地址')}：</label>
              <Links
                title={basicInfo.coreMainCompanyAddress || '--'}
                url={`https://GOVWebSite/govmap/index.html?mode=2&pureMode&title=万寻地图&right=4C203DE15&group=${basicInfo.groupSystemName}`}
              ></Links>
            </Col>
          </Row>
        </div>
      </div>
    </Card>
  )
}

const CharacterInfo = ({ basicInfo }) => {
  const ifOversea = wftCommon.is_overseas_config
  const personIntroduce = `${intl('420005', '人物简介')}${window.en_access_config ? ': ' : '：'}${basicInfo.personIntroduce || '--'}`
  return (
    <Card className="basic-info-container">
      <div className="card-content">
        <div>
          <div className="title">{basicInfo.personName}</div>
          {/* 海外用户不显示人物简介 */}
          {!ifOversea && <TextExpandable content={personIntroduce} maxLines={3} />}
        </div>
      </div>
    </Card>
  )
}

const BasicInfo = () => {
  const basicInfo = useGroupStore((state) => state.basicInfo)
  const module = useGroupStore((state) => state.module)
  const renderBasicInfo = () => {
    switch (module) {
      case TreeModuleName.Group:
        return <GroupInfo basicInfo={basicInfo} />
      case TreeModuleName.Character:
        return <CharacterInfo basicInfo={basicInfo} />
      default:
        return null
    }
  }
  return renderBasicInfo()
}

export default BasicInfo
