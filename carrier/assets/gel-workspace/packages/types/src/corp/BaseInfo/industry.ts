export interface IndustrySectorItem {
  id: string
  name: string
  level: number
}

export interface IndustrySectorConfidence {
  confidence: number
  list: IndustrySectorItem[]
}

export interface IndustrySector {
  key: string
  name: string
  total: number
  list: IndustrySectorConfidence[]
}
