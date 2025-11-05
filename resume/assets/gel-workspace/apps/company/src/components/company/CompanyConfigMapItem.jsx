import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

const Box = styled.div`
  display: flex;
  
  .map-title {
    font-weight: bold;
    white-space: nowrap;
    margin-right: 15px;
    margin-bottom: 0;
    font-size: 14px;
    display: flex;
    align-items: flex-start;
  }

  .map-item {
    display: grid;
    grid-template-columns: repeat(9,1fr);
    width: 100%;
  }

`

const Item = styled.a`
  margin-right: 5px;
  margin-bottom: 10px;
  white-space: nowrap;
  color: ${prop => prop.num === 0?'#999999':'#000000'} !important;
  pointer-events: ${prop => prop.num === 0 && 'none'};
  .blue {
    color: #3355ff;
    margin-left: 3px;
  }

`

const CompanyConfigMapItem = ({ item }) => {
  const { children: list, title } = item
  const corpId = useSelector(state => state.company.baseInfo.corp_id)

  return (
    <Box>
      <span className='map-title'>{title}</span>
      <div className='map-item'>
        {
          list.map((config,i) => (
            <Item 
              href={`/superlist/PC.Front/Company/Company.html#${config.url}?companycode=${corpId}`}
              num={config.num} 
              target='_blank'
              key={i}>
              {`${config.text}`}
              <span className='blue'>
                {
                  config.num === 0 || config.num === -1 ? null :
                    (`(${config.num > 99 ? '99+' : config.num})`)
                }
              </span>
            </Item>
          ))
        }
      </div>
    </Box>
  )
}

export default CompanyConfigMapItem;
