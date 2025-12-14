import { StreamChunk, StreamResponse } from 'gel-api'

/**
 * Helper function to handle streaming updates from chat API
 */
export const parseStreamThunk = (
  chunk: StreamChunk,
  abortStreamControllerRef: AbortController | null
): { type: 'DONE' } | { type: 'UPDATE'; payload: { content: string; reasonContent: string } } | undefined => {
  // Check if already aborted
  if (abortStreamControllerRef?.signal?.aborted) {
    return
  }

  if (chunk?.data?.includes('[DONE]')) {
    return { type: 'DONE' }
  }

  try {
    const data = JSON.parse(chunk.data) as StreamResponse
    const content = data.choices[0].delta.content
    const reasonContent = data.choices[0].delta.reasoning_content

    return {
      type: 'UPDATE',
      payload: {
        content,
        reasonContent,
      },
    }
  } catch (e) {
    console.error('流式chunk解析失败', chunk, 'error', e)
    // throw {
    //   error: e,
    //   chunk,
    // }
  }
}
