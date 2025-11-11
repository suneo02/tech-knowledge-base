import React from 'react'

import styles from './index.module.less'
import { Carousel } from 'antd'

interface CarouselItemProps {
  list: any[]
}

const CarouselItem: React.FC<CarouselItemProps> = (props) => {
  const { list } = props

  return (
    <div className="slider-container">
      <Carousel autoplay vertical verticalSwiping slidesToShow={1} slidesToScroll={1}>
        {list.map((item) => {
          return (
            <div className={styles.carouselItem} key={`${item.id}-1`}>
              {item.content}
            </div>
          )
        })}
      </Carousel>
    </div>
  )
}

export default CarouselItem
