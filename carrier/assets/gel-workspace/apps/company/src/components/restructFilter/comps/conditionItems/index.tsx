import styled from 'styled-components'
import CheckBoxOfCustom from './CheckBoxOfCustom'
import CityOrIndusty from './CityOrIndustry'
import HasOrNotItem from './HasOrNotItem'
import InputKeys from './InputKeys'
import InputKeysOfLogic from './InputKeysOfLogic'
import InputWithSearch from './InputWithSearch'
import NumberRange from './NumberRange'
import SingleOfCustom from './SingleOfCustom'

// 动态创建组件配置，确保在高版本浏览器中也能正常使用
// Dynamic component loader with fallback for browser compatibility
const createFilterItemTypeConfig = () => {
  const config = {
    0: CityOrIndusty, // 类型0为地区或城市
    1: InputKeysOfLogic, // 类型1为输入关键词包括了三个逻辑
    2: InputKeys, // 类型2为输入关键词
    3: CheckBoxOfCustom, // 类型3为复选框,可以自定义
    4: SingleOfCustom, // 类型4为单选框,可以自定义
    5: HasOrNotItem, // 类型5为有无
    6: NumberRange, // 类型6为数量范围
    9: InputWithSearch, // 榜单名录搜索框
    10: CityOrIndusty, // 类型10为置信度选择器
    91: InputWithSearch, // 名录控件
  }

  return config
}

// 导出动态创建的配置
export const filterItemTypeConfig = createFilterItemTypeConfig()

export const ConditionItem = styled.div`
  /* padding: 8px 0; */
  margin-bottom: 20px;
  position: relative;

  .logic {
    position: absolute;
    top: 12px;
    right: 0;
  }

  .has-not-item {
    position: absolute;
    top: 8px;
    right: 0;
  }

  &.range-box-absolute {
    position: absolute;
    left: 350px;
    top: 0;
  }
  .range-box-absolute {
    position: absolute;
    left: 350px;
    top: 0;
  }
`
