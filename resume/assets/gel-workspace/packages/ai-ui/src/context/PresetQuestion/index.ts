import { ChatQuestion, SuperListPresetQuestion } from 'gel-api'
import { createPresetQuestionContext } from './creator'

// Export the specific instance for ChatQuestion
const { Privider: PresetQuestionBaseProvider, useQuestionContext: usePresetQuestionBaseContext } =
  createPresetQuestionContext<ChatQuestion>()

export { PresetQuestionBaseProvider, usePresetQuestionBaseContext }

// Export the specific instance for SuperChatQuestion
const { Privider: PresetQuestionSuperProvider, useQuestionContext: usePresetQuestionSuperContext } =
  createPresetQuestionContext<SuperListPresetQuestion>()

export { PresetQuestionSuperProvider, usePresetQuestionSuperContext }
