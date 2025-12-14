import { HtmlUnit } from './type'

/**
 * Parses a cell's HTML content into a list of top-level HTML units.
 * An HTML unit is either an HTML element or a text node.
 * @param cellHtml The HTML string of a single cell.
 * @returns An array of HtmlUnit objects.
 */

export function getCellHtmlUnits(cellHtml: string): HtmlUnit[] {
  if (!cellHtml || cellHtml.trim() === '') {
    return []
  }
  try {
    const $wrapper = $('<div>').html(cellHtml)
    const units: HtmlUnit[] = []
    $wrapper.contents().each((_, node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        units.push({ htmlContent: (node as HTMLElement).outerHTML })
      } else if (node.nodeType === Node.TEXT_NODE) {
        // Only add non-empty text nodes
        if (node.nodeValue && node.nodeValue.trim() !== '') {
          // Browsers normalize consecutive spaces in text nodes when accessed via nodeValue,
          // and jQuery's .html() might also re-encode entities.
          // To preserve original spacing/entities as much as possible for text nodes,
          // it might be better to get the text node's content in a way that reflects its raw state,
          // or ensure that any crucial spacing (like &nbsp;) is within elements if it's structural.
          // For now, using nodeValue is standard.
          units.push({ htmlContent: node.nodeValue })
        }
      }
    })
    return units
  } catch (error) {
    console.error('PDFPage: Error in getCellHtmlUnits', error, cellHtml)
    return [{ htmlContent: cellHtml }] // Fallback
  }
}
