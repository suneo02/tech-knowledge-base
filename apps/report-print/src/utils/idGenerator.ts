/**
 * Unique ID Generation Utility
 */

const generatedIds: string[] = []

/**
 * Generates a safe, unique ID string.
 * Ensures uniqueness within the current session by tracking generated IDs.
 * @param prefix - An optional prefix for the ID. Defaults to 'id'.
 * @returns A string suitable for use as an HTML element ID, guaranteed to be unique in the current session.
 */
export function generateSafeId(prefix: string = 'id'): string {
  let attempts = 0
  let uniqueId = ''

  do {
    const timestamp = Date.now()
    const randomSuffix = Math.floor(Math.random() * 1000000)
    let candidateId = `${prefix}-${timestamp}-${randomSuffix}`

    if (attempts > 0) {
      // If we've had a collision, append an attempt counter to the base ID
      // for this attempt cycle to ensure diversity.
      const baseCandidate = `${prefix}-${timestamp}-${randomSuffix}` // Reconstruct initial for this attempt cycle
      candidateId = `${baseCandidate}-${attempts}`
    }

    if (generatedIds.indexOf(candidateId) === -1) {
      uniqueId = candidateId
    }
    attempts++
  } while (uniqueId === '' && attempts < 1000) // Safety break for extreme cases

  if (uniqueId === '') {
    // Fallback if we somehow couldn't generate a unique ID after many attempts,
    // though this is extremely unlikely.
    console.warn('IDGenerator: Could not generate a unique ID after many attempts. Using a less safe random ID.')
    // Generate a fallback ID that is still likely to be unique but without the tracking guarantee
    uniqueId = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
    // Attempt to add even the fallback ID to the array, though collision is less of a concern here
    if (generatedIds.indexOf(uniqueId) === -1) {
      generatedIds.push(uniqueId)
    } else {
      // If even the fallback collides (super rare), create an even more random one and don't store
      uniqueId = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 10)}-${Math.random().toString(36).substring(2, 10)}`
    }
    return uniqueId // Return here because we don't want to add it again below if it was a fallback
  }

  generatedIds.push(uniqueId)
  return uniqueId
}
