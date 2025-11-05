import React from 'react'
import styled from 'styled-components';
import CompanyConfigMapItem from './CompanyConfigMapItem';

const Box = styled.div`

  .title {
    font-size: 16px;
    color: #333333;
    line-height: 24px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
  }

`

const CompanyConfigMapList = ({ data }) => {
  return (
    <Box fontColor='blue'>
      {
        data.length > 0 ?
          <div className='title'>
            更多企业信息
          </div> : null
      }
      <div className='item-box'>
        {
          data.map((item, i) => (
            <CompanyConfigMapItem key={i} item={item} />
          ))
        }
      </div>
    </Box>
  )
}

export default CompanyConfigMapList