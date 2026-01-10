import React, { useEffect, useRef, useState } from 'react'
import { ConditionItem } from '.'
import { Input, message } from '@wind/wind-ui'
import { useConditionFilterStore } from '../../../../store/cde/useConditionFilterStore'
import ConditionTitle from '../filterOptions/ConditionTitle'
import { getRankAndlist, getBFYQ, getBFSD } from '../../../../api/findCustomer'
import closeImg from '../../../../assets/imgs/closeIcon.png'
import styled from 'styled-components'
import intl from '../../../../utils/intl'
import LogicOption from '../filterOptions/LogicOption'
import DatePickerOption from '../filterOptions/DatePickerOption'
import SingleOption from '../filterOptions/SingleOption'

const { Search } = Input

// 名录筛选认证年份 前端先定死 后续由接口提供
const CreditYearConfig = {
  108020113: [2013, 2014, 2015, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
  108020136: [2021, 2023],
  108020137: [2019, 2020],
  108020138: [2023],
  108020117: [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
  108020115: [2009, 2014, 2015, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
  108020112: [2010, 2011, 2018, 2019, 2020, 2021, 2023, 2024],
  108020109: [2008, 2009, 2011],
  108020110: [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023],
  '108020097,108020098,108020099': [2016, 2017, 2019, 2020, 202, 2022, 2023, 2024],
}

const InputWithSearch = ({ item }) => {
  const { isVip, itemName, logicOption, itemId, itemType, itemOption, hoverHint } = item
  const isCorpLists = itemType === '91' || itemType === 91 ? true : false

  const { updateFilters, getFilterById } = useConditionFilterStore()
  let filter = getFilterById(itemId) // 寻找是否存在filter

  const [inputVal, setInputVal] = useState('')
  const [searchList, setSearchList] = useState([])

  const SearchRef = useRef()
  let initList = []
  let initObj = {}
  let widthAuto = item.widthAuto ? item.widthAuto : false

  if (filter) {
    if (filter.value && filter.value.length) {
      filter.value.map((t) => {
        initObj[t.objectId] = t
        initList.push(t.objectId)
      })
    } else if (filter.search && filter.search.length) {
      filter.search.map((t) => {
        initObj[t.objectId] = t
        initList.push(t.objectId)
      })
    }
  }

  const [selectList, setSelectlist] = useState(initList)
  const [selectObj, setSelectObj] = useState(initObj)

  const [searchListCopy, setSearchListCopy] = useState([])
  const [empty, setEmpty] = useState(false)

  const [logic, setLogic] = useState(filter?.logic ? filter.logic : 'any')

  const [corpListShow, setCorpListShow] = useState(false)

  let inputLock = null

  if (item.itemField == 'park_id' || item.itemField == 'track_id' || isCorpLists) {
    widthAuto = true
  }

  useEffect(() => {
    if (!filter) {
      setSelectlist([])
    }
    if (filter?.search) {
      setSelectlist(filter.search.map((t) => t.objectId))
    }
  }, [filter])

  useEffect(() => {
    if (isCorpLists) {
      const list = []
      itemOption &&
        itemOption.length &&
        itemOption.map((t) => {
          list.push({
            objectName: t.name,
            objectId: t.id,
            ...t,
          })
        })
      list.length && setSearchList(list)
    }
  }, [isCorpLists])

  useEffect(() => {
    if (!inputVal) {
      if (isCorpLists) {
        const list = [...itemOption]
        const newList = []
        list.map((t) => {
          newList.push({
            objectName: t.name,
            objectId: t.id,
            ...t,
          })
        })
        setSearchList(newList)
      }
      return
    }

    setEmpty(false)

    if (isCorpLists) {
      const list = [...itemOption]
      const newList = []
      list.map((t) => {
        const reg = new RegExp(inputVal, 'gi')
        if (reg.test(t.name)) {
          newList.push({
            objectName: t.name,
            objectId: t.id,
            ...t,
          })
        }
      })
      setSearchList(newList)
      return
    }

    if (item.itemField == 'park_id') {
      getBFYQ(inputVal).then((res) => {
        if (res.resultCode == '200' && res.resultData && res.resultData.dataList && res.resultData.dataList.length) {
          let list = []
          res.resultData.dataList.map((t) => {
            list.push({
              objectId: t.parkId,
              objectName: t.parkName.replace(/<em>|<\/em>/g, ''),
            })
          })
          setSearchList(list)
        } else {
          setSearchList([])
          setEmpty(true)
        }
      })
    } else if (item.itemField == 'track_id') {
      getBFSD(inputVal).then((res) => {
        if (res.resultCode == '200' && res.resultData && res.resultData.length) {
          let list = []
          res.resultData.map((t) => {
            list.push({
              objectId: t.code,
              objectName: t.name.replace(/<em>|<\/em>/g, ''),
            })
          })
          setSearchList(list)
        } else {
          setSearchList([])
          setEmpty(true)
        }
      })
    } else {
      getRankAndlist({ keyword: inputVal }).then((res) => {
        if (res.code == '0' && res.data && res.data.length) {
          let list = []
          res.data.map((t) => {
            list.push({
              objectId: t.objectId,
              objectName: t.objectName.replace(/<em>|<\/em>/g, ''),
            })
          })
          setSearchList(list)
        } else {
          setSearchList([])
          setEmpty(true)
        }
      })
    }
  }, [inputVal])

  const onChangeCallback = (value) => {
    console.log(value)
    updateFilters({
      filter: item,
      value,
      logic: logicOption,
    })
  }

  const onChange = (e) => {
    if (!searchList.length && searchListCopy.length) {
      setSearchList(searchListCopy)
    }
    setCorpListShow(true)
    const value = e.target.value.trim()
    inputLock && clearTimeout(inputLock)
    inputLock = setTimeout(function lockfn() {
      console.log(value)
      setInputVal(value)
    }, 300)
  }

  const selectClick = (t) => {
    if (selectList.length >= 5) {
      message.warn('上限5条，请删除其他后重试')
      return
    }

    if (!t.validDate && t.certYear) {
      t.selfDefine = 0
      t.itemOption = []
      if (CreditYearConfig[t.id]) {
        CreditYearConfig[t.id].map((tt) => {
          t.itemOption.push({
            name: tt,
            value: tt,
          })
        })
      }
    }

    if (!selectObj[t.objectId]) {
      selectObj[t.objectId] = t
      setSelectObj(selectObj)
    }
    let labels = []
    if (selectList.indexOf(t.objectId) == -1) {
      selectList.push(t.objectId)
    }
    selectList.map((t) => {
      labels.push(selectObj[t])
    })
    setSelectlist(selectList)
    onChangeCallback(labels)
  }

  const delSelect = (t, idx) => {
    const list = [...selectList]
    console.log(t)
    console.log(idx)
    list.splice(idx, 1)
    setSelectlist(list)
    const labels = []
    list.map((t) => {
      labels.push(selectObj[t])
    })
    onChangeCallback(labels)
  }

  // logic变化
  const changeOptionCallback = (logic) => {
    setLogic(logic)
    if (filter) {
      updateFilters({
        filter: item,
        logic,
        value: filter.value,
      })
    }
  }

  const customDateChange = (val, selItem) => {
    selItem.objectDate = val
    filter.value = filter.value || []
    filter.value.map((t) => {
      if (t.objectId == selItem.objectId) {
        t.objectDate = selItem.objectDate
      }
    })
    updateFilters({
      filter: item,
      logic,
      value: filter.value,
    })
  }

  const customYearChange = (val, selItem) => {
    selItem.objectYear = val[0] || ''
    filter.value = filter.value || []
    filter.value.map((t) => {
      if (t.objectId == selItem.objectId) {
        t.objectYear = selItem.objectYear
      }
    })
    updateFilters({
      filter: item,
      logic,
      value: filter.value,
    })
  }

  return (
    <ConditionItem>
      <ConditionTitle filter={filter} isVip={isVip} itemName={itemName} hoverHint={hoverHint} />
      {isCorpLists ? (
        <LogicOption
          defaultOption={logic}
          changeOptionCallback={changeOptionCallback}
          data-uc-id="fvkd0T-Bi7"
          data-uc-ct="logicoption"
        />
      ) : null}
      <Box
        style={{ maxWidth: widthAuto ? 'auto' : '320px', marginTop: '5px' }}
        onClick={(e) => {}}
        data-uc-id="wqW5mNsp6h"
        data-uc-ct="box"
      >
        {selectList.length ? (
          <div className={isCorpLists ? 'select-corplist-cont' : 'select-div'}>
            {selectList.map((t, i) => {
              if (!isCorpLists) {
                // 榜单搜索
                return (
                  <span className="select-span" key={i}>
                    {selectObj[t].objectName}
                    <img onClick={() => delSelect(t, i)} src={closeImg} data-uc-id="IMo5U3zgs-" data-uc-ct="img" />
                  </span>
                )
              }
              // 名录下拉选择
              return (
                <div className="select-corplist-div">
                  <span className="select-span select-corplist-span" key={i}>
                    {selectObj[t].objectName}
                    <img onClick={() => delSelect(t, i)} src={closeImg} data-uc-id="rDrMsWpR4d" data-uc-ct="img" />
                  </span>
                  {isCorpLists && selectObj[t].validDate ? (
                    <div className="select-corplist-option">
                      <div>{intl('21235', '有效期')}：</div>
                      <DatePickerOption
                        value={selectObj[t].objectDate}
                        changeOptionCallback={(date, dateString) => {
                          console.log('🚀 ~ {selectList.map ~ val,dateString:', date, dateString)
                          let value = date?.map((i) => i?.format('YYYYMMDD')).join('-')
                          customDateChange(value, selectObj[t])
                        }}
                        data-uc-id="qesRTHJorr"
                        data-uc-ct="datepickeroption"
                      />
                    </div>
                  ) : null}
                  {isCorpLists &&
                  !selectObj[t].validDate &&
                  selectObj[t].certYear &&
                  selectObj[t].itemOption &&
                  selectObj[t].itemOption.length ? (
                    <div className="select-corplist-option">
                      <div>{intl('478597', '认证年度')}：</div>
                      <SingleOption
                        itemOption={selectObj[t].itemOption}
                        info={selectObj[t]}
                        defaultValue={selectObj[t].objectYear ? selectObj[t].objectYear : ''}
                        changeOptionCallback={(val) => {
                          customYearChange(val, selectObj[t])
                        }}
                        data-uc-id="zOXrUx60mA"
                        data-uc-ct="singleoption"
                      />
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        ) : (
          ''
        )}
        <Search
          size="large"
          ref={SearchRef}
          defaultValue={inputVal}
          placeholder={widthAuto ? intl(297900, '请输入关键词') : intl('437751', '请输入榜单名称')}
          onFocus={onChange}
          onChange={onChange}
          onBlur={(e) => {
            setTimeout(() => {
              let listCopy = []
              searchList.map((t) => {
                listCopy.push(t)
              })
              setSearchListCopy(listCopy)
              setSearchList([])
              setCorpListShow(false)
            }, 200)
            setEmpty(false)
          }}
          data-uc-id="F2BL9yz4nl"
          data-uc-ct="search"
        />

        {(inputVal && searchList.length) || (isCorpLists && corpListShow) ? (
          <div className="input-div">
            {' '}
            {searchList.map((t) => {
              return (
                <span
                  className="input-span"
                  dataCode={t.objectId}
                  onClick={(e) => {
                    selectClick(t)
                    if (SearchRef.current?.input?.state?.value) {
                      SearchRef.current.input.state.value = ''
                    }
                  }}
                  data-uc-id="dPXeDGOeyQ"
                  data-uc-ct="span"
                >
                  {' '}
                  {t.objectName}{' '}
                </span>
              )
            })}{' '}
          </div>
        ) : empty ? (
          <div className="input-div">
            {' '}
            {
              <span className="input-span" style={{ color: '#999' }}>
                {' '}
                {intl('312173', '请更换关键词进行搜索')}{' '}
              </span>
            }{' '}
          </div>
        ) : (
          ''
        )}
      </Box>
    </ConditionItem>
  )
}

const Box = styled.div`
  .input-div {
    border: solid 1px #ccc;
    border-top: none;
  }
  .input-span {
    display: block;
    width: 100%;
    padding-left: 8px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    cursor: pointer;
    line-height: 28px;
    border-bottom: #f4f4f4 1px solid;
    &:hover {
      background: #f4f4f4;
    }
  }
  .select-div {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
  }
  .select-corplist-div {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    margin-bottom: 5px;
    margin-top: 5px;
  }
  .select-span {
    padding: 0 4px;
    line-height: 20px;
    font-size: 13px;
    color: #333;
    background-color: #f8f8f8;
    border-radius: 2px;
    border: 1px solid #e3e3e3;
    margin-right: 12px;
    position: relative;
    display: flex;
    margin-bottom: 5px;

    &:hover {
      background-color: #e3f2fd;
    }
    img {
      width: 8px;
      height: 8px;
      margin-top: 6px;
      margin-left: 8px;
      cursor: pointer;
    }
  }
  .select-corplist-span {
    line-height: 30px;
    margin-bottom: 0;
    font-size: 13px;
    img {
      margin-top: 10px;
    }
  }
  .select-corplist-option {
    display: flex;
    flex-wrap: wrap;
    line-height: 32px;
  }
  .input-div {
    max-height: 180px;
    overflow-y: scroll;
  }
`

export default InputWithSearch
