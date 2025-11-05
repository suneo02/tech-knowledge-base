import { includePolyfill } from '@/utils/common'
import { createRowFromData } from './createRowFromData'
import { extractSplittableDetailsFromUnit } from './extractSplittableDetailsFromUnit'
import { getPlainText } from './helper'
import { CellData, CheckOverflowFn, HtmlUnit } from './type'

/**
 * Attempts to split a single HTML unit (expected to be a simple text container or a text node)
 * such that the first part fits based on height checking.
 *
 * @param unitToSplit - The HTML unit to split.
 * @param checkOverflow - A callback function that takes CellData[] and returns true if it overflows, false otherwise.
 * @param baseCellsDataForContext - Array of CellData representing the current state of the entire row,
 *                                  where the cell corresponding to unitToSplit has HTML *before* this unit.
 * @param cellIndexInRow - The index of the cell (in baseCellsDataForContext) that unitToSplit belongs to.
 * @param htmlOfCellBeforeThisUnit - The HTML content of the target cell *before* adding any part of unitToSplit.
 * @returns An object with { bestFitUnitHtml: string | null, remainingUnitHtml: string | null }
 */
export function splitTextualHtmlUnitByFit(
  unitToSplit: HtmlUnit,
  checkOverflow: CheckOverflowFn,
  baseCellsDataForContext: CellData[],
  cellIndexInRow: number,
  htmlOfCellBeforeThisUnit: string
): {
  bestFitUnitHtml: string | null
  remainingUnitHtml: string | null
} {
  try {
    const originalUnitHtml = unitToSplit.htmlContent
    const unitDetails = extractSplittableDetailsFromUnit(originalUnitHtml)

    if (unitDetails.isComplex) {
      // console.warn("PDFPage: splitTextualHtmlUnitByFit encountered complex unit, cannot split by text: ", originalUnitHtml);
      return { bestFitUnitHtml: null, remainingUnitHtml: originalUnitHtml }
    }

    const { originalText, isSimpleElementWrapper, $children } = unitDetails

    // Guard against $children being null if isSimpleElementWrapper is true, though logic above should prevent it.
    if (isSimpleElementWrapper && !$children) {
      console.error(
        'PDFPage: Inconsistent state in splitTextualHtmlUnitByFit - simple wrapper but no children provided by helper.'
      )
      return { bestFitUnitHtml: null, remainingUnitHtml: originalUnitHtml }
    }

    if (originalText.trim().length === 0 && includePolyfill(originalUnitHtml, '<')) {
      // Has HTML structure but no text (e.g. <br />, <img>)
      // Try to fit the whole unit as is
      const testCellsData = baseCellsDataForContext.map((cd, idx) => {
        if (idx === cellIndexInRow) {
          const combinedHtml = htmlOfCellBeforeThisUnit + originalUnitHtml
          return {
            ...cd,
            html: combinedHtml,
            content: getPlainText(combinedHtml),
          }
        }
        return { ...cd }
      })

      // Use the callback to check overflow
      if (checkOverflow(createRowFromData(testCellsData))) {
        return { bestFitUnitHtml: null, remainingUnitHtml: originalUnitHtml }
      } else {
        return { bestFitUnitHtml: originalUnitHtml, remainingUnitHtml: null }
      }
    }

    if (originalText.trim().length === 0) {
      // No text and no HTML structure of note for splitting
      return { bestFitUnitHtml: originalUnitHtml, remainingUnitHtml: null }
    }

    let bestFitTextLength = 0

    for (let len = 1; len <= originalText.length; len++) {
      const currentTestText = originalText.substring(0, len)
      let testUnitFragmentHtml = ''

      if (isSimpleElementWrapper && $children) {
        // $children check for type safety
        const $clonedElement = $children.clone()
        $clonedElement.text(currentTestText)
        testUnitFragmentHtml = $clonedElement.prop('outerHTML')
      } else {
        testUnitFragmentHtml = currentTestText
      }

      // Construct test CellData for the entire row
      const testCellsData = baseCellsDataForContext.map((cd, idx) => {
        if (idx === cellIndexInRow) {
          const combinedHtml = htmlOfCellBeforeThisUnit + testUnitFragmentHtml
          return {
            ...cd,
            html: combinedHtml,
            content: getPlainText(combinedHtml),
          }
        }
        return { ...cd } // Other cells use their HTML from baseCellsDataForContext
      })

      // Use the callback to check overflow
      if (checkOverflow(createRowFromData(testCellsData))) {
        break // Current length `len` caused overflow, so `len-1` was the best fit.
      } else {
        bestFitTextLength = len
      }
    }

    if (bestFitTextLength === 0) {
      return { bestFitUnitHtml: null, remainingUnitHtml: originalUnitHtml }
    }

    const fittedText = originalText.substring(0, bestFitTextLength)
    const remainingText = originalText.substring(bestFitTextLength)

    let finalBestFitHtml = ''
    let finalRemainingHtml = null

    if (isSimpleElementWrapper && $children) {
      // $children check for type safety
      const $clonedElementFit = $children.clone()
      $clonedElementFit.text(fittedText)
      finalBestFitHtml = $clonedElementFit.prop('outerHTML')

      if (remainingText.length > 0) {
        const $clonedElementRemaining = $children.clone()
        $clonedElementRemaining.text(remainingText)
        finalRemainingHtml = $clonedElementRemaining.prop('outerHTML')
      }
    } else {
      // Pure text node
      finalBestFitHtml = fittedText
      if (remainingText.length > 0) {
        finalRemainingHtml = remainingText
      }
    }

    // If the entire original text fit, then there's no remainder from this unit.
    if (bestFitTextLength === originalText.length) {
      finalRemainingHtml = null
    }

    return {
      bestFitUnitHtml: finalBestFitHtml,
      remainingUnitHtml: finalRemainingHtml,
    }
  } catch (e) {
    console.error(
      'PDFPage: splitTextualHtmlUnitByFit error' +
        JSON.stringify(e) +
        JSON.stringify(baseCellsDataForContext.map((c) => c.html))
    )
    return { bestFitUnitHtml: null, remainingUnitHtml: '' }
  }
}
