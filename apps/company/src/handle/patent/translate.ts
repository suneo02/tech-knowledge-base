import { translateToEnglish } from '@/utils/intl/complexHtml'
import { PatentItem, PatentItemFront } from 'gel-types'
import { isEn } from 'gel-util/intl'

export interface PatentAggregation {
  key: string
  key_en?: string
  [key: string]: any
}

export interface PatentTranslateResult {
  list: PatentItemFront[]
  aggregations?: {
    agg_patentClassification?: PatentAggregation[]
  }
}

/**
 * 处理专利数据翻译
 * @param data 原始专利数据
 * @returns 翻译后的数据
 */
export async function handlePatentTranslate(data: PatentTranslateResult): Promise<PatentTranslateResult> {
  if (!isEn()) {
    return data
  }

  try {
    const result = { ...data }

    // 翻译专利分类聚合数据（按索引补全 key_en，保留原分桶与顺序）
    if (result.aggregations?.agg_patentClassification && result.aggregations.agg_patentClassification.length > 0) {
      const agg = result.aggregations.agg_patentClassification
      const toTranslate = agg.map((item) => ({ key: item.key }))
      try {
        const enAggRes = await translateToEnglish(toTranslate)
        const enAgg = enAggRes?.data || []
        for (let i = 0; i < agg.length && i < enAgg.length; i++) {
          const enKey = enAgg[i]?.key
          if (typeof enKey === 'string') {
            agg[i].key_en = enKey.replace ? enKey.replace(/<em>|<\/em>/g, '') : enKey
          }
        }
      } catch (_err) {
        // 忽略聚合翻译失败，继续后续流程
      }
    }

    if (result.list && result.list.length > 0) {
      const assigneeAll: PatentItem['assignee'] = []
      const applicantAll: PatentItem['applicant'] = []

      result.list.forEach((item) => {
        if (Array.isArray(item.assignee) && item.assignee.length > 0) {
          assigneeAll.push(...item.assignee)
        }
        if (Array.isArray(item.applicant) && item.applicant.length > 0) {
          applicantAll.push(...item.applicant)
        }
      })

      const [enListRes, enAssigneeRes, enApplicantRes] = await Promise.all([
        translateToEnglish(result.list, { skipFields: ['assignee', 'applicant', 'assigneeList'] }),
        assigneeAll.length
          ? translateToEnglish(assigneeAll, { allowFields: ['mainBodyType'] })
          : Promise.resolve({ data: [] }),
        applicantAll.length
          ? translateToEnglish(applicantAll, { allowFields: ['mainBodyType'] })
          : Promise.resolve({ data: [] }),
      ])

      const endata = enListRes.data
      endata.forEach((translatedItem) => {
        const originalItem = result.list.find((item) => item.dataId && item.dataId === translatedItem.dataId)
        if (originalItem) {
          translatedItem.patentName_en = translatedItem.patentName || ''
          translatedItem.patentName_en = translatedItem.patentName_en.replace
            ? translatedItem.patentName_en.replace(/<em>|<\/em>/g, '')
            : translatedItem.patentName_en
          translatedItem.patentName = originalItem.patentName
        }
      })
      result.list = endata

      let p = 0
      result.list.forEach((item) => {
        if (Array.isArray(item.assignee)) {
          const len = item.assignee.length
          const chunk = (enAssigneeRes?.data || []).slice(p, p + len)
          for (let i = 0; i < len && i < chunk.length; i++) {
            const val = chunk[i]?.mainBodyType
            if (typeof val === 'string') {
              item.assignee[i].mainBodyType = val
            }
          }
          p += len
        }
      })

      let q = 0
      result.list.forEach((item) => {
        const applicants = item.applicant
        if (Array.isArray(applicants)) {
          const len = applicants.length
          const chunk = (enApplicantRes?.data || []).slice(q, q + len)
          for (let i = 0; i < len && i < chunk.length; i++) {
            const val = chunk[i]?.mainBodyType
            if (typeof val === 'string') {
              applicants[i].mainBodyType = val
            }
          }
          q += len
        }
      })
    }

    return result
  } catch (error) {
    console.error('Patent translation error:', error)
    return data
  }
}
