import { Tag } from 'antd'
import './OptionViewport.less'
import { MyIcon } from '../Icon'
import { pointBuried } from '../../api/configApi'

// 筛选结果页面中的左侧展示控件
const OptionViewport2 = (props) => {
  const { mode, title, value, logic, info = {}, changeFilterVisible, changeGeoFilter, detailFilter, geoFilter } = props
  // console.log(geoFilter);
  let geoGroup = {}
  geoFilter.forEach((item, index) => {
    if (item.id) {
      // 我的地盘
      geoGroup.territory = geoGroup.territory || []
      geoGroup.territory.push({
        ...item,
        index, // 方便删除
      })
    } else {
      // 我的定位
      geoGroup.location = geoGroup.location || []
      geoGroup.location.push({
        ...item,
        index, // 方便删除
      })
    }
  })
  // console.log(geoGroup)

  const deleteView = (type) => {
    let _geoFilter = []
    geoFilter.forEach((geo) => {
      if (type === 1) {
        geo.id && _geoFilter.push(geo)
      } else {
        !geo.id && _geoFilter.push(geo)
      }
    })
    pointBuried({
      action: '922604570164',
      params: [],
    })
    changeGeoFilter(_geoFilter)
  }

  const tagClose = (e, item) => {
    e.preventDefault()
    geoFilter.splice(item.index, 1)
    changeGeoFilter(geoFilter)
  }

  //   const { t } = useTranslation();
  const t = window.intl

  return (
    <>
      {geoGroup.location && (
        <div className="option-viewport">
          <div className="title">
            <MyIcon name="delete" onClick={() => deleteView(1)} data-uc-id="GbhpqHSNJ" data-uc-ct="myicon" /> 我的定位
          </div>
          <div className="tagBox">
            {geoGroup.location.map((item, index) => {
              return (
                <Tag
                  className="geo"
                  key={index}
                  closable={geoGroup.location.length > 1 ? true : false}
                  onClose={(e) => tagClose(e, item)}
                  data-uc-id="2J8NgekwW9"
                  data-uc-ct="tag"
                  data-uc-x={index}
                >
                  <span className="tagTextSpan" title={item.territoryName}>
                    {item.territoryName}
                  </span>
                </Tag>
              )
            })}
          </div>
        </div>
      )}
      {geoGroup.territory && (
        <div className="option-viewport">
          <div className="title">
            <MyIcon name="delete" onClick={() => deleteView(2)} data-uc-id="HIRuUHMgqX" data-uc-ct="myicon" />{' '}
            {t(257695)}
          </div>
          <div className="tagBox">
            {geoGroup.territory &&
              geoGroup.territory.map((item, index) => {
                return (
                  <Tag
                    className="geo"
                    key={index}
                    closable={geoGroup.territory.length > 1 ? true : false}
                    onClose={(e) => tagClose(e, item)}
                    data-uc-id="OQrT_UiIqD"
                    data-uc-ct="tag"
                    data-uc-x={index}
                  >
                    <span className="tagTextSpan" title={item.territoryName}>
                      {item.territoryName}
                    </span>
                  </Tag>
                )
              })}
          </div>
        </div>
      )}
    </>
  )
}

export default OptionViewport2
