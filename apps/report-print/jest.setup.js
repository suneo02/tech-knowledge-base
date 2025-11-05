// jest.setup.js
const fs = require('fs')
const path = require('path')

// Path to your specific jQuery file from the workspace root
const jqueryPath = path.resolve(__dirname, './public/resource/js/jquery.js')

try {
  const jqueryCode = fs.readFileSync(jqueryPath, 'utf-8')

  // JSDOM (Jest's test environment) provides `window` and `document`
  if (window && window.document) {
    const script = window.document.createElement('script')
    script.textContent = jqueryCode // Use textContent to inject the script
    window.document.head.appendChild(script)
    // Optional: a log to confirm jQuery is loaded when tests run with --verbose or similar
    // console.log('Successfully loaded local jQuery v1.8.0 into JSDOM for tests.');
  } else {
    console.error(
      'JSDOM environment (window or document) not found. jQuery could not be loaded.',
    )
  }
} catch (error) {
  console.error('Failed to read or load local jQuery file:', jqueryPath, error)
  // You might want to throw the error to fail tests if jQuery is critical
  // throw error;
}

// Ensure Node constants are available globally for tests if not already defined by JSDOM/Node env
if (typeof Node === 'undefined') {
  global.Node = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3,
    COMMENT_NODE: 8,
    DOCUMENT_NODE: 9,
    DOCUMENT_TYPE_NODE: 10,
    DOCUMENT_FRAGMENT_NODE: 11,
  }
}
