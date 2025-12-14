import { getPlainText } from './helper'
import { splitTextualHtmlUnitByFit } from './splitTextualHtmlUnitByFit'
import { CellData, CheckOverflowFn, HtmlUnit } from './type'

/**
 * Attempts to perform a fine-grained split on HTML units that caused an overflow.
 * This function is called when adding a batch of full HTML units to a row makes it overflow.
 * It iterates through the units that were part of the overflow attempt and tries to split them individually.
 *
 * @param cellsHtmlUnits - 2D array of HTML units for each cell. Modified if a unit is split.
 * @param cellUnitPointers - Array tracking the current unit index for each cell.
 * @param bestFitCellsData - Data for cells that have been confirmed to fit so far. Modified if a partial unit fits.
 * @param originalCellsData - Original cell data for reference (e.g., for colspans).
 * @param checkOverflow - Callback to check if a given JQuery row element causes overflow.
 * @returns An object indicating if a refined fit was made and if any split occurred during this process.
 */
export function tryFineGrainedSplitAfterOverflow(
  cellsHtmlUnits: HtmlUnit[][],
  cellUnitPointers: number[],
  bestFitCellsData: CellData[],
  originalCellsData: CellData[],
  checkOverflow: CheckOverflowFn
): { refinedFitInThisPass: boolean; actualSplitOccurredInHelper: boolean } {
  try {
    let refinedFitInThisPass = false
    let actualSplitOccurredInHelper = false

    for (let i = 0; i < originalCellsData.length; i++) {
      if (cellUnitPointers[i] < cellsHtmlUnits[i].length) {
        const unitToAttemptSplit = cellsHtmlUnits[i][cellUnitPointers[i]]
        const htmlOfCellBeforeThisUnit = bestFitCellsData[i].html

        const contextCellsData = originalCellsData.map((ocd, idx) => ({
          ...ocd,
          html: idx === i ? htmlOfCellBeforeThisUnit : bestFitCellsData[idx].html,
          content: idx === i ? getPlainText(htmlOfCellBeforeThisUnit) : bestFitCellsData[idx].content,
        }))

        const splitAttempt = splitTextualHtmlUnitByFit(
          unitToAttemptSplit,
          checkOverflow,
          contextCellsData,
          i,
          htmlOfCellBeforeThisUnit
        )

        if (splitAttempt.bestFitUnitHtml) {
          const fittedHtmlForCell = htmlOfCellBeforeThisUnit + splitAttempt.bestFitUnitHtml
          bestFitCellsData[i].html = fittedHtmlForCell
          bestFitCellsData[i].content = getPlainText(fittedHtmlForCell)

          actualSplitOccurredInHelper = true
          refinedFitInThisPass = true

          cellsHtmlUnits[i].splice(cellUnitPointers[i], 1)

          if (splitAttempt.remainingUnitHtml) {
            cellsHtmlUnits[i].splice(cellUnitPointers[i], 0, {
              htmlContent: splitAttempt.remainingUnitHtml,
            })
          }
        }
      }
    }
    return { refinedFitInThisPass, actualSplitOccurredInHelper }
  } catch (e) {
    console.error(
      'PDFPage: tryFineGrainedSplitAfterOverflow error' +
        JSON.stringify(e) +
        JSON.stringify(originalCellsData.map((c) => c.html))
    )
    return {
      refinedFitInThisPass: false,
      actualSplitOccurredInHelper: false,
    }
  }
}
