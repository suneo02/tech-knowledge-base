import React from 'react'

const SvgMock = React.forwardRef<SVGSVGElement>((props, ref) => (
  <svg ref={ref} {...props}>
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
  </svg>
))

SvgMock.displayName = 'SvgMock'

export default SvgMock
