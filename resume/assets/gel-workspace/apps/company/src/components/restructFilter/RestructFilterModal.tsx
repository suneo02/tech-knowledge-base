import React, { FC } from 'react'
import styled from 'styled-components'
import RestructFilter from './RestructFilter'

const RestructFilterModal: FC<{
  modal: boolean
  setModal: (modal: boolean) => void
  onSearch: () => void
}> = ({ modal = true, setModal = () => null, onSearch }) => {
  return (
    <>
      {modal ? (
        <Box>
          <div className="filter-box">
            <RestructFilter onClose={() => setModal(false)} isShow={false} onSearch={onSearch} fromModal={true} />
          </div>
        </Box>
      ) : null}
    </>
  )
}

const Box = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 999;
  .filter-box {
    background-color: #fff;
    width: 800px;
    height: 595px;
    transform: translateY(-50px);
  }
`
export default RestructFilterModal
