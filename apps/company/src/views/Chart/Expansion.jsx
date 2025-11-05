// 折叠收起组件

import { useState } from "react"


const Expansion = ({
  content,
  expand
}) => {

  const [expanded, setExpanded] = useState(false)
  return <>
    <div style={{cursor:"pointer",color:"#00aec7"} } onClick={()=>{setExpanded(i=>!i)}}>
    {
      content
    }
    </div>
    {
      expanded ? expand : <></>
    }
  </>
}


export default Expansion