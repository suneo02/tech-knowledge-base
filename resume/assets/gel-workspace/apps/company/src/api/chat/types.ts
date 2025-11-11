/**
 * Chat API response types
 */

export interface ChatQuestion {
  /** Whether the question is dynamic */
  isDynamic: boolean
  /** Question type: 0 for data search, 1 for graph/chart */
  questionsType: number
  /** The question text */
  questions: string
  /** SVG icon for the question type */
  questionsIcon: string
}

/**
 * Response type for the getQuestion endpoint
 */
export type GetQuestionResponse = ChatQuestion[]
