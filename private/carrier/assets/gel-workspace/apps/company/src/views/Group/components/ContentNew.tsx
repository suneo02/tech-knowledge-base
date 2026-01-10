/**
 * 展示详情页 可搭配快捷导航栏使用
 * Created by Calvin
 *
 * @format
 */
import * as globalActions from '@/actions/global'
import CardHeader from '@/components/common/card/header/Header'
import { ConfigDetailContext } from '@/components/layout/ctx'
import { VipPurchase } from '@/components/user'
import { getVipInfo } from '@/lib/utils'
import { useGroupStore } from '@/store/group'
import store from '@/store/store'
import { ICfgDetailSubMenu } from '@/types/configDetail/module.ts'
import intl from '@/utils/intl'
import { Card, Link, Skeleton } from '@wind/wind-ui'
import { isArray, isNil } from 'lodash'
import React, { forwardRef, useEffect, useState } from 'react'
import VipAccess from '../../../components/developer/VipAccess'
import { Menu } from '../../../components/layout/container/Integration'
import { TreeModuleName } from '../../../store/group'
import BasicInfo from './BasicInfo'
import './contentNew.less'

const GroupContentNew = forwardRef<HTMLDivElement, undefined>((_, contentRef) => {
  const treeData = useGroupStore((store) => store.treeData)
  const module = useGroupStore((store) => store.module)
  const userVipInfo = getVipInfo()
  const [vipState, setVipState] = useState([])
  useEffect(() => {
    const arr = []
    if (userVipInfo?.isVip) arr.push('vip')
    if (userVipInfo?.isSvip) arr.push('svip')
    setVipState(arr)
  }, [userVipInfo?.isVip, userVipInfo?.isSvip])

  const checkHidden = (info) => {
    return (!info.num || info.num === '0') && info.enableHidden
  }

  const renderChild = (node: ICfgDetailSubMenu) => {
    const checkVip =
      (node.isSvip && !vipState.includes('svip')) ||
      (node.isVip && !(vipState.includes('vip') || vipState.includes('svip')))
    if (node.display === false) {
      return null
    }
    return (
      <div id={node.key} key={node.key} className="node-item-children">
        {checkVip ? (
          <Card title={<CardHeader {...node} />} styleType="block">
            <VipPurchase
              title={node.title}
              vipPopupSel={node.isSvip ? 'svip' : 'vip'}
              onlySvip={node.isSvip}
              data-uc-id="W5sc8BVzp2n"
              data-uc-ct="vipcomponent"
            />
          </Card>
        ) : checkHidden(node) ? null : (
          // @ts-expect-error
          <Menu {...node} />
        )}
      </div>
    )
  }

  const showModal = () => {
    store.dispatch(
      globalActions.setGolbalModal({
        className: 'disclaimerModal',
        width: 445,
        height: 680,
        visible: true,
        onCancel: () => store.dispatch(globalActions.clearGolbalModal()),
        title: intl('23348', '免责声明'),
        content: (
          <React.Suspense fallback={<div></div>}>
            <p>
              {intl(
                391696,
                '企业库所有数据来源于公开渠道和第三方提供，万得尊重并倡导保护知识产权，本产品所引用数据及其他信息仅作参考，不代表万得赞同或证实其描述。如对该数据服务存在异议，或发现违法及不良信息，请拨打电话400-820-9463或发送邮件至GelSupport@wind.com.cn，我们将及时处理。'
              )}
            </p>
            <br />
            <p>{intl('437429', '数据来源说明') + (window.en_access_config ? ':' : '：')}</p>
            <p>
              {(window.en_access_config ? '(1)' : '（1）') +
                intl('416890', '基本信息：国家企业信用信息公示系统、全国建筑市场监管公共服务平台等。')}
            </p>
            <p>
              {(window.en_access_config ? '(2)' : '（2）') +
                intl(
                  '416891',
                  '法律诉讼：国家企业信用信息公示系统、中国裁判文书网、中国执行信息公开网、中华人民共和国最高人民法院、人民法院公告网、中国庭审公开网、各地方人民法院等。'
                )}
            </p>
            <p>
              {(window.en_access_config ? '(3)' : '（3）') +
                intl(
                  '416892',
                  '经营风险：国家企业信用信息公示系统、国家税务总局、中国执行信息公开网、人民法院诉讼资产网、中国土地市场网、各省份税务局、各地市级环保局等。'
                )}
            </p>
            <p>
              {(window.en_access_config ? '(4)' : '（4）') +
                intl(
                  '416933',
                  '经营信息：国家信用信息公示系统、巨潮资讯网、中国土地市场网、全国公共资源交易服务平台、中华人民共和国工业和信息化部网站、中国海关企业进出口信用信息管理平台、中国政府采购网、中国招标投标公共服务平台等。'
                )}
            </p>
            <p>
              {(window.en_access_config ? '(5)' : '（5）') +
                intl(
                  '416953',
                  '知识产权：国家工商行政管理总局商标局、中华人民共和国国家知识产权局、中国版权登记门户网、中华人民共和国工业和信息化部网站、中国药监局官网、全国建筑市场监管公共服务平台、中国银保监会官网等。'
                )}
            </p>
            <p>
              {(window.en_access_config ? '(6)' : '（6）') +
                intl(
                  '416934',
                  '历史信息：各官方网站，包括全国企业信用信息公示系统、中华人民共和国最高人民法院全国法院、国家知识产权局官方网站、国家工商行政管理总局商标局官网、国家版权局官方网站，为我司保存的官方网站历史记录，因参考、使用该信息造成的损失，万得征信不承担任何责任。'
                )}
            </p>
          </React.Suspense>
        ),
        footer: [],
      })
    )
  }

  return (
    <ConfigDetailContext.Provider value={'group'}>
      <div className="content" ref={contentRef}>
        <VipAccess value={vipState} setValue={setVipState} />
        <div>
          <BasicInfo />
          {treeData?.length ? (
            treeData.map((res) => {
              // 非数组 或者 无children 或者 每个 child 都不展示
              if (
                isNil(res) ||
                !isArray(res.children) ||
                res.children.length === 0 ||
                res.children.every((node) => node.disabled)
              )
                return null
              return (
                <div className="node-item" key={res.key} id={res.key}>
                  <Card title={<CardHeader {...res} />}>
                    {res.children?.length ? res.children.map((node) => !node.disabled && renderChild(node)) : null}
                  </Card>
                </div>
              )
            })
          ) : (
            <div className="empty-container">
              <Skeleton loading animation></Skeleton>
            </div>
          )}
          <div className="footer-container">
            {module === TreeModuleName.Group
              ? intl(
                  '437735',
                  '免责声明：企业库所有数据来源于公开渠道和第三方提供，万得尊重并倡导保护知识产权，本产品所引用数据及其他信息仅作参考，不代表万得赞同或证实其描述。如对该数据服务存在异议，或发现违法及不良信息，请拨打电话400-820-9463或发送邮件至GelSupport@wind.com.cn，我们将及时处理。'
                )
              : '免责声明：人物相关数据主要根据人名进行匹配，可能存在同名同姓匹配不精准问题，展示结果仅供参考，该成果并不代表万得的任何明示、暗示之观点或保证。企业库所有数据来源于公开渠道和第三方提供，万得尊重并倡导保护知识产权，本产品所引用数据及其他信息仅作参考，不代表万得赞同或证实其描述。如对该数据服务存在异议，或发现违法及不良信息，请拨打电话400-820-9463或发送邮件至GelSupport@wind.com.cn，我们将及时处理。'}
            {/*@ts-expect-error ttt*/}
            <Link onClick={showModal} underline data-uc-id="vjEi4nGcTO2" data-uc-ct="link">
              {intl('437429', '数据来源说明')}
            </Link>
          </div>
        </div>
      </div>
    </ConfigDetailContext.Provider>
  )
})

GroupContentNew.displayName = 'GroupContent'
export default GroupContentNew
