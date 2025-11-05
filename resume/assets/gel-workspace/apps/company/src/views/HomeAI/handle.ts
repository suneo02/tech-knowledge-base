const INITIAL_MESSAGE_KEY = 'chat_initial_message'

export const setChatInitialMessage = (message: string): void => {
  localStorage.setItem(INITIAL_MESSAGE_KEY, message)
}
