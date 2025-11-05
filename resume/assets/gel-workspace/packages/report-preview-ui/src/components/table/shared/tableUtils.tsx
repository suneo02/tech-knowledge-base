/**
 * Shared utility functions for table components
 */

import { TableColProps } from '@/types/table'
import React from 'react'

/**
 * Table utility class with static helper methods
 */
export class TableUtils {
  /**
   * Renders cell content, handling custom render functions and ensuring valid React elements
   * @param value - The raw cell value
   * @param record - The row data record
   * @param index - The row index
   * @param renderFn - Optional custom render function
   * @returns React element or string to render
   */
  static renderCellContent(
    value: any,
    record: any = null,
    index: number = 0,
    renderFn?: TableColProps['render']
  ): React.ReactNode {
    // If there's a custom render function, use it
    if (typeof renderFn === 'function') {
      try {
        const renderResult = renderFn(value, record, index)

        // Handle different types of render results
        if (renderResult === null || renderResult === undefined) {
          console.warn('renderResult is null or undefined', renderResult, value, record, index)
          return ''
        }

        // If it's already a React element, return it directly
        if (React.isValidElement(renderResult)) {
          return renderResult
        }

        // If it's a string, return it directly
        if (typeof renderResult === 'string') {
          return renderResult
        }

        // For objects or other types, convert to string
        if (typeof renderResult === 'object') {
          console.warn('renderResult is an object', renderResult)
        }
        return String(renderResult)
      } catch (error) {
        console.error('Error in render function:', error)
        return value !== undefined ? String(value) : ''
      }
    }

    // No custom render function, display the value directly
    return value != null ? String(value) : '--'
  }

  /**
   * Creates a className string from multiple class names, filtering out falsy values
   * @param classNames - Array of potential class names
   * @returns Combined class name string
   */
  static classNames(...classNames: (string | undefined | null | false)[]): string {
    return classNames.filter(Boolean).join(' ')
  }
}
