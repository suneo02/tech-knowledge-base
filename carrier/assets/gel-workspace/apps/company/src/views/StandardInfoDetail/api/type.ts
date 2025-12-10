/**
 * 起草人信息
 */
interface Drafter {
  drafterId: string
  drafterName: string
}

/**
 * 归口单位信息
 */
interface PutUnderUnit {
  unitId: string
  unitName: string
  unitRoleType: number
  unitType: number
}

/**
 * 备案信息
 */
interface FilingInfo {
  file: string
  filingDate: string
  filingNo: string
}

/**
 * 行业标准信息
 */
interface StandardDetail {
  abolishDate?: string
  approveReleaseUnit: Array<any>
  drafter: Array<Drafter>
  file: Array<string>
  filingsInfo: Array<FilingInfo>
  implementationDate: string
  putUnderUnit: Array<PutUnderUnit>
  releaseDate: string
  scorpOfApplication: string
  standardCategory: string
  standardClassify_chinese: string
  standardClassify_international: string
  standardName: string
  standardNo: string
  standardStatus: string
}

/**
 * 起草信息
 */
interface DraftInfo {
  currency: string
  draftingUnit: string
  establishmentDate: string
  registeredCapital: number
  standardNum: number
  windId?: string
}
