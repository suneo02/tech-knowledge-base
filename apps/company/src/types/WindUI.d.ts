import '@wind/wind-ui'
import { ReactNode } from 'react'

declare module '@wind/wind-ui' {
  interface BackTopProps {
    children?: ReactNode
  }
}
