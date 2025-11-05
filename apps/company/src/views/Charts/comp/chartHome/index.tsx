import React from 'react'
import { Layout } from '@wind/wind-ui'
import intl from '@/utils/intl'
import atlasCglj from '@/assets/imgs/atlas_cglj.png'
import atlasCgx from '@/assets/imgs/atlas_cgx.png'
import atlasDdycd from '@/assets/imgs/atlas_ddycd.png'
import atlasDwtz from '@/assets/imgs/atlas_dwtz.png'
import atlasGlftp from '@/assets/imgs/atlas_glftp.png'
import atlasGqct from '@/assets/imgs/atlas_gqct.png'
import atlasJztp from '@/assets/imgs/atlas_jztp.png'
import atlasQytp from '@/assets/imgs/atlas_qytp.png'
import atlasRzlc from '@/assets/imgs/atlas_rzlc.png'
import atlasRztp from '@/assets/imgs/atlas_rztp.png'
import atlasYsgx from '@/assets/imgs/atlas_ysgx.png'
import atlasYsskr from '@/assets/imgs/atlas_ysskr.png'
import atlasZzsyr from '@/assets/imgs/atlas_zzsyr.png'
import { atlasTreeData } from '../chartMenu/altasMenus'
import './index.less'

const { Content } = Layout

// 图片映射关系
const imgMap = {
  chart_gqct: atlasGqct, // 股权穿透图
  chart_newtzct: atlasDwtz, // 对外投资图
  chart_yskzr: atlasYsskr, // 实控人图谱
  chart_qysyr: atlasZzsyr, // 受益人图谱
  chart_glgx: atlasGlftp, // 关联方图谱
  chart_qytp: atlasQytp, // 企业图谱
  chart_ysgx: atlasYsgx, // 疑似关系
  chart_jztp: atlasJztp, // 竞争图谱
  chart_rztp: atlasRztp, // 融资图谱
  chart_rzlc: atlasRzlc, // 融资历程
  chart_cgx: atlasCgx, // 查关系
  chart_ddycd: atlasDdycd, // 多对一触达
  chart_cglj: atlasCglj, // 持股路径
}

/**
 * @description 新版图谱平台首页
 * @param {Function} onSelectMenu 选中菜单回调
 */
const ChartHome = ({ onSelectMenu, onBuildGraph }) => {
  const jumpPage = (item) => {
    if (item.externalLink) {
      window.open(item.externalLink)
      return
    }

    if (item.children?.length > 0) {
      // 如果有子菜单，选择第一个子菜单
      onSelectMenu?.(item.children[0].key)
    } else {
      onSelectMenu?.(item.key)
    }
  }

  return (
    // @ts-ignore
    <Content className="chart-home-content">
      <div className="ap-header">
        <div className="ap-header-left">
          <p className="title">{intl('365067', '企业图谱平台')}</p>
          <p>{intl('367255', '一个深度洞察企业股权关系、关联关系的智能可视化平台')}</p>
          <p>{intl('367273', '适用于企业尽调、营销获客、风险监控等多场景')}</p>
        </div>
      </div>
      <div className="ap-content">
        {atlasTreeData.map((item) => {
          return (
            item.key !== 'atlasplatform' && (
              <div className="ap-card" key={item.key}>
                <p className="ap-card-title">{item.title}</p>
                <ul>
                  {item.children.map((childItem) => {
                    return (
                      <li onClick={() => jumpPage(childItem)} key={childItem.key}>
                        <p>{childItem.title}</p>
                        <img src={imgMap[childItem.key]} alt={childItem.title} />
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          )
        })}
      </div>
    </Content>
  )
}

export default ChartHome
