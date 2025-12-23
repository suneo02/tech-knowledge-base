import { MutableRefObject } from 'react'

export interface PreviewReportContentReactProps {
  scale?: number // Adding scale as a prop for zoom functionality
  hiddenNodeIds?: string[] // Array of ids for hidden nodes
}

export interface PreviewReportContentRef {
  scrollToItem: (id: string) => void
}

export interface PreviewReportContentInstance extends PreviewReportContentRef {
  getCurrent: () => MutableRefObject<PreviewReportContentRef | null>
}
