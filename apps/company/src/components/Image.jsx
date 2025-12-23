import React, { useMemo, useState } from 'react'

// 图片组件
const Img = (props) => {
  const [src, setSrc] = useState(props.loadingImg) //加载中图片
  const [isFlag, setIsFlag] = useState(false) //是否第一次加载

  const handleOnload = () => {
    //判断是否是第一次加载
    if (isFlag) return
    const imgDom = new Image()
    imgDom.src = props.src
    imgDom.onload = function () {
      setIsFlag(true)
      setSrc(props.src)
    }
    imgDom.onerror = function () {
      setIsFlag(true)
      setSrc(props.errorImg)
    }
  }

  const newProps = useMemo(() => {
    const { loadingImg, errorImg, ...params } = props
    return params
  }, [props])

  return (
    <>
      <img
        {...newProps}
        src={src}
        onLoad={() => {
          handleOnload()
          props.onLoad && props.onLoad()
        }}
        data-uc-id="ZTjKBlF-N5"
        data-uc-ct="img"
      ></img>
    </>
  )
}

export default React.memo(Img)
