import { Checkbox, Radio, Tag } from '@wind/wind-ui'
import React from 'react'
import { pointBuried } from '../../api/configApi'
import { useConditionFilterStore } from '../../store/cde/useConditionFilterStore'
import intl from '../../utils/intl'
import { MyIcon } from '../Icon'
import './OptionViewport.less'
import { CheckBoxGroupForOptionViewport } from './OptionViewPort/CheckBoxGroup'
import { useOptionViewportItemOption } from './OptionViewPort/hook'

/**
一个用于呈现选项视图的React组件。筛选结果页面中的左侧展示控件
@component
@param {object} props - 组件的属性。
@param {number} props.mode - 组件的模式，用于决定组件的呈现方式。
@param {string} props.title - 组件的标题。
@param {Array} props.value - 组件的值。
@param {string} props.logic - 组件的逻辑类型。
@param {object} props.info - 组件的额外信息。
@param {Function} props.changeFilterVisible - 一个用于改变过滤器可见性的函数。
@param {Function} props.changeFilter - 一个用于改变过滤器的函数。
@param {Function} props.detailFilter - 一个用于详细过滤的函数。
@returns {JSX.Element} 一个用于呈现选项视图的React组件。
*/
const OptionViewport = (props) => {
  console.log('🚀 ~ OptionViewport ~ props:', props)
  const { mode, title, value, logic, info = {}, changeFilterVisible, changeFilter, detailFilter, filter } = props

  // 叶子节点checkboxs全量list

  const options = {
    any: intl(257770, '含任一'),
    notAny: intl(257771, '不含'),
    all: intl(257777, '含所有'),
  }

  const { codeMap } = useConditionFilterStore()
  console.log('🚀 ~ OptionViewport ~ codeMap:', codeMap)
  // useEffect(() => {
  //   getFilterConfigList()
  // }, [])
  // 获取context

  const { itemOptions } = useOptionViewportItemOption(info, value)

  const onRadioChange = (value) => {
    let filter = props.filter
    // 单选
    filter.value = [value]
    // 有无数量型的关联选项
    // if (filter.info && filter.info.itemType === "5" && detailFilter) {
    //   detailFilter.value = [];
    // }

    if (props.info && props.info.itemType === '5' && detailFilter) {
      detailFilter.value = []
    }

    detailFilter ? changeFilter([filter, detailFilter]) : changeFilter([filter])
  }

  const deleteView = () => {
    let filter = props.filter
    filter.value = []
    pointBuried({
      action: '922604570164',
      params: [],
    })
    changeFilter([filter])
  }

  const tagClose = (ev, index) => {
    ev.preventDefault()
    let filter = props.filter
    filter.value.splice(index, 1)
    changeFilter([filter])
  }

  const logicChange = (e) => {
    let filter = props.filter
    filter.logic = e.target.value
    changeFilter([filter])
  }

  const confidenceChange = (e) => {
    let filter = props.filter
    filter.confidence = e.target.value
    changeFilter([filter])
  }

  return (
    <div className="option-viewport">
      <div className="title">
        <div className="title-left">
          <MyIcon name="delete" onClick={deleteView} /> {title}
          {info && info.isVip ? <MyIcon name="svip" className="svip" /> : null}
        </div>
        {filter?.confidence ? (
          <div className="title-right">
            <Radio.Group className="logic" name="city" defaultValue={filter?.confidence} onChange={confidenceChange}>
              {info.extraOptions.map((item, index) => {
                return (
                  <Radio.Button key={index} value={item.value}>
                    {item.label.split('：')[1]}
                  </Radio.Button>
                )
              })}
            </Radio.Group>
          </div>
        ) : null}
      </div>
      {mode === 1 ? (
        <>
          <div className="tagBox">{value}</div>
        </>
      ) : null}
      {mode === 2 ? (
        <>
          {!['range', 'equal', 'bool'].includes(logic) &&
            info.logicOption &&
            info.logicOption.split(',').length > 1 && (
              // @ts-expect-error
              <Radio.Group className="logic" onChange={logicChange} value={logic} optionType="button">
                {info &&
                  info.logicOption &&
                  info.logicOption.split(',').map((item, index) => {
                    return (
                      <Radio.Button key={index} value={item}>
                        {options[item]}
                      </Radio.Button>
                    )
                  })}
              </Radio.Group>
            )}

          {
            // 榜单名录
            (info.itemType === '9' || info.itemType === '91') && (
              <div className="tagBox" onClick={() => changeFilterVisible(info)}>
                {value.map((item, index) => {
                  return (
                    // @ts-expect-error ttt
                    <Tag closable={value.length > 1 ? true : false} key={index} onClose={(ev) => tagClose(ev, index)}>
                      <span className="tagTextSpan">{item.objectName}</span>
                    </Tag>
                  )
                })}
                <a onClick={() => changeFilterVisible(info)}> {intl('217745', '点击修改')} </a>
              </div>
            )
          }
          {(logic === 'prefix' ||
            logic === 'keyword' ||
            info.itemType <= 2 ||
            info.itemType === '6' ||
            info.itemType === '10' ||
            info.categoryType === '2') && (
            // @ts-expect-error ttt
            <div className="tagBox" onClick={(ev) => ev.stopPropagation() && changeFilterVisible(info)}>
              {value.map((item, index) => {
                return (
                  // @ts-expect-error ttt
                  <Tag closable={value.length > 1 ? true : false} key={index} onClose={(ev) => tagClose(ev, index)}>
                    <span
                      className="tagTextSpan"
                      title={
                        codeMap?.[info?.itemId]?.[item]
                          ? item === '0000' && info.itemId === 89
                            ? '全国'
                            : codeMap[info?.itemId][item]
                          : item
                      }
                    >
                      {codeMap?.[info?.itemId]
                        ? item === '0000' && info.itemId === 89
                          ? '全国'
                          : codeMap[info?.itemId][item]
                        : item}
                    </span>
                  </Tag>
                )
              })}
              <a onClick={() => changeFilterVisible(info)}> {intl('217745', '点击修改')}</a>
            </div>
          )}

          {/* 多选 */}
          {info.itemType === '3' && (
            <CheckBoxGroupForOptionViewport
              value={value}
              itemOptions={itemOptions}
              onChange={() => changeFilterVisible(info)}
            />
          )}
          {/* 单选 */}
          {info.itemType > 3 &&
            info.itemType !== '6' &&
            info.itemType !== '9' &&
            info.itemType !== '91' &&
            info.itemId !== 143 && (
              // @ts-expect-error
              <Checkbox.Group className="radio" value={value}>
                {itemOptions.map((item) => {
                  return (
                    item.value !== -1 && (
                      <Checkbox
                        value={item.value}
                        // @ts-expect-error
                        onClick={() => {
                          if (item.status === 2) {
                            changeFilterVisible(info)
                          } else {
                            onRadioChange(item.value)
                          }
                        }}
                      >
                        {item.label}
                      </Checkbox>
                    )
                  )
                })}
              </Checkbox.Group>
            )}
        </>
      ) : null}
    </div>
  )
}

export default OptionViewport
