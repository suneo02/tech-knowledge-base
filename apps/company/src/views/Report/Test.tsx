import React, { useState } from 'react'

const ChildComponent = React.memo(() => {
  const [count, setCount] = useState(0)

  return (
    <div style={{ height: '400vh' }}>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
})

export default ChildComponent
