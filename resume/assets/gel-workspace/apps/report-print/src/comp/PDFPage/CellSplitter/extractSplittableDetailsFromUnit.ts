/**
 * Helper to analyze an HTML unit and extract details relevant for splitting.
 * @param originalUnitHtml The HTML content of the unit.
 * @returns An object with details about the unit, or indicates if it's too complex.
 */

export function extractSplittableDetailsFromUnit(originalUnitHtml: string): {
  originalText: string // The actual text content that can be split
  isSimpleElementWrapper: boolean // True if the text is wrapped in a single simple element (e.g., <p>, <span>)
  $children: JQuery | null // The jQuery object for the wrapper element (if isSimpleElementWrapper is true)
  isComplex: boolean // True if the unit is too complex to be split by this logic
} {
  try {
    // Handle empty string explicitly as a non-complex case
    if (originalUnitHtml === '') {
      return {
        originalText: '',
        isSimpleElementWrapper: false,
        $children: null,
        isComplex: false,
      }
    }

    // 1. Prepare a temporary jQuery wrapper:
    //    It creates a temporary <div> in memory and sets its innerHTML to the originalUnitHtml.
    //    This allows using jQuery methods to inspect the structure of the unit.
    const $tempWrapper = $('<div>').html(originalUnitHtml)

    // 2. Initialize return values:
    let originalText = ''
    let isSimpleElementWrapper = false

    // 3. Get jQuery collections for children and contents:
    //    - $children: Gets only the direct child *elements* of the $tempWrapper.
    //    - $contents: Gets *all* direct children, including text nodes and comment nodes, not just elements.
    const $children = $tempWrapper.children()
    const $contents = $tempWrapper.contents()

    // 4. First Condition: Check for a simple element wrapper
    //    This `if` block checks if the HTML unit consists of exactly one child element,
    //    and that this single child element itself contains all the text content of the unit.
    //    Example: `originalUnitHtml` is "<p>Hello World</p>"
    //    - $children.length === 1 (the <p> tag)
    //    - $contents.length === 1 (the <p> tag, as it's the only content)
    //    - $children.first().text().trim() === $tempWrapper.text().trim():
    //      Compares the text of the first child element (text inside <p>) with the text of the entire wrapper.
    //      This ensures there isn't any stray text outside the single child element.
    if (
      $children.length === 1 &&
      $contents.length === 1 &&
      $children.first().text().trim() === $tempWrapper.text().trim()
    ) {
      originalText = $children.first().text() // Extract the text from the single child element
      isSimpleElementWrapper = true // Mark that it's a simple wrapper

      // Return the details: text, wrapper status, the jQuery object for the wrapper itself, and not complex.
      // $children.first() is returned so the caller can clone this wrapper element.
      return {
        originalText,
        isSimpleElementWrapper,
        $children: $children.first(),
        isComplex: false,
      }
    }

    // 5. Second Condition: Check for a pure text node
    //    This `else if` block checks if the HTML unit is just a text node.
    //    Example: `originalUnitHtml` is "Just some text"
    //    - $children.length === 0 (no child *elements*)
    //    - $contents.length === 1 (one content node, which should be the text itself)
    //    - $contents.first()[0] && $contents.first()[0].nodeType === Node.TEXT_NODE:
    //      Checks if the first (and only) content node exists and is actually a DOM text node.
    else if (
      $children.length === 0 &&
      $contents.length === 1 &&
      $contents.first()[0] &&
      $contents.first()[0].nodeType === Node.TEXT_NODE
    ) {
      originalText = $tempWrapper.text() // Extract the text (which is the whole unit)
      isSimpleElementWrapper = false // Mark that it's not an element wrapper

      // Return the details: text, no wrapper, no specific $children element, and not complex.
      return {
        originalText,
        isSimpleElementWrapper,
        $children: null,
        isComplex: false,
      }
    }

    // 6. Else Condition: Complex Structure
    //    If neither of the above conditions is met, the HTML unit is considered too complex
    //    for the `splitTextualHtmlUnitByFit` function to reliably split by its text content.
    //    Examples:
    //    - "<span>Hello</span> <span>World</span>" (multiple top-level elements)
    //    - "Text <b>and</b> more text" (mixed text nodes and elements at the top level)
    //    - "<div><p>Nested</p></div>" (if the first check didn't simplify it to just the <p>)
    else {
      // Return indicating it's complex, with empty/null values for other fields.
      return {
        originalText: '',
        isSimpleElementWrapper: false,
        $children: null,
        isComplex: true,
      }
    }
  } catch (e) {
    console.error(
      'PDFPage: extractSplittableDetailsFromUnit error' + JSON.stringify(e) + JSON.stringify(originalUnitHtml)
    )
    return {
      originalText: '',
      isSimpleElementWrapper: false,
      $children: null,
      isComplex: true,
    }
  }
}
