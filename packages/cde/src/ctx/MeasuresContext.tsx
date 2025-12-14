import { CDEMeasureItem } from 'gel-api'
import { uniqBy } from 'lodash'
import React, { createContext, useContext, useMemo } from 'react'

const frozenMeasures: CDEMeasureItem[] = [
  { field: 'corp_id', title: '企业ID' },
  { field: 'corp_name', title: '企业名称' },
]

interface MeasuresContextType {
  measures: CDEMeasureItem[]
  frozenMeasures: CDEMeasureItem[]
  measuresOverall: CDEMeasureItem[]
  measuresForDisplay: CDEMeasureItem[]
}

const MeasuresContext = createContext<MeasuresContextType | null>(null)

export const MeasuresProvider: React.FC<{
  children: React.ReactNode
  measuresDefault: CDEMeasureItem[]
}> = ({ children, measuresDefault }) => {
  const measuresOverall = uniqBy([...frozenMeasures, ...measuresDefault], 'field')

  const measuresForDisplay = useMemo(() => {
    return measuresOverall.filter((item) => item.field !== 'corp_id')
  }, [measuresOverall])

  return (
    <MeasuresContext.Provider
      value={{
        measures: measuresDefault,
        frozenMeasures,
        measuresOverall,
        measuresForDisplay,
      }}
    >
      {children}
    </MeasuresContext.Provider>
  )
}

export const useCDEMeasuresCtx = () => {
  const context = useContext(MeasuresContext)
  if (!context) {
    throw new Error('useMeasuresContext must be used within a MeasuresProvider')
  }
  return context
}
