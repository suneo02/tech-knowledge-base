import { createRowFromData } from './createRowFromData'
import { getCellHtmlUnits } from './getCellHtmlUnits'
import { getPlainText, handleEmptyContent, handleNoFitContent, hasAnyContent, reconstructHtmlFromUnits } from './helper'
import { tryFineGrainedSplitAfterOverflow } from './tryFineGrainedSplitAfterOverflow'
import { CellData, CheckOverflowFn, HtmlUnit, SplitResult } from './type'

/**
 * Iteratively fits HTML units from cells to determine the maximum content
 * that can fit onto a single line without causing page overflow.
 * Prioritizes HTML element integrity.
 *
 * @param originalCellsData - The full data for the row to be split.
 * @param checkOverflow - Callback to check if a given JQuery row element causes overflow.
 * @returns An object containing `firstLineData`, `remainingData`, and `didSplit` status.
 */
export function splitForSingleLineFit(originalCellsData: CellData[], checkOverflow: CheckOverflowFn): SplitResult {
  try {
    if (!originalCellsData || originalCellsData.length === 0) {
      return { firstLineData: [], remainingData: [], didSplit: false }
    }

    if (!hasAnyContent(originalCellsData)) {
      return handleEmptyContent(originalCellsData)
    }

    // Initialize cell structures for processing
    // cellsHtmlUnits: Each inner array contains HtmlUnit objects (tags or text nodes) for the corresponding cell.
    const cellsHtmlUnits: HtmlUnit[][] = originalCellsData.map((cell) => getCellHtmlUnits(cell.html))
    // cellUnitPointers: Tracks the index of the next HtmlUnit to process for each cell within its cellsHtmlUnits array.
    const cellUnitPointers: number[] = originalCellsData.map(() => 0)

    // bestFitCellsData stores the HTML that has been confirmed to fit
    let bestFitCellsData: CellData[] = originalCellsData.map((cell) => ({
      ...cell,
      html: '',
      content: '',
    }))

    // candidateCellsData is used for the current iteration's test
    let candidateCellsData: CellData[] = bestFitCellsData.map((c) => ({ ...c }))

    // actualSplitOccurred: Flag to indicate if any cell's content was truly split across firstLineData and remainingData.
    let actualSplitOccurred = false
    // atLeastOneUnitProcessedInIteration: Controls the main processing loop. True if any unit was added in an iteration.
    let atLeastOneUnitProcessedInIteration = true

    // Main loop: Iteratively add HTML units to candidateCellsData and test
    while (atLeastOneUnitProcessedInIteration) {
      atLeastOneUnitProcessedInIteration = false

      // Store HTML of candidate cells *before* adding new units in this iteration
      const candidateHtmlBeforeUnitAdd: string[] = candidateCellsData.map((c) => c.html)

      for (let i = 0; i < originalCellsData.length; i++) {
        if (cellUnitPointers[i] < cellsHtmlUnits[i].length) {
          const currentUnit = cellsHtmlUnits[i][cellUnitPointers[i]]

          // Try adding the whole unit first
          const provisionalHtml = candidateCellsData[i].html + currentUnit.htmlContent
          candidateCellsData[i].html = provisionalHtml
          candidateCellsData[i].content = getPlainText(provisionalHtml)
          atLeastOneUnitProcessedInIteration = true
        }
      }

      if (!atLeastOneUnitProcessedInIteration) {
        // No more units to process in any cell
        break
      }

      // Create row from candidate data and then check overflow using the callback
      const $testRow = createRowFromData(candidateCellsData)
      const isOverflow = checkOverflow($testRow)
      // $testRow is managed (appended/removed) by the checkOverflow callback implementer

      if (isOverflow) {
        candidateCellsData = bestFitCellsData.map((c) => ({ ...c }))

        const splitResult = tryFineGrainedSplitAfterOverflow(
          cellsHtmlUnits,
          cellUnitPointers,
          bestFitCellsData,
          originalCellsData,
          checkOverflow
        )

        actualSplitOccurred = actualSplitOccurred || splitResult.actualSplitOccurredInHelper

        if (splitResult.refinedFitInThisPass) {
          // A fine-grained split was successful for at least one unit.
          // bestFitCellsData has been updated by the helper.
          // candidateCellsData needs to be synced with this new bestFitCellsData for the next main loop iteration.
          candidateCellsData = bestFitCellsData.map((c) => ({ ...c }))
          // atLeastOneUnitProcessedInIteration remains true (or should be considered true)
          // as the state has changed, and the loop should continue to process further units (remainders or next ones).
        } else {
          // No refined fit was possible for any of the overflowing units.
          // The current bestFitCellsData (before this overflow attempt) is final for the first line.
          // The units at cellUnitPointers[j] are the start of remainingData.
          atLeastOneUnitProcessedInIteration = false // Force while loop to terminate.
        }
      } else {
        // No overflow from adding the current batch of full units.
        // The current candidateCellsData fits.
        bestFitCellsData = candidateCellsData.map((c) => ({ ...c }))
        // Advance pointers for the units that were successfully added in this iteration.
        for (let i = 0; i < originalCellsData.length; i++) {
          // Check if cell i contributed a unit in this successful block addition.
          // A unit was added if its HTML changed and the pointer is still within bounds.
          if (
            candidateHtmlBeforeUnitAdd[i].length < candidateCellsData[i].html.length &&
            cellUnitPointers[i] < cellsHtmlUnits[i].length
          ) {
            cellUnitPointers[i]++
          }
        }
        // atLeastOneUnitProcessedInIteration is already true if units were processed to reach here.
        // If no units were processed at all (all pointers at end), outer loop check handles termination.
      }
    } // End of while loop

    // Construct final firstLineData and remainingData
    const finalFirstLineData: CellData[] = bestFitCellsData.map((cell, idx) => ({
      ...originalCellsData[idx], // Keep original colSpan, rowSpan etc.
      html: cell.html,
      content: getPlainText(cell.html),
    }))

    const finalRemainingData: CellData[] = originalCellsData.map((cell, idx) => {
      const remainingUnitsForCell = cellsHtmlUnits[idx].slice(cellUnitPointers[idx])
      const remainingHtml = reconstructHtmlFromUnits(remainingUnitsForCell)
      return {
        ...cell,
        html: remainingHtml,
        content: getPlainText(remainingHtml),
      }
    })

    // Determine if a split actually occurred
    if (!actualSplitOccurred) {
      // If not set by fine-grained split
      actualSplitOccurred = finalRemainingData.some((cell) => cell.html.trim() !== '' || cell.content.trim() !== '')
    }

    // If bestFit is empty and original had content, it means nothing fit.
    const firstLineIsEmpty = !finalFirstLineData.some((c) => c.html.trim() !== '')
    if (firstLineIsEmpty && hasAnyContent(originalCellsData)) {
      return handleNoFitContent(originalCellsData)
    }

    return {
      firstLineData: finalFirstLineData,
      remainingData: actualSplitOccurred ? finalRemainingData : [],
      didSplit: actualSplitOccurred,
    }
  } catch (error) {
    console.error(
      'PDFPage: splitForSingleLineFit (HTML-aware) error' +
        JSON.stringify(error) +
        JSON.stringify(originalCellsData.map((c) => c.html))
    )
    // Fallback to returning original data as remaining if an error occurs
    return {
      firstLineData: [],
      remainingData: originalCellsData.map((c) => ({ ...c })), // Ensure fresh copy
      didSplit: false,
    }
  }
}
